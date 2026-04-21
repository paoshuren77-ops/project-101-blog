export type PostStatus = "draft" | "published" | "archived";

export type BlogPost = {
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

export type PostFormValues = {
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

export type PostRow = {
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
