# Production Readiness Guide

This document describes the procedures and configurations for running **interQ** in a production environment.

## 1. Quick Start with Docker Compose

To start the entire application stack including PostgreSQL, Redis, and the Next.js app server:

```bash
# 1. Copy environment variables file
cp .env.example .env

# 2. Fill in the Firebase credentials and environment secrets in .env

# 3. Spin up the services
docker-compose up -d --build
```

The app will be available on port `3000`.

## 2. Docker Setup

The application uses a multi-stage Dockerfile optimized to run as a non-root user (`nextjs`) inside `node:22-alpine` for security.

### Build the Image manually:
```bash
docker build -t interq:latest .
```

### Run the Container manually:
```bash
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://user:pass@host:5432/db" \
  -e REDIS_URL="redis://host:6379" \
  -e FIREBASE_PROJECT_ID="your-project-id" \
  -e FIREBASE_CLIENT_EMAIL="service-account-email" \
  -e FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..." \
  interq:latest
```

## 3. Database Migrations

Before releasing new builds, database migrations should be run using Prisma. In containerized production environments, run migrations during deployment scripts:

```bash
docker-compose exec web npx prisma migrate deploy
```

Avoid using `prisma db push` in production. Always generate, review, and apply SQL migrations.

## 4. Monitoring & Healthchecks

A dedicated health check endpoint is available at `/api/v1/health`.

### Response Payload:
- **`200 OK`**: Database and Redis are fully operational.
- **`503 Service Unavailable`**: Either Database or Redis is unreachable.

Example status:
```json
{
  "status": "healthy",
  "timestamp": "2026-07-10T15:00:00.000Z",
  "services": {
    "database": "healthy",
    "redis": "healthy"
  }
}
```

Configure external uptime checkers (e.g., Pingdom, Better Uptime) or Kubernetes readiness/liveness probes to query `/api/v1/health`.

## 5. Security & Headers

We have configured security headers in `next.config.ts` enforcing:
- **Strict-Transport-Security (HSTS)**: 2 years.
- **Content-Security-Policy (CSP)**: Strict policy allowing only trusted domains and local assets.
- **X-Frame-Options**: `DENY` to prevent clickjacking.
- **X-Content-Type-Options**: `nosniff`.

Ensure SSL is terminated at your load balancer (e.g. Nginx, Cloudflare, AWS ALB) for HSTS to take full effect.

## 6. Sentry (Error Tracking) Setup

For production error tracking, we recommend integrating Sentry:
1. Run `npx @sentry/wizard@latest -i nextjs`.
2. Configure the `SENTRY_DSN` in your environment variables.
3. Errors on both the client side and API server will be automatically routed to Sentry.
