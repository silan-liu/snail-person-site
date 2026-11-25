import type { Env } from './env';

interface PostStatsRow {
  slug: string;
  views: number;
  likes: number;
}

interface GuestbookRow {
  id: number;
  nickname: string;
  website: string | null;
  content: string;
  created_at: string;
}

const SLUG_PATTERN = /^[a-zA-Z0-9_-]{1,120}$/;

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}

function normalizeUrl(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  try {
    const parsed = new URL(trimmed.startsWith('http://') || trimmed.startsWith('https://') ? trimmed : `https://${trimmed}`);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null;
    return parsed.toString().slice(0, 200);
  } catch {
    return null;
  }
}

async function handleBatchStats(url: URL, env: Env): Promise<Response> {
  const rawSlugs = (url.searchParams.get('slugs') || '')
    .split(',')
    .map((s) => s.trim())
    .filter((s) => SLUG_PATTERN.test(s))
    .slice(0, 50);

  if (rawSlugs.length === 0) {
    return json({ stats: {} });
  }

  const placeholders = rawSlugs.map(() => '?').join(', ');
  const { results } = await env.DB.prepare(
    `SELECT slug, views, likes FROM post_stats WHERE slug IN (${placeholders})`,
  )
    .bind(...rawSlugs)
    .all<PostStatsRow>();

  const stats: Record<string, { views: number; likes: number }> = {};
  for (const slug of rawSlugs) {
    stats[slug] = { views: 0, likes: 0 };
  }
  for (const row of results) {
    stats[row.slug] = { views: Number(row.views) || 0, likes: Number(row.likes) || 0 };
  }

  return json({ stats });
}

async function handleSinglePostStats(
  slug: string,
  action: 'stats' | 'view' | 'like',
  request: Request,
  env: Env,
): Promise<Response> {
  if (!SLUG_PATTERN.test(slug)) {
    return json({ error: '无效的文章标识' }, 400);
  }

  if (action === 'stats' && request.method === 'GET') {
    const row = await env.DB.prepare(
      'SELECT slug, views, likes FROM post_stats WHERE slug = ?',
    )
      .bind(slug)
      .first<PostStatsRow>();

    return json({
      slug,
      views: Number(row?.views) || 0,
      likes: Number(row?.likes) || 0,
    });
  }

  if (action === 'view' && request.method === 'POST') {
    const row = await env.DB.prepare(
      `INSERT INTO post_stats (slug, views, likes, updated_at)
       VALUES (?, 1, 0, datetime('now'))
       ON CONFLICT(slug) DO UPDATE SET
         views = views + 1,
         updated_at = datetime('now')
       RETURNING slug, views, likes`,
    )
      .bind(slug)
      .first<PostStatsRow>();

    return json({
      slug,
      views: Number(row?.views) || 1,
      likes: Number(row?.likes) || 0,
    });
  }

  if (action === 'like' && request.method === 'POST') {
    let mode: 'like' | 'unlike' = 'like';
    try {
      const body = (await request.json()) as { action?: string };
      if (body?.action === 'unlike') mode = 'unlike';
    } catch {
      // Allow empty body as default like
    }

    const row =
      mode === 'like'
        ? await env.DB.prepare(
            `INSERT INTO post_stats (slug, views, likes, updated_at)
             VALUES (?, 0, 1, datetime('now'))
             ON CONFLICT(slug) DO UPDATE SET
               likes = likes + 1,
               updated_at = datetime('now')
             RETURNING slug, views, likes`,
          )
            .bind(slug)
            .first<PostStatsRow>()
        : await env.DB.prepare(
            `INSERT INTO post_stats (slug, views, likes, updated_at)
             VALUES (?, 0, 0, datetime('now'))
             ON CONFLICT(slug) DO UPDATE SET
               likes = MAX(0, likes - 1),
               updated_at = datetime('now')
             RETURNING slug, views, likes`,
          )
            .bind(slug)
            .first<PostStatsRow>();

    return json({
      slug,
      views: Number(row?.views) || 0,
      likes: Number(row?.likes) || 0,
    });
  }

  return json({ error: 'Method Not Allowed' }, 405);
}

async function handleGuestbook(request: Request, env: Env): Promise<Response> {
  if (request.method === 'GET') {
    const { results } = await env.DB.prepare(
      `SELECT id, nickname, website, content, created_at
       FROM guestbook_messages
       ORDER BY id DESC
       LIMIT 50`,
    ).all<GuestbookRow>();

    return json({ messages: results });
  }

  if (request.method === 'POST') {
    let payload: Record<string, unknown>;
    try {
      payload = (await request.json()) as Record<string, unknown>;
    } catch {
      return json({ error: '请求格式不正确' }, 400);
    }

    // Honeypot anti-spam check
    if (typeof payload.company === 'string' && payload.company.trim().length > 0) {
      return json({ ok: true, message: null }, 201);
    }

    const nickname = typeof payload.nickname === 'string' ? payload.nickname.trim() : '';
    const emailRaw = typeof payload.email === 'string' ? payload.email.trim() : '';
    const content = typeof payload.content === 'string' ? payload.content.trim() : '';
    const website = normalizeUrl(payload.website);

    if (nickname.length < 1 || nickname.length > 30) {
      return json({ error: '请填写 1~30 字以内的昵称' }, 400);
    }
    if (content.length < 2 || content.length > 500) {
      return json({ error: '留言内容需在 2~500 字之间' }, 400);
    }
    if (emailRaw && (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailRaw) || emailRaw.length > 100)) {
      return json({ error: '邮箱格式不太正确，请检查或留空' }, 400);
    }

    const inserted = await env.DB.prepare(
      `INSERT INTO guestbook_messages (nickname, email, website, content, created_at)
       VALUES (?, ?, ?, ?, datetime('now'))
       RETURNING id, nickname, website, content, created_at`,
    )
      .bind(nickname, emailRaw || null, website, content)
      .first<GuestbookRow>();

    return json({ ok: true, message: inserted }, 201);
  }

  return json({ error: 'Method Not Allowed' }, 405);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname.startsWith('/api/')) {
      try {
        if (url.pathname === '/api/posts/stats' && request.method === 'GET') {
          return await handleBatchStats(url, env);
        }

        const postMatch = url.pathname.match(/^\/api\/posts\/([^/]+)\/(stats|view|like)$/);
        if (postMatch) {
          const slug = decodeURIComponent(postMatch[1]);
          const action = postMatch[2] as 'stats' | 'view' | 'like';
          return await handleSinglePostStats(slug, action, request, env);
        }

        if (url.pathname === '/api/guestbook') {
          return await handleGuestbook(request, env);
        }

        return json({ error: 'API Not Found' }, 404);
      } catch (err) {
        console.error('API error:', err);
        return json({ error: '服务暂时不可用，请稍后再试' }, 500);
      }
    }

    return env.ASSETS.fetch(request);
  },
};
