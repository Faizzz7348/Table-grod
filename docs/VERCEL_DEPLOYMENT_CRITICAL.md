# 🚨 IMPORTANT: VERCEL DEPLOYMENT CHECKLIST

## ⚠️ WAJIB BUAT INI DULU SEBELUM DEPLOY!

Kalau tak buat ni, **GAMBAR AKAN HILANG** bila restart/redeploy! 

---

## ✅ Pre-Deployment Checklist

### 1. Install Dependencies (Local)
```bash
npm install
```
This installs `@vercel/blob` package yang baru ditambah.

### 2. Setup Vercel Blob Storage

**CRITICAL STEP - TAK BOLEH SKIP!**

1. Go to: https://vercel.com/dashboard/stores
2. Click **"Create Database"** → Select **"Blob"**
3. Name: `table-grod-images` (or any name)
4. Region: Choose closest to your users (e.g., Singapore for MY/SG)
5. Click **"Create"**
6. Copy the **BLOB_READ_WRITE_TOKEN** value

### 3. Add Environment Variable to Vercel

1. Go to your Vercel project
2. Click **Settings** → **Environment Variables**
3. Click **"Add New"**
4. Fill in:
   - **Name:** `BLOB_READ_WRITE_TOKEN`
   - **Value:** [paste token from step 2]
   - **Environments:** Check ALL (Production, Preview, Development)
5. Click **"Save"**

### 4. Verify `.env.example` Exists

Make sure `.env.example` has this:
```env
BLOB_READ_WRITE_TOKEN="your_vercel_blob_token_here"
DATABASE_URL="postgresql://..."
```

### 5. Commit & Push All Changes

```bash
git add .
git commit -m "fix: Image persistence menggunakan Vercel Blob Storage"
git push origin main
```

Vercel akan auto-deploy bila you push ke GitHub.

---

## 🧪 Testing After Deployment

1. **Upload gambar baru**
   - Go to deployed site
   - Upload 1-2 test images
   - Verify upload success ✅

2. **Test persistence**
   - Refresh page → Images still there? ✅
   - Redeploy project → Images still there? ✅
   - Wait 5 minutes → Images still there? ✅

3. **Check logs**
   - Vercel Dashboard → Deployments → Latest → Functions
   - Click on `/api/upload` function
   - Check logs for "Vercel Blob upload successful"

---

## ❌ Troubleshooting

### Error: "BLOB_READ_WRITE_TOKEN is missing"

**Solution:**
1. Verify token added to Vercel Environment Variables
2. Token name correct? Must be exactly: `BLOB_READ_WRITE_TOKEN`
3. Redeploy after adding token

### Error: "Upload failed"

**Check:**
1. File size < 10MB?
2. File type is image (jpg, png, gif, webp)?
3. Check Vercel function logs for detailed error

### Gambar still hilang?

**Double check:**
- [ ] `@vercel/blob` installed? (check package.json)
- [ ] Token added to Vercel? (check Environment Variables)
- [ ] Project redeployed? (check latest deployment has new code)
- [ ] API endpoint working? (test upload di deployed site)

---

## 📝 What Changed

| Before | After |
|--------|-------|
| ImgBB API (external) | Vercel Blob (built-in) |
| Images disappear on restart | Images permanent forever |
| API key dependency | Native Vercel token |
| External service limit | No limits (500GB/month free) |

---

## 🔗 Related Docs

- [VERCEL_BLOB_SETUP.md](VERCEL_BLOB_SETUP.md) - Detailed setup guide
- [IMAGE_UPLOAD_GUIDE.md](IMAGE_UPLOAD_GUIDE.md) - Image upload feature guide
- [README.md](../README.md) - Main documentation

---

## 🎯 Summary

**3 Steps to Fix Image Loss Forever:**

1. ✅ Create Vercel Blob Store
2. ✅ Add `BLOB_READ_WRITE_TOKEN` to Vercel Environment Variables  
3. ✅ Push code and redeploy

**That's it! No more "gambar hilang" issues!** 🎉

---

**Last Updated:** December 28, 2025  
**Fix Version:** Vercel Blob v0.27.0
