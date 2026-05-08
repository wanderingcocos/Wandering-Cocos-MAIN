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

## Keeping the app alive with PM2 (auto-restart on crash)

Hostinger's built-in Node.js panel only restarts the app manually. PM2 is a process manager that automatically restarts the app if it crashes or if the server reboots, and provides structured logs.

### Install PM2 (one-time setup)

In the hPanel terminal (or via SSH):

```bash
npm install -g pm2
```

### Build the app first

Before starting with PM2, make sure you've built the app:

```bash
npm run build:prod
```

### Start the app via PM2

First, create the log directory if it doesn't exist:

```bash
mkdir -p logs
```

Then start the server:

```bash
PORT=$(cat ~/public_html/.htaccess 2>/dev/null | grep -oP '(?<=RewriteRule \. http://localhost:)\d+' || echo 3000) \
  pm2 start ecosystem.config.cjs --env production
```

> **How PORT works with PM2:** Hostinger normally injects `PORT` automatically when it starts a Node.js app via hPanel. When running PM2 from the terminal instead, you need to pass `PORT` explicitly. The command above tries to detect it from your hPanel config — if that doesn't work, check hPanel → Node.js → Application settings for the assigned port number and run:
> ```bash
> PORT=<your-port> pm2 start ecosystem.config.cjs --env production
> ```

This reads the `ecosystem.config.cjs` file at the repo root and starts the server under PM2's supervision.

### Make PM2 restart on server reboot

```bash
pm2 startup
```

Run the command it outputs (it will look like `sudo env PATH=... pm2 startup systemd -u ...`), then save the current process list:

```bash
pm2 save
```

### Useful PM2 commands

| Command | What it does |
|---|---|
| `pm2 status` | Show running processes and their status |
| `pm2 logs wandering-cocos` | Stream live logs |
| `pm2 restart wandering-cocos` | Restart the app (e.g. after a deploy) |
| `pm2 stop wandering-cocos` | Stop the app |
| `pm2 delete wandering-cocos` | Remove from PM2 process list |

### Deploying updates with PM2

After `git pull origin main`, rebuild and restart:

```bash
npm run build:prod && pm2 restart wandering-cocos
```

> **Note:** If Hostinger's hPanel "Start" button conflicts with PM2, use PM2 exclusively via the terminal and leave the hPanel start command unused. PM2 will keep the process running independently.

---

## Verifying the deployment

- Visit your domain — you should see the Wandering Cocos website
- Visit `yourdomain.com/api/healthz` — should return a health status response
- Run `pm2 status` in the terminal to confirm the app shows `online`
- Check `logs/pm2-error.log` or run `pm2 logs wandering-cocos` if the app fails to start

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
