# 🔍 White Blank Page di Vercel - Troubleshooting Guide

## 🚨 Masalah Umum & Solusi

### **1. Environment Variables Tidak Set** (PALING SERING!)

**Symptom**: White blank page, console kosong atau error tentang undefined

**Check List**:
- [ ] Go to Vercel Dashboard → Your Project → Settings → Environment Variables
- [ ] Verify ini ada:
  - `DATABASE_URL` - Connection string ke database
  - `VITE_API_URL` - Should be `/api` for Vercel
  - `BLOB_READ_WRITE_TOKEN` - For image uploads
  - Any other `.env` variables yang app butuh

**Fix**:
```
Di Vercel Dashboard:
1. Settings → Environment Variables
2. Add/Update:
   - DATABASE_URL=postgresql://...
   - VITE_API_URL=/api
   - BLOB_READ_WRITE_TOKEN=your_token
3. Redeploy
```

---

### **2. Database Connection Error**

**Symptom**: App load tapi data tidak appear, atau error di console

**Check**:
```javascript
// In browser console (Vercel app):
console.error - lihat ada error tentang database
// atau network tab - lihat /api/routes response
```

**Fix**:
- Verify DATABASE_URL is correct
- Check database server is running and accessible
- Test connection: `npx prisma db push`
- Check firewall/network allowing Vercel IP

---

### **3. Build Output Issue**

**Symptom**: See folder structure instead of app

**Check Vercel Build Log**:
1. Go to Vercel → Deployments
2. Click latest deployment
3. Check "Build Logs"
4. Look for errors like:
   - "npm run build failed"
   - "outputDirectory not found"

**Fix**:
In `vercel.json`:
```json
{
  "buildCommand": "npm run build && npx prisma generate || true",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

Rebuild: `npm run build` locally to verify works

---

### **4. CSS/Styles Not Loading**

**Symptom**: White page with no styling

**Check**:
- Open browser DevTools → Network
- Look for CSS files - are they loaded?
- Any 404 errors?

**Common Issues**:
- PrimeReact CSS file path wrong
- Leaflet CSS not loading
- index-clean.css missing

**Fix**: Verify in `index.html`:
```html
<!-- These must load correctly -->
<link rel="stylesheet" href="https://unpkg.com/primereact/resources/themes/lara-light-cyan/theme.css">
<!-- CSS will be injected by Vite, make sure main.jsx imports it -->
```

---

### **5. JavaScript Bundle Error**

**Symptom**: Page loads but no content, console shows JS errors

**Check Console** (F12):
- Any red errors?
- Lazy loading issues?
- Import errors?

**Recent Fix Applied**:
- EditableDescriptionList now has proper default export
- This was causing lazy loading error

**Verify**:
```
Console should NOT show:
- "No default value"
- "Cannot find module"
- "Unexpected token"
```

---

## 🔧 Complete Vercel Setup

### **Step 1: Create Vercel Environment Variables**

Vercel Dashboard → Settings → Environment Variables:

```
NAME: DATABASE_URL
VALUE: postgresql://username:password@host/database?sslmode=require
```

```
NAME: VITE_API_URL
VALUE: /api
```

```
NAME: BLOB_READ_WRITE_TOKEN
VALUE: vercel_blob_token_here
```

### **Step 2: Verify Build Works**

```bash
npm run build
# Should complete without errors
# dist/ folder should have:
# - index.html
# - assets/
# - manifest.webmanifest
# - sw.js
```

### **Step 3: Check vercel.json**

```json
{
  "version": 2,
  "buildCommand": "npm run build && npx prisma generate || true",
  "outputDirectory": "dist",
  "framework": "vite",
  "installCommand": "npm install"
}
```

### **Step 4: Deploy & Monitor**

```bash
git push  # Triggers Vercel redeploy
```

Then:
1. Go to Vercel Deployments
2. Wait for "Ready" status
3. Click deployment URL
4. Open DevTools Console (F12)
5. Check for errors

---

## 🐛 Debug Tips

### **Check Browser Console** (F12):
```javascript
// You should see:
// - No red errors
// - "App initialized" or loading message
// - CSS should be visible
```

### **Check Network Tab** (F12):
```
index.html       - 200 OK
main.js (bundle) - 200 OK
CSS files        - 200 OK
/api/routes      - 200 OK (with data)
```

### **Check Vercel Build Logs**:
1. Click deployment
2. Scroll to "Build & Deployments"
3. Look for:
   - `npm install` success?
   - `npm run build` success?
   - File count in output?

---

## ✅ Test Checklist

```
[ ] npm run build works locally
[ ] dist/index.html exists
[ ] npm run preview shows app correctly
[ ] All env vars set in Vercel
[ ] DATABASE_URL connects successfully
[ ] No console errors in DevTools
[ ] Network tab shows all files loading (200 OK)
[ ] API endpoints respond correctly
[ ] App displays content, not blank page
```

---

## 🆘 Still Blank?

1. **Check build logs** - Vercel Dashboard → Deployments → View Logs
2. **Check browser console** - F12 → Console tab → Red errors?
3. **Check Network tab** - F12 → Network tab → Any 404s?
4. **Local test** - `npm run preview` → Does it work locally?
5. **Ask:** What error message in:
   - Vercel build logs?
   - Browser console?
   - Network failures?

---

## 📞 Quick Checklist untuk Kau

**Kau checkkan:**
1. Vercel env vars semua ada? (DATABASE_URL, VITE_API_URL, etc)
2. Build successful di Vercel? (No red X)
3. Browser console ada error merah? (F12)
4. index.html loading? (Network tab)
5. API endpoints respond? (Network tab, look for /api/*)

**Common culprit**: Missing DATABASE_URL atau VITE_API_URL in Vercel env vars!

---

**Status**: Updated January 5, 2026
