"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { adminApi, type AdminUser } from "@/lib/admin-api";
import { clearAccessToken, setAccessToken } from "@/lib/auth-session";

interface AdminAuthContextValue {
  user: AdminUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

const PUBLIC_ADMIN_PATHS = ["/admin/login"];

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  const isPublic = PUBLIC_ADMIN_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  const refreshSession = useCallback(async () => {
    try {
      const tokenRes = await adminApi.auth.refresh();
      setAccessToken(tokenRes.access_token);
      const me = await adminApi.auth.me();
      setUser(me);
      return true;
    } catch {
      clearAccessToken();
      setUser(null);
      return false;
    }
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const tokenRes = await adminApi.auth.login(email, password);
      setAccessToken(tokenRes.access_token);
      const me = await adminApi.auth.me();
      setUser(me);
      router.push("/admin/dashboard");
    },
    [router]
  );

  const logout = useCallback(async () => {
    try {
      await adminApi.auth.logout();
    } finally {
      clearAccessToken();
      setUser(null);
      router.push("/admin/login");
    }
  }, [router]);

  useEffect(() => {
    let cancelled = false;
    async function bootstrap() {
      if (isPublic) {
        setLoading(false);
        return;
      }
      const ok = await refreshSession();
      if (!cancelled && !ok) {
        router.replace("/admin/login");
      }
      if (!cancelled) setLoading(false);
    }
    bootstrap();
    return () => {
      cancelled = true;
    };
  }, [isPublic, pathname, refreshSession, router]);

  const value = useMemo(
    () => ({ user, loading, login, logout, refreshSession }),
    [user, loading, login, logout, refreshSession]
  );

  if (!isPublic && loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">
        Loading admin session…
      </div>
    );
  }

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
