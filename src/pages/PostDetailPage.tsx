import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Link, useParams } from "react-router-dom";
import { fallbackPosts } from "../data/fallbackPosts";
import { formatDate } from "../lib/date";
import { getPublishedPostBySlug } from "../lib/posts";
import { isSupabaseConfigured } from "../lib/supabase";
import type { BlogPost } from "../types/post";

function PostDetailPage() {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(() => fallbackPosts.find((item) => item.slug === slug) ?? null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!slug || !isSupabaseConfigured) return;

    let isMounted = true;

    getPublishedPostBySlug(slug)
      .then((item) => {
        if (!isMounted) return;
        setPost(item);
        setMessage("");
      })
      .catch((error: unknown) => {
        if (!isMounted) return;
        setMessage(error instanceof Error ? error.message : "文章不存在或未发布");
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (!post) {
    return (
      <main className="page-shell">
        <p className="eyebrow">Not found</p>
        <h1 className="page-title">文章不存在</h1>
        {message ? <p className="notice">{message}</p> : null}
        <Link className="text-link" to="/">
          返回首页
        </Link>
      </main>
    );
  }

  return (
    <main className="article-page">
      <article>
        <header className="article-hero">
          <p className="eyebrow">{post.topic}</p>
          <h1>{post.title}</h1>
          <p>{post.excerpt}</p>
          <div className="article-meta">
            <span>{post.author}</span>
            <span>{formatDate(post.publishedAt ?? post.createdAt)}</span>
            <span>{post.tags.join(" / ")}</span>
          </div>
        </header>
        {post.coverImage ? <img className="article-cover" src={post.coverImage} alt={post.coverAlt || post.title} /> : null}
        <div className="article-content">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </article>
    </main>
  );
}

export default PostDetailPage;
