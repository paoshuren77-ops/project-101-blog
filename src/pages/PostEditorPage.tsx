import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AdminGuard from "../components/AdminGuard";
import { getAdminPost, savePost, slugify, uploadCoverImage } from "../lib/posts";
import { requireSupabase } from "../lib/supabase";
import type { BlogPost, PostFormValues, PostStatus } from "../types/post";

const emptyForm: PostFormValues = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  topic: "工程",
  author: "林墨",
  tags: "",
  coverImage: "",
  coverAlt: "",
  status: "draft",
  publishedAt: "",
};

function toDatetimeLocal(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function postToForm(post: BlogPost): PostFormValues {
  return {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    topic: post.topic,
    author: post.author,
    tags: post.tags.join(", "),
    coverImage: post.coverImage,
    coverAlt: post.coverAlt,
    status: post.status,
    publishedAt: toDatetimeLocal(post.publishedAt),
  };
}

function PostEditorContent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [values, setValues] = useState<PostFormValues>(emptyForm);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(Boolean(id));
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!id) return;

    let isMounted = true;

    getAdminPost(id)
      .then((post) => {
        if (!isMounted) return;
        setValues(postToForm(post));
        setMessage("");
      })
      .catch((error: unknown) => {
        if (!isMounted) return;
        setMessage(error instanceof Error ? error.message : "文章加载失败");
      })
      .finally(() => {
        if (!isMounted) return;
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  function updateField<K extends keyof PostFormValues>(key: K, value: PostFormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function handleTitleBlur() {
    if (!values.slug && values.title) {
      updateField("slug", slugify(values.title));
    }
  }

  async function handleUpload(file: File | null) {
    if (!file) return;

    try {
      setIsUploading(true);
      setMessage("");
      const { data } = await requireSupabase().auth.getUser();
      if (!data.user) {
        throw new Error("请先登录后再上传封面图。");
      }
      const url = await uploadCoverImage(file, data.user.id);
      updateField("coverImage", url);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "上传失败");
    } finally {
      setIsUploading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsSaving(true);
      setMessage("");
      await savePost(values, id);
      navigate("/admin");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "保存失败");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return <main className="admin-shell">正在加载文章...</main>;
  }

  return (
    <main className="admin-shell">
      <div className="admin-toolbar">
        <div>
          <p className="eyebrow">Editor</p>
          <h1>{id ? "编辑文章" : "新建文章"}</h1>
        </div>
        <Link className="secondary-link" to="/admin">
          返回列表
        </Link>
      </div>

      {message ? <p className="form-error">{message}</p> : null}

      <form className="post-editor" onSubmit={handleSubmit}>
        <section className="editor-main">
          <label>
            标题
            <input
              value={values.title}
              onBlur={handleTitleBlur}
              onChange={(event) => updateField("title", event.target.value)}
              required
            />
          </label>
          <label>
            摘要
            <textarea
              rows={3}
              value={values.excerpt}
              onChange={(event) => updateField("excerpt", event.target.value)}
              required
            />
          </label>
          <label>
            正文 Markdown
            <textarea
              rows={16}
              value={values.content}
              onChange={(event) => updateField("content", event.target.value)}
              required
            />
          </label>
        </section>

        <aside className="editor-side">
          <label>
            Slug
            <input value={values.slug} onChange={(event) => updateField("slug", slugify(event.target.value))} required />
          </label>
          <label>
            专题
            <input value={values.topic} onChange={(event) => updateField("topic", event.target.value)} required />
          </label>
          <label>
            作者
            <input value={values.author} onChange={(event) => updateField("author", event.target.value)} required />
          </label>
          <label>
            标签
            <input
              value={values.tags}
              onChange={(event) => updateField("tags", event.target.value)}
              placeholder="React, 工程, 前端"
            />
          </label>
          <label>
            状态
            <select value={values.status} onChange={(event) => updateField("status", event.target.value as PostStatus)}>
              <option value="draft">草稿</option>
              <option value="published">发布</option>
              <option value="archived">下架</option>
            </select>
          </label>
          <label>
            发布时间
            <input
              type="datetime-local"
              value={values.publishedAt}
              onChange={(event) => updateField("publishedAt", event.target.value)}
            />
          </label>
          <label>
            封面图上传
            <input type="file" accept="image/*" onChange={(event) => void handleUpload(event.target.files?.[0] ?? null)} />
          </label>
          <label>
            封面图 URL
            <input value={values.coverImage} onChange={(event) => updateField("coverImage", event.target.value)} />
          </label>
          <label>
            封面描述
            <input value={values.coverAlt} onChange={(event) => updateField("coverAlt", event.target.value)} />
          </label>
          {values.coverImage ? <img className="cover-preview" src={values.coverImage} alt={values.coverAlt || "封面预览"} /> : null}
          <button type="submit" disabled={isSaving || isUploading}>
            {isUploading ? "上传中..." : isSaving ? "保存中..." : "保存文章"}
          </button>
        </aside>
      </form>
    </main>
  );
}

function PostEditorPage() {
  return (
    <AdminGuard>
      <PostEditorContent />
    </AdminGuard>
  );
}

export default PostEditorPage;
