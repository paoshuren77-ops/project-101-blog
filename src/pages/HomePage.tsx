import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import PostCard from "../components/PostCard";
import { fallbackPosts } from "../data/fallbackPosts";
import { formatDate } from "../lib/date";
import { listPublishedPosts } from "../lib/posts";
import { isSupabaseConfigured } from "../lib/supabase";
import type { BlogPost } from "../types/post";

const filters = ["all", "工程", "生活", "团队", "阅读"] as const;
type Filter = (typeof filters)[number];

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function HomePage() {
  const [posts, setPosts] = useState<BlogPost[]>(fallbackPosts);
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<Filter>("all");
  const [emailPlaceholder, setEmailPlaceholder] = useState("you@example.com");
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setStatusMessage("当前展示示例文章；配置 Supabase 后将自动读取后台文章。");
      return;
    }

    let isMounted = true;

    listPublishedPosts()
      .then((publishedPosts) => {
        if (!isMounted) return;
        setPosts(publishedPosts);
        setStatusMessage("");
      })
      .catch((error: unknown) => {
        if (!isMounted) return;
        setStatusMessage(error instanceof Error ? error.message : "文章加载失败");
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredPosts = useMemo(() => {
    const normalizedQuery = normalize(query);

    return posts.filter((post) => {
      const haystack = normalize(`${post.title} ${post.tags.join(" ")} ${post.author}`);
      const matchesQuery = !normalizedQuery || haystack.includes(normalizedQuery);
      const matchesFilter = activeFilter === "all" || post.topic === activeFilter;

      return matchesQuery && matchesFilter;
    });
  }, [activeFilter, posts, query]);

  const featuredPost = posts[0] ?? fallbackPosts[0];

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  function handleNewsletterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.currentTarget.reset();
    setEmailPlaceholder("已收到，感谢订阅");
  }

  return (
    <>
      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-media" aria-hidden="true" />
          <div className="hero-content">
            <p className="eyebrow">设计、技术与长期主义</p>
            <h1 id="hero-title">宏宁文化</h1>
            <p className="hero-copy">
              记录产品实践、工程思考、阅读札记和城市观察。每周更新一篇深度文章，帮你把碎片信息整理成可复用的判断。
            </p>
            <form className="search-form" role="search" onSubmit={handleSearchSubmit}>
              <label className="sr-only" htmlFor="searchInput">
                搜索文章
              </label>
              <input
                id="searchInput"
                type="search"
                placeholder="搜索文章、标签或作者"
                autoComplete="off"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              <button type="submit" aria-label="搜索" title="搜索">
                ⌕
              </button>
            </form>
          </div>
        </section>

        <section className="featured-section" aria-labelledby="featured-title">
          <div className="section-heading">
            <p className="eyebrow">Featured</p>
            <h2 id="featured-title">本周精选</h2>
          </div>
          <article className="featured-article">
            <div>
              <span className="topic">{featuredPost.topic}</span>
              <h3>{featuredPost.title}</h3>
              <p>{featuredPost.excerpt}</p>
              <div className="article-meta">
                <span>{featuredPost.author}</span>
                <span>{formatDate(featuredPost.publishedAt ?? featuredPost.createdAt)}</span>
                <span>{featuredPost.tags.slice(0, 2).join(" / ")}</span>
              </div>
            </div>
            <Link className="read-link" to={`/posts/${featuredPost.slug}`} aria-label="阅读精选文章">
              阅读
            </Link>
          </article>
        </section>

        <section className="content-grid" id="latest" aria-labelledby="latest-title">
          <div className="section-heading">
            <p className="eyebrow">Latest</p>
            <h2 id="latest-title">最新文章</h2>
          </div>
          {statusMessage ? <p className="notice">{statusMessage}</p> : null}
          <div className="posts" id="postsList">
            {filteredPosts.map((post) => (
              <PostCard post={post} key={post.id} />
            ))}
          </div>
          <p className={`empty-state ${filteredPosts.length === 0 ? "is-visible" : ""}`}>
            没有找到匹配的文章。
          </p>
        </section>

        <section className="topics-section" id="topics" aria-labelledby="topics-title">
          <div className="section-heading">
            <p className="eyebrow">Topics</p>
            <h2 id="topics-title">专题索引</h2>
          </div>
          <div className="topic-list" aria-label="专题列表">
            {filters.map((filter) => (
              <button
                className={activeFilter === filter ? "is-active" : ""}
                type="button"
                key={filter}
                onClick={() => setActiveFilter(filter)}
              >
                {filter === "all" ? "全部" : filter}
              </button>
            ))}
          </div>
        </section>
      </main>

      <footer className="site-footer" id="about">
        <div>
          <h2>宏宁文化</h2>
          <p>一个关注长期价值的独立 blog。欢迎把这里当成你的周末阅读入口。</p>
        </div>
        <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
          <label htmlFor="emailInput">订阅更新</label>
          <div>
            <input id="emailInput" type="email" placeholder={emailPlaceholder} />
            <button type="submit">订阅</button>
          </div>
        </form>
      </footer>
    </>
  );
}

export default HomePage;
