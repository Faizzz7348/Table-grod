import formidable from 'formidable';
import fs from 'fs/promises';

// Config for Vercel serverless function
export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

// Helper function to parse form data
const parseForm = (req) => {
  return new Promise((resolve, reject) => {
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB limit
      keepExtensions: true,
      multiples: false,
      allowEmptyFiles: false,
      minFileSize: 1,
    });

    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error('Formidable parse error:', err);
        reject(err);
      } else {
        console.log('Form parsed successfully');
        resolve({ fields, files });
      }
    });
  });
};

// Helper to convert file to base64 (without data URI prefix)
const fileToBase64 = async (filePath) => {
  try {
    const data = await fs.readFile(filePath);
    return data.toString('base64');
  } catch (error) {
    console.error('Error reading file:', error);
    throw error;
  }
};

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Starting file upload process...');
    
    // Parse the multipart form data
    const { fields, files } = await parseForm(req);
    
    // Get the uploaded file - handle different formidable versions
    let file = null;
    if (files.image) {
      file = Array.isArray(files.image) ? files.image[0] : files.image;
    }
    
    if (!file) {
      console.error('No file found in request');
      return res.status(400).json({ 
        error: 'No file uploaded',
        message: 'Please select an image file to upload'
      });
    }

    console.log('File received:', {
      name: file.originalFilename || file.name,
      type: file.mimetype || file.type,
      size: file.size,
      path: file.filepath || file.path
    });

    // Validate file type
    const mimeType = file.mimetype || file.type;
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    
    if (!mimeType || !validTypes.includes(mimeType.toLowerCase())) {
      return res.status(400).json({ 
        error: 'Invalid file type',
        message: 'Only JPEG, PNG, GIF, and WebP images are allowed'
      });
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      return res.status(400).json({ 
        error: 'File too large',
        message: 'Maximum file size is 10MB'
      });
    }

    // Get ImgBB API key from environment
    const imgbbApiKey = process.env.IMGBB_API_KEY;
    
    if (!imgbbApiKey) {
      console.error('IMGBB_API_KEY not configured');
      return res.status(500).json({ 
        error: 'Upload service not configured',
        message: 'ImgBB API key is missing. Please configure IMGBB_API_KEY environment variable.'
      });
    }

    // Get file path
    const filePath = file.filepath || file.path;
    
    // Convert file to base64
    console.log('Converting file to base64...');
    const base64Image = await fileToBase64(filePath);
    console.log('Base64 conversion complete, length:', base64Image.length);
    
    // Upload to ImgBB using FormData-like structure
    const formBody = new URLSearchParams();
    formBody.append('image', base64Image);
    
    console.log('Uploading to ImgBB...');
    
    // Create a proper FormData-like body string
    const bodyString = formBody.toString();
    
    const imgbbResponse = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(bodyString).toString(),
      },
      body: bodyString
    });

    console.log('ImgBB response status:', imgbbResponse.status);
    
    // Read response only once
    const responseText = await imgbbResponse.text();
    console.log('ImgBB raw response:', responseText.substring(0, 200));
    
    if (!imgbbResponse.ok) {
      console.error('ImgBB HTTP error:', imgbbResponse.status, responseText);
      return res.status(500).json({ 
        error: 'Upload failed',
        message: `ImgBB returned error: ${imgbbResponse.status}`
      });
    }

    // Parse the response
    let imgbbData;
    try {
      imgbbData = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse ImgBB response:', parseError);
      return res.status(500).json({ 
        error: 'Upload failed',
        message: 'Invalid response from ImgBB'
      });
    }
    
    console.log('ImgBB parsed response:', imgbbData.success ? 'Success' : 'Failed');

    if (!imgbbData.success) {
      console.error('ImgBB upload failed:', imgbbData);
      return res.status(500).json({ 
        error: 'Upload failed',
        message: imgbbData.error?.message || 'Failed to upload to ImgBB'
      });
    }

    // Clean up temporary file
    try {
      await fs.unlink(filePath);
      console.log('Temporary file deleted');
    } catch (unlinkError) {
      console.error('Failed to delete temp file:', unlinkError);
      // Don't fail the request if cleanup fails
    }

    // Return the uploaded image URL
    console.log('Upload successful:', imgbbData.data.url);
    return res.status(200).json({
      success: true,
      data: {
        url: imgbbData.data.url,
        displayUrl: imgbbData.data.display_url,
        thumb: imgbbData.data.thumb?.url,
        deleteUrl: imgbbData.data.delete_url,
        size: imgbbData.data.size
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
