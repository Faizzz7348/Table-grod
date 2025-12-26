# QR Code Feature Implementation

## Overview
A QR code management feature has been added to the shortcut section in location info modals. This allows users to upload QR code images and set destination URLs.

## Features

### Edit Mode
When in edit mode and clicking the QR code button:
- **Upload QR Code Image**: Upload a photo/image of a QR code
- **Set Destination URL**: Enter a URL that the QR code points to
- **Visual Feedback**: 
  - Purple icon with plus circle when no QR code exists
  - Orange icon with pencil when QR code is configured
- **No Caption Required**: Only image and URL fields, keeping it simple

### View Mode  
When in view mode and clicking the QR code button:
- **Auto-Show**: Button only appears if QR code image or URL exists
- **Quick Access**: Click to view the QR code and go to destination
- **Direct Navigation**: "Go to Destination" button opens the URL in new tab
- **Hidden When Empty**: Button is hidden if no QR code is uploaded

## User Flow

### Adding a QR Code (Edit Mode)
1. Enable Edit Mode
2. Click Info button on any location
3. In the Shortcut section, click the QR Code button (purple with plus icon)
4. Upload a QR code image (jpg, png, etc.) OR enter a destination URL
5. Click "Save"
6. Click "Save Changes" in the main table to persist data

### Viewing/Scanning QR Code (View Mode)
1. Disable Edit Mode (View Mode)
2. Click Info button on a location that has a QR code
3. In the Shortcut section, click the QR Code button (appears only if QR exists)
4. View the QR code image
5. Click "Go to Destination" to open the URL automatically

## Technical Details

### State Management
New state variables added:
```javascript
const [qrCodeDialogVisible, setQrCodeDialogVisible] = useState(false);
const [qrCodeImageUrl, setQrCodeImageUrl] = useState('');
const [qrCodeDestinationUrl, setQrCodeDestinationUrl] = useState('');
const [uploadingQrCode, setUploadingQrCode] = useState(false);
```

### Data Structure
Each location object now includes:
```javascript
{
  id: string,
  code: string,
  location: string,
  // ... other fields
  qrCodeImageUrl: string,      // URL of uploaded QR code image
  qrCodeDestinationUrl: string  // URL that QR code points to
}
```

### Upload Handler
- Uses the existing `/api/upload` endpoint (ImgBB integration)
- Validates file type (images only)
- Validates file size (max 10MB)
- Shows upload progress indicator
- Stores uploaded image URL

### Save Handler
- Updates location data in both `dialogData` and `routes` state
- Updates `selectedRowInfo` if it's the currently viewed location
- Sets `hasUnsavedChanges` flag
- Requires main "Save Changes" to persist to backend

## UI Components

### Dialog Modal
- **Header**: Shows "Manage QR Code" in edit mode, "Scan QR Code" in view mode
- **Body**: 
  - Edit Mode: File upload input + destination URL input
  - View Mode: QR code image display + "Go to Destination" button
- **Footer**: 
  - Edit Mode: Cancel/Save buttons (Save disabled if no data entered)
  - View Mode: Close button only

### Shortcut Button
- **Icon**: `pi-qrcode` from PrimeIcons
- **Colors**:
  - Edit Mode (empty): Purple (#8b5cf6)
  - Edit Mode (has QR): Orange (#f59e0b)
  - View Mode: Purple (#8b5cf6)
- **Tooltip**: Shows appropriate message based on state
- **Visibility**: In view mode, only shows if QR code exists

## Integration Points

### Works With
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
