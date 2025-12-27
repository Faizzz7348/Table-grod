# Vercel Development Setup untuk QR Code Upload

## 🚨 Masalah Error 404

Error 404 pada QR code upload terjadi kerana API endpoint `/api/upload` tidak available di local development menggunakan `npm run dev` (Vite sahaja).

## ✅ Penyelesaian: Gunakan Vercel Dev

### 1. Install Vercel CLI

```bash
npm install -g vercel
```

Atau jika tiada permission:

```bash
sudo npm install -g vercel
```

### 2. Login ke Vercel

```bash
vercel login
```

Ikut arahan untuk login menggunakan email atau GitHub.

### 3. Link Project (First Time Only)

```bash
vercel link
```

Pilih:
- Setup and deploy: **Yes**
- Link to existing project: **Yes**
- Project name: **Table-grod** (atau nama project anda)

### 4. Pull Environment Variables

```bash
vercel env pull
```

Ini akan download `.env.local` dengan semua environment variables dari Vercel (termasuk IMGBB_API_KEY).

### 5. Run Development Server

**GANTI ini:**
```bash
npm run dev
```

**DENGAN ini:**
```bash
npm run dev:vercel
```

Atau:
```bash
vercel dev
```

Server akan start di `http://localhost:3000` dan API endpoints akan berfungsi!

## 🎯 Testing QR Code Upload

1. Buka browser: `http://localhost:3000`
2. Enable **Edit Mode**
3. Click pada mana-mana location → **Info button**
4. Scroll ke **Shortcut Section**
5. Click **QR Code button** (purple icon)
6. Upload gambar QR code
7. ✅ Upload sepatutnya berjaya!

## 📁 File Structure untuk Vercel

```
/workspaces/Table-grod/
├── api/
│   ├── upload.js          ← API endpoint untuk upload
│   ├── locations.js       ← API untuk locations
│   └── routes.js          ← API untuk routes
├── src/
│   └── FlexibleScrollDemo.jsx  ← Frontend dengan QR code feature
├── vercel.json            ← Vercel configuration
├── .env.local             ← Environment variables (auto-generated oleh vercel env pull)
└── package.json           ← Scripts termasuk dev:vercel
```

## 🔧 Troubleshooting

### Error: "IMGBB_API_KEY not configured"

**Penyelesaian:**
1. Pergi ke Vercel Dashboard → Your Project → Settings → Environment Variables
2. Pastikan `IMGBB_API_KEY` dah set
3. Run `vercel env pull` lagi
4. Restart `vercel dev`

### Port 3000 Already in Use

```bash
vercel dev --listen 3001
```

### API Still Returns 404

**Check:**
```bash
# Pastikan file api/upload.js wujud
ls -la api/upload.js

# Check vercel.json configuration
cat vercel.json
```

## 📊 Comparison: npm dev vs vercel dev

| Feature | npm run dev | vercel dev |
|---------|------------|------------|
| Frontend | ✅ Yes | ✅ Yes |
| Hot Reload | ✅ Yes | ✅ Yes |
| API Routes | ❌ No | ✅ Yes |
| Serverless Functions | ❌ No | ✅ Yes |
| Environment Variables | Limited | ✅ Full |
| Port | 5173 | 3000 |

## 🚀 Production Deployment

Untuk deploy ke production:

```bash
# Build and deploy
vercel --prod

# Atau push ke GitHub (jika auto-deploy enabled)
git add .
git commit -m "Add QR code feature"
git push origin main
```

## 💡 Tips

1. **Development**: Gunakan `vercel dev` untuk test dengan API
2. **Frontend Only**: Gunakan `npm run dev` jika tak perlu API
3. **Environment Variables**: Selalu pastikan sync dengan `vercel env pull`
4. **Testing Production**: Test di deployed Vercel URL sebelum release

## 📝 Updated Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "dev:vercel": "vercel dev",  ← GUNAKAN INI untuk test QR upload
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

## ✅ Checklist Setup

- [ ] Vercel CLI installed: `vercel --version`
- [ ] Logged in: `vercel login`
- [ ] Project linked: `vercel link`
- [ ] Environment variables pulled: `vercel env pull`
- [ ] IMGBB_API_KEY configured di Vercel Dashboard
- [ ] Running development: `npm run dev:vercel`
- [ ] QR code upload tested dan berfungsi ✅

---

**Next Steps:**
1. Install Vercel CLI
2. Run `vercel dev`
3. Test QR code upload feature
4. Deploy to production: `vercel --prod`
