# Vercel Deployment Checklist - Image Upload Fix

## Pre-Deployment Setup

### 1. Get ImgBB API Key (Free)
- [ ] Go to https://api.imgbb.com/
- [ ] Sign up for free account
- [ ] Get API key from dashboard
- [ ] Copy the API key (you'll need it for environment variables)

### 2. Local Environment Setup
- [ ] Run: `./setup-image-upload.sh` OR `npm install`
- [ ] Edit `.env` file
- [ ] Add your IMGBB_API_KEY to `.env`
- [ ] Verify DATABASE_URL is set
- [ ] Test locally: `npm run dev`
- [ ] Test image upload works locally

### 3. Vercel Environment Variables

#### Method A: Using Vercel CLI
```bash
vercel env add IMGBB_API_KEY
# When prompted, enter your ImgBB API key
# Select: Production, Preview, Development (all)
```

#### Method B: Using Vercel Dashboard
1. - [ ] Go to https://vercel.com/dashboard
2. - [ ] Select your project
3. - [ ] Navigate to: Settings → Environment Variables
4. - [ ] Click "Add New"
5. - [ ] Add variable:
   - Name: `IMGBB_API_KEY`
   - Value: [Your ImgBB API key]
   - Environments: ✅ Production ✅ Preview ✅ Development
6. - [ ] Click "Save"
7. - [ ] Add DATABASE_URL if not already set

## Deployment Steps

### 4. Deploy to Vercel
```bash
# Install dependencies
npm install

# Build locally to test
npm run build

# Deploy to Vercel
vercel --prod

# Or use GitHub integration (auto-deploy on push)
git add .
git commit -m "Fix image upload for Vercel"
git push origin main
```

- [ ] Run `npm install` successfully
- [ ] Run `npm run build` without errors
- [ ] Deploy to Vercel
- [ ] Wait for deployment to complete
- [ ] Check build logs for errors

## Post-Deployment Testing

### 5. Test in Production
- [ ] Open your Vercel URL
- [ ] Open browser DevTools (F12)
- [ ] Navigate to a route
- [ ] Click on any location
- [ ] Click "Manage Images" button (Edit mode)
- [ ] Click "Upload Image"
- [ ] Select an image file (under 4.5MB for server upload)
- [ ] Verify upload starts (loading indicator)
- [ ] Check console logs (should show upload progress)
- [ ] Verify "Image uploaded successfully!" alert
- [ ] Verify image appears in the preview
- [ ] Click "Save Images"
- [ ] Verify changes saved
- [ ] Refresh page and verify image persists

### 6. Verify API Endpoint
```bash
# Test upload endpoint is accessible
curl -X OPTIONS https://your-app.vercel.app/api/upload

# Should return CORS headers
```

- [ ] API endpoint responds
- [ ] CORS headers are present
- [ ] No 404 or 500 errors

## Troubleshooting

### Common Issues

#### Issue: "Upload service not configured"
**Solution:**
- [ ] Verify IMGBB_API_KEY is set in Vercel
- [ ] Check spelling of environment variable
- [ ] Redeploy after adding variable
- [ ] Check Vercel deployment logs

#### Issue: "Upload failed" or "File too large"
**Solution:**
- [ ] Check file size is under 4.5MB (Vercel limit)
- [ ] Try smaller image
- [ ] Check browser console for error details
- [ ] Consider image compression (see IMAGE_UPLOAD_ALTERNATIVE.md)

#### Issue: Images upload but don't persist
**Solution:**
- [ ] Check if you clicked "Save Images" button
- [ ] Verify database connection
- [ ] Check browser console for save errors
- [ ] Verify DATABASE_URL in Vercel

#### Issue: 500 Internal Server Error
**Solution:**
- [ ] Check Vercel function logs
- [ ] Verify formidable package is installed
- [ ] Check api/upload.js file exists
- [ ] Verify IMGBB_API_KEY format

## Verification Commands

```bash
# Check if dependencies are installed
npm list formidable

# Test build
npm run build

# Check environment variables (local)
cat .env

# Check Vercel environment variables
vercel env ls

# View Vercel deployment logs
vercel logs [deployment-url]

# Test API endpoint
curl -I https://your-app.vercel.app/api/upload
```

## Files Modified/Added

### New Files:
- [x] `api/upload.js` - Upload API endpoint
- [x] `IMAGE_UPLOAD_GUIDE.md` - Comprehensive guide
- [x] `IMAGE_UPLOAD_ALTERNATIVE.md` - Alternative methods
- [x] `setup-image-upload.sh` - Setup script
- [x] `DEPLOYMENT_CHECKLIST.md` - This file

### Modified Files:
- [x] `package.json` - Added formidable dependency
- [x] `src/FlexibleScrollDemo.jsx` - Updated handleFileUpload
- [x] `.env.example` - Updated environment variables
- [x] `vercel.json` - Added upload endpoint CORS

## Success Criteria

✅ Image upload feature is working when:
- [ ] Users can click "Upload Image" button
- [ ] File selection dialog opens
- [ ] Selected images upload successfully
- [ ] Images display in preview
- [ ] Images save to database
- [ ] Images persist after page refresh
- [ ] No console errors
- [ ] No Vercel function errors

## Monitoring

### During First Week:
- [ ] Monitor Vercel function logs daily
- [ ] Check error rates in Vercel dashboard
- [ ] Monitor ImgBB usage/quota
- [ ] Test uploads from different devices/browsers
- [ ] Collect user feedback

### Metrics to Track:
- Upload success rate
- Average file size
- Upload duration
- Error frequency
- ImgBB quota usage

## Rollback Plan

If issues occur:

```bash
# Revert to previous deployment
vercel rollback

# Or revert code changes
git revert [commit-hash]
git push origin main
```

## Support Resources

- **ImgBB API Docs**: https://api.imgbb.com/
- **Vercel Docs**: https://vercel.com/docs
- **Project Guides**:
  - IMAGE_UPLOAD_GUIDE.md
  - IMAGE_UPLOAD_ALTERNATIVE.md
  - VERCEL_DEPLOYMENT.md

## Notes

- ImgBB free tier: Unlimited uploads, 32MB max
- Vercel free tier: 100GB bandwidth/month
- Server-side upload max: 4.5MB (Vercel limit)
- Client-side upload max: 10MB (our limit)
- Supported formats: JPEG, PNG, GIF, WebP
- Images are permanently hosted on ImgBB

## Final Checklist

- [ ] All dependencies installed
- [ ] Environment variables set in Vercel
- [ ] Code deployed successfully
- [ ] Upload tested in production
- [ ] Images persist correctly
- [ ] No errors in logs
- [ ] Documentation reviewed
- [ ] Team notified of changes

---

**Deployment Date**: _________________

**Deployed By**: _________________

**Vercel URL**: _________________

**Status**: ⬜ Pending | ⬜ In Progress | ⬜ Complete | ⬜ Issues

**Notes**: 
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
