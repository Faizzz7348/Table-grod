# 🚀 Ready to Setup - Complete Instructions

## ✅ Development Database - CONFIGURED
Your `.env` file dah set dengan development database URL.

---

## 📋 Next Steps

### 1️⃣ Generate Prisma Client & Run Migration

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database (create tables)
npx prisma db push

# Seed sample data (optional)
npx prisma db seed
```

### 2️⃣ Test Local Development

```bash
# Start dev server
npm run dev

# Test:
# 1. Enable Edit Mode (password: 1234)
# 2. Click info icon
# 3. Edit description
# 4. Click "Save Info"
# 5. Click "Save Changes" in toolbar
# 6. Refresh - description should persist! ✅
```

---

## 🌐 Production Setup (Vercel)

### Method 1: Via Vercel Dashboard (Recommended)

1. Go to: https://vercel.com/dashboard
2. Select your project: **Table-grod**
3. Go to: **Settings** → **Environment Variables**
4. Click **Add New**
5. Add:
   ```
   Key: DATABASE_URL
   Value: postgresql://neondb_owner:npg_z8Fl2sMUhcHt@ep-blue-union-ahq8npgb-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
   ```
6. Apply to: ✅ **Production** (and Preview if needed)
7. Click **Save**

### Method 2: Via Vercel CLI

```bash
# Login to Vercel
vercel login

# Add production environment variable
vercel env add DATABASE_URL production

# Paste this when prompted:
# postgresql://neondb_owner:npg_z8Fl2sMUhcHt@ep-blue-union-ahq8npgb-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

### 3️⃣ Deploy to Production

```bash
# Commit dan push (kalau ada changes)
git add .
git commit -m "feat: Add description fields and Neon database setup"
git push origin main

# Vercel will auto-deploy
# Or manual deploy:
vercel --prod
```

### 4️⃣ Verify Production Database

After deploy, check Neon Console:

1. Go to: https://console.neon.tech
2. Select your **production branch** (ep-blue-union...)
3. Go to: **SQL Editor** or **Tables**
4. Run:
   ```sql
   -- Check if tables exist
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public';
   
   -- Check Route table has description column
   SELECT column_name, data_type 
   FROM information_schema.columns 
   WHERE table_name = 'Route';
   
   -- Check Location table has description column
   SELECT column_name, data_type 
   FROM information_schema.columns 
   WHERE table_name = 'Location';
   ```

---

## 🔍 Verify Setup

### Development (Local)
```bash
# Check database connection
npx prisma db pull

# View data
npx prisma studio
# Opens at: http://localhost:5555
```

### Production (Vercel)
```bash
# Check environment variables
vercel env ls

# Should show:
# DATABASE_URL (Production)
```

---

## 📊 Database Overview

| Environment | Database | Branch | Purpose |
|-------------|----------|--------|---------|
| **Development** | ep-wispy-boat-ah2o3aig | dev | Local testing |
| **Production** | ep-blue-union-ahq8npgb | main | Live app |

Both databases have:
- ✅ Route table with `description` column
- ✅ Location table with `description` column
- ✅ All other existing columns

---

## 🧪 Testing Checklist

### Local Development
- [ ] `npx prisma generate` - Success
- [ ] `npx prisma db push` - Tables created
- [ ] `npm run dev` - Server running
- [ ] Edit Mode → Edit description → Save Info
- [ ] Save Changes in toolbar
- [ ] Refresh page → Description persists ✅

### Production
- [ ] Environment variable set in Vercel
- [ ] Deployed successfully
- [ ] Tables exist in production database
- [ ] Description columns present
- [ ] Edit & save description works
- [ ] Data persists after page refresh ✅

---

## 🛠️ Troubleshooting

### Error: "Can't reach database"
```bash
# Check DATABASE_URL in .env
cat .env | grep DATABASE_URL

# Test connection
npx prisma db pull
```

### Error: "Column does not exist"
```bash
# Push schema again
npx prisma db push --accept-data-loss

# Or migrate
npx prisma migrate dev --name add_description
```

### Production not working
```bash
# Check Vercel env vars
vercel env ls

# Pull production env to test locally
vercel env pull .env.production.local

# Test with production env
DATABASE_URL='<production-url>' npm run dev
```

---

## 📚 Documentation

- [Neon Setup Guide](./docs/NEON_DATABASE_SETUP.md)
- [Environment Setup](./docs/ENVIRONMENT_SETUP.md)
- [Migration Guide](./DESCRIPTION_MIGRATION_GUIDE.md)

---

## ✨ Summary

**Development**: ✅ Configured  
**Production**: ⏳ Set environment variable in Vercel, then deploy

**Next**: Run commands above to complete setup! 🚀
