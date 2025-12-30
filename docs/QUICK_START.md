## 🎯 Quick Commands

### Setup Development Database
```bash
npx prisma generate
npx prisma db push
npx prisma db seed  # optional
npm run dev
```

### Deploy to Production
```bash
# 1. Set in Vercel Dashboard:
#    DATABASE_URL = postgresql://neondb_owner:npg_z8Fl2sMUhcHt@ep-blue-union-ahq8npgb-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# 2. Deploy
git push origin main
```

### Verify
```bash
# Local
npx prisma studio

# Production
vercel env ls
```

**Full Instructions**: See [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md)
