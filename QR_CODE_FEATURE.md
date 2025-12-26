# QR Code Feature Implementation

## Overview
A QR code management feature has been added to the shortcut section in location info modals. This allows users to upload QR code images and set destination URLs. The implementation now includes QR code scanning capabilities using the `qr-scanner` library, similar to the Route.git repository.

## Features

### Edit Mode
When in edit mode and clicking the QR code button:
- **Upload QR Code Image**: Upload a photo/image of a QR code (stored as base64)
- **Set Destination URL**: Enter a URL that the QR code points to
- **Visual Feedback**: 
  - Purple icon with plus circle when no QR code exists
  - Orange icon with pencil when QR code is configured
- **No Caption Required**: Only image and URL fields, keeping it simple
- **Image Preview**: Shows preview of uploaded QR code image

### View Mode  
When in view mode and clicking the QR code button:
- **Auto-Show**: Button only appears if QR code image or URL exists
- **Automatic QR Code Scanning**: Automatically scans QR code from uploaded image when dialog opens
- **QR Code Scanning**: Uses QrScanner library to decode QR codes from images
- **Scan Animation**: Visual scanning animation with green scan line and corners
- **Auto Navigation**: After scanning, automatically opens detected URL
- **Fallback**: If QR scan fails, uses destination URL if available
- **Smart URL Detection**: 
  - Opens detected URLs directly
  - Adds https:// if URL doesn't have protocol
  - Searches on Google if content is not a URL
- **Manual Re-scan**: "Scan Again" button to re-scan the QR code if needed
- **Hidden When Empty**: Button is hidden if no QR code is uploaded

## User Flow

### Adding a QR Code (Edit Mode)
1. Enable Edit Mode
2. Click Info button on any location
3. In the Shortcut section, click the QR Code button (purple with plus icon)
4. Upload a QR code image (jpg, png, etc.) - stored as base64 data URL
5. (Optional) Enter a destination URL as fallback
6. Click "Save"
7. Click "Save Changes" in the main table to persist data

### Viewing/Scanning QR Code (View Mode)
1. Disable Edit Mode (View Mode)
2. Click Info button on a location that has a QR code
3. In the Shortcut section, click the QR Code button (appears only if QR exists)
4. **Automatic Scanning**: QR code is automatically scanned immediately when dialog opens
5. **Visual Feedback**: Watch the green scan line animation during scanning
6. **Auto Navigation**: Automatically redirects to detected URL after successful scan
7. Alternative: Click "Scan Again" to manually re-scan if needed

## Technical Details

### Dependencies
```json
{
  "qr-scanner": "^1.4.2"
}
```

### State Management
New state variables added:
```javascript
const [qrCodeDialogVisible, setQrCodeDialogVisible] = useState(false);
const [qrCodeImageUrl, setQrCodeImageUrl] = useState('');
const [qrCodeDestinationUrl, setQrCodeDestinationUrl] = useState('');
const [uploadingQrCode, setUploadingQrCode] = useState(false);
const [scanningQrCode, setScanningQrCode] = useState(false);
```

### Data Structure
Each location object now includes:
```javascript
{
  id: string,
  code: string,
  location: string,
  // ... other fields
  qrCodeImageUrl: string,      // Base64 data URL of QR code image
  qrCodeDestinationUrl: string  // URL that QR code points to (fallback)
}
```

### Upload Handler
- Converts uploaded image to base64 data URL (no server upload needed)
- Validates file type (images only)
- Validates file size (max 10MB)
- Shows upload progress indicator
- Stores image as base64 in state

### QR Code Scanning Handler
```javascript
const handleScanQrCode = async (destinationUrl) => {
    // Uses QrScanner.scanImage() to decode QR from image
    // Handles both remote URLs and base64 data URLs
    // Provides fallback to destination URL if scan fails
    // Auto-navigates to detected URL after animation
}
```

### Save Handler
- Updates location data in both `dialogData` and `routes` state
- Updates `selectedRowInfo` if it's the currently viewed location
- Sets `hasUnsavedChanges` flag
- Requires main "Save Changes" to persist to backend

## UI Components

### Dialog Modal
- **Header**: Shows "Manage QR Code" in edit mode, "Scan QR Code" in view mode
- **Body**: 
  - Edit Mode: File upload input + destination URL input + image preview
  - View Mode: QR code scanning animation OR QR code image display + "Scan Again" button
- **Footer**: 
  - Edit Mode: Cancel/Save buttons (Save disabled if no data entered)
  - View Mode: Close button only

### Shortcut Button
- **Icon**: 
  - Edit Mode (empty): `pi-plus-circle` 
  - Edit Mode (has QR): `pi-pencil`
  - View Mode: `pi-qrcode`
- **Colors**:
  - Edit Mode (empty): Purple (#8b5cf6)
  - Edit Mode (has QR): Orange (#f59e0b)
  - View Mode: Purple (#8b5cf6)
- **Tooltip**: Shows appropriate message based on state
- **Visibility**: In view mode, only shows if QR code exists

### Scanning Animation
CSS animations for visual feedback:
- **Scan Line**: Moving green line that scans across QR code
- **Scan Corners**: Pulsing corner borders
- **Loading Spinner**: Shows during scan process

```css
@keyframes scanLine {
    0% { top: 0%; }
    50% { top: 100%; }
    100% { top: 0%; }
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}
```

## Integration Points

### Works With
- Image upload system (base64 storage)
- Info modal system
- Edit/View mode toggle
- State management (routes, dialogData, selectedRowInfo)
- Save/unsaved changes tracking

### QR Scanner Library Integration
```javascript
import QrScanner from 'qr-scanner';

// Scan QR code from image
const result = await QrScanner.scanImage(imageSource, { 
    returnDetailedScanResult: true 
});

// Handle CORS for remote images
if (imageSource.startsWith('http')) {
    const response = await fetch(imageSource);
    imageSource = await response.blob();
}
```

## Benefits vs Previous Implementation

1. **Actual QR Scanning**: Uses real QR scanning library instead of just opening URL
2. **Smart URL Detection**: Automatically detects and handles URLs vs text
3. **Better UX**: Scanning animation provides visual feedback
4. **Offline Storage**: Base64 storage means images work offline
5. **No Server Dependency**: No need for image hosting service
6. **Fallback Support**: Gracefully handles scan failures with destination URL
7. **Google Search Integration**: Non-URL content automatically searches on Google

## Testing Checklist

- [x] Install qr-scanner library
- [x] Import QrScanner in component
- [x] Update handleQrCodeUpload to use base64
- [x] Update handleScanQrCode with QrScanner
- [x] Test QR code upload in edit mode
- [x] Test QR code scanning in view mode
- [x] Test scan animation
- [x] Test URL auto-navigation
- [x] Test fallback to destination URL
- [x] Test Google search for non-URLs
- [x] Test image preview in dialog
- [x] Test button color changes
- [x] Test save functionality

## Similar Implementation
This feature is implemented similarly to:
- Repository: https://github.com/Faizzz7348/Route.git
- File: client/src/components/info-modal.tsx
- Features: QR code upload, scanning, and navigation
- ✅ Dark mode / Light mode
- ✅ Mobile responsive design
- ✅ Edit mode / View mode toggle
- ✅ Unsaved changes tracking
- ✅ Existing image upload infrastructure

### Follows Same Pattern As
- Website Link feature (shortcut section)
- Image upload feature (dialog management)
- Info modal system (location data)

## Future Enhancements (Optional)

1. **QR Code Generator**: Generate QR codes from URLs automatically
2. **Camera Scan**: Use device camera to scan QR codes in real-time
3. **QR Code Preview**: Show what the QR code will look like when generated
4. **Batch QR Codes**: Upload multiple QR codes at once
5. **QR Code Analytics**: Track how many times QR codes are scanned

## Testing Checklist

- [x] QR button appears in shortcut section
- [x] Edit mode allows upload and URL entry
- [x] View mode shows QR code when exists
- [x] View mode hides button when no QR code
- [x] Upload validation works (file type, size)
- [x] Save updates location data correctly
- [x] Unsaved changes tracking works
- [x] Dark mode styling works
- [x] Mobile responsive
- [x] No console errors

## Files Modified

- `/workspaces/Table-grod/src/FlexibleScrollDemo.jsx`
  - Added QR code state variables (lines ~247-254)
  - Added QR code upload handler (lines ~750-785)
  - Added QR code save handler (lines ~787-830)
  - Updated QR button in shortcut section (lines ~3480-3550)
  - Added QR code dialog modal (lines ~4895-5020)
