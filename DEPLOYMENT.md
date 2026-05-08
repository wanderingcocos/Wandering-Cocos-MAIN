# Deploying to Hostinger (Node.js Hosting)

This guide covers deploying the Wandering Cocos app to Hostinger's Node.js hosting
by pulling code from GitHub.

---

## Prerequisites

- A Hostinger Business (or higher) hosting plan with Node.js support
- Your GitHub repository connected to Hostinger
- A Neon PostgreSQL database (connection string ready)

---

## One-time server setup (via SSH or Hostinger Terminal)

Hostinger's Node.js environment uses npm by default. This project requires pnpm
for workspace-aware dependency resolution. Install it once via the hPanel terminal:

```bash
npm install -g pnpm@9
```

---

## Environment variables (hPanel → Node.js → Environment Variables)

Set the following variables in Hostinger's hPanel before starting the app:

| Variable | Value | Notes |
|---|---|---|
| `NODE_ENV` | `production` | Required — enables production mode |
| `DATABASE_URL` | `postgresql://user:pass@host/db?sslmode=require` | From your Neon console |
| `PORT` | *(leave empty)* | Hostinger sets this automatically |

Do **not** set `BASE_PATH` as a runtime env var — it is only used during the build step.

---

## Deploying from GitHub

### 1. Pull the latest code

In the hPanel terminal (or via SSH):

```bash
git pull origin main
```

### 2. Build the project

Run the production build script. This installs all dependencies, compiles the
frontend (React/Vite) and bundles the API server (esbuild):

```bash
npm run build:prod
```

This command does the following in order:
1. Installs all workspace dependencies with pnpm
2. Builds the frontend into `artifacts/wandering-cocos/dist/public/`
3. Bundles the API server into `artifacts/api-server/dist/index.cjs`

### 3. Run the initial database migration (first deploy only)

Sync the database schema to your Neon PostgreSQL database:

```bash
DATABASE_URL="your-neon-connection-string" npx drizzle-kit push --config lib/db/drizzle.config.ts
```

You only need to do this once on first deploy, or whenever the database schema changes.

### 4. Configure the startup command in hPanel

In hPanel → Node.js → Application settings:

- **Application startup file / entry point:** `artifacts/api-server/dist/index.cjs`
- **Node.js version:** `20` (or match the version in `.nvmrc`)

Alternatively, Hostinger accepts an npm start command — set it to:

```
npm start
```

The `start` script in `package.json` runs `node artifacts/api-server/dist/index.cjs`.

### 5. Start (or restart) the application

In hPanel, click **Restart** in the Node.js panel. The server will:
- Listen on the port Hostinger provides
- Serve the React frontend as static files from the root path (`/`)
- Handle all API requests under `/api`

---

## Subsequent deploys

For every future deploy after pushing new code to GitHub:

```bash
git pull origin main
npm run build:prod
```

Then click **Restart** in hPanel.

If you changed the database schema, also re-run the migration step above.

---

## Verifying the deployment

- Visit your domain — you should see the Wandering Cocos website
- Visit `yourdomain.com/api/healthz` — should return `{"status":"ok"}` (or similar)
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
