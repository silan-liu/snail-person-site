# 微微笑的蜗牛 · 个人网站

基于 **Astro 5 + TypeScript + Tailwind CSS v4** 构建的现代极简个人网站，支持浅色/深色主题无闪烁切换、项目作品集标签筛选、原生 Markdown 博客、RSS 订阅与自动 Sitemap 生成。

## 快速开始

```bash
# 安装依赖
npm install

# 启动本地开发服务器（默认 http://localhost:4321）
npm run dev

# 类型与模板检查
npm run check

# 构建生产静态文件（输出至 dist/）
npm run build

# 本地预览生产构建结果
npm run preview
```

## 日常维护与个性化修改

1. **修改个人资料、经历、技能与社交链接**
   直接编辑 `src/config/site.ts`，保存后全站生效。
2. **发布新博客文章**
   在 `src/content/blog/` 目录下新建 `.md` 文件，按以下格式填写头部信息：
   ```md
   ---
   title: 文章标题
   description: 一句话摘要
   pubDate: 2026-11-25
   tags:
     - 全栈开发
   ---

   这里是正文内容……
   ```
3. **添加或更新项目作品**
   在 `src/content/projects/` 目录下编辑或新增 `.md` 文件，设置 `featured: true` 即可在首页「精选项目」中展示。
4. **修改正式域名**
   部署前将 `astro.config.mjs` 中的 `site` 字段改为您的正式域名（例如 `https://yourdomain.com`），以便生成正确的 RSS 与 Sitemap 链接。

## 部署建议

本项目产物为纯静态文件（`dist/`），推荐一键托管至：
- **Vercel**：导入仓库后自动识别 Astro，构建命令 `npm run build`，输出目录 `dist`。
- **Cloudflare Pages**：框架预设选择 Astro，构建命令 `npm run build`，输出目录 `dist`。
- **GitHub Pages**：配合官方 `withastro/action` 自动部署。
