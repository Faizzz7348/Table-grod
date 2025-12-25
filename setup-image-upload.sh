#!/bin/bash

# Image Upload Setup Script for Vercel

echo "=========================================="
echo "Image Upload Setup for Vercel"
echo "=========================================="
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "✅ .env file created"
    echo "⚠️  Please edit .env and add your IMGBB_API_KEY"
else
    echo "✅ .env file already exists"
fi

echo ""
echo "=========================================="
echo "Vercel Environment Variables Setup"
echo "=========================================="
echo ""
echo "You need to set the following environment variables in Vercel:"
echo ""
echo "1. IMGBB_API_KEY"
echo "   - Get it from: https://api.imgbb.com/"
echo "   - Sign up for free account"
echo "   - Copy your API key"
echo ""
echo "2. DATABASE_URL"
echo "   - Your PostgreSQL connection string"
echo ""

echo "=========================================="
echo "Setting Environment Variables in Vercel"
echo "=========================================="
echo ""
echo "Method 1: Using Vercel CLI"
echo "-------------------------"
echo "vercel env add IMGBB_API_KEY"
echo "(Enter your API key when prompted)"
echo ""
echo "Method 2: Using Vercel Dashboard"
echo "--------------------------------"
echo "1. Go to https://vercel.com/dashboard"
echo "2. Select your project"
echo "3. Go to Settings → Environment Variables"
echo "4. Add IMGBB_API_KEY with your key"
echo "5. Select all environments (Production, Preview, Development)"
echo ""

echo "=========================================="
echo "Installation"
echo "=========================================="
echo ""
echo "Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "=========================================="
echo "Testing Configuration"
echo "=========================================="
echo ""

# Check if IMGBB_API_KEY is set in .env
if grep -q "IMGBB_API_KEY=\"your_imgbb_api_key_here\"" .env; then
    echo "⚠️  IMGBB_API_KEY is not configured in .env"
    echo "   Please edit .env and add your actual API key"
else
    echo "✅ IMGBB_API_KEY appears to be configured in .env"
fi

echo ""
echo "=========================================="
echo "Next Steps"
echo "=========================================="
echo ""
echo "1. ✅ Dependencies installed (formidable added)"
echo "2. ⚠️  Set IMGBB_API_KEY in .env file"
echo "3. ⚠️  Set environment variables in Vercel dashboard"
echo "4. 🚀 Deploy: vercel --prod"
echo "5. 🧪 Test image upload in production"
echo ""
echo "📚 Documentation:"
echo "   - IMAGE_UPLOAD_GUIDE.md - Complete setup guide"
echo "   - IMAGE_UPLOAD_ALTERNATIVE.md - Alternative methods"
echo ""
echo "=========================================="
echo "Quick Test (Local)"
echo "=========================================="
echo ""
echo "Run: npm run dev"
echo "Then test image upload functionality"
echo ""
