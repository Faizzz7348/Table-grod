# 🚀 FIX BLANK PAGE DI VERCEL - STEP BY STEP

## 🎯 Problem: White blank page di Vercel

Ini guide cepat untuk fix white blank page. Most likely cause: **missing environment variables**

---

## ✅ STEP 1: Verify Local Build Works

Run di terminal:
```bash
npm run build
npm run preview
```

**Expected**: App load correctly di browser. Jika tidak, fix local issues dulu sebelum deploy Vercel.

---

## ✅ STEP 2: Check Vercel Environment Variables

**Go to**: https://vercel.com/dashboard

1. Cari project kau
2. Click → **Settings**
3. Click → **Environment Variables** (left sidebar)
4. Add/Check ini ada:

```
Variable Name: DATABASE_URL
Value: postgresql://username:password@ep-xxx.region.neon.tech/neondb?sslmode=require
(Use your actual database connection string)

Variable Name: VITE_API_URL
Value: /api

Variable Name: BLOB_READ_WRITE_TOKEN
Value: (Get from Vercel Blob storage - if using image uploads)
```

**IMPORTANT**: After add variables, kau MUST redeploy!

---

## ✅ STEP 3: Redeploy with New Variables

**Option A**: Trigger redeploy dari Vercel
- Go to **Deployments**
- Click **...** (three dots) on latest deployment
- Click **Redeploy**

**Option B**: Push git commit
```bash
git add .
git commit -m "Update env vars"
git push
```

---

## ✅ STEP 4: Check Deployment

1. Go to **Deployments** tab
2. Wait for status = **Ready** (green checkmark)
3. Click project URL to open

---

## 🔍 STEP 5: If Still Blank, Debug

Open browser, press **F12** (DevTools):

### Console Tab:
- Ada **red error**? Screenshot dan investigate
- Kosong? Bagus, move ke Network tab

### Network Tab:
- Look for these, should all be **200 OK**:
  - index.html
  - main-xxxxx.js (bundle)
  - index-xxxxx.css (styles)
  - /api/routes (API call)

- Ada **404 error**? Missing file issue
- Ada **5xx error**? Server/API issue

---

## 💾 Checklist

- [ ] Local build works (`npm run build`)
- [ ] Local preview works (`npm run preview`)
- [ ] Vercel env vars set (DATABASE_URL, VITE_API_URL)
- [ ] Redeployed Vercel
- [ ] Browser console F12 - no red errors
- [ ] Network tab - all 200 OK
- [ ] App loads with content

---

## 🆘 Still Blank? Check This:

### 1. Missing DATABASE_URL?
```
Error: DATABASE_URL is not set
```
**Fix**: Set DATABASE_URL in Vercel env vars

### 2. API Connection Error?
```
Error: Cannot POST /api/routes
Error: Database connection failed
```
**Fix**: 
- Verify DATABASE_URL is correct
- Check database server is running
- Check Vercel IP can access database

### 3. Import/Module Error?
```
Error: Cannot find module
Error: SyntaxError
```
**Fix**: 
- Verify `npm run build` works locally
- Check recent code changes
- See build logs in Vercel

### 4. CSS/Style Issues?
```
Page loads but all white with no styling
```
**Check Network tab**:
- CSS files loading?
- If 404, check vite.config.js CSS import config

---

## 📊 Quick Vercel Check

Run diagnostic script:
```bash
bash diagnose-vercel.sh
```

This will check:
- ✓ Local build works
- ✓ Files in dist/ folder
- ✓ vercel.json configured
- ✓ Entry points correct
- ✓ CSS imports setup

---

## 📝 For Future: What to Always Check

Before deploying:
1. ✅ Run `npm run build` - must succeed
2. ✅ Run `npm run preview` - must show app
3. ✅ Set env vars in Vercel
4. ✅ Redeploy
5. ✅ Check browser console F12 for errors

---

**Stuck?** Check detailed troubleshooting guide:
👉 `/docs/VERCEL_BLANK_PAGE_TROUBLESHOOTING.md`

**Need more help?**
- Vercel docs: https://vercel.com/docs
- React/Vite deployment: https://vitejs.dev/guide/ssr.html
- Database setup: Check `docs/NEON_DATABASE_SETUP.md`

---

**Last Updated**: January 5, 2026
