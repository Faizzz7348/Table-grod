#!/bin/bash

echo "📁 Organizing documentation files..."

# Array of files to move
files=(
    "ANIMATED_MODAL_README.md"
    "AUTO_QR_SCAN_FEATURE.md"
    "COMMIT_INSTRUCTIONS.md"
    "DATABASE_SETUP.md"
    "DATABASE_SETUP_PRODUCTION.md"
    "DEPLOYMENT_CHECKLIST.md"
    "DEVICE_DETECTION_README.md"
    "DIALOG_TRANSITIONS.md"
    "DUPLICATE_VALIDATION.md"
    "IMAGELIGHTBOX_README.md"
    "IMAGE_LIGHTGALLERY_GUIDE.md"
    "IMAGE_UPLOAD_ALTERNATIVE.md"
    "IMAGE_UPLOAD_FIX_SUMMARY.md"
    "IMAGE_UPLOAD_GUIDE.md"
    "LINK_CONFIRMATION_EXAMPLE.md"
    "LINK_CONFIRMATION_SUMMARY.md"
    "LINK_CONFIRMATION_VISUAL.md"
    "MAP_FEATURE_SETUP.md"
    "MODAL_QUICKSTART.md"
    "PRODUCTION_SETUP.md"
    "PWA_SETUP_GUIDE.md"
    "QR_CODE_FEATURE.md"
    "QR_CODE_USAGE_EXAMPLE.md"
    "QUICKSTART.md"
    "QUICK_REF_LINK_CONFIRMATION.md"
    "SAVE_FEATURE_SETUP.md"
    "SAVE_TROUBLESHOOTING.md"
    "SETUP_INSTRUCTIONS.md"
    "TROUBLESHOOTING_UPLOAD_ERROR.md"
    "VERCEL_DEPLOYMENT.md"
    "VERCEL_DEV_SETUP.md"
    ".cleanup-summary.md"
)

# Move each file to docs folder
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        git mv "$file" docs/
        echo "✓ Moved: $file"
    else
        echo "⚠ Not found: $file"
    fi
done

echo ""
echo "✅ Documentation organized!"
echo "📝 README.md stays in root directory"
echo "📂 All other .md files moved to docs/ folder"
echo ""
echo "Next steps:"
echo "  git status"
echo "  git commit -m 'Organize: Move all documentation to docs folder'"
echo "  git push"
