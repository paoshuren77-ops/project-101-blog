import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { lazy, Suspense, useState } from "react";
import SiteHeader from "./components/SiteHeader";

const HomePage = lazy(() => import("./pages/HomePage"));
const PostDetailPage = lazy(() => import("./pages/PostDetailPage"));
const AdminLoginPage = lazy(() => import("./pages/AdminLoginPage"));
const AdminDashboardPage = lazy(() => import("./pages/AdminDashboardPage"));
const PostEditorPage = lazy(() => import("./pages/PostEditorPage"));

type Theme = "light" | "dark";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") {
    return "light";
  }

  return localStorage.getItem("theme") === "dark" ? "dark" : "light";
}

function App() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  function handleThemeToggle() {
    setTheme((currentTheme) => {
      const nextTheme = currentTheme === "dark" ? "light" : "dark";
      localStorage.setItem("theme", nextTheme);
      return nextTheme;
    });
  }

  return (
    <BrowserRouter>
      <div data-theme={theme}>
        <SiteHeader onThemeToggle={handleThemeToggle} />
        <Suspense fallback={<main className="page-shell">正在加载...</main>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/posts/:slug" element={<PostDetailPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/posts/new" element={<PostEditorPage />} />
            <Route path="/admin/posts/:id/edit" element={<PostEditorPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </div>
    </BrowserRouter>
  );
}

export default App;
