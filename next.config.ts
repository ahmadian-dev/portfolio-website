import type { NextConfig } from "next";

const PROJECT_SLUGS = [
  "predictive-maintenance",
  "document-intelligence",
  "business-forecasting",
  "ai-sql-copilot",
  "computer-vision-inspection",
] as const;

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self' data:",
      "connect-src 'self'",
      "frame-src 'self'",
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

function legacyPresentationRedirects() {
  const out: { source: string; destination: string; permanent: boolean }[] = [];
  for (const slug of PROJECT_SLUGS) {
    const base = `/projects/${slug}`;
    const entries: [string, string][] = [
      [`${base}/presentation/dashboard`, `${base}/dashboard`],
      [`${base}/presentation/dashboard/index.html`, `${base}/dashboard`],
      [`${base}/presentation/architecture`, `${base}/architecture`],
      [`${base}/presentation/architecture/index.html`, `${base}/architecture`],
      [`${base}/presentation/architecture/architecture.html`, `${base}/architecture`],
      [`${base}/presentation/demo-website`, `${base}/presentation`],
      [`${base}/presentation/demo-website/index.html`, `${base}/presentation`],
      [`${base}/presentation/index.html`, `${base}/presentation`],
      [`${base}/dashboard/index.html`, `${base}/dashboard`],
      [`${base}/architecture/index.html`, `${base}/architecture`],
      [`${base}/architecture/architecture.html`, `${base}/architecture`],
    ];
    for (const [source, destination] of entries) {
      out.push({ source, destination, permanent: true });
    }
  }
  return out;
}

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [],
  },
  async redirects() {
    return [
      {
        source: "/p/predmaint",
        destination: "/projects/predictive-maintenance",
        permanent: true,
      },
      {
        source: "/p/docintel",
        destination: "/projects/document-intelligence",
        permanent: true,
      },
      {
        source: "/p/forecast",
        destination: "/projects/business-forecasting",
        permanent: true,
      },
      {
        source: "/p/sqlcopilot",
        destination: "/projects/ai-sql-copilot",
        permanent: true,
      },
      {
        source: "/p/cvinspect",
        destination: "/projects/computer-vision-inspection",
        permanent: true,
      },
      {
        source: "/live-demo",
        destination: "/projects",
        permanent: true,
      },
      {
        source: "/live-demo/:path*",
        destination: "/projects",
        permanent: true,
      },
      ...legacyPresentationRedirects(),
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      {
        source: "/assets/(.*)",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
