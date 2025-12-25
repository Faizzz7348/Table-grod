# Image Upload Setup for Vercel

This document explains the image upload functionality and how to configure it for Vercel deployment.

## Overview

The image upload feature uses **ImgBB** as an external image hosting service, which is perfect for Vercel's serverless environment since:
- Vercel has read-only file system (can't store uploaded files permanently)
- Vercel functions have limited execution time
- External hosting provides permanent, reliable image storage

## Architecture

### Frontend (`src/FlexibleScrollDemo.jsx`)
- User selects an image file (max 10MB)
- File is validated (type and size)
- File is sent to our API endpoint via FormData
- Receives image URL and displays it

### Backend API (`api/upload.js`)
- Receives multipart/form-data upload
- Validates file (type: JPEG/PNG/GIF/WebP, size: max 10MB)
- Converts file to base64
- Uploads to ImgBB API
- Returns the hosted image URL
- Automatically cleans up temporary files

## Configuration

### 1. Get ImgBB API Key

1. Go to https://api.imgbb.com/
2. Sign up for a free account
3. Get your API key from the dashboard
4. Free tier allows:
   - Unlimited uploads
   - 32MB file size limit (we use 10MB)
   - Permanent storage

### 2. Local Development

Create `.env` file in project root:

```env
DATABASE_URL="your_database_url"
IMGBB_API_KEY="your_imgbb_api_key_here"
```

### 3. Vercel Deployment

#### Environment Variables

Add the environment variable in Vercel:

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add:
   - **Name**: `IMGBB_API_KEY`
   - **Value**: Your ImgBB API key
   - **Environment**: Production, Preview, Development (select all)

#### Vercel Configuration

The `vercel.json` file is already configured:

```json
{
  "functions": {
    "api/**/*.js": {
      "memory": 1024,
      "maxDuration": 10
    }
  }
}
```

This gives our upload function:
- 1024MB memory (enough for image processing)
- 10 seconds timeout (plenty for uploads)

## File Size Limits

| Limit Type | Size | Note |
|------------|------|------|
| Frontend validation | 10MB | Can be adjusted in code |
| API validation | 10MB | Matches frontend |
| ImgBB free tier | 32MB | External service limit |
| Vercel request body | 4.5MB | **Important limitation** |

### Important: Vercel Body Size Limit

⚠️ **Vercel has a 4.5MB request body limit for serverless functions.**

If you need to upload larger files:
- Consider client-side direct upload to ImgBB (requires VITE_IMGBB_API_KEY in frontend)
- Use Vercel Blob Storage (paid feature)
- Use another cloud storage (AWS S3, Cloudinary, etc.)

## Supported Image Formats

- JPEG / JPG
- PNG
- GIF
- WebP

## Error Handling

The system handles various error cases:

1. **No file selected**: User feedback
2. **Invalid file type**: Alert with allowed types
3. **File too large**: Alert with size limit
4. **Network error**: Alert with error message
5. **API configuration missing**: Alert to contact admin
6. **Upload failed**: Alert with specific error

## Security Features

1. **File Type Validation**: Both frontend and backend
2. **File Size Validation**: Prevents abuse
3. **CORS Headers**: Properly configured
4. **Temporary File Cleanup**: Automatic deletion
5. **API Key**: Stored securely in environment variables

## Alternative Solutions

If you need different image hosting:

### Option 1: Direct Client Upload to ImgBB
```javascript
// Frontend only, requires VITE_IMGBB_API_KEY
const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
  method: 'POST',
  body: formData
});
```

### Option 2: Cloudinary
- Free tier: 25GB storage, 25GB bandwidth
- Better features but requires account

### Option 3: Vercel Blob
- Native Vercel solution
- Paid feature
- Good for production apps

## Testing

### Local Testing
```bash
npm install
npm run dev
```

### Testing Upload:
1. Open the app
2. Click on a location
3. Click "Manage Images" button
4. Click "Upload Image"
5. Select an image file
6. Check console for upload progress
7. Image should appear in the list

## Troubleshooting

### Upload fails with "Upload service not configured"
- Check IMGBB_API_KEY is set in environment variables
- Verify the key is correct
- Redeploy after adding environment variable

### Upload fails with "File too large"
- Check file size is under 10MB
- For Vercel, ensure under 4.5MB

### Upload succeeds but image doesn't load
- Check image URL is accessible
- Check browser console for CORS errors
- Verify ImgBB URL is not blocked

### Images disappear after some time
- ImgBB free tier images are permanent
- Check if ImgBB account is still active
- Consider paid hosting for critical apps

## Cost Considerations

| Service | Free Tier | Cost |
|---------|-----------|------|
| ImgBB | Unlimited uploads, permanent storage | FREE |
| Vercel | 100GB bandwidth/month | FREE (then $20/month) |
| Cloudinary | 25GB storage, 25GB bandwidth | FREE (then paid tiers) |
| Vercel Blob | N/A | Paid only |

## Best Practices

1. **Optimize images before upload**: Compress/resize on client
2. **Show upload progress**: Better UX
3. **Validate on both sides**: Frontend + Backend
4. **Handle errors gracefully**: User-friendly messages
5. **Clean up temp files**: Prevent storage issues
6. **Monitor usage**: Track upload volumes
7. **Set rate limits**: Prevent abuse
8. **Use CDN**: ImgBB provides global CDN

## Code Structure

```
/api
  └── upload.js          # Image upload API endpoint
/src
  └── FlexibleScrollDemo.jsx
      └── handleFileUpload()  # Frontend upload logic
.env.example             # Environment variables template
vercel.json              # Vercel configuration
IMAGE_UPLOAD_GUIDE.md    # This file
```

## Deployment Checklist

- [ ] Install formidable dependency: `npm install`
- [ ] Set IMGBB_API_KEY in Vercel environment variables
- [ ] Set DATABASE_URL in Vercel environment variables
- [ ] Deploy to Vercel
- [ ] Test image upload in production
- [ ] Monitor error logs in Vercel dashboard
- [ ] Check image URLs are accessible

## Support

For issues:
1. Check Vercel function logs
2. Check browser console for errors
3. Verify ImgBB API key is valid
4. Test with smaller images first
5. Check network tab for request/response

## References

- [ImgBB API Documentation](https://api.imgbb.com/)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)
- [formidable npm package](https://www.npmjs.com/package/formidable)
