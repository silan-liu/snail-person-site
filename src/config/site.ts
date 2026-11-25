export interface NavItem {
  label: string;
  href: string;
}

export interface SocialLink {
  label: string;
  href: string;
  icon: 'github' | 'email' | 'rss';
}

export interface SkillGroup {
  category: string;
  items: string[];
}

export interface ExperienceItem {
  period: string;
  role: string;
  org: string;
  summary: string;
}

export interface SiteConfig {
  name: string;
  title: string;
  role: string;
  tagline: string;
  description: string;
  location: string;
  status: string;
  email: string;
  aboutParagraphs: string[];
  principles: Array<{ title: string; detail: string }>;
  nav: NavItem[];
  socials: SocialLink[];
  skills: SkillGroup[];
  experiences: ExperienceItem[];
}

/**
 * 全站唯一基础信息配置文件
 * 后续修改个人资料、经历、技能和社交链接，只需编辑本文件即可同步全站。
 */
export const siteConfig: SiteConfig = {
  name: '微微笑的蜗牛',
  title: '微微笑的蜗牛 — 全栈开发者',
  role: '全栈开发者',
  tagline: '稳步前行，打磨清晰、可靠且有温度的软件产品。',
  description:
    '微微笑的蜗牛的个人网站。关注现代 Web 工程、跨端应用开发与简洁实用的系统架构，记录项目实践与技术思考。',
  location: '中国',
  status: '持续迭代中 · 欢迎来留言板打个招呼',
  email: '413769707@qq.com',
  aboutParagraphs: [
    '你好，我是微微笑的蜗牛，一名注重代码质量与产品体验的全栈开发者。我相信好的软件不需要浮夸的包装，而是在清晰的架构、顺手的交互和稳定的工程实践里自然呈现价值。',
    '平时我的工作覆盖前端界面设计实现、后端服务与数据建模，也对桌面端、移动端工具以及开发效率工作流抱有浓厚兴趣。习惯用“先想清楚问题边界，再小步快跑迭代”的方式推进每一个项目。',
    '这个个人网站是我整理代表作品、沉淀技术笔记与记录思考的安静角落。如果你对我的项目感兴趣，或者想聊聊全栈架构与独立开发，欢迎随时发邮件联系我。',
  ],
  principles: [
    {
      title: '简洁胜于复杂',
      detail: '克制地引入抽象与依赖，让系统在半年后依然容易理解和维护。',
    },
    {
      title: '体验从细节生长',
      detail: '关注加载速度、排布节奏与边缘状态，把“顺手”做成默认标准。',
    },
    {
      title: '持续迭代与沉淀',
      detail: '像蜗牛一样保持节奏，把每次踩坑和架构权衡转化为可复用的经验。',
    },
  ],
  nav: [
    { label: '首页', href: '/' },
    { label: '项目', href: '/projects' },
    { label: '博客', href: '/blog' },
    { label: '留言', href: '/guestbook' },
    { label: '关于', href: '/about' },
  ],
  socials: [
    { label: 'Email', href: 'mailto:413769707@qq.com', icon: 'email' },
    { label: 'GitHub', href: 'https://github.com/silan-liu', icon: 'github' },
    { label: 'RSS', href: '/rss.xml', icon: 'rss' },
  ],
  skills: [
    {
      category: '前端工程',
      items: ['TypeScript', 'React', 'Astro', 'Next.js', 'Tailwind CSS', 'Vite'],
    },
    {
      category: '后端与数据',
      items: ['Node.js', 'Python', 'REST / GraphQL', 'PostgreSQL', 'Redis', 'Prisma'],
    },
    {
      category: '客户端与跨端',
      items: ['Electron', 'Swift / iOS & macOS', 'PWA', 'Local-first / CRDT'],
    },
    {
      category: '工程与部署',
      items: ['Docker', 'GitHub Actions', 'Nginx', 'Cloudflare / Vercel', 'Linux'],
    },
  ],
  experiences: [
    {
      period: '2024 — 至今',
      role: '全栈开发者 / 独立构建者',
      org: '个人工作室与开源项目',
      summary:
        '主导多款 Web 与桌面端效率工具的产品设计、前后端架构及部署运维，探索 Local-first 同步与自动化工作流。',
    },
    {
      period: '2021 — 2024',
      role: '高级全栈工程师',
      org: '互联网研发团队（示例，可替换为真实经历）',
      summary:
        '负责核心业务系统从 0 到 1 的前后端架构搭建，推动 TypeScript 全栈类型共享与组件库建设，显著提升交付稳定性。',
    },
    {
      period: '2019 — 2021',
      role: '软件开发工程师',
      org: '科技研发部门（示例，可替换为真实经历）',
      summary:
        '参与中后台系统与 API 服务开发，积累了性能优化、数据库索引调优与跨团队协作的扎实工程经验。',
    },
  ],
};
