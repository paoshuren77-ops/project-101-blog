# project-101-blog

React + Vite + TypeScript blog site with a Supabase-powered admin panel.

## Features

- Public blog home page and post detail pages
- Admin login with Supabase Auth
- Create, edit, publish, archive, and delete blog posts
- Upload cover images to Supabase Storage
- Markdown article body rendering
- Search and topic filtering on the public home page

## Local Development

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:5173`.

## Supabase Setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL editor.
3. Create an auth user in Supabase Auth for your admin account.
4. Copy `.env.example` to `.env.local` and fill in:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

5. Restart the dev server.

Admin entry:

```text
/admin
```

Without Supabase environment variables, the public site displays built-in sample posts and the admin panel stays disabled.

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
```
