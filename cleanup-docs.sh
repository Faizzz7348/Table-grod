#!/bin/bash
# Script to clean up obsolete documentation files

echo "🧹 Cleaning up obsolete documentation files..."

# List of obsolete files to delete
files=(
    "docs/COMMIT_MESSAGE.md"
    "docs/CLEANUP_SUMMARY.md"
    "docs/QUICK_FIX_SUMMARY.md"
    "docs/IMAGE_UPLOAD_ALTERNATIVE.md"
    "docs/TROUBLESHOOTING_UPLOAD_ERROR.md"
    "docs/MODAL_CHANGELOG.md"
    "docs/ANIMATED_MODAL_README.md"
    "docs/LINK_CONFIRMATION_EXAMPLE.md"
    "docs/LINK_CONFIRMATION_VISUAL.md"
    "docs/LINK_CONFIRMATION_SUMMARY.md"
    "docs/QUICK_REF_LINK_CONFIRMATION.md"
    "docs/MODAL_ENHANCEMENTS.md"
    "docs/MODAL_QUICKSTART.md"
    "docs/DIALOG_TRANSITIONS.md"
    "docs/CHANGELOG_PERSISTENCE.md"
    "docs/IMAGE_UPLOAD_GUIDE.md"
    "docs/VERCEL_DEPLOYMENT_CRITICAL.md"
    "docs/PRODUCTION_SETUP.md"
    "docs/VERCEL_DEV_SETUP.md"
    "docs/SETUP_INSTRUCTIONS.md"
    "docs/COMMIT_INSTRUCTIONS.md"
    "docs/.cleanup-summary.md"
)

deleted=0
not_found=0

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        rm "$file"
        echo "✓ Deleted: $file"
        ((deleted++))
    else
        echo "⚠ Not found: $file"
        ((not_found++))
    fi
done

echo ""
echo "✅ Cleanup complete!"
echo "   Deleted: $deleted files"
echo "   Not found: $not_found files"
echo ""
echo "Remaining documentation files:"
ls -1 docs/*.md | wc -l
