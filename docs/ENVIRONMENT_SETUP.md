# Environment Variables Setup Guide

## 🎯 Recommended Approach: Separate Databases

### Option 1: Neon Branch (Recommended) ⭐

**Development Database** (Neon branch: `dev`)
```bash
# .env.development
DATABASE_URL="postgresql://user:pass@ep-dev-branch-123.us-east-2.aws.neon.tech/table_grod?sslmode=require"
```

**Production Database** (Neon branch: `main`)
```bash
# Vercel Environment Variables
DATABASE_URL="postgresql://user:pass@ep-main-123.us-east-2.aws.neon.tech/table_grod?sslmode=require"
```

#### Setup Neon Branch:
```bash
1. Neon Console → Branches
2. Create branch: "dev" (from main)
3. Copy connection string untuk dev branch
4. Use in .env.development
```

---

### Option 2: Same Database (Simple)

Guna satu database untuk dev & prod:

```bash
# .env (local)
DATABASE_URL="postgresql://user:pass@ep-xxx.neon.tech/table_grod?sslmode=require"

# Vercel (production) - Same URL
DATABASE_URL="postgresql://user:pass@ep-xxx.neon.tech/table_grod?sslmode=require"
```

⚠️ **Warning**: Dev testing akan affect production data!

---

## 📁 File Structure

```
/workspaces/Table-grod/
├── .env.example          ← Template (commit to git)
├── .env.development      ← Dev config (NOT committed)
├── .env.production.example ← Prod template (commit to git)
├── .env                  ← Active config (NOT committed)
└── .gitignore            ← Exclude .env files
```

---

## 🔧 Setup Instructions

### 1. Local Development

```bash
# Copy example file
cp .env.example .env.development

# Edit with your dev database URL
nano .env.development

# Symlink for easy use
ln -sf .env.development .env

# Or just rename
mv .env.development .env
```

### 2. Vercel Production

**DO NOT** put production secrets in files!

```bash
# Go to Vercel Dashboard
1. Your Project → Settings → Environment Variables
2. Add variables:
   - DATABASE_URL = "postgresql://..."
   - BLOB_READ_WRITE_TOKEN = "vercel_blob_xxx"
3. Apply to: Production (and Preview if needed)
4. Redeploy
```

---

## 🔐 Security Best Practices

### ✅ DO:
- Use `.env` files for local development only
- Add all `.env*` files to `.gitignore`
- Use Vercel Dashboard for production secrets
- Use different databases for dev/prod (Neon branches)
- Rotate tokens regularly

### ❌ DON'T:
- Commit `.env` files with real secrets to GitHub
- Share database URLs in public repos
- Use production database for local testing
- Hardcode secrets in code

---

## 🧪 Testing Different Environments

### Run with specific environment:

```bash
# Development (uses .env.development)
npm run dev

# Production build (uses Vercel env vars when deployed)
npm run build
npm run preview
```

### Switch environments quickly:

```bash
# Use dev database
ln -sf .env.development .env

# Use staging database (if you have one)
ln -sf .env.staging .env

# Check which one is active
ls -la .env
```

---

## 🌳 Neon Branching Workflow

### Create Development Branch:
```sql
1. Neon Console → Your Project
2. Branches → Create Branch
   - Name: "development"
   - From: "main"
3. Copy connection string
4. Use in .env.development
```

### Benefits:
- ✅ Isolated testing environment
- ✅ Schema auto-synced from main
- ✅ Easy to reset (delete & recreate branch)
- ✅ No risk to production data
- ✅ Free (10 branches on free tier)

### Merge workflow:
```bash
# Test changes in dev branch
1. Make changes locally
2. Test with dev database
3. Push to GitHub

# Apply to production
4. Vercel auto-deploys to production
5. Production uses main branch database
```

---

## 📊 Environment Variables Overview

| Variable | Development | Production | Purpose |
|----------|-------------|------------|---------|
| DATABASE_URL | Dev branch | Main branch | Database connection |
| VITE_API_URL | /api | /api | API endpoint |
| BLOB_READ_WRITE_TOKEN | Optional | Required | Image uploads |

---

## 🐛 Troubleshooting

### "Cannot connect to database"
```bash
# Check DATABASE_URL format
echo $DATABASE_URL

# Must include ?sslmode=require for Neon
DATABASE_URL="postgresql://...?sslmode=require"
```

### "Wrong environment variables loaded"
```bash
# Check which .env is active
ls -la .env

# Verify contents
cat .env | head -1
```

### "Production using dev database"
```bash
# Check Vercel environment variables
vercel env ls

# Should show production DATABASE_URL
```

---

## 🎯 Quick Reference

```bash
# Local development
cp .env.example .env
# Edit .env with dev database URL
npm run dev

# Deploy to production  
git push origin main
# Vercel auto-deploy with production env vars

# Check production env vars
vercel env ls
vercel env pull  # Download to .env.local
```

---

## 📚 Related Docs

- [Neon Database Setup](./NEON_DATABASE_SETUP.md)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

---

**Best Practice**: Guna Neon branching untuk development, set production env vars dalam Vercel Dashboard! 🚀
