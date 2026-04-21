# project-101-blog

一个基于 React + Vite + TypeScript 的 Blog 项目，包含前台展示页和 Supabase 驱动的后台文章管理系统。

前台负责文章展示、搜索、专题筛选和文章详情；后台负责登录、新建文章、编辑文章、发布/下架、删除文章和上传封面图。数据存储、登录鉴权和图片存储由 Supabase 提供。

## 技术栈

- React 19
- Vite 7
- TypeScript
- React Router
- wangEditor
- DOMPurify
- Supabase Auth
- Supabase Postgres
- Supabase Storage
- ESLint

## 功能

- Blog 首页展示已发布文章
- 文章详情页，支持富文本正文渲染
- 搜索文章标题、标签和作者
- 按专题筛选文章
- 明暗主题切换
- 后台管理员登录
- 后台文章列表
- 新建、编辑、删除文章
- 使用 wangEditor 富文本编辑正文
- 支持草稿、发布、下架三种状态
- 上传文章封面图到 Supabase Storage
- 未配置 Supabase 时，前台展示内置示例文章

## 项目结构

```text
.
├── index.html                 # Vite HTML 入口
├── package.json               # 依赖和 npm scripts
├── vite.config.ts             # Vite 配置
├── eslint.config.js           # ESLint 配置
├── tsconfig.json              # TypeScript 根配置
├── .env.example               # Supabase 环境变量示例
├── supabase/
│   └── schema.sql             # 数据表、RLS、Storage bucket 初始化脚本
└── src/
    ├── main.tsx               # React 应用入口
    ├── App.tsx                # 路由和全局主题状态
    ├── styles.css             # 全局样式
    ├── components/
    │   ├── AdminGuard.tsx     # 后台登录保护
    │   ├── PostCard.tsx       # 前台文章卡片
    │   ├── RichTextEditor.tsx # wangEditor 富文本编辑器
    │   └── SiteHeader.tsx     # 顶部导航
    ├── data/
    │   └── fallbackPosts.ts   # 未配置 Supabase 时的示例文章
    ├── lib/
    │   ├── date.ts            # 日期格式化
    │   ├── posts.ts           # 文章 CRUD 和封面上传
    │   └── supabase.ts        # Supabase client 初始化
    ├── pages/
    │   ├── HomePage.tsx       # 前台首页
    │   ├── PostDetailPage.tsx # 文章详情
    │   ├── AdminLoginPage.tsx # 后台登录
    │   ├── AdminDashboardPage.tsx
    │   └── PostEditorPage.tsx # 新建/编辑文章
    └── types/
        └── post.ts            # 文章相关类型
```

## 路由

```text
/                         前台首页
/posts/:slug              文章详情页
/admin                    后台文章列表
/admin/login              后台登录
/admin/posts/new          新建文章
/admin/posts/:id/edit     编辑文章
```

## 本地开发

安装依赖：

```bash
npm install
```

启动开发服务：

```bash
npm run dev
```

默认访问地址：

```text
http://127.0.0.1:5173/
```

后台入口：

```text
http://127.0.0.1:5173/admin
```

## Supabase 配置

如果不配置 Supabase，前台会展示 `src/data/fallbackPosts.ts` 里的示例文章，后台登录和上传功能不可用。

启用后台管理需要完成以下步骤。

### 1. 创建 Supabase 项目

登录 Supabase 后创建一个新项目，等待项目初始化完成。

### 2. 初始化数据库和存储

打开 Supabase 项目的 `SQL Editor`，复制并执行：

```text
supabase/schema.sql
```

该脚本会创建：

- `public.posts` 文章表
- `posts` 表的 Row Level Security 策略
- `blog-covers` Storage bucket
- 封面图上传、读取、更新、删除策略

### 3. 创建管理员账号

在 Supabase 控制台进入：

```text
Authentication -> Users
```

创建一个用户。之后用这个邮箱和密码登录 `/admin`。

### 4. 配置环境变量

复制环境变量示例：

```bash
cp .env.example .env.local
```

填写 Supabase 项目信息：

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

只能填写 `anon` / `publishable` key，不要把 `service_role` key 放进前端项目。

修改 `.env.local` 后，需要重启开发服务。

## 文章数据模型

后台文章保存在 Supabase `posts` 表中，核心字段包括：

```text
id             uuid
title          标题
slug           文章 URL 标识
excerpt        摘要
content        HTML 富文本正文
topic          专题
author         作者
tags           标签数组
cover_image    封面图 URL
cover_alt      封面图描述
status         draft | published | archived
published_at   发布时间
created_at     创建时间
updated_at     更新时间
```

前台首页只读取 `status = published` 的文章。后台登录后可以管理全部状态的文章。

## 后台使用流程

1. 打开 `/admin`
2. 使用 Supabase Auth 用户登录
3. 点击 `新建文章`
4. 填写标题、摘要、正文、专题、标签等信息
5. 上传封面图或手动填写封面图 URL
6. 状态选择 `发布`
7. 保存后返回首页查看文章

正文使用 wangEditor 富文本编辑器编写，内容以 HTML 字符串保存到 `posts.content`，文章详情页通过 DOMPurify 净化后渲染。

## 常用命令

```bash
npm run dev       # 启动本地开发服务
npm run build     # TypeScript 检查并构建生产包
npm run preview   # 本地预览生产构建
npm run lint      # 运行 ESLint
```

## 构建和部署

生产构建：

```bash
npm run build
```

构建产物会生成在：

```text
dist/
```

这个项目是纯前端静态应用，可以部署到：

- 阿里云 OSS 静态网站托管
- Vercel
- Netlify
- GitHub Pages
- 任意 Nginx 静态站点服务

部署前需要确保生产环境也配置了：

```bash
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

如果部署到 OSS、Nginx 这类静态托管环境，需要把 SPA fallback 指向 `index.html`，否则直接访问 `/admin` 或 `/posts/:slug` 可能会 404。

## 注意事项

- `.env.local` 不要提交到 Git。
- 前端只能使用 Supabase `anon` / `publishable` key。
- `service_role` key 拥有高权限，只能放在服务端环境。
- `supabase/schema.sql` 当前允许所有已登录用户管理文章，适合单管理员或小团队内部使用。
- 如果后续开放多用户注册，建议增加 `profiles` 表和角色判断，只允许 `admin` 或 `editor` 管理文章。
