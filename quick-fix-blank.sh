#!/bin/bash

# 🚀 QUICK FIX: White Blank Page di Vercel

echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║  🔍 VERCEL WHITE BLANK PAGE - QUICK FIX                ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Read from user
read -p "1. Have you set DATABASE_URL in Vercel env vars? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "   ❌ STOP HERE! Go set it first:"
    echo "      https://vercel.com/dashboard → Settings → Environment Variables"
    echo "      Add: DATABASE_URL = your_database_url"
    echo ""
    exit 1
fi

read -p "2. Have you set VITE_API_URL=/api in Vercel env vars? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "   ❌ STOP HERE! Go set it first:"
    echo "      https://vercel.com/dashboard → Settings → Environment Variables"
    echo "      Add: VITE_API_URL = /api"
    echo ""
    exit 1
fi

read -p "3. Did you redeploy after setting env vars? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "   ❌ Redeploy required!"
    echo "      Go to: https://vercel.com/dashboard → Deployments"
    echo "      Click latest deployment → Redeploy"
    echo ""
    exit 1
fi

echo ""
echo "✅ All env vars set and redeployed!"
echo ""
echo "🔍 Now check these:"
echo ""
echo "   1. Open Vercel app in browser"
echo "   2. Press F12 (DevTools)"
echo "   3. Check Console tab:"
echo "      - Any RED errors?"
echo "      - If yes, screenshot and investigate"
echo ""
echo "   4. Check Network tab:"
echo "      - index.html = 200?"
echo "      - main-xxxxx.js = 200?"
echo "      - CSS files = 200?"
echo "      - /api/routes = 200?"
echo ""
echo "   5. If all 200 OK, app should load!"
echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║  If STILL blank after all this:                        ║"
echo "║  → Check: docs/VERCEL_BLANK_PAGE_TROUBLESHOOTING.md   ║"
echo "║  → Or: Read FIX_BLANK_PAGE_VERCEL.md for full guide    ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""
