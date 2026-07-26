export async function apiFetch(
  proxyId: string,
  path: string,
  init?: RequestInit,
): Promise<{ ok: boolean; status: number; data: unknown }> {
  const url = `/api/proxy/${proxyId}${path.startsWith("/") ? path : `/${path}`}`;
  try {
    const res = await fetch(url, {
      ...init,
      headers: {
        ...(init?.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
        ...init?.headers,
      },
    });
    const text = await res.text();
    let data: unknown = text;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }
    return { ok: res.ok, status: res.status, data };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      data: {
        error: "network_error",
        detail: err instanceof Error ? err.message : "Network request failed",
      },
    };
  }
}

export function pretty(data: unknown): string {
  try {
    return JSON.stringify(data, null, 2);
  } catch {
    return String(data);
  }
}

export function apiStatusHint(status: number, data: unknown): string {
  const detail =
    data && typeof data === "object" && data !== null && "detail" in data
      ? String((data as { detail: unknown }).detail)
      : "";
  if (status === 0) return detail || "Network error — check your connection.";
  if (status === 503) return detail || "API base URL is not configured for this project.";
  if (status === 502 || status === 504) {
    return detail || "Backend API is unreachable. Start the FastAPI service for this project.";
  }
  if (status === 400) return detail || "Invalid proxy request.";
  if (!status || status >= 400) return detail || `Request failed (HTTP ${status}).`;
  return `HTTP ${status}`;
}
