# Production Database Setup (Vercel Postgres)

## 🚀 Quick Setup Steps

### 1. Create Vercel Postgres Database

1. Go to your project on [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on "Storage" tab
3. Click "Create Database"
4. Select **"Postgres"**
5. Choose database name (e.g., `table-grod-db`)
6. Select region closest to your users
7. Click "Create"

### 2. Connect Database to Project

Vercel will automatically add these environment variables to your project:
- `DATABASE_URL` - Connection string for Prisma
- `DIRECT_URL` - Direct connection (for migrations)
- `POSTGRES_URL` - Connection pooling URL

**These are automatically configured - no manual setup needed!**

### 3. Run Database Migrations

After database is created, you need to setup the tables:

#### Option A: Via Vercel Dashboard (Easiest)
1. Go to your project's "Deployments"
2. Click on the latest deployment
3. Click "..." menu → "Redeploy"
4. Make sure "Use existing Build Cache" is **unchecked**
5. Click "Redeploy"

The build process will automatically run:
```bash
npx prisma generate
npx prisma db push
```

#### Option B: Via Local CLI (if you have database access)
```bash
# Set environment variables from Vercel
export DATABASE_URL="your-database-url"
export DIRECT_URL="your-direct-url"

# Push schema to database
npx prisma db push

# (Optional) Seed initial data
npm run db:seed
```

### 4. Seed Initial Data (Optional)

To populate your database with initial data:

1. Update `prisma/seed.js` with your initial routes/locations
2. Run locally:
```bash
npm run db:seed
```

Or add to Vercel build command in `vercel.json`:
```json
{
  "buildCommand": "npm run build && npx prisma generate && npx prisma db push && npm run db:seed"
}
```

### 5. Verify Database Connection

After deployment, check if database is working:

1. Visit your production URL
2. Open browser console (F12)
3. Check for any API errors
4. Try adding a new route - it should save to database

## 🔐 Environment Variables

These are automatically set by Vercel when you create the database:

| Variable | Description | Auto-set? |
|----------|-------------|-----------|
| `DATABASE_URL` | Prisma connection string | ✅ Yes |
| `DIRECT_URL` | Direct database connection | ✅ Yes |
| `POSTGRES_URL` | Pooling connection | ✅ Yes |

## 📊 Database Schema

Your database will have 2 tables:

### Routes Table
```sql
- id (Auto-increment)
- route (String)
- shift (String)
- warehouse (String)
- createdAt (Timestamp)
- updatedAt (Timestamp)
```

### Locations Table
```sql
- id (Auto-increment)
- no (Integer)
- code (String)
- location (String)
- delivery (String)
- powerMode (String)
- images (Array of Strings)
- latitude (Float, optional)
- longitude (Float, optional)
- address (String, optional)
- routeId (Integer, foreign key)
- createdAt (Timestamp)
- updatedAt (Timestamp)
```

## 🔄 How It Works

### Development (localhost)
- Uses **localStorage** in browser
- No database connection needed
- Fast for testing

### Production (Vercel)
- Uses **Vercel Postgres database**
- Data persistent across all users
- Centralized data storage

## 🛠️ Troubleshooting

### Error: "Failed to fetch routes"
**Solution:**
1. Check if database is created in Vercel
2. Verify environment variables are set
3. Check deployment logs for migration errors

### Error: "Prisma Client validation error"
**Solution:**
1. Redeploy with fresh build (unchecked cache)
2. Ensure `npx prisma generate` runs during build

### Empty Database After Setup
**Solution:**
1. Run seed script: `npm run db:seed`
2. Or manually add data through the UI in edit mode

### Database Connection Timeout
**Solution:**
1. Check Vercel region matches database region
2. Verify database is not paused (free tier limitation)

## 📱 Accessing Database

### Via Prisma Studio (Development)
```bash
npm run db:studio
```
Opens GUI at http://localhost:5555

### Via Vercel Dashboard
1. Go to Storage → Your Database
2. Click "Data" tab
3. View/edit tables directly

## 🔄 Migration from localStorage to Database

If you have data in localStorage (development) that you want in production:

### Option 1: Manual Entry
1. Open development site
2. Copy data from localStorage (F12 → Application → localStorage)
3. Open production site in edit mode
4. Manually re-enter data

### Option 2: Export/Import (Future Feature)
We can add export/import buttons to transfer data easily.

## ⚡ Performance Notes

- Database has connection pooling enabled
- API routes cached where appropriate
- Optimistic UI updates for better UX

## 💰 Costs

**Vercel Postgres Pricing:**
- **Hobby (Free)**: 60 compute hours/month, 256 MB storage
- **Pro**: $10/month base + usage

For this app's typical usage, free tier should be sufficient.

## 🚨 Important Notes

1. **Auto-Deploy**: Every push to `main` branch automatically deploys and runs migrations
2. **Backup**: Vercel doesn't auto-backup free tier databases - consider periodic exports
3. **Security**: Database credentials are automatically rotated by Vercel
4. **Scaling**: Database auto-scales based on usage

## ✅ Checklist

- [ ] Database created in Vercel
- [ ] Environment variables auto-configured
- [ ] Deployed with fresh build
- [ ] Database tables created (prisma db push)
- [ ] (Optional) Initial data seeded
- [ ] Verified production site works
- [ ] Data persists after refresh

## 🆘 Need Help?

1. Check Vercel deployment logs
2. Check browser console for API errors
3. Verify database connection in Vercel dashboard
4. Check Prisma schema is valid: `npx prisma validate`

---

**Next Steps After Setup:**
1. Deploy your code: `git push`
2. Create database in Vercel Dashboard
3. Redeploy to run migrations
4. Your production app now uses real database! 🎉
