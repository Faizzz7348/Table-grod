# 🚀 Production Setup - Vercel dengan Database Production

## Status Konfigurasi

✅ **Aplikasi sudah dikonfigurasi untuk production!**

### Yang Sudah Dikonfigurasi:

1. ✅ **Vercel Configuration** ([vercel.json](vercel.json))
   - Build command dengan Prisma generate & migration
   - API routing dan rewrites
   - CORS headers untuk API
   - Security headers

2. ✅ **Database Configuration** ([prisma/schema.prisma](prisma/schema.prisma))
   - Schema untuk Route dan Location tables
   - Relasi antar tables
   - Support untuk images, maps, QR codes

3. ✅ **API Endpoints** 
   - [api/routes.js](api/routes.js) - CRUD operations untuk routes
   - [api/locations.js](api/locations.js) - CRUD operations untuk locations
   - [api/upload.js](api/upload.js) - Image upload handling

## 📋 Langkah Deploy ke Production

### 1. Setup Vercel Postgres Database

1. Buka [Vercel Dashboard](https://vercel.com/dashboard)
2. Pilih project **Table-grod**
3. Klik tab **"Storage"**
4. Klik **"Create Database"**
5. Pilih **"Postgres"**
6. Beri nama: `table-grod-production`
7. Pilih region terdekat dengan users Anda
8. Klik **"Create"**

✅ **Vercel otomatis menambahkan environment variables:**
- `DATABASE_URL` - untuk Prisma ORM
- `DIRECT_URL` - untuk migrations
- `POSTGRES_URL` - untuk connection pooling

### 2. Deploy ke Vercel

#### Option A: Via Git (Recommended)

```bash
# Commit perubahan
git add .
git commit -m "Configure for production database"
git push origin main
```

Vercel akan otomatis deploy dengan:
1. Install dependencies (`npm install`)
2. Build aplikasi (`npm run build`)
3. Generate Prisma client (`npx prisma generate`)
4. Push database schema (`npx prisma db push`)

#### Option B: Via Vercel CLI

```bash
# Install Vercel CLI (jika belum)
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### 3. Verifikasi Database

Setelah deploy, verifikasi database berjalan:

1. Buka production URL Anda
2. Coba tambah route baru
3. Cek di browser console (F12) - tidak ada error
4. Data tersimpan dengan benar

### 4. Manage Database (Optional)

#### Via Vercel Dashboard:
1. Go to project → **Storage**
2. Click database name
3. Click **"Data"** tab
4. Lihat semua tables dan data

#### Via Prisma Studio (Local):
```bash
# Set environment variables dari Vercel
export DATABASE_URL="postgresql://..."

# Buka Prisma Studio
npx prisma studio
```

## 🔄 Update Database Schema

Jika ada perubahan schema di masa depan:

1. Edit [prisma/schema.prisma](prisma/schema.prisma)
2. Commit dan push ke Git
3. Vercel akan otomatis menjalankan migration

Atau manual via CLI:
```bash
export DATABASE_URL="your-production-url"
npx prisma db push
```

## 🌱 Seed Data Production (Optional)

Untuk menambah data awal:

1. Edit [prisma/seed.js](prisma/seed.js) dengan data production
2. Jalankan seed:

```bash
export DATABASE_URL="your-production-url"
npm run db:seed
```

Atau tambahkan ke build command di [vercel.json](vercel.json):
```json
{
  "buildCommand": "npm run build && npx prisma generate && npx prisma db push --accept-data-loss && npm run db:seed"
}
```

## 🔐 Environment Variables di Vercel

Environment variables yang dibutuhkan (sudah otomatis ter-set):

| Variable | Description | Status |
|----------|-------------|--------|
| `DATABASE_URL` | Prisma connection string | ✅ Auto |
| `DIRECT_URL` | Direct database connection | ✅ Auto |
| `POSTGRES_URL` | Connection pooling URL | ✅ Auto |

Untuk menambah custom variables:
1. Vercel Dashboard → Project → Settings
2. Tab **"Environment Variables"**
3. Add variable untuk `production`, `preview`, `development`

## 📊 Database Tables

### Routes Table
```sql
CREATE TABLE "Route" (
  id SERIAL PRIMARY KEY,
  route VARCHAR NOT NULL,
  shift VARCHAR NOT NULL,
  warehouse VARCHAR NOT NULL,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

### Locations Table
```sql
CREATE TABLE "Location" (
  id SERIAL PRIMARY KEY,
  no INTEGER NOT NULL,
  code VARCHAR NOT NULL,
  location VARCHAR NOT NULL,
  delivery VARCHAR NOT NULL,
  powerMode VARCHAR NOT NULL,
  images TEXT[],
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  address VARCHAR,
  websiteLink VARCHAR,
  qrCodeImageUrl VARCHAR,
  qrCodeDestinationUrl VARCHAR,
  routeId INTEGER REFERENCES "Route"(id),
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

## 🐛 Troubleshooting

### Error: Database not configured

**Solusi:**
1. Pastikan Vercel Postgres database sudah dibuat
2. Cek environment variables di Vercel dashboard
3. Redeploy project

### Error: Prisma client not generated

**Solusi:**
```bash
# Redeploy dengan clear cache
vercel --prod --force
```

### Migration errors

**Solusi:**
```bash
# Reset database (HATI-HATI: data akan hilang!)
export DATABASE_URL="your-production-url"
npx prisma db push --force-reset
```

### Connection timeout

**Solusi:**
1. Cek region database - harus dekat dengan Vercel deployment region
2. Gunakan `POSTGRES_URL` untuk connection pooling
3. Tambahkan retry logic di API

## 📚 Resources

- [Vercel Postgres Documentation](https://vercel.com/docs/storage/vercel-postgres)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Production Checklist](DEPLOYMENT_CHECKLIST.md)
- [Database Setup Guide](DATABASE_SETUP_PRODUCTION.md)

## ✨ Next Steps

1. ✅ Database setup - **DONE**
2. ✅ API endpoints - **DONE**
3. ✅ Vercel configuration - **DONE**
4. 🚀 Deploy to production - **READY!**
5. 📊 Monitor performance
6. 🔒 Setup backups (via Vercel dashboard)

---

**Status:** ✅ Ready for Production Deployment

**Last Updated:** December 26, 2025
