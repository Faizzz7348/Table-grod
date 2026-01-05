#!/bin/bash

# Display visual guide for VITE_API_URL

cat << 'EOF'

╔═══════════════════════════════════════════════════════════════════════════╗
║                                                                           ║
║              VITE_API_URL - VISUAL FLOW & EXPLANATION                    ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 WHAT IS VITE_API_URL?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A configuration variable that tells your app:
  "Hey, when you need to call an API, send request to THIS place"

Example:
  VITE_API_URL=/api
  ↓
  fetch('/api/routes')  ← Uses the /api path


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 WHERE TO SET VITE_API_URL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LOCATION 1: .env file (for local development)
┌─────────────────────────────────┐
│  File: .env                     │
│  Location: Root folder          │
│  Content:                       │
│    VITE_API_URL=/api           │
└─────────────────────────────────┘
     ↓ When run: npm run dev
     ↓ App will use /api for all API calls


LOCATION 2: Vercel Dashboard (for production)
┌─────────────────────────────────┐
│  1. https://vercel.com/dashboard│
│  2. Select your project         │
│  3. Settings                    │
│  4. Environment Variables       │
│  5. Add: VITE_API_URL = /api   │
│  6. Redeploy                   │
└─────────────────────────────────┘
     ↓ When deploy: git push
     ↓ App will use /api for all API calls


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔧 HOW VITE READS IT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Step 1: You set in .env file
        ┌──────────────────┐
        │ VITE_API_URL=/api│
        └────────┬─────────┘

Step 2: Vite automatically read (during npm run dev / npm run build)
        Vite scan all VITE_* variables and expose them to app

Step 3: App access via import.meta.env
        ┌──────────────────────────────────┐
        │ const api = import.meta.env.VITE_API_URL;  // Get value: /api
        └──────────────────────────────────┘

Step 4: App use in API calls
        ┌──────────────────────────────────┐
        │ fetch(`${api}/routes`)           │
        │ → fetch('/api/routes')           │
        └──────────────────────────────────┘


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 WHAT HAPPENS WHEN API CALL IS MADE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

IN CODE:
┌──────────────────────────────────┐
│ fetch(`${api}/routes`)           │
│ where api = import.meta.env.VITE_API_URL  │
└─────────────┬────────────────────┘
              │
              ↓ substitutes /api
┌──────────────────────────────────┐
│ fetch('/api/routes')             │
└─────────────┬────────────────────┘
              │
              ↓ send request to
              │
LOCAL:
    Browser: http://localhost:5173/api/routes
            ↓ (Vite proxy)
    Actual Server: http://localhost:3000/api/routes

PRODUCTION (VERCEL):
    Browser: https://yourdomain.vercel.app/api/routes
            ↓ (Vercel route)
    Serverless Function: api/routes.js


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ IN YOUR APP: How It's Used
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: src/service/CustomerService.js
Location: Line 1

┌──────────────────────────────────────────────────────┐
│ const API_BASE_URL = import.meta.env.VITE_API_URL   │
│                      || '/api';                      │
│                                                       │
│ Meaning:                                             │
│ • Get value from VITE_API_URL env var                │
│ • If not set, use default '/api'                    │
│ • Store in API_BASE_URL                             │
└──────────────────────────────────────────────────────┘

Then used like:
┌──────────────────────────────────────────────────────┐
│ fetch(`${API_BASE_URL}/routes`)                     │
│ fetch(`${API_BASE_URL}/locations`)                  │
│ fetch(`${API_BASE_URL}/upload`)                     │
└──────────────────────────────────────────────────────┘


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌐 FLOW: From User Click to Response
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. User open app
   https://yourdomain.vercel.app/
   ↓

2. App load, read VITE_API_URL
   const api = import.meta.env.VITE_API_URL  → /api
   ↓

3. User click button that fetch data
   fetch('/api/routes')
   ↓

4. Browser send request to server
   GET https://yourdomain.vercel.app/api/routes
   ↓

5. Vercel receive, forward to handler
   api/routes.js Serverless Function
   ↓

6. Handler query database
   SELECT * FROM routes
   ↓

7. Database return data
   [{ id: 1, name: 'KL' }, ...]
   ↓

8. Handler format and send back
   JSON response
   ↓

9. App receive, display data
   User see list of routes on screen
   ✓ Done!


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚙️ WHY NEED VITE_API_URL?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Reason 1: FLEXIBILITY
  ❌ Don't hardcode: const api = 'http://localhost:3000'
  ✓ Use var: const api = import.meta.env.VITE_API_URL
  → Change config without rewrite code


Reason 2: DIFFERENT ENVIRONMENTS
  Local:      VITE_API_URL=/api → http://localhost:5173/api
  Production: VITE_API_URL=/api → https://domain.vercel.app/api
  Both same line of code, different behavior!


Reason 3: SECURITY
  Don't expose secrets in code
  Set in env vars (Vercel dashboard)
  Code just use import.meta.env


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ IMPORTANT RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

RULE 1: Must start with VITE_
  ✓ VITE_API_URL
  ✗ API_URL (won't work, Vite ignore this)


RULE 2: Set in BOTH places
  .env file (local)
  Vercel env vars (production)


RULE 3: Restart app after change
  Local:     npm run dev (restart)
  Vercel:    Redeploy from dashboard


RULE 4: Don't hardcode
  ✗ 'http://localhost:3000'
  ✓ import.meta.env.VITE_API_URL


RULE 5: Keep simple
  Just /api
  Don't add full URL (Vite handle that)


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ SETUP CHECKLIST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LOCAL SETUP:
  [ ] Create .env file (root folder)
  [ ] Add: VITE_API_URL=/api
  [ ] Run: npm run dev
  [ ] Open DevTools (F12) → Console
  [ ] Paste: console.log(import.meta.env.VITE_API_URL)
  [ ] See: /api ✓

VERCEL SETUP:
  [ ] Go to vercel.com/dashboard
  [ ] Select project
  [ ] Settings → Environment Variables
  [ ] Add: VITE_API_URL=/api
  [ ] Redeploy
  [ ] Open app in browser
  [ ] DevTools (F12) → Console
  [ ] Paste: console.log(import.meta.env.VITE_API_URL)
  [ ] See: /api ✓

VERIFY WORKING:
  [ ] npm run dev → API calls work (Network tab 200 OK)
  [ ] npm run preview → API calls work
  [ ] Vercel deployed → API calls work (Network tab 200 OK)


═══════════════════════════════════════════════════════════════════════════

SIMPLE ANSWER TO YOUR QUESTION:

"Vite API nak dapat dari mana?"

Answer:
  1. Create .env file with: VITE_API_URL=/api
  2. Set in Vercel env vars: VITE_API_URL=/api
  3. App read automatically via: import.meta.env.VITE_API_URL
  4. Done! App know where API is

═══════════════════════════════════════════════════════════════════════════

EOF
