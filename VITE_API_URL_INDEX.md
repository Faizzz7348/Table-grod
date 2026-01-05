# 📚 VITE_API_URL - Complete Documentation Index

Kau tanya "Vite API nak dapat dari mana?" 

Sini saya buat lengkap dokumentasi tentang VITE_API_URL:

---

## 📖 Choose Your Learning Style

### 🏃 **Super Cepat (2 minit)** 
👉 **VITE_API_URL_SIMPLE.md**
- 3 langkah saja
- Create .env file
- Set in Vercel
- Done!

### 📊 **Visual Learner (5 minit)**
👉 **VITE_API_URL_VISUAL_GUIDE.sh**
- Flow diagram
- Step by step
- Visual explanation
- Run: `bash VITE_API_URL_VISUAL_GUIDE.sh`

### 📋 **Quick Reference (1 minit)**
👉 **VITE_API_URL_QUICK_REF.sh**
- All in one screen
- API endpoint list
- Checklist
- Run: `bash VITE_API_URL_QUICK_REF.sh`

### 📚 **Complete Guide (15 minit)**
👉 **docs/VITE_API_URL_EXPLAINED.md**
- Deep dive
- How it works behind scenes
- Troubleshooting
- Current setup in your app

---

## 🎯 TLDR - The Answer

**Soalan**: "Vite API nak dapat dari mana?"

**Jawab**:
1. Create `.env` file with `VITE_API_URL=/api`
2. Vite read it automatically
3. App use via `import.meta.env.VITE_API_URL`
4. All API calls go to `/api` endpoint
5. Done!

For production (Vercel):
1. Set same thing in Vercel env vars
2. Redeploy
3. Production app work with same config

---

## 📂 Files Created

```
VITE_API_URL_SIMPLE.md              ← Start here! (3 steps)
VITE_API_URL_QUICK_REF.sh           ← Quick reference (run in terminal)
VITE_API_URL_VISUAL_GUIDE.sh        ← Visual flow (run in terminal)
docs/VITE_API_URL_EXPLAINED.md      ← Full documentation
docs/VITE_API_URL - Complete...     ← This file
```

---

## 🔧 Setup dalam 3 Langkah

### STEP 1: Local Development

Create file `.env` in root folder:
```
VITE_API_URL=/api
```

### STEP 2: Verify It Works

```bash
npm run dev
```

Open browser console (F12):
```javascript
console.log(import.meta.env.VITE_API_URL)
// Output: /api ✓
```

### STEP 3: Production (Vercel)

1. https://vercel.com/dashboard
2. Select your project
3. Settings → Environment Variables
4. Add: `VITE_API_URL = /api`
5. Redeploy

---

## ⚙️ How It Works

```javascript
// In your code: src/service/CustomerService.js
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Use in API calls:
fetch(`${API_BASE_URL}/routes`)   // Become: /api/routes
fetch(`${API_BASE_URL}/upload`)   // Become: /api/upload

// These API endpoints handle the requests:
api/routes.js    ← GET /api/routes
api/locations.js ← GET /api/locations
api/upload.js    ← POST /api/upload
```

---

## 🔌 Current Setup in Your App

**Source**: src/service/CustomerService.js (Line 1)

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
```

This mean:
- Try to get from `VITE_API_URL` env var
- If not found, use default `/api`
- All API calls use this base URL

---

## 📡 API Endpoints Available

All use `VITE_API_URL`:

```
GET    /api/routes
POST   /api/routes
PUT    /api/routes/:id
DELETE /api/routes/:id

GET    /api/locations
POST   /api/locations
PUT    /api/locations/:id
DELETE /api/locations/:id

POST   /api/upload
GET    /api/upload
```

---

## ⚠️ Common Issues

**Issue**: API calls fail with 404
**Fix**: Check `import.meta.env.VITE_API_URL` in console, should be `/api`

**Issue**: Works locally, fail in Vercel
**Fix**: Forgot to set env var in Vercel. Go set it and redeploy.

**Issue**: Want to use different API URL
**Fix**: Change env var value, but remember:
- Local: .env file
- Production: Vercel dashboard
- Both must be same value or restart

---

## ✅ Verification Checklist

```
Local Development:
  [ ] .env file created with VITE_API_URL=/api
  [ ] npm run dev work
  [ ] Console show: /api ✓
  [ ] API calls work (Network tab 200 OK)

Production (Vercel):
  [ ] Set VITE_API_URL=/api in Vercel env vars
  [ ] Redeployed successfully
  [ ] Console show: /api ✓
  [ ] API calls work (Network tab 200 OK)
  [ ] App display data correctly
```

---

## 📞 Need Help?

1. **Super confused?** Read: VITE_API_URL_SIMPLE.md
2. **Want visual?** Run: `bash VITE_API_URL_VISUAL_GUIDE.sh`
3. **Need quick ref?** Run: `bash VITE_API_URL_QUICK_REF.sh`
4. **Technical details?** Read: docs/VITE_API_URL_EXPLAINED.md
5. **Still stuck?** Check troubleshooting section in VITE_API_URL_EXPLAINED.md

---

## 🎓 What You Learned

✓ VITE_API_URL is environment variable that tell app where API is
✓ Set in .env for local, Vercel env vars for production
✓ Vite automatically read (must prefix with VITE_)
✓ App access via `import.meta.env.VITE_API_URL`
✓ All API calls use this as base URL
✓ Flexible = different behavior per environment, same code

---

**Status**: Updated January 5, 2026
**Ready to**: Deploy and use your app! 🚀

All files created successfully. Choose your preferred learning style and go from there!
