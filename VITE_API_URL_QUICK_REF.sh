#!/bin/bash

# Quick Reference: VITE_API_URL

cat << 'EOF'

╔════════════════════════════════════════════════════════════════════════╗
║                    VITE_API_URL - QUICK REFERENCE                     ║
╚════════════════════════════════════════════════════════════════════════╝

📍 DEFINITION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

VITE_API_URL = Tell app where API server is

Example:
  VITE_API_URL=/api
  → fetch('/api/routes') = GET /api/routes
  → fetch('/api/upload') = POST /api/upload


⚙️ HOW IT WORKS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Declare in .env file:
   VITE_API_URL=/api

2. Vite read it automatically (must prefix with VITE_):
   import.meta.env.VITE_API_URL

3. Code use it:
   const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'
   fetch(`${API_BASE_URL}/routes`)

4. Result:
   Browser send: GET /api/routes
   Server receive and process


📂 WHERE TO SET IT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LOCAL DEVELOPMENT:
  File: .env (in root folder)
  Content:
    VITE_API_URL=/api
  Run: npm run dev

PRODUCTION (VERCEL):
  1. https://vercel.com/dashboard
  2. Select project
  3. Settings → Environment Variables
  4. Add: VITE_API_URL = /api
  5. Redeploy


🔌 CURRENT SETUP IN YOUR APP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Source: src/service/CustomerService.js (Line 1)

  const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

This mean:
  ✓ Get from env var: VITE_API_URL
  ✓ Fallback to: /api


📡 API ENDPOINTS (all use VITE_API_URL)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

GET    /api/routes              → Fetch all routes
POST   /api/routes              → Create route
PUT    /api/routes/:id          → Update route
DELETE /api/routes/:id          → Delete route

GET    /api/locations           → Fetch all locations
POST   /api/locations           → Create location
PUT    /api/locations/:id       → Update location
DELETE /api/locations/:id       → Delete location

POST   /api/upload              → Upload image
GET    /api/upload              → Check status


🌍 FLOW DIAGRAM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LOCAL:
  ┌──────────────────────┐
  │  App (localhost:5173)│
  │  VITE_API_URL=/api   │
  └──────────┬───────────┘
             │ fetch('/api/routes')
             ↓
  ┌──────────────────────┐
  │  Vite Dev Server     │
  │  (localhost:5173)    │
  └──────────┬───────────┘
             │ proxies to
             ↓
  ┌──────────────────────┐
  │  API Server          │
  │  (localhost:3000)    │
  │  api/routes.js       │
  └──────────┬───────────┘
             │
             ↓
  ┌──────────────────────┐
  │  Database            │
  │  PostgreSQL/Neon     │
  └──────────────────────┘


PRODUCTION (VERCEL):
  ┌────────────────────────────────┐
  │  App (yourdomain.vercel.app)   │
  │  VITE_API_URL=/api             │
  └────────────────┬───────────────┘
                   │ fetch('/api/routes')
                   ↓
  ┌────────────────────────────────┐
  │  Vercel Serverless             │
  │  api/routes.js (Function)      │
  └────────────────┬───────────────┘
                   │
                   ↓
  ┌────────────────────────────────┐
  │  Database                      │
  │  Neon PostgreSQL               │
  └────────────────────────────────┘


⚠️ COMMON MISTAKES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ WRONG:
  const API_BASE_URL = 'http://localhost:3000/api'
  Problem: Hardcoded, breaks in production

❌ WRONG:
  API_URL=/api  (no VITE_ prefix)
  Problem: Vite won't expose it

❌ WRONG:
  Set VITE_API_URL in .env but forgot to set in Vercel
  Problem: Works local, fails production

✅ CORRECT:
  VITE_API_URL=/api  (in both .env and Vercel)
  const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'


✅ CHECKLIST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

For Local Development:
  [ ] Create .env file with VITE_API_URL=/api
  [ ] Run: npm run dev
  [ ] Check browser console: no "Cannot find /api/..." errors
  [ ] API calls work (check Network tab in DevTools)

For Production (Vercel):
  [ ] Add VITE_API_URL=/api in Vercel env vars
  [ ] Add DATABASE_URL in Vercel env vars
  [ ] api/ folder exists with route handlers
  [ ] vercel.json has rewrites for /api
  [ ] Redeploy after setting env vars
  [ ] Check browser console: no errors
  [ ] Network tab shows /api calls with 200 status


🔍 HOW TO CHECK WHAT VALUE IS USED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Open browser DevTools (F12)
2. Go to Console tab
3. Paste: console.log(import.meta.env.VITE_API_URL)
4. See the value

Output example:
  Local:  "/api"
  Vercel: "/api"


📚 FILES INVOLVED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

.env                              ← Set VITE_API_URL for local
.env.production.example           ← Template for production
src/service/CustomerService.js    ← Use VITE_API_URL
api/*.js                          ← API endpoints
vercel.json                       ← Configure API rewrites
vite.config.js                    ← Vite config (auto expose VITE_*)

Full guide: docs/VITE_API_URL_EXPLAINED.md


═══════════════════════════════════════════════════════════════════════════

TL;DR:
  1. Set VITE_API_URL=/api in .env (local)
  2. Set VITE_API_URL=/api in Vercel (production)
  3. App automatically use it via import.meta.env.VITE_API_URL
  4. All fetch() calls go to that API endpoint
  5. Done!

═══════════════════════════════════════════════════════════════════════════

EOF
