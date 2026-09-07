# DEPLOYMENT GUIDE: Thailand Expressway & Tollway Fare Calculator

Production deployment guide for running **Thai Unified Toll Map** on an Ubuntu server behind an Nginx reverse proxy.

---

## 1. Prerequisites

- **OS**: Ubuntu 20.04 / 22.04 LTS (or macOS for local dev)
- **Node.js**: v18.0.0 or higher
- **Package Manager**: npm 9+
- **Git**: Installed and authenticated
- **Web Server**: Nginx (managed externally as a public reverse proxy)

---

## 2. Initial Server Setup

Clone the source repository onto the target server:

```bash
cd /var/www  # Or your application deployment directory
git clone https://github.com/palakons/thai_unified_toll_map.git
cd thai_unified_toll_map
```

---

## 3. Environment Variables

Create your production `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Edit `.env` to configure production variables:

```env
PORT=3000
HOST=127.0.0.1
NODE_ENV=production
VITE_APP_TITLE="ระบบคำนวณค่าทางด่วนและโทลล์เวย์ไทย - Thai Expressway & Tollway Fare Calculator"
VITE_APP_ENV=production
```

> **Note**: Secrets and environment-specific values must never be committed to Git.

---

## 4. Install Commands

Reproduce clean dependencies using the exact lockfile:

```bash
npm ci
```

---

## 5. Build Command

Generate the production bundle:

```bash
npm run build
```

The compiled static assets will be output to `./dist`.

---

## 6. Production Start Command

Start the production server bound strictly to `127.0.0.1:${PORT}`:

```bash
npm run start
```

> **Note**: For process management (e.g. via `systemd` or `pm2`), configure your service unit to run `npm run start` in the repository directory.

---

## 7. Health Check

Verify service liveness locally on the server:

```bash
curl -f http://127.0.0.1:3000/healthz
```

Expected output:
```json
{
  "status": "ok",
  "service": "thai-unified-toll-map"
}
```

---

## 8. Update / Redeploy Procedure

To deploy a new update from GitHub:

```bash
# 1. Pull latest changes
git pull origin main

# 2. Re-install exact dependencies
npm ci

# 3. Rebuild production bundle
npm run build

# 4. Restart process (e.g. systemctl restart toll-map or pm2 restart toll-map)
npm run start
```

---

## 9. Rollback Procedure

If a deployed version encounters issues, rollback to the previous stable Git commit:

```bash
# 1. Checkout previous commit/tag
git checkout HEAD~1

# 2. Re-install & rebuild
npm ci
npm run build

# 3. Restart application
npm run start
```
