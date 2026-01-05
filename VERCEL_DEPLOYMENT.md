# 🚀 Vercel Deployment Guide - MUST READ!

## ⚠️ CRITICAL: Why Vercel Different From Local?

**Local Dev (`npm run dev`):**
- Guna dummy data dari API fallback
- Semua works without database

**Vercel Production:**
- MESTI ada DATABASE_URL configured
- MESTI ada BLOB_READ_WRITE_TOKEN for images
- Kalau tak set = blank/loading screen!

---

## ✅ Step-by-Step Fix Vercel Deployment

### 1️⃣ Set Environment Variables di Vercel

Go to: https://vercel.com/[your-username]/table-grod/settings/environment-variables

Add these 2 CRITICAL variables:

```bash
DATABASE_URL=postgresql://[username]:[password]@[host].neon.tech/neondb?sslmode=require
BLOB_READ_WRITE_TOKEN=vercel_blob_xxxxxxxxxxxxx
```

**Get DATABASE_URL from:**
- Neon: https://console.neon.tech
- Copy from "Connection String"

**Get BLOB_READ_WRITE_TOKEN from:**
- Vercel: https://vercel.com/dashboard/stores
- Create Blob storage
- Copy token

### 2️⃣ Redeploy

After adding env variables:
```bash
git push
```

Or manual redeploy: https://vercel.com/[your-username]/table-grod

---

## 🔍 Debug Vercel Issues

### If Table Tak Keluar:

1. **Check Console Logs**
   - Open browser dev tools (F12)
   - Look for errors in Console tab
   - Check Network tab for failed API calls

2. **Check Vercel Function Logs**
   - Go to: https://vercel.com/[your-username]/table-grod/logs
   - Look for errors in `/api/routes` or `/api/locations`

3. **Common Errors:**

   **Error: "Connection refused"**
   → DATABASE_URL not set or invalid

   **Error: "Unauthorized"**
   → BLOB_READ_WRITE_TOKEN not set

   **Loading spinner forever**
   → API calls failing, check Network tab

---

## 🎯 Quick Test Checklist

✅ Environment variables set di Vercel?
✅ Database accessible from Vercel (Neon recommended)?
✅ Blob storage created and token added?
✅ Latest code pushed to main branch?
✅ Deployment successful (green checkmark)?

---

## 💡 Pro Tips

1. **Always check Vercel logs first** bila ada issue
2. **Test API endpoints directly:**
   - https://your-app.vercel.app/api/routes
   - Should return JSON data, not HTML

3. **Use dummy data for testing:**
   - Comment out DATABASE_URL di Vercel
   - API will use dummy data fallback

---

## 📞 Still Got Issues?

Run these commands locally to test build:
```bash
npm run build
npm run preview
```

If works locally but not Vercel = environment variable issue!
