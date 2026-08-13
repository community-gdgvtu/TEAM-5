/**
 * Shared HTTP helpers for all API clients.
 */

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  const res = await fetch(path, { ...options, headers });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as any).error || `Request failed (${res.status}).`);
  }

  return res.json() as Promise<T>;
}