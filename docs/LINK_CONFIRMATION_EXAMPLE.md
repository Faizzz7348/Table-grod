# Link Confirmation Dialog - Example Usage

## Overview
Dialog confirmation telah ditambah untuk semua button shortcut yang membuka external links. Ini memastikan user sedar sebelum dibawa ke link luar.

## Features

✅ Confirmation dialog untuk:
- **Google Maps** - Directions
- **Waze** - Navigation
- **Website Link** - Custom website
- **Web Portal** - FM Vending Portal
- **QR Code** - After scanning

## How It Works

### 1. User Flow
```
User clicks button → Confirmation dialog appears → User confirms → Link opens in new tab
```

### 2. Implementation

```javascript
// State for confirmation dialog
const [linkConfirmVisible, setLinkConfirmVisible] = useState(false);
const [pendingLinkData, setPendingLinkData] = useState({ url: '', type: '' });

// Handler to open link with confirmation
const handleOpenLink = (url, type) => {
    setPendingLinkData({ url, type });
    setLinkConfirmVisible(true);
};

// Confirm action
const confirmOpenLink = () => {
    window.open(pendingLinkData.url, '_blank');
    setLinkConfirmVisible(false);
    setPendingLinkData({ url: '', type: '' });
};

// Cancel action
const cancelOpenLink = () => {
    setLinkConfirmVisible(false);
    setPendingLinkData({ url: '', type: '' });
};
```

### 3. Usage Examples

#### Example 1: Google Maps Button
```jsx
<Button
    onClick={() => {
        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
        handleOpenLink(googleMapsUrl, 'Google Maps');
    }}
>
    <img src="/google-maps.svg" alt="Google Maps" />
</Button>
```

#### Example 2: Waze Button
```jsx
<Button
    onClick={() => {
        const wazeUrl = `https://www.waze.com/ul?ll=${lat},${lng}&navigate=yes`;
        handleOpenLink(wazeUrl, 'Waze');
    }}
>
    <img src="/waze.svg" alt="Waze" />
</Button>
```

#### Example 3: Website Link
```jsx
<Button
    onClick={() => {
        handleOpenLink(selectedRowInfo.websiteLink, 'Website');
    }}
>
    <i className="pi pi-external-link"></i>
</Button>
```

#### Example 4: Web Portal
```jsx
<Button
    onClick={() => {
        handleOpenLink(webPortalUrl, 'Web Portal');
    }}
>
    <i className="pi pi-globe"></i>
</Button>
```

#### Example 5: QR Code
```jsx
// After scanning QR code
setTimeout(() => {
    setScanningQrCode(false);
    setQrCodeDialogVisible(false);
    handleOpenLink(destinationUrl, 'QR Code');
}, 2500);
```

## Dialog UI

### Dialog Features:
- ✅ Shows link type (Google Maps, Waze, Website, etc.)
- ✅ Displays full URL for verification
- ✅ Warning message for security
- ✅ Cancel and Open buttons
- ✅ Dark mode support
- ✅ Dismissable with ESC or clicking outside

### Dialog Content:
```
┌─────────────────────────────────────┐
│ 🔗 Open External Link              │
├─────────────────────────────────────┤
│                                     │
│ You are about to open Google Maps   │
│ in a new tab:                       │
│                                     │
│ ┌─────────────────────────────┐   │
│ │ https://www.google.com/...  │   │
│ └─────────────────────────────┘   │
│                                     │
│ ⓘ Make sure you trust this link    │
│   before opening it.                │
│                                     │
│           [Cancel]  [Open Link]     │
└─────────────────────────────────────┘
```

## Security Benefits

1. **URL Verification** - User can see full URL before opening
2. **Phishing Prevention** - Reduces accidental clicks on malicious links
3. **User Awareness** - Shows destination type (Maps, Website, etc.)
4. **Consent** - Explicit user action required

## Testing

### Test Scenarios:
1. ✅ Click Google Maps button → Confirmation shows → Confirm → Maps opens
2. ✅ Click Waze button → Confirmation shows → Confirm → Waze opens
3. ✅ Click Website button → Confirmation shows → Cancel → Nothing happens
4. ✅ Scan QR code → Animation plays → Confirmation shows → Opens destination
5. ✅ Press ESC on confirmation → Dialog closes → No action
6. ✅ Click outside confirmation → Dialog closes → No action

## Notes

- Dialog works in both light and dark mode
- URL is shown in full for transparency
- Long URLs are scrollable
- All existing functionality preserved
- No breaking changes to existing code

## Example Output

When clicking Google Maps button:
```
Dialog Title: "Open External Link"
Type: "Google Maps"
URL: "https://www.google.com/maps/dir/?api=1&destination=3.1234,101.5678"
Action: Opens in new tab after confirmation
```

When clicking Website Link:
```
Dialog Title: "Open External Link"
Type: "Website"
URL: "https://example.com"
Action: Opens in new tab after confirmation
```

## Integration

Dialog sudah fully integrated dengan:
- ✅ Location Info Modal
- ✅ Shortcut Section
- ✅ QR Code Feature
- ✅ Map Features (Google Maps, Waze)
- ✅ Website Link Feature
- ✅ Web Portal Feature

Semua link external sekarang melalui confirmation dialog untuk keselamatan dan user awareness yang lebih baik.
