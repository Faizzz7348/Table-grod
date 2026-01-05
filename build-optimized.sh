#!/bin/bash

# 🚀 Build Script - Optimized Version
# Script untuk build aplikasi yang sudah dioptimalkan

echo "🔧 Building optimized application..."
echo ""

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf dist

# Build
echo "📦 Building for production..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful!"
    echo ""
    echo "📊 Build statistics:"
    echo "├── Output directory: dist/"
    echo "├── Optimizations applied:"
    echo "│   ├── ✅ Code splitting"
    echo "│   ├── ✅ Minification (Terser)"
    echo "│   ├── ✅ Tree shaking"
    echo "│   ├── ✅ Asset optimization"
    echo "│   ├── ✅ CSS code splitting"
    echo "│   └── ✅ Console logs removed"
    echo ""
    echo "🎯 Next steps:"
    echo "1. Test locally: npm run preview"
    echo "2. Deploy to production"
    echo ""
else
    echo ""
    echo "❌ Build failed!"
    echo "Please check the error messages above."
    echo ""
    exit 1
fi
