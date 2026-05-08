# Deploying to Hostinger (Node.js Hosting)

This guide covers deploying the Wandering Cocos app to Hostinger's Node.js hosting
by pulling code from GitHub.

The entire build and startup is handled by a single command: **`npm start`**

---

## Prerequisites

- A Hostinger Business (or higher) hosting plan with Node.js support
- Your GitHub repository connected to Hostinger
- A Neon PostgreSQL database (connection string ready)

---

## Environment variables (hPanel → Node.js → Environment Variables)

Set the following variables in Hostinger's hPanel before starting the app:

| Variable | Required | Value |
|---|---|---|
| `NODE_ENV` | Yes | `production` |
| `DATABASE_URL` | Yes | `postgresql://user:pass@host/db?sslmode=require` — from your Neon console |
| `ADMIN_SECRET` | Yes | A long random string (e.g. run `openssl rand -hex 32` locally to generate one) |
| `PORT` | No | Leave empty — Hostinger sets this automatically |

Do **not** set `BASE_PATH` as a runtime env var — it is only used during the build step (handled automatically by `npm start`).

---

## Deploying from GitHub

### 1. Pull the latest code

In the hPanel terminal (or via SSH):

```bash
git pull origin main
```

### 2. Start the application

In hPanel → Node.js → Application settings:

- **Node.js version:** `24`
- **Application startup file / entry point:** `artifacts/api-server/dist/index.cjs`
- **Start command:** `npm start`

Click **Start** (or **Restart** if already running).

`npm start` will automatically:
1. Install all workspace dependencies (using pnpm via npx — no manual pnpm setup needed)
2. Build the React frontend into `artifacts/wandering-cocos/dist/public/`
3. Bundle the API server into `artifacts/api-server/dist/index.cjs`
4. Start the Node.js server

### 3. Run the initial database migration (first deploy only)

After the first deploy, run the schema migration once via the hPanel terminal:

```bash
DATABASE_URL="your-neon-connection-string" npx drizzle-kit push --config lib/db/drizzle.config.ts
```

You only need this on the first deploy, or whenever the database schema changes.

---

## Subsequent deploys

For every future deploy after pushing new code to GitHub:

```bash
git pull origin main
```

Then click **Restart** in hPanel. `npm start` re-runs the full build automatically.

If you changed the database schema, also re-run the migration step above.

---

## Verifying the deployment

- Visit your domain — you should see the Wandering Cocos website
- Visit `yourdomain.com/api/healthz` — should return a health status response
- Check the hPanel Node.js logs if the app fails to start

---

## Architecture in production

```
Browser → yourdomain.com/
              │
              ▼
     Express (Node.js on Hostinger)
              │
    ┌─────────┴──────────────┐
    │                        │
 /api/**              /* (everything else)
 API routes          Serves React SPA static files
 (Express router)    (artifacts/wandering-cocos/dist/public/)
```

The frontend and API run as a single Node.js process — no separate servers needed.
