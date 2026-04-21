import { Link } from "react-router-dom";
import type { BlogPost } from "../types/post";
import { formatDate } from "../lib/date";

type PostCardProps = {
  post: BlogPost;
};

function PostCard({ post }: PostCardProps) {
  return (
    <article className="post-card">
      <Link to={`/posts/${post.slug}`} aria-label={`阅读文章：${post.title}`}>
        <img src={post.coverImage} alt={post.coverAlt || post.title} />
      </Link>
      <div className="post-body">
        <span className="topic">{post.topic}</span>
        <h3>
          <Link to={`/posts/${post.slug}`}>{post.title}</Link>
        </h3>
        <p>{post.excerpt}</p>
        <div className="article-meta">
          <span>{post.author}</span>
          <span>{formatDate(post.publishedAt ?? post.createdAt)}</span>
        </div>
      </div>
    </article>
  );
}

export default PostCard;
