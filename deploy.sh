#!/bin/bash
# Universal deploy script - Build, commit, and deploy to Vercel

set -e  # Exit on error

cd /workspaces/Table-grod

echo "🚀 Starting deployment process..."
echo ""

# Step 1: Clean build
echo "📦 Building application..."
npm run build
echo "✅ Build complete"
echo ""

# Step 2: Git commit (if changes exist)
if [[ -n $(git status -s) ]]; then
    echo "📝 Committing changes..."
    git add -A
    
    # Use commit message from argument, or default
    COMMIT_MSG="${1:-chore: update and deploy}"
    git commit -m "$COMMIT_MSG"
    
    echo "✅ Changes committed: $COMMIT_MSG"
    echo ""
else
    echo "ℹ️  No changes to commit"
    echo ""
fi

# Step 3: Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod

echo ""
echo "✨ Deployment complete!"
echo "🔗 Check your deployment at Vercel dashboard"
