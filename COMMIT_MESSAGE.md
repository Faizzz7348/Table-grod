# Git Commit Message for Image Persistence Fix

## Commit Message

```
fix: Replace ImgBB with Vercel Blob for permanent image storage

BREAKING CHANGE: Image upload now requires BLOB_READ_WRITE_TOKEN environment variable

This commit fixes the persistent issue where uploaded images disappear after 
Vercel deployment restarts. The root cause was using local file storage (/tmp) 
which is ephemeral in serverless environments.

Changes:
- Replace ImgBB API with Vercel Blob Storage (@vercel/blob)
- Update api/upload.js to use native Vercel Blob service
- Update environment variable requirements (BLOB_READ_WRITE_TOKEN)
- Add comprehensive setup documentation
- Update README.md with new storage information

Benefits:
✅ Images stored permanently on Vercel's CDN
✅ No more image loss after restarts/redeployments
✅ Better integration with Vercel infrastructure
✅ No external API dependencies or rate limits
✅ CDN-backed for faster image loading

Migration Required:
1. Create Vercel Blob Store at https://vercel.com/dashboard/stores
2. Add BLOB_READ_WRITE_TOKEN to Vercel Environment Variables
3. Run: npm install
4. Redeploy project

Documentation:
- See docs/VERCEL_BLOB_SETUP.md for detailed setup guide
- See docs/VERCEL_DEPLOYMENT_CRITICAL.md for deployment checklist
- See QUICK_FIX_SUMMARY.md for quick reference

Fixes: Image disappearance issue (#13)
```

## Alternative Short Version

```
fix: Permanent image storage with Vercel Blob

- Replace ImgBB with Vercel Blob Storage
- Images now persist after restarts/redeployments
- Requires BLOB_READ_WRITE_TOKEN in Vercel env vars
- See docs/VERCEL_BLOB_SETUP.md for setup

Fixes #13
```

## Command to Commit

```bash
# Add all changes
git add .

# Commit with message
git commit -m "fix: Replace ImgBB with Vercel Blob for permanent image storage

BREAKING CHANGE: Requires BLOB_READ_WRITE_TOKEN environment variable

- Replace ImgBB API with Vercel Blob Storage
- Images now persist permanently after restarts
- Add comprehensive setup documentation
- Update README and environment examples

See docs/VERCEL_BLOB_SETUP.md for setup guide"

# Push to GitHub (triggers Vercel auto-deploy)
git push origin main
```

## Post-Commit Checklist

After pushing to GitHub:

- [ ] Verify Vercel auto-deploy started
- [ ] Check build logs for errors
- [ ] Confirm BLOB_READ_WRITE_TOKEN is set in Vercel
- [ ] Test image upload on deployed site
- [ ] Verify image persistence after redeploy
- [ ] Update team/documentation if needed

---

**Remember:** Images won't work until you:
1. Add BLOB_READ_WRITE_TOKEN to Vercel Environment Variables
2. Redeploy the project

**Get token from:** https://vercel.com/dashboard/stores
