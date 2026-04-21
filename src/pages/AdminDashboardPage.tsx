import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminGuard from "../components/AdminGuard";
import { deletePost, listAdminPosts } from "../lib/posts";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import type { BlogPost } from "../types/post";
import { formatDate } from "../lib/date";

function AdminDashboardContent() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  async function loadPosts() {
    if (!isSupabaseConfigured) {
      setMessage("请先配置 Supabase 环境变量。");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setPosts(await listAdminPosts());
      setMessage("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "文章列表加载失败");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadPosts();
  }, []);

  async function handleDelete(id: string) {
    const confirmed = window.confirm("确定删除这篇文章？这个操作无法撤销。");
    if (!confirmed) return;

    try {
      await deletePost(id);
      await loadPosts();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "删除失败");
    }
  }

  async function handleSignOut() {
    await supabase?.auth.signOut();
    navigate("/admin/login");
  }

  return (
    <main className="admin-shell">
      <div className="admin-toolbar">
        <div>
          <p className="eyebrow">Admin</p>
          <h1>文章管理</h1>
        </div>
        <div className="admin-actions">
          <Link className="button-link" to="/admin/posts/new">
            新建文章
          </Link>
          <button className="secondary-button" type="button" onClick={handleSignOut}>
            退出
          </button>
        </div>
      </div>

      {message ? <p className="notice">{message}</p> : null}
      {isLoading ? <p className="notice">正在加载文章...</p> : null}

      <div className="admin-table" role="table" aria-label="文章列表">
        <div className="admin-table-row admin-table-head" role="row">
          <span>标题</span>
          <span>状态</span>
          <span>专题</span>
          <span>更新时间</span>
          <span>操作</span>
        </div>
        {posts.map((post) => (
          <div className="admin-table-row" role="row" key={post.id}>
            <span>
              <strong>{post.title}</strong>
              <small>{post.slug}</small>
            </span>
            <span>{post.status}</span>
            <span>{post.topic}</span>
            <span>{formatDate(post.updatedAt)}</span>
            <span className="table-actions">
              <Link to={`/admin/posts/${post.id}/edit`}>编辑</Link>
              <button type="button" onClick={() => void handleDelete(post.id)}>
                删除
              </button>
            </span>
          </div>
        ))}
      </div>
    </main>
  );
}

function AdminDashboardPage() {
  return (
    <AdminGuard>
      <AdminDashboardContent />
    </AdminGuard>
  );
}

export default AdminDashboardPage;
