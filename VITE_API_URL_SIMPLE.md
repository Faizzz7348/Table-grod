# VITE_API_URL - 3 LANGKAH MUDAH

## Soalan: "Vite API nak dapat dari mana?"

**Jawab**: Set dalam `.env` file. Vite akan baca sendiri.

---

## ✅ STEP 1: Create `.env` File (Local Development)

Di root folder project (same level as package.json):

**File: .env**
```
VITE_API_URL=/api
```

That's it! Vite will automatically read this.

---

## ✅ STEP 2: Verify It Works

Run locally:
```bash
npm run dev
```

Open browser console (F12 → Console), paste:
```javascript
console.log(import.meta.env.VITE_API_URL)
```

Expected output:
```
/api
```

If you see `/api`, means it working! ✓

---

## ✅ STEP 3: Production (Vercel)

Go to: https://vercel.com/dashboard

1. Click your project
2. Click **Settings**
3. Click **Environment Variables** (left sidebar)
4. Click **Add New** and input:
   ```
   Name: VITE_API_URL
   Value: /api
   ```
5. Click **Save**
6. Go to **Deployments** and click **Redeploy**

Done! Now Vercel knows where API is.

---

## 🔌 Behind The Scene

### What Happens Locally:

```
You type in browser: http://localhost:5173
  ↓
App load from Vite dev server
  ↓
App read: import.meta.env.VITE_API_URL
  ↓
Get value: /api (from .env file)
  ↓
When fetch('/api/routes'):
  - Browser send to: http://localhost:5173/api/routes
  - Vite proxy to your actual API
  ↓
Get data back
  ↓
App display data
```

### What Happens on Vercel:

```
You visit: https://yourdomain.vercel.app
  ↓
App load from Vercel
  ↓
App read: import.meta.env.VITE_API_URL
  ↓
Get value: /api (from Vercel env vars)
  ↓
When fetch('/api/routes'):
  - Browser send to: https://yourdomain.vercel.app/api/routes
  - Vercel route to Serverless Function: api/routes.js
  ↓
Get data back
  ↓
App display data
```

---

## ⚙️ Where App Use VITE_API_URL

**File: src/service/CustomerService.js (Line 1)**

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
```

Then anywhere in code:
```javascript
fetch(`${API_BASE_URL}/routes`)   // Jadi: /api/routes
fetch(`${API_BASE_URL}/upload`)   // Jadi: /api/upload
```

---

## ⚠️ Important Points

1. **Must prefix with VITE_**
   - `VITE_API_URL` ✓ Works
   - `API_URL` ✗ Doesn't work

2. **Set in TWO places**
   - Local: `.env` file
   - Production: Vercel env vars
   - Both same value: `/api`

3. **After change env vars**
   - Local: Restart `npm run dev`
   - Vercel: Redeploy from dashboard

4. **Default fallback**
   - If not set: Use `/api` (already in code)
   - But better explicit than rely on default

---

## 🆘 Troubleshooting

**Q: API call fail 404?**
A: Check `import.meta.env.VITE_API_URL` in console. Should be `/api`

**Q: Work locally but not on Vercel?**
A: Forgot to set env var in Vercel. Go set it dan redeploy.

**Q: How check current value?**
A: `console.log(import.meta.env.VITE_API_URL)` in browser console

---

## 📋 Checklist

- [ ] Created `.env` file with `VITE_API_URL=/api`
- [ ] Run `npm run dev` work
- [ ] Check console: `import.meta.env.VITE_API_URL` show `/api`
- [ ] Set in Vercel env vars: `VITE_API_URL=/api`
- [ ] Redeployed Vercel
- [ ] Production app work (can see data)

---

**That's it! VITE_API_URL adalah simple saja.** 

👉 See `docs/VITE_API_URL_EXPLAINED.md` for more detailed explanation.
