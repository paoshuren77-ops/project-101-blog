import { Link } from "react-router-dom";

type SiteHeaderProps = {
  onThemeToggle: () => void;
};

function SiteHeader({ onThemeToggle }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <Link className="brand" to="/" aria-label="宏宁文化首页">
        <span className="brand-mark">M</span>
        <span>宏宁文化</span>
      </Link>
      <nav className="main-nav" aria-label="主导航">
        <a href="/#latest">最新</a>
        <a href="/#topics">专题</a>
        <Link to="/admin">后台</Link>
      </nav>
      <button className="theme-toggle" type="button" aria-label="切换主题" title="切换主题" onClick={onThemeToggle}>
        <span aria-hidden="true">◐</span>
      </button>
    </header>
  );
}

export default SiteHeader;
