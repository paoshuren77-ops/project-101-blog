create extension if not exists pgcrypto;

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text not null,
  content text not null,
  topic text not null,
  author text not null default '林墨',
  tags text[] not null default '{}',
  cover_image text,
  cover_alt text,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.posts enable row level security;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at
before update on public.posts
for each row
execute function public.set_updated_at();

drop policy if exists "Published posts are readable by everyone" on public.posts;
create policy "Published posts are readable by everyone"
on public.posts
for select
using (status = 'published' or auth.role() = 'authenticated');

drop policy if exists "Authenticated users can insert posts" on public.posts;
create policy "Authenticated users can insert posts"
on public.posts
for insert
to authenticated
with check (true);

drop policy if exists "Authenticated users can update posts" on public.posts;
create policy "Authenticated users can update posts"
on public.posts
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated users can delete posts" on public.posts;
create policy "Authenticated users can delete posts"
on public.posts
for delete
to authenticated
using (true);

insert into storage.buckets (id, name, public)
values ('blog-covers', 'blog-covers', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Blog covers are publicly readable" on storage.objects;
create policy "Blog covers are publicly readable"
on storage.objects
for select
using (bucket_id = 'blog-covers');

drop policy if exists "Authenticated users can upload blog covers" on storage.objects;
create policy "Authenticated users can upload blog covers"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'blog-covers');

drop policy if exists "Authenticated users can update blog covers" on storage.objects;
create policy "Authenticated users can update blog covers"
on storage.objects
for update
to authenticated
using (bucket_id = 'blog-covers')
with check (bucket_id = 'blog-covers');

drop policy if exists "Authenticated users can delete blog covers" on storage.objects;
create policy "Authenticated users can delete blog covers"
on storage.objects
for delete
to authenticated
using (bucket_id = 'blog-covers');
 