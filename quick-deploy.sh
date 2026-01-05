#!/bin/bash
# Quick deployment - Skip build, just commit & deploy
# Use this when you've already built locally

set -e
cd /workspaces/Table-grod

echo "⚡ Quick deployment (skip build)..."
echo ""

# Commit if changes exist
if [[ -n $(git status -s) ]]; then
    git add -A
    COMMIT_MSG="${1:-chore: quick deploy}"
    git commit -m "$COMMIT_MSG"
    echo "✅ Committed: $COMMIT_MSG"
else
    echo "ℹ️  No changes to commit"
fi

# Deploy
echo "🌐 Deploying..."
vercel --prod

echo "✨ Done!"
