/**
 * Shared HTTP helpers for all API clients.
 */

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const res = await fetch(path, { ...options, headers, signal: controller.signal });
    clearTimeout(timeout);

    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      throw new Error("Backend unavailable");
    }

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error((data as any).error || `Request failed (${res.status}).`);
    }

    return res.json() as Promise<T>;
  } catch (e) {
    clearTimeout(timeout);
    throw e;
  }
}

/**
 * Demo session token. Real logins mint a server session; the demo login
 * stores no token, so we synthesize the same `civicfix_session_<id>_<ts>`
 * format the backend authMiddleware accepts. Falls back to a role-agnostic
 * demo user id when nobody is signed in.
 */
export function getDemoSessionToken(): string {
  let id = "user_demo_001";
  try {
    const raw = localStorage.getItem("civicfix_user");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.id) id = parsed.id;
    }
  } catch {
    /* ignore malformed storage */
  }
  return `civicfix_session_${id}_${Date.now()}`;
}

/**
 * Coerces an arbitrary user id (or already-valid session token) into a
 * session token the backend accepts. Screens that pass `currentUser.id`
 * as the "token" land here and get a valid one.
 */
export function toSessionToken(raw?: string | null): string {
  if (raw && raw.startsWith("civicfix_session_")) return raw;
  return getDemoSessionToken();
}

/**
 * Runs `request` (the real API call). If it rejects — server offline, 4xx/5xx,
 * network error — resolves with `fallback` so the demo never dead-ends.
 */
export async function withFallback<T>(request: Promise<T>, fallback: T): Promise<T> {
  try {
    return await request;
  } catch {
    return fallback;
  }
}
