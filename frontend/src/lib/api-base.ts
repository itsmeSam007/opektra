/** Server-side API base URL (RSC / SSG). Browser admin client uses `/api/v1` via admin-api.ts. */
export function getServerApiUrl(): string {
  const proxy = process.env.API_PROXY_URL?.replace(/\/$/, "");
  if (proxy) return `${proxy}/api/v1`;

  const configured = process.env.NEXT_PUBLIC_API_URL;
  if (configured?.startsWith("http")) return configured.replace(/\/$/, "");

  // Docker image build: no backend — fail fast so static generation uses empty fallbacks.
  if (process.env.DOCKER_BUILD === "1") return "http://127.0.0.1:1/api/v1";

  return "http://localhost:18000/api/v1";
}

const FETCH_TIMEOUT_MS = 8_000;

export async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(`${getServerApiUrl()}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  } finally {
    clearTimeout(timeout);
  }
}
