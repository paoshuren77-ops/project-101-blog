import { requireSupabase } from "./supabase";
import type { BlogPost, PostFormValues, PostRow } from "../types/post";

const POST_COLUMNS =
  "id,title,slug,excerpt,content,topic,author,tags,cover_image,cover_alt,status,published_at,created_at,updated_at";

export function rowToPost(row: PostRow): BlogPost {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    content: row.content,
    topic: row.topic,
    author: row.author,
    tags: row.tags,
    coverImage: row.cover_image ?? "",
    coverAlt: row.cover_alt ?? "",
    status: row.status,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function tagsFromInput(value: string) {
  return value
    .split(/[,，]/)
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function slugify(value: string) {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");

  return slug || `post-${Date.now()}`;
}

function formToPayload(values: PostFormValues) {
  return {
    title: values.title.trim(),
    slug: slugify(values.slug || values.title),
    excerpt: values.excerpt.trim(),
    content: values.content.trim(),
    topic: values.topic.trim(),
    author: values.author.trim(),
    tags: tagsFromInput(values.tags),
    cover_image: values.coverImage.trim() || null,
    cover_alt: values.coverAlt.trim() || null,
    status: values.status,
    published_at:
      values.status === "published"
        ? values.publishedAt
          ? new Date(values.publishedAt).toISOString()
          : new Date().toISOString()
        : values.publishedAt
          ? new Date(values.publishedAt).toISOString()
          : null,
    updated_at: new Date().toISOString(),
  };
}

export async function listPublishedPosts() {
  const { data, error } = await requireSupabase()
    .from("posts")
    .select(POST_COLUMNS)
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false });

  if (error) throw error;

  return (data as PostRow[]).map(rowToPost);
}

export async function listAdminPosts() {
  const { data, error } = await requireSupabase()
    .from("posts")
    .select(POST_COLUMNS)
    .order("updated_at", { ascending: false });

  if (error) throw error;

  return (data as PostRow[]).map(rowToPost);
}

export async function getPublishedPostBySlug(slug: string) {
  const { data, error } = await requireSupabase()
    .from("posts")
    .select(POST_COLUMNS)
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error) throw error;

  return rowToPost(data as PostRow);
}

export async function getAdminPost(id: string) {
  const { data, error } = await requireSupabase()
    .from("posts")
    .select(POST_COLUMNS)
    .eq("id", id)
    .single();

  if (error) throw error;

  return rowToPost(data as PostRow);
}

export async function savePost(values: PostFormValues, id?: string) {
  const payload = formToPayload(values);
  const query = id
    ? requireSupabase().from("posts").update(payload).eq("id", id)
    : requireSupabase().from("posts").insert(payload);

  const { error } = await query;

  if (error) throw error;
}

export async function deletePost(id: string) {
  const { error } = await requireSupabase().from("posts").delete().eq("id", id);

  if (error) throw error;
}

export async function uploadCoverImage(file: File, userId: string) {
  const extension = file.name.split(".").pop() || "jpg";
  const safeName = file.name
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const filePath = `${userId}/${crypto.randomUUID()}-${safeName || "cover"}.${extension}`;
  const client = requireSupabase();
  const { error } = await client.storage.from("blog-covers").upload(filePath, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) throw error;

  const { data } = client.storage.from("blog-covers").getPublicUrl(filePath);

  return data.publicUrl;
}
