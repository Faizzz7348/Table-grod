# Alternative Image Upload: Direct Client Upload

If you encounter Vercel's 4.5MB request body limit, you can use direct client-side upload to ImgBB.

## Option 1: Server-side Upload (Current - Recommended)

**File**: `api/upload.js`  
**Limit**: 4.5MB (Vercel limitation)  
**Security**: ✅ API key hidden on server  
**Best for**: Most use cases

## Option 2: Direct Client Upload (Alternative)

Use when you need to upload larger files (>4.5MB but <10MB)

### Setup

1. **Update `.env` file**:
```env
VITE_IMGBB_API_KEY="your_imgbb_api_key_here"
```

2. **Update Vercel Environment Variables**:
- Add `VITE_IMGBB_API_KEY` with your ImgBB API key
- Remember: This exposes your API key to the client (publicly visible)

3. **Replace `handleFileUpload` in `src/FlexibleScrollDemo.jsx`**:

```javascript
const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) {
        console.log('No file selected');
        return;
    }
    
    if (!file.type.startsWith('image/')) {
        alert('Please select an image file (jpg, png, gif, webp)');
        console.error('Invalid file type:', file.type);
        return;
    }
    
    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
        alert('File size exceeds 10MB limit');
        return;
    }
    
    try {
        setUploadingImage(true);
        console.log('Uploading image directly to ImgBB...', {
            fileName: file.name,
            fileType: file.type,
            fileSize: (file.size / 1024 / 1024).toFixed(2) + ' MB'
        });
        
        // Get API key from environment
        const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
        
        if (!apiKey) {
            console.error('ImgBB API key is not configured');
            alert('Image upload is not configured. Please contact administrator.');
            return;
        }
        
        // Create FormData
        const formData = new FormData();
        formData.append('image', file);
        
        // Upload directly to ImgBB
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
            method: 'POST',
            body: formData
        });
        
        console.log('ImgBB response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('ImgBB HTTP error:', response.status, errorText);
            alert(`Upload failed: ${response.status} ${response.statusText}`);
            return;
        }
        
        const data = await response.json();
        console.log('ImgBB response data:', data);
        
        if (data.success) {
            // Add the uploaded image URL to the list
            const imageUrl = data.data.url;
            const newImages = [...currentRowImages, imageUrl];
            const newIndex = newImages.length - 1;
            setCurrentRowImages(newImages);
            // Set loading state for uploaded image
            setImageLoadingStates(prev => ({ ...prev, [newIndex]: true }));
            console.log('Image uploaded successfully:', imageUrl);
            alert('Image uploaded successfully!');
        } else {
            console.error('ImgBB upload failed:', data);
            alert(`Failed to upload image: ${data.error?.message || 'Unknown error'}`);
        }
    } catch (error) {
        console.error('Error uploading image:', error);
        alert(`Error uploading image: ${error.message}`);
    } finally {
        setUploadingImage(false);
        // Clear file input
        event.target.value = '';
    }
};
```

## Comparison

| Feature | Server-side (Current) | Direct Client Upload |
|---------|----------------------|---------------------|
| Max file size | 4.5MB (Vercel limit) | 10MB (our limit) |
| API key security | ✅ Hidden | ❌ Exposed to client |
| Upload speed | Slower (2 hops) | Faster (1 hop) |
| Server load | Uses serverless function | No server load |
| Error handling | Better control | Limited control |
| Cost | Uses function time | No function cost |

## Recommendation

- **Use server-side** (current implementation) for better security and most use cases
- **Use direct client upload** only if you frequently need to upload files >4.5MB
- **Best solution for large files**: Use image compression before upload

## Image Compression (Recommended)

Instead of changing the upload method, compress images on the client first:

```bash
npm install browser-image-compression
```

```javascript
import imageCompression from 'browser-image-compression';

const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    try {
        setUploadingImage(true);
        
        // Compress image before upload
        const options = {
            maxSizeMB: 2,              // Max file size
            maxWidthOrHeight: 1920,     // Max dimension
            useWebWorker: true
        };
        
        const compressedFile = await imageCompression(file, options);
        console.log('Original:', (file.size / 1024 / 1024).toFixed(2), 'MB');
        console.log('Compressed:', (compressedFile.size / 1024 / 1024).toFixed(2), 'MB');
        
        // Continue with upload using compressedFile...
        const formData = new FormData();
        formData.append('image', compressedFile);
        
        // Rest of upload code...
    } catch (error) {
        console.error('Compression error:', error);
        alert('Error processing image');
    }
};
```

This approach:
- ✅ Keeps API key secure
- ✅ Reduces bandwidth usage
- ✅ Faster uploads
- ✅ Better user experience
- ✅ Works with server-side upload
