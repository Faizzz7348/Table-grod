# QR Code Feature - Usage Example

## Cara Penggunaan QR Code (Serupa dengan Route.git)

### 1. Menambah QR Code (Edit Mode)

#### Langkah-langkah:

1. **Aktifkan Edit Mode**
   - Klik butang "Edit Mode" di bahagian atas
   - Interface akan bertukar kepada mode edit

2. **Buka Location Info**
   - Klik butang "i" (info) pada mana-mana location
   - Dialog info akan terbuka

3. **Klik Butang QR Code**
   - Di bahagian "Shortcut", cari butang QR Code
   - Icon: Purple dengan plus circle (🟣➕) jika tiada QR
   - Icon: Orange dengan pencil (🟠✏️) jika sudah ada QR

4. **Upload QR Code Image**
   - Klik "Choose File" atau drag & drop image
   - Format: JPG, PNG, GIF (max 10MB)
   - Image akan disimpan sebagai base64 (offline-friendly)
   - Preview image akan dipaparkan selepas upload

5. **Masukkan Destination URL (Optional)**
   - Contoh: `https://www.example.com`
   - URL ini akan dibuka jika QR scan gagal (fallback)
   - Boleh skip jika QR code sudah mengandungi URL

6. **Save**
   - Klik butang "Save" dalam dialog
   - Klik "Save Changes" di main table untuk persist data

### 2. Scan QR Code (View Mode)

#### Langkah-langkah:

1. **Matikan Edit Mode**
   - Pastikan Edit Mode OFF (View Mode)
   - Butang QR hanya kelihatan jika location ada QR code

2. **Buka Location dengan QR Code**
   - Klik butang "i" (info) pada location yang ada QR
   - Butang QR code akan muncul (purple icon 🟣)

3. **Klik Butang QR Code**
   - Dialog scan akan terbuka
   - **Auto-scanning dimulakan!**
   
4. **Proses Scanning**
   - Green scan line bergerak (animasi)
   - Corner borders berpulse
   - Loading spinner ditunjukkan
   - Scanning menggunakan `qr-scanner` library

5. **Auto Navigation**
   - Selepas scan berjaya (~1.5 saat)
   - URL yang didetect akan dibuka secara automatik
   - Tab baru akan terbuka dengan URL tersebut

#### Smart URL Detection:
- **URL dengan protocol**: `https://example.com` → Terus dibuka
- **URL tanpa protocol**: `example.com` → Auto tambah `https://`
- **Bukan URL**: `some text` → Search di Google
- **Scan gagal**: Guna destination URL (fallback)

### 3. Button States & Colors

| Mode | Status | Icon | Color | Tooltip |
|------|--------|------|-------|---------|
| Edit | No QR | `pi-plus-circle` | Purple (#8b5cf6) | "Add QR Code" |
| Edit | Has QR | `pi-pencil` | Orange (#f59e0b) | "Edit QR Code" |
| View | Has QR | `pi-qrcode` | Purple (#8b5cf6) | "QR Code" |
| View | No QR | - | - | (Hidden) |

### 4. Technical Flow

```javascript
// 1. User uploads image
handleQrCodeUpload(event) {
  const file = event.target.files[0];
  // Convert to base64
  reader.readAsDataURL(file);
  setQrCodeImageUrl(base64String);
}

// 2. User saves
handleSaveQrCode() {
  // Update dialogData, routes, selectedRowInfo
  setHasUnsavedChanges(true);
}

// 3. User scans in view mode
handleScanQrCode(destinationUrl) {
  setScanningQrCode(true);
  
  // Scan QR code using QrScanner
  const result = await QrScanner.scanImage(imageSource, {
    returnDetailedScanResult: true
  });
  
  // Navigate to detected URL
  setTimeout(() => {
    window.open(result.data, '_blank');
  }, 1500);
}
```

### 5. Data Structure

```javascript
// Location object with QR code
{
  id: "abc-123",
  code: "KL01",
  location: "Kuala Lumpur Office",
  // ... other fields
  
  // QR Code fields
  qrCodeImageUrl: "data:image/png;base64,iVBORw0KG...",  // base64
  qrCodeDestinationUrl: "https://www.company.com/kl-office"  // fallback
}
```

### 6. Animation Details

#### Scan Line Animation
```css
@keyframes scanLine {
  0% { top: 0%; }
  50% { top: 100%; }
  100% { top: 0%; }
}

.qr-scan-line {
  background: linear-gradient(transparent, #10b981, transparent);
  animation: scanLine 2s ease-in-out infinite;
}
```

#### Pulse Animation
```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.qr-scan-corners {
  border: 2px solid #10b981;
  animation: pulse 1.5s ease-in-out infinite;
}
```

### 7. Error Handling

| Error | Cause | Solution |
|-------|-------|----------|
| "Not an image file" | Wrong file type | Upload JPG/PNG/GIF |
| "File too large" | Size > 10MB | Compress image first |
| "Could not read QR code" | Invalid/blurry QR | Use clearer image |
| "No QR code configured" | Empty fields | Upload image or URL |

### 8. Use Cases

#### Use Case 1: Product Information
- Upload QR code dari product packaging
- Set destination: Product detail page
- Scan untuk lihat product info

#### Use Case 2: Location Navigation
- Upload QR code untuk navigate ke location
- Set destination: Google Maps link
- Scan untuk buka navigation

#### Use Case 3: Website Link
- Upload QR code dengan website URL
- Set destination: Website URL (fallback)
- Scan untuk buka website

#### Use Case 4: Contact Information
- Upload QR code dengan contact details
- Set destination: vCard or contact page
- Scan untuk save contact

### 9. Advantages vs Previous Implementation

| Feature | Before | After (Route.git Style) |
|---------|--------|------------------------|
| Scanning | Manual URL open | Real QR scanning |
| Storage | Server upload | Base64 (offline) |
| Animation | None | Green scan line |
| URL Detection | Direct only | Smart detection |
| Fallback | None | Destination URL |
| Search | None | Auto Google search |
| Preview | None | Live preview |

### 10. Testing Checklist

- [ ] Upload QR code image (< 10MB)
- [ ] Preview shows correctly
- [ ] Save QR code data
- [ ] Button changes color (purple → orange)
- [ ] View mode shows QR button
- [ ] Click QR button triggers scan
- [ ] Scan animation plays
- [ ] URL detected correctly
- [ ] Auto navigation works
- [ ] Fallback URL works if scan fails
- [ ] Google search for non-URLs
- [ ] Handle invalid/corrupt images
- [ ] Persist data after save

### 11. Integration dengan Route.git Pattern

Implementasi ini mengikuti pattern dari repositori rujukan:
- **Repository**: https://github.com/Faizzz7348/Route.git
- **File**: `client/src/components/info-modal.tsx`
- **Lines**: 123-237 (Scan handling), 544-562 (Upload UI)

#### Key Similarities:
1. ✅ Base64 storage (no server upload)
2. ✅ QrScanner library integration
3. ✅ Smart URL detection & Google search
4. ✅ Scan animation dengan visual feedback
5. ✅ Button state management (purple/orange)
6. ✅ Preview image display
7. ✅ Fallback URL support

### 12. Tips & Best Practices

1. **QR Code Quality**
   - Use high resolution (min 300x300px)
   - Clear contrast (dark on light)
   - No blur or distortion

2. **File Size**
   - Compress images before upload
   - Recommended: < 500KB
   - Max: 10MB

3. **URL Format**
   - Use full URLs with protocol
   - Example: `https://example.com` (not `example.com`)
   - Test URL before setting as destination

4. **Testing**
   - Test QR codes with online generators
   - Verify scan works with phone camera
   - Check URL redirects correctly

5. **User Experience**
   - Add meaningful destination URLs
   - Use descriptive tooltips
   - Provide fallback URLs

### 13. Troubleshooting

#### Problem: QR Code tidak scan
**Solution**: 
- Pastikan image clear dan high resolution
- Check QR code valid dengan phone camera
- Try compress image jika terlalu besar

#### Problem: URL tidak terbuka
**Solution**:
- Check internet connection
- Verify URL format correct (dengan https://)
- Check browser popup blocker settings

#### Problem: Button tidak muncul
**Solution**:
- Pastikan dalam View Mode (bukan Edit Mode)
- Check location ada QR code data
- Refresh page dan try lagi

## Kesimpulan

QR Code feature ini mengikuti best practices dari Route.git repository dengan:
- Real QR scanning capability
- Smart URL detection
- Beautiful scan animations
- Offline-friendly base64 storage
- Graceful error handling
- Intuitive user interface

Selamat menggunakan! 🎉
