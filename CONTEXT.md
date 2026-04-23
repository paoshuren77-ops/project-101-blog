# project2 技术上下文文档

## 1. 项目概述

这是一个基于 React + Vite + TypeScript 的 Blog 项目，包含前台展示页和 Supabase 驱动的后台文章管理系统。

## 2. 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | React 19 |
| 构建工具 | Vite 7 |
| 语言 | TypeScript |
| 路由 | React Router 7 |
| 富文本编辑器 | wangEditor |
| HTML 净化 | DOMPurify |
| 后端即服务 | Supabase (Auth + Postgres + Storage) |
| 代码检查 | ESLint |
| 测试 | Vitest |

## 3. 目录结构

```
project2/
├── index.html                    # Vite HTML 入口
├── package.json                 # 依赖和 npm scripts
├── vite.config.ts              # Vite 配置
├── eslint.config.js            # ESLint 配置
├── tsconfig*.json             # TypeScript 配置
├── .env.example               # Supabase 环境变量示例
├── .env.local                # Supabase 环境变量 (不提交)
├── supabase/
│   └── schema.sql             # 数据库初始化脚本
└── src/
    ├── main.tsx              # React 应用入口
    ├── App.tsx               # 路由和全局主题状态
    ├── styles.css            # 全局样式
    ├── vite-env.d.ts          # Vite 类型声明
    ├── components/
    │   ├── AdminGuard.tsx     # 后台登录保护
    │   ├── PostCard.tsx       # 前台文章卡片
    │   ├── RichTextEditor.tsx # wangEditor 富文本编辑器
    │   └── SiteHeader.tsx      # 顶部导航
    ├── data/
    │   └── fallbackPosts.ts   # 未配置 Supabase 时的示例文章
    ├── lib/
    │   ├── date.ts            # 日期格式化
    │   ├── date.test.ts       # 日期格式化测试
    │   ├── posts.ts           # 文章 CRUD 和封面上传
    │   ├── posts.test.ts       # 文章操作测试
    │   └── supabase.ts        # Supabase client 初始化
    ├── pages/
    │   ├── HomePage.tsx        # 前台首页
    │   ├── PostDetailPage.tsx  # 文章详情
    │   ├── AdminLoginPage.tsx # 后台登录
    │   ├── AdminDashboardPage.tsx
    │   └── PostEditorPage.tsx  # 新建/编辑文章
    └── types/
        └── post.ts            # 文章相关类型
```

## 4. 路由

| 路径 | 页面 |
|------|------|
| `/` | 前台首页 |
| `/posts/:slug` | 文章详情页 |
| `/admin` | 后台文章列表 |
| `/admin/login` | 后台登录 |
| `/admin/posts/new` | 新建文章 |
| `/admin/posts/:id/edit` | 编辑文章 |

## 5. 数据库模型 (Supabase)

表名：`public.posts`

| 字段 | 类型 | 说明 |
|------|------|------|
| id | uuid | 主键 |
| title | text | 标题 |
| slug | text | URL 标识 (唯一) |
| excerpt | text | 摘要 |
| content | text | HTML 富文本正文 |
| topic | text | 专题 |
| author | text | 作者 |
| tags | text[] | 标签数组 |
| cover_image | text | 封面图 URL |
| cover_alt | text | 封面图描述 |
| status | text | 状态: draft/published/archived |
| published_at | timestamptz | 发布时间 |
| created_at | timestamptz | 创建时间 |
| updated_at | timestamptz | 更新时间 |

Storage bucket: `blog-covers`

## 6. RLS 策略

- 已发布文章: 所有人可读
- 已认证用户: 可插入/更新/删除文章
- 封面图: 已认证用户可上传/管理，所有人可读

## 7. 环境变量

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

注意: 前端只能使用 `anon` key，不能使用 `service_role` key。

## 8. 常用命令

```bash
npm run dev      # 启动开发服务器 (http://127.0.0.1:5173)
npm run build   # TypeScript 检查并构建
npm run preview # 本地预览生产构建
npm run lint    # 运行 ESLint
npm run test    # 运行 Vitest
```

## 9. 组件概览

### components/

- **AdminGuard**: 后台路由保护，未登录跳转到登录页
- **PostCard**: 文章卡片，显示标题、摘要、封面、日期
- **RichTextEditor**: wangEditor 富文本编辑器封装
- **SiteHeader**: 顶部导航，含主题切换

### pages/

- **HomePage**: 文章列表，支持搜索和专题筛选
- **PostDetailPage**: 文章详情，DOMPurify 渲染正文
- **AdminLoginPage**: 登录表单
- **AdminDashboardPage**: 文章管理列表
- **PostEditorPage**: 新建/编辑文章表单

### lib/

- **supabase.ts**: Supabase client 初始化
- **posts.ts**: 文章 CRUD 操作、封面上传
- **date.ts**: 日期格式化工具

## 10. 类型定义

```typescript
type PostStatus = "draft" | "published" | "archived";

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  topic: string;
  author: string;
  tags: string[];
  coverImage: string;
  coverAlt: string;
  status: PostStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type PostFormValues = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  topic: string;
  author: string;
  tags: string;
  coverImage: string;
  coverAlt: string;
  status: PostStatus;
  publishedAt: string;
};

type PostRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  topic: string;
  author: string;
  tags: string[];
  cover_image: string | null;
  cover_alt: string | null;
  status: PostStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};
```

## 11. 开发注意事项

- `.env.local` 不提交到 Git
- 前台只显示 `status = published` 的文章
- 后台可管理所有状态的文章
- 正文以 HTML 格式存储，用 DOMPurify 净化后渲染
- 未配置 Supabase 时使用 `src/data/fallbackPosts.ts` 的示例文章