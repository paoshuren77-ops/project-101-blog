import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabase";

type AdminGuardProps = {
  children: ReactNode;
};

function AdminGuard({ children }: AdminGuardProps) {
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

  if (isChecking) {
    return <main className="page-shell">正在检查登录状态...</main>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}

export default AdminGuard;
