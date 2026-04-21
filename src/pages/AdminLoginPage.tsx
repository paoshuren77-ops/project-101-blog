import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

function AdminLoginPage() {
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!supabase) {
      setIsChecking(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setIsAuthenticated(Boolean(data.session));
      setIsChecking(false);
    });
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;

    setIsSubmitting(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsSubmitting(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setIsAuthenticated(true);
  }

  const from = (location.state as { from?: string } | null)?.from ?? "/admin";

  if (isChecking) {
    return <main className="page-shell">正在检查登录状态...</main>;
  }

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  return (
    <main className="admin-auth">
      <section className="admin-auth-panel">
        <p className="eyebrow">Admin</p>
        <h1>后台登录</h1>
        {!isSupabaseConfigured ? (
          <p className="notice">请先配置 Supabase 环境变量，后台登录和文章上传才会启用。</p>
        ) : null}
        <form className="admin-form" onSubmit={handleSubmit}>
          <label>
            邮箱
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>
          <label>
            密码
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </label>
          {message ? <p className="form-error">{message}</p> : null}
          <button type="submit" disabled={!isSupabaseConfigured || isSubmitting}>
            {isSubmitting ? "登录中..." : "登录"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default AdminLoginPage;
