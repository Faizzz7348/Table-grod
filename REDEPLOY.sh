#!/bin/bash
# Quick fix and redeploy after first deployment error

cd /workspaces/Table-grod

echo "🔧 Quick redeploy with fixed vercel.json..."
echo ""

# Build already done, just commit the fix
git add vercel.json
git commit -m "fix: use rewrites instead of routes in vercel.json

Vercel error: Cannot use both 'routes' and 'rewrites' together
Solution: Use catch-all rewrite pattern instead

Changes:
- Remove routes array
- Add catch-all rewrite: /(.*) -> /index.html
- Keep API rewrite: /api/(.*) -> /api/\$1

This enables proper SPA routing for React app."

echo "✅ Fix committed!"
echo ""

echo "🌐 Deploying to Vercel..."
vercel --prod

echo ""
echo "✨ Deployment complete!"
echo "🔗 Check your app - blank page should be fixed!"
