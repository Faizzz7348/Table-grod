import { put } from '@vercel/blob';
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
      uploadDir: '/tmp',
      filename: (name, ext, part, form) => {
        return `upload_${Date.now()}${ext}`;
      }
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

    // Check for Vercel Blob token
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
    
    if (!blobToken) {
      console.error('BLOB_READ_WRITE_TOKEN not configured');
      return res.status(500).json({ 
        error: 'Upload service not configured',
        message: 'Vercel Blob token is missing. Please configure BLOB_READ_WRITE_TOKEN environment variable in your Vercel project settings.'
      });
    }

    // Get file path
    const filePath = file.filepath || file.path;
    const fileName = file.originalFilename || file.name || `upload_${Date.now()}`;
    
    // Read file data
    console.log('Reading file data...');
    const fileData = await fs.readFile(filePath);
    console.log('File data read, size:', fileData.length, 'bytes');
    
    // Upload to Vercel Blob
    console.log('Uploading to Vercel Blob...');
    const blob = await put(fileName, fileData, {
      access: 'public',
      contentType: mimeType,
      token: blobToken,
    });

    console.log('Vercel Blob upload successful:', blob.url);

    // Clean up temporary file
    try {
      await fs.unlink(filePath);
      console.log('Temporary file deleted');
    } catch (unlinkError) {
      console.error('Failed to delete temp file:', unlinkError);
      // Don't fail the request if cleanup fails
    }

    // Return the uploaded image URL
    return res.status(200).json({
      success: true,
      data: {
        url: blob.url,
        displayUrl: blob.url,
        pathname: blob.pathname,
        contentType: blob.contentType,
        size: file.size
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
