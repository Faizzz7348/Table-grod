# VERCEL BLOB STORAGE SETUP - FIX GAMBAR HILANG FOREVER! 🎯

## Masalah Yang Diselesaikan

**GAMBAR HILANG SELEPAS RESTART/REDEPLOY?** ✅ FIXED!

Vercel serverless functions tidak simpan file kekal. Setiap kali restart/redeploy, semua gambar yang upload akan **HILANG**. 

**Penyelesaian:** Gunakan **Vercel Blob Storage** - storage kekal yang built-in untuk Vercel.

---

## Setup Langkah-demi-Langkah (5 Minit!)

### 1️⃣ Create Vercel Blob Store

1. Pergi ke **[Vercel Dashboard - Storage](https://vercel.com/dashboard/stores)**
2. Klik **"Create Database"**
3. Pilih **"Blob"**
4. Bagi nama: `table-grod-images` (atau apa-apa nama)
5. Pilih region yang dekat dengan user (e.g., `Singapore` untuk Malaysia)
6. Klik **"Create"**

### 2️⃣ Copy Blob Token

Selepas create, you akan nampak:
```
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_XXXXXXXXXXXX"
```

**COPY token ini!** Ini adalah kunci untuk upload gambar.

### 3️⃣ Add Token ke Vercel Project

1. Pergi ke **Vercel Project Settings**
2. Klik **"Environment Variables"** tab
3. Klik **"Add New"**
4. Masukkan:
   - **Key:** `BLOB_READ_WRITE_TOKEN`
   - **Value:** token yang you copy tadi
   - **Environment:** Pilih semua (Production, Preview, Development)
5. Klik **"Save"**

### 4️⃣ Redeploy Project

```bash
# Option 1: Push code baru (akan auto-deploy)
git add .
git commit -m "Fixed: Gambar tak hilang lagi dengan Vercel Blob"
git push

# Option 2: Manual redeploy di Vercel Dashboard
# Pergi ke Deployments > Latest > Klik "Redeploy"
```

### 5️⃣ Test Upload Gambar

1. Buka app yang deployed
2. Upload gambar baru
3. Refresh page → Gambar still ada ✅
4. Redeploy project → Gambar **MASIH ADA** ✅
5. Restart/cold start → Gambar **TAK HILANG** ✅

---

## Apa Yang Berubah?

### Sebelum (ImgBB - API luar)
```javascript
// Upload ke ImgBB API
// Problem: Rate limits, external dependency
const response = await fetch('https://api.imgbb.com/...')
```

### Sekarang (Vercel Blob - Built-in)
```javascript
// Upload ke Vercel Blob (permanent storage)
// No rate limits, no external API, native Vercel integration
const blob = await put(fileName, fileData, {
  access: 'public',
  token: process.env.BLOB_READ_WRITE_TOKEN
});
```

### Kelebihan Vercel Blob:
- ✅ **Permanent storage** - gambar tak hilang forever
- ✅ **CDN-backed** - gambar load laju dari edge network
- ✅ **No rate limits** - upload berapa banyak pun ok
- ✅ **Native Vercel** - no external API dependencies
- ✅ **Automatic HTTPS** - secure by default
- ✅ **Free tier** - 500GB bandwidth per bulan

---

## Troubleshooting

### Error: "BLOB_READ_WRITE_TOKEN is missing"

**Fix:**
1. Check Vercel Environment Variables ada token atau tidak
2. Pastikan nama betul: `BLOB_READ_WRITE_TOKEN` (bukan typo)
3. Redeploy selepas add environment variable

### Gambar masih hilang?

**Check:**
1. Token betul atau tidak? Pergi Vercel Dashboard > Storage > Connect
2. Redeploy project selepas add token
3. Check browser console untuk errors
4. Clear cache: `CTRL+SHIFT+R` (hard refresh)

### Upload slow?

Normal! First upload mungkin slow sebab:
- Cold start serverless function
- Setup CDN cache
- Subsequent uploads akan laju

---

## File-file Yang Changed

### 1. `package.json`
```json
"dependencies": {
  "@vercel/blob": "^0.27.0",  // ← NEW!
  ...
}
```

### 2. `api/upload.js`
- Ganti ImgBB API dengan Vercel Blob
- Simplified upload logic
- Better error messages

### 3. `.env.example`
- Remove `IMGBB_API_KEY`
- Add `BLOB_READ_WRITE_TOKEN` dengan instructions lengkap

---

## Commands

```bash
# Install dependencies (run locally)
npm install

# Test locally dengan Vercel CLI
npx vercel dev

# Build dan deploy
npm run build
git push  # Auto-deploy to Vercel
```

---

## Verification Checklist

Selepas setup, verify semua benda ni:

- [ ] ✅ Vercel Blob Store created
- [ ] ✅ `BLOB_READ_WRITE_TOKEN` added to environment variables
- [ ] ✅ Project redeployed
- [ ] ✅ `npm install` run (untuk install @vercel/blob)
- [ ] ✅ Upload gambar test - SUCCESS
- [ ] ✅ Refresh page - gambar still ada
- [ ] ✅ Redeploy - gambar STILL ada
- [ ] ✅ Check browser console - no errors

---

## Support Links

- [Vercel Blob Documentation](https://vercel.com/docs/storage/vercel-blob)
- [Vercel Storage Dashboard](https://vercel.com/dashboard/stores)
- [Vercel Blob Pricing](https://vercel.com/docs/storage/vercel-blob/usage-and-pricing)

---

## TLDR - Quick Fix Summary

1. **Create Blob Store** di Vercel Dashboard
2. **Copy token** `BLOB_READ_WRITE_TOKEN`
3. **Add token** ke Vercel Environment Variables
4. **Redeploy** project
5. **Test upload** - gambar tak hilang lagi! 🎉

**Ini fix PERMANENT. Tak payah fix lagi 12 kali!** 💪
