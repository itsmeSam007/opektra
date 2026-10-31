import { getAccessToken } from "@/lib/auth-session";

/** Browser-only: same-origin proxy via next.config rewrites. */
const API_URL = "/api/v1";

export interface AdminUser {
  id: number;
  email: string;
  is_active: boolean;
  roles: string[];
  permissions: string[];
  created_at: string;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAccessToken();
  const res = await fetch(`${API_URL}${endpoint}`, {
    credentials: "include",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (!res.ok) {
    const err = new Error(`API error: ${res.status}`);
    (err as Error & { status: number }).status = res.status;
    throw err;
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const adminApi = {
  auth: {
    login: (email: string, password: string) =>
      request<{ access_token: string; token_type: string }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),
    refresh: () =>
      request<{ access_token: string; token_type: string }>("/auth/refresh", {
        method: "POST",
      }),
    logout: () =>
      request<{ ok: boolean }>("/auth/logout", {
        method: "POST",
        headers: getAccessToken() ? { Authorization: `Bearer ${getAccessToken()}` } : {},
      }),
    me: () => request<AdminUser>("/auth/me"),
  },
};

export async function adminFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    return await request<T>(endpoint, options);
  } catch (err) {
    const status = (err as Error & { status?: number }).status;
    if (status === 401) {
      const refreshed = await adminApi.auth.refresh();
      const { setAccessToken } = await import("@/lib/auth-session");
      setAccessToken(refreshed.access_token);
      return request<T>(endpoint, options);
    }
    throw err;
  }
}
