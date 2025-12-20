# Vercel Deployment Guide

## Prerequisites
1. Create a Vercel account at [vercel.com](https://vercel.com)
2. Install Vercel CLI (optional): `npm i -g vercel`

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Configure project:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
6. Click "Deploy"

### Option 2: Deploy via CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

## Environment Variables
If you're using Prisma or other services requiring environment variables:

1. Go to your project settings on Vercel
2. Navigate to "Environment Variables"
3. Add your variables:
   - `DATABASE_URL` (if using database)
   - Any other env variables from `.env`

## Important Notes

### Build Configuration
- ✅ **vercel.json** is already configured
- ✅ **Build command**: `npm run build`
- ✅ **Output directory**: `dist`
- ✅ **Framework**: Vite with React

### Database (Prisma)
⚠️ **Note**: Prisma requires a database connection. For full functionality:
- Set up a database (PostgreSQL, MySQL, etc.)
- Add `DATABASE_URL` to Vercel environment variables
- Run migrations after deployment

### Static Site (No Database)
If you want to deploy without database:
- The app will work with mock data from `CustomerService.js`
- No additional configuration needed

## Post-Deployment

After successful deployment, Vercel will provide:
- 🌐 **Production URL**: `https://your-app-name.vercel.app`
- 📊 **Deployment Dashboard**: Monitor builds and analytics
- 🔄 **Auto-deploys**: Every push to main branch triggers new deployment

## Custom Domain (Optional)
1. Go to project settings
2. Click "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify build command works locally: `npm run build`

### App Shows Blank Screen
- Check browser console for errors
- Verify all assets are loading correctly
- Check routing configuration in `vercel.json`

### Performance Issues
- Enable caching headers (already configured in vercel.json)
- Optimize images and assets
- Consider using Vercel's Image Optimization

## Useful Commands

```bash
# Preview deployment
vercel

# Production deployment
vercel --prod

# View deployment logs
vercel logs

# List deployments
vercel ls

# Remove deployment
vercel rm [deployment-url]
```

## Support
- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
