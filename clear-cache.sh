#!/bin/bash
# Script to clear various caches

echo "🧹 Clearing caches..."

# Clear dist folder
if [ -d "dist" ]; then
    rm -rf dist
    echo "✓ Cleared: dist/"
fi

# Clear Vite cache
if [ -d "node_modules/.vite" ]; then
    rm -rf node_modules/.vite
    echo "✓ Cleared: node_modules/.vite/"
fi

# Clear npm cache
npm cache clean --force
echo "✓ Cleared: npm cache"

# Clear Vercel cache (if exists)
if [ -d ".vercel" ]; then
    rm -rf .vercel/.cache
    echo "✓ Cleared: .vercel/.cache"
fi

echo ""
echo "✅ All caches cleared!"
echo ""
echo "To rebuild, run:"
echo "  npm run build"
