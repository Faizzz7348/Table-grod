# Setup Neon Database untuk Table-grod

## Kenapa Neon?

✅ **Free Tier** - 3GB storage, 10GB bandwidth/month  
✅ **Serverless** - Auto-scale, auto-suspend bila tak guna  
✅ **Fast** - Branching feature untuk test  
✅ **Easy** - Setup dalam 2 minit  

## Step-by-Step Setup

### 1️⃣ Create Neon Account & Project

1. Pergi ke **[https://neon.tech](https://neon.tech)**
2. Sign up (boleh guna GitHub account)
3. Click **"Create a project"**
4. Pilih region (recommend: **US East** atau **Singapore**)
5. Name: `table-grod` atau apa-apa nama yang anda suka

### 2️⃣ Get Connection String

Selepas project created:

1. Click **"Connection Details"** atau **"Dashboard"**
2. Pilih **"Pooled connection"** (recommended untuk serverless)
3. Copy **Connection string**

Example:
```
postgresql://table_grod_owner:npg_abc123xyz@ep-cool-morning-123456.us-east-2.aws.neon.tech/table_grod?sslmode=require
```

### 3️⃣ Setup Local Environment

Create `.env` file di root project:

```bash
# .env
DATABASE_URL="postgresql://YOUR_USER:YOUR_PASSWORD@YOUR_HOST.neon.tech/YOUR_DB?sslmode=require"
```

**⚠️ IMPORTANT**: 
- Gantikan dengan connection string anda
- Pastikan ada `?sslmode=require` di akhir
- Jangan commit `.env` file ke GitHub!

### 4️⃣ Install Dependencies & Generate Prisma Client

```bash
# Install Prisma (kalau belum)
npm install

# Generate Prisma Client
npx prisma generate
```

### 5️⃣ Run Migration

**Option A: Prisma Migrate (Recommended)**
```bash
npx prisma migrate dev --name add_description_fields
```

**Option B: DB Push (Faster untuk development)**
```bash
npx prisma db push
```

### 6️⃣ Seed Initial Data (Optional)

```bash
npx prisma db seed
```

Ini akan create:
- 3 routes (KL 7, KL 8, SG 1)
- Sample locations dengan data

### 7️⃣ Verify Database

Check dalam Neon Console:
1. Pergi ke **"Tables"** tab
2. Verify tables ada:
   - ✅ Route
   - ✅ Location
   - ✅ _prisma_migrations

3. Click **"Route"** → verify column `description` ada
4. Click **"Location"** → verify column `description` ada

### 8️⃣ Test Locally

```bash
# Start dev server
npm run dev

# Open browser
# http://localhost:5173
```

Test flow:
1. Enable Edit Mode (password: `1234`)
2. Click info icon pada row
3. Edit description → Click "Save Info"
4. Click "Save Changes" di toolbar
5. Refresh page → description akan kekal!

### 9️⃣ Deploy ke Vercel

1. **Push code ke GitHub** (dah buat? Good!)

2. **Add Environment Variable di Vercel**:
   - Vercel Dashboard → Settings → Environment Variables
   - Add: `DATABASE_URL` = (your Neon connection string)
   - Apply to: Production, Preview, Development

3. **Redeploy**:
   - Vercel auto-redeploy
   - Or manual: `vercel --prod`

4. **Test Production**:
   - Open your Vercel URL
   - Test save description
   - Verify data persist

## Troubleshooting

### Error: "Can't reach database server"
```bash
# Check connection string format
# Must include ?sslmode=require for Neon
DATABASE_URL="postgresql://...?sslmode=require"
```

### Error: "Migration already applied"
```bash
# Reset migrations
npx prisma migrate reset

# Then migrate again
npx prisma migrate dev
```

### Error: "Column already exists"
```bash
# Drop columns first
npx prisma db push --accept-data-loss
```

### Want to reset database completely?
```bash
# Reset everything
npx prisma migrate reset

# Seed fresh data
npx prisma db seed
```

## Neon Dashboard Features

### SQL Editor
Run custom queries:
```sql
-- View all routes with descriptions
SELECT id, route, description FROM "Route";

-- View all locations with descriptions
SELECT id, code, location, description FROM "Location" LIMIT 10;
```

### Branching (Cool Feature!)
Create branch untuk testing:
1. Click **"Branches"**
2. Create branch: `development`
3. Test schema changes without affecting main
4. Merge bila ready!

### Monitoring
- View connections
- Query history
- Storage usage
- Bandwidth usage

## Cost & Limits (Free Tier)

✅ **Storage**: 3 GB  
✅ **Bandwidth**: 10 GB/month  
✅ **Compute**: Shared CPU, Auto-suspend after 5 min idle  
✅ **Branches**: 10 branches  
✅ **Projects**: 1 project  

Untuk Table-grod app, free tier lebih dari cukup!

## Next Steps

1. ✅ Setup Neon database
2. ✅ Run migrations
3. ✅ Test locally
4. ✅ Deploy to Vercel
5. 🚀 App ready untuk production!

## Support

- **Neon Docs**: https://neon.tech/docs
- **Prisma Docs**: https://prisma.io/docs
- **Issues**: Check browser console & server logs

---

**Pro Tip**: Enable Neon's auto-suspend feature untuk jimat bandwidth. Database akan auto-wake bila ada request!
