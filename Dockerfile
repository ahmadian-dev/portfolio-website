FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ARG API_PREDMAINT_URL
ARG API_DOCINTEL_URL
ARG API_FORECAST_URL
ARG API_SQLCOPILOT_URL
ARG API_CVINSPECT_URL
ENV API_PREDMAINT_URL=$API_PREDMAINT_URL
ENV API_DOCINTEL_URL=$API_DOCINTEL_URL
ENV API_FORECAST_URL=$API_FORECAST_URL
ENV API_SQLCOPILOT_URL=$API_SQLCOPILOT_URL
ENV API_CVINSPECT_URL=$API_CVINSPECT_URL
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
RUN addgroup -S nextjs && adduser -S nextjs -G nextjs
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/').then((r)=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "server.js"]
