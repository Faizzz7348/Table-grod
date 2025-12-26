#!/bin/bash

# QR Code Feature Commit Script
echo "🚀 Committing QR Code Feature Implementation..."

cd /workspaces/Table-grod

# Add all changes
git add .

# Commit with detailed message
git commit -m "feat: Implement QR Code scanning feature (Route.git style)

✨ New Features:
- Real QR code scanning using qr-scanner library
- Base64 image storage (offline-friendly)
- Smart URL detection & Google search integration
- Beautiful scan animation with green scan line
- Auto navigation after QR scan
- Fallback destination URL support

🎨 UI/UX Improvements:
- Dynamic button colors (purple/orange) based on QR state
- Live image preview in upload dialog
- Scanning animation with visual feedback
- Icon changes (plus/pencil/qrcode) per state

📦 Dependencies:
- Added qr-scanner ^1.4.2

📝 Documentation:
- Updated QR_CODE_FEATURE.md with implementation details
- Added QR_CODE_USAGE_EXAMPLE.md with usage guide (Malay)

🔄 Changes:
- src/FlexibleScrollDemo.jsx: Added QrScanner integration
- Simplified upload to use base64 (no server needed)
- Enhanced handleScanQrCode with real QR scanning
- Smart URL detection (https://, Google search)

Similar implementation to: https://github.com/Faizzz7348/Route.git
File reference: client/src/components/info-modal.tsx

Co-authored-by: GitHub Copilot <noreply@github.com>"

echo "✅ Commit completed!"
echo ""
echo "📊 Commit summary:"
git log -1 --stat

echo ""
echo "🔍 To push to remote:"
echo "   git push origin main"
