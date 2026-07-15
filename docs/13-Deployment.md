# Deployment Guide for interQ

This document provides a comprehensive step-by-step guide for deploying **interQ** to production.

---

## Architecture Overview
Since **interQ** uses **Socket.IO** (WebSockets) via a custom `server.js` and a **Redis** subscription backend for real-time notifications, it cannot be hosted on serverless platforms like Vercel (which do not support persistent WebSocket connections or custom Node.js servers).

Instead, it must be deployed to platforms that support running persistent Node.js servers, Docker containers, or virtual machines (VPS).

---

## 1. Environment Variables Configuration

Ensure the following environment variables are set in your production environment:

| Variable Name | Required | Description | Example |
| :--- | :--- | :--- | :--- |
| `DATABASE_URL` | Yes | PostgreSQL connection string | `postgresql://user:pass@host:5432/dbname` |
| `REDIS_URL` | Yes | Redis connection string | `redis://default:pass@host:6379` |
| `PORT` | No | Server port (defaults to 3000) | `3000` |
| `NODE_ENV` | Yes | Production environment | `production` |
| `FIREBASE_PROJECT_ID` | Yes | Firebase project ID | `interq-489dd` |
| `FIREBASE_CLIENT_EMAIL` | Yes | Firebase Admin SDK client email | `firebase-adminsdk-...@...` |
| `FIREBASE_PRIVATE_KEY` | Yes | Firebase Admin SDK private key | `"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"` |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Yes | Client-side Firebase API Key | `AIzaSy...` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Yes | Client-side Auth Domain | `interq-489dd.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Yes | Client-side Storage Bucket | `interq-489dd.firebasestorage.app` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Yes | Messaging Sender ID | `954695367952` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Yes | Client-side App ID | `1:954695367952:web:...` |

---

## 2. Deploying on Railway (Recommended & Easiest)

Railway is a Platform-as-a-Service (PaaS) that natively supports persistent containers (using our `Dockerfile`), PostgreSQL, and Redis.

### Step 2.1: Provision Services on Railway
1. Go to [Railway.app](https://railway.app) and create a new project.
2. Click **+ New** -> **Database** -> **Add PostgreSQL**.
3. Click **+ New** -> **Database** -> **Add Redis**.

### Step 2.2: Add the Web Service
1. Click **+ New** -> **GitHub Repo** and connect your `interq` repository.
2. Railway will automatically detect the `Dockerfile` at the root of the project and begin building it.

### Step 2.3: Link Environment Variables
In the **web service** settings under **Variables**, link the Redis and Postgres instances and add the Firebase variables:
*   Add variable `DATABASE_URL` with value `${{Postgres.DATABASE_URL}}`
*   Add variable `REDIS_URL` with value `${{Redis.REDIS_URL}}`
*   Add your Firebase environment variables listed in Section 1.

### Step 2.4: Configure Deploy/Migration Step
To run database migrations before the app starts, change the startup command in your Web service settings:
*   **Startup Command:** `npx prisma migrate deploy && node server.js`

---

## 3. Deploying on Render (Alternative PaaS)

Render is another developer-friendly platform that supports persistent servers.

### Step 3.1: Create Databases
1. Create a **PostgreSQL** database on Render. Copy its connection string.
2. Create a **Redis** instance (or use an external Redis provider like Upstash). Copy its connection string.

### Step 3.2: Create a Web Service
1. In the Render Dashboard, click **New +** -> **Web Service**.
2. Connect your GitHub repository.
3. Select **Docker** as the Runtime (Render will build using the `Dockerfile` automatically).
4. Under **Environment**, add the environment variables listed in Section 1.
5. Under **Advanced**, set the **Start Command** (if overridden):
   ```bash
   npx prisma migrate deploy && node server.js
   ```

---

## 4. Self-Hosting using Docker Compose (VPS / VMs)

If you are deploying to a VPS (e.g. DigitalOcean, Linode, AWS EC2), you can run the entire stack using our configured `docker-compose.yml`.

### Step 4.1: Install Docker and Docker Compose
Ensure Docker and Docker Compose are installed on your VPS.

### Step 4.2: Setup Project
Clone the repository and copy the environment file:
```bash
git clone <your-repo-url> interq
cd interq
cp .env.example .env
```

### Step 4.3: Configure `.env`
Edit the `.env` file and replace all values with your production secrets (Firebase credentials, database passwords, etc.).

### Step 4.4: Start Services
Run Docker Compose in detached mode:
```bash
docker-compose up -d --build
```
This command starts:
*   A persistent PostgreSQL instance
*   A persistent Redis instance
*   The `web` persistent container (which automatically runs `npx prisma generate` and compiles the Next.js app)

### Step 4.5: Run Migrations on VPS
Once the container is online, run Prisma migrations to build your production database tables:
```bash
docker-compose exec web npx prisma migrate deploy
```

---

## 5. Post-Deployment Verification
Check the health status of your deployment by visiting:
`https://your-domain.com/api/v1/health`

A healthy deployment will return:
```json
{
  "status": "healthy",
  "timestamp": "2026-07-15T23:10:00.000Z",
  "services": {
    "database": "healthy",
    "redis": "healthy"
  }
}
```
