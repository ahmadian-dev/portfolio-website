import { NextRequest, NextResponse } from "next/server";
import { getProjectByProxyId } from "@/lib/projects";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 12 * 1024 * 1024;
const UPSTREAM_TIMEOUT_MS = 45_000;

function backendBase(proxyId: string): string | null {
  const project = getProjectByProxyId(proxyId);
  if (!project) return null;
  const fromEnv = process.env[project.apiEnvKey]?.trim();
  return fromEnv || null;
}

function isAllowedUpstreamPath(pathname: string): boolean {
  const path = (pathname.startsWith("/") ? pathname : `/${pathname}`).split("?")[0];
  if (path === "/health" || path === "/docs" || path === "/redoc" || path === "/openapi.json") return true;
  return path.startsWith("/v1/");
}

function resolveSafeUpstream(base: string, pathParts: string[]): URL | null {
  if (pathParts.some((p) => p.includes("..") || p.includes("\\"))) return null;

  const joined = pathParts.map((part) => {
    try {
      return decodeURIComponent(part);
    } catch {
      return part;
    }
  });

  if (joined.some((p) => p.includes("://") || p.startsWith("//") || p.includes("\\"))) return null;

  const targetPath = "/" + joined.join("/");
  if (targetPath.includes("//") || targetPath.includes("\\")) return null;
  if (!isAllowedUpstreamPath(targetPath.split("?")[0])) return null;

  let baseUrl: URL;
  try {
    baseUrl = new URL(base.endsWith("/") ? base : `${base}/`);
  } catch {
    return null;
  }

  if (!["http:", "https:"].includes(baseUrl.protocol)) return null;

  let url: URL;
  try {
    url = new URL(targetPath.replace(/^\//, ""), baseUrl);
  } catch {
    return null;
  }

  if (url.protocol !== baseUrl.protocol || url.host !== baseUrl.host) return null;
  if (!isAllowedUpstreamPath(url.pathname)) return null;

  return url;
}

async function forward(req: NextRequest, proxyId: string, pathParts: string[]) {
  const project = getProjectByProxyId(proxyId);
  if (!project) {
    return NextResponse.json({ error: "unknown_proxy", detail: "Unknown project proxy id" }, { status: 404 });
  }

  const base = backendBase(proxyId);
  if (!base) {
    return NextResponse.json(
      {
        error: "api_base_not_configured",
        detail: `Set ${project.apiEnvKey} in the environment`,
      },
      { status: 503 },
    );
  }

  const url = resolveSafeUpstream(base, pathParts);
  if (!url) {
    return NextResponse.json(
      { error: "invalid_proxy_path", detail: "Path is not allowed for this proxy" },
      { status: 400 },
    );
  }

  req.nextUrl.searchParams.forEach((v, k) => url.searchParams.set(k, v));

  const contentLength = Number(req.headers.get("content-length") || "0");
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "payload_too_large", detail: "Request body exceeds limit" }, { status: 413 });
  }

  const headers = new Headers();
  const contentType = req.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);
  const apiKey = req.headers.get("x-api-key");
  if (apiKey) headers.set("x-api-key", apiKey);

  const init: RequestInit = {
    method: req.method,
    headers,
    cache: "no-store",
    signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
  };

  if (req.method !== "GET" && req.method !== "HEAD") {
    const buf = Buffer.from(await req.arrayBuffer());
    if (buf.byteLength > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "payload_too_large", detail: "Request body exceeds limit" }, { status: 413 });
    }
    init.body = buf;
  }

  try {
    const upstream = await fetch(url, init);
    const buf = await upstream.arrayBuffer();
    const out = new NextResponse(buf, { status: upstream.status });
    const ct = upstream.headers.get("content-type");
    if (ct) out.headers.set("content-type", ct);
    out.headers.set("Cache-Control", "no-store");
    return out;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to reach FastAPI";
    const timedOut = err instanceof Error && (err.name === "TimeoutError" || err.name === "AbortError");
    return NextResponse.json(
      {
        error: timedOut ? "upstream_timeout" : "upstream_unreachable",
        detail: message,
        hint: `Ensure the API for ${proxyId} is reachable at the configured ${project.apiEnvKey}`,
      },
      { status: timedOut ? 504 : 502 },
    );
  }
}

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ slug: string; path: string[] }> },
) {
  const { slug, path } = await ctx.params;
  return forward(req, slug, path);
}

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ slug: string; path: string[] }> },
) {
  const { slug, path } = await ctx.params;
  return forward(req, slug, path);
}
