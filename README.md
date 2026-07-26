# Flagship Portfolio Website

**Production domain:** https://portfolio.ahmadian.dev  
**Owner:** Mohammad Ahmadian — AI / Machine Learning Engineer

Unified Next.js portfolio: navigation, project pages, and interactive FastAPI demos in **one** website.

## Routes

| Path | Page |
|------|------|
| `/` | Home |
| `/about` | About |
| `/projects` | Projects index |
| `/projects/predictive-maintenance` | Production ML Platform |
| `/projects/document-intelligence` | Document Intelligence |
| `/projects/business-forecasting` | Business Forecasting |
| `/projects/ai-sql-copilot` | AI SQL Copilot |
| `/projects/computer-vision-inspection` | Computer Vision Inspection |
| `/resume` | Resume |
| `/contact` | Contact |

## Stack

Next.js 15 · TypeScript · Tailwind CSS · Framer Motion · Heroicons · Recharts

## Local development

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open http://localhost:3000

### API env (required for interactive demos)

```env
API_PREDMAINT_URL=http://127.0.0.1:8001
API_DOCINTEL_URL=http://127.0.0.1:8002
API_FORECAST_URL=http://127.0.0.1:8003
API_SQLCOPILOT_URL=http://127.0.0.1:8004
API_CVINSPECT_URL=http://127.0.0.1:8005
```

Browser calls go through `/api/proxy/[proxyId]/...` (no CORS changes to FastAPI).

## Production

```bash
npm run build
npm start
```

Docker:

```bash
docker compose up --build
```

Vercel: import this directory, set the five `API_*_URL` env vars, domain `portfolio.ahmadian.dev`.

## SEO

- `sitemap.xml` · `robots.txt` · Open Graph · Twitter cards · JSON-LD · web manifest

## Security notes

- API proxy allowlists `/v1/*` (plus health/docs/openapi), blocks host escape / SSRF
- Body size limit · upstream timeout · no-store on proxied responses
- Security headers: CSP, HSTS, Permissions-Policy, X-Frame-Options
