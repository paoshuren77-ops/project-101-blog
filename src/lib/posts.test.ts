import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { PostFormValues, PostRow } from "../types/post";
import {
  deletePost,
  listPublishedPosts,
  rowToPost,
  savePost,
  slugify,
} from "./posts";

const supabaseMock = vi.hoisted(() => ({
  from: vi.fn(),
}));

vi.mock("./supabase", () => ({
  requireSupabase: () => supabaseMock,
}));

const postRow: PostRow = {
  id: "post-1",
  title: "测试文章",
  slug: "test-post",
  excerpt: "摘要",
  content: "<p>正文</p>",
  topic: "Engineering",
  author: "Codex",
  tags: ["react", "supabase"],
  cover_image: null,
  cover_alt: null,
  status: "published",
  published_at: "2026-04-21T08:30:00.000Z",
  created_at: "2026-04-20T08:30:00.000Z",
  updated_at: "2026-04-21T09:00:00.000Z",
};

const formValues: PostFormValues = {
  title: "  新文章  ",
  slug: "",
  excerpt: "  一段摘要  ",
  content: "  <p>正文</p>  ",
  topic: "  React  ",
  author: "  Limu  ",
  tags: "react, supabase， vite,",
  coverImage: "  ",
  coverAlt: "  ",
  status: "published",
  publishedAt: "",
};

function createQueryBuilder(result: unknown) {
  const builder = {
    select: vi.fn(() => builder),
    eq: vi.fn(() => builder),
    order: vi.fn(() => result),
    single: vi.fn(() => result),
    insert: vi.fn(() => result),
    update: vi.fn(() => builder),
    delete: vi.fn(() => builder),
  };

  return builder;
}

describe("posts lib", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-21T10:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it("maps database rows into BlogPost shape", () => {
    expect(rowToPost(postRow)).toEqual({
      id: "post-1",
      title: "测试文章",
      slug: "test-post",
      excerpt: "摘要",
      content: "<p>正文</p>",
      topic: "Engineering",
      author: "Codex",
      tags: ["react", "supabase"],
      coverImage: "",
      coverAlt: "",
      status: "published",
      publishedAt: "2026-04-21T08:30:00.000Z",
      createdAt: "2026-04-20T08:30:00.000Z",
      updatedAt: "2026-04-21T09:00:00.000Z",
    });
  });

  it("slugifies titles while preserving unicode letters and numbers", () => {
    expect(slugify("  Hello, 世界 2026!  ")).toBe("hello-世界-2026");
    expect(slugify("?!")).toBe("post-1776765600000");
  });

  it("lists published posts with the expected Supabase query", async () => {
    const builder = createQueryBuilder({ data: [postRow], error: null });
    supabaseMock.from.mockReturnValue(builder);

    await expect(listPublishedPosts()).resolves.toEqual([rowToPost(postRow)]);
    expect(supabaseMock.from).toHaveBeenCalledWith("posts");
    expect(builder.select).toHaveBeenCalledWith(
      "id,title,slug,excerpt,content,topic,author,tags,cover_image,cover_alt,status,published_at,created_at,updated_at",
    );
    expect(builder.eq).toHaveBeenCalledWith("status", "published");
    expect(builder.order).toHaveBeenCalledWith("published_at", {
      ascending: false,
      nullsFirst: false,
    });
  });

  it("throws Supabase errors from listPublishedPosts", async () => {
    const error = new Error("query failed");
    const builder = createQueryBuilder({ data: null, error });
    supabaseMock.from.mockReturnValue(builder);

    await expect(listPublishedPosts()).rejects.toThrow(error);
  });

  it("inserts normalized post form values", async () => {
    const builder = createQueryBuilder({ error: null });
    supabaseMock.from.mockReturnValue(builder);

    await savePost(formValues);

    expect(builder.insert).toHaveBeenCalledWith({
      title: "新文章",
      slug: "新文章",
      excerpt: "一段摘要",
      content: "<p>正文</p>",
      topic: "React",
      author: "Limu",
      tags: ["react", "supabase", "vite"],
      cover_image: null,
      cover_alt: null,
      status: "published",
      published_at: "2026-04-21T10:00:00.000Z",
      updated_at: "2026-04-21T10:00:00.000Z",
    });
  });

  it("updates an existing post by id", async () => {
    const builder = createQueryBuilder({ error: null });
    supabaseMock.from.mockReturnValue(builder);

    await savePost(
      {
        ...formValues,
        slug: "custom-slug",
        status: "draft",
      },
      "post-1",
    );

    expect(builder.update).toHaveBeenCalledWith(
      expect.objectContaining({
        slug: "custom-slug",
        status: "draft",
        published_at: null,
      }),
    );
    expect(builder.eq).toHaveBeenCalledWith("id", "post-1");
  });

  it("deletes a post by id", async () => {
    const builder = createQueryBuilder({ error: null });
    supabaseMock.from.mockReturnValue(builder);

    await deletePost("post-1");

    expect(builder.delete).toHaveBeenCalled();
    expect(builder.eq).toHaveBeenCalledWith("id", "post-1");
  });
});
