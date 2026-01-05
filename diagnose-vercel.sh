#!/bin/bash

# 🔍 Vercel White Blank Page - Quick Diagnostic Script

echo "================================"
echo "🔍 VERCEL DEPLOYMENT DIAGNOSTIC"
echo "================================"
echo ""

# Check 1: Build status
echo "✅ [1/6] Checking local build..."
if npm run build > /dev/null 2>&1; then
    echo "    ✓ Build successful"
else
    echo "    ✗ Build FAILED - Fix this first!"
    exit 1
fi

# Check 2: dist folder
echo ""
echo "✅ [2/6] Checking output files..."
if [ -f "dist/index.html" ]; then
    echo "    ✓ dist/index.html found"
else
    echo "    ✗ dist/index.html NOT FOUND!"
fi

if [ -d "dist/assets" ]; then
    echo "    ✓ dist/assets folder found"
else
    echo "    ✗ dist/assets NOT FOUND!"
fi

# Check 3: vercel.json
echo ""
echo "✅ [3/6] Checking vercel.json..."
if [ -f "vercel.json" ]; then
    if grep -q '"outputDirectory": "dist"' vercel.json; then
        echo "    ✓ vercel.json configured correctly"
    else
        echo "    ✗ outputDirectory not set to 'dist' in vercel.json"
    fi
else
    echo "    ✗ vercel.json NOT FOUND!"
fi

# Check 4: Environment variables template
echo ""
echo "✅ [4/6] Checking .env.example..."
if [ -f ".env.example" ]; then
    echo "    ✓ .env.example found"
    echo ""
    echo "    📝 Required env vars for Vercel:"
    grep -E "^[A-Z_]+" .env.example | head -10 | sed 's/=.*//' | while read var; do
        echo "       - $var"
    done
else
    echo "    ✗ .env.example NOT FOUND!"
fi

# Check 5: Main entry point
echo ""
echo "✅ [5/6] Checking entry points..."
if grep -q '<div id="root">' index.html; then
    echo "    ✓ index.html has root element"
else
    echo "    ✗ index.html missing root element!"
fi

if [ -f "src/main.jsx" ]; then
    echo "    ✓ src/main.jsx exists"
else
    echo "    ✗ src/main.jsx NOT FOUND!"
fi

# Check 6: CSS imports
echo ""
echo "✅ [6/6] Checking CSS..."
if grep -q "index-clean.css" src/main.jsx; then
    echo "    ✓ CSS imported in main.jsx"
else
    echo "    ✗ CSS import issue!"
fi

echo ""
echo "================================"
echo "🎯 NEXT STEPS FOR VERCEL:"
echo "================================"
echo ""
echo "1. Go to: https://vercel.com/dashboard"
echo "2. Select your project"
echo "3. Click: Settings → Environment Variables"
echo "4. Make sure these are set:"
echo "   ✓ DATABASE_URL"
echo "   ✓ VITE_API_URL=/api"
echo "   ✓ BLOB_READ_WRITE_TOKEN (if needed)"
echo ""
echo "5. Click: Deployments"
echo "6. Select latest deployment"
echo "7. Check 'Build Logs' for errors"
echo ""
echo "8. If still blank, open app in browser:"
echo "   F12 → Console → Check for red errors"
echo "   F12 → Network → Check /api/routes response"
echo ""
echo "================================"
echo "💡 Common Issues:"
echo "================================"
echo ""
echo "❌ White blank page?"
echo "   → Check DATABASE_URL in Vercel env vars"
echo ""
echo "❌ Build failed?"
echo "   → Check 'npm run build' error above"
echo ""
echo "❌ Styles missing?"
echo "   → Check Network tab, CSS files 404?"
echo ""
echo "❌ API errors?"
echo "   → Check /api/routes in Network tab"
echo ""
echo "✅ All looks good? Time to deploy!"
echo ""
