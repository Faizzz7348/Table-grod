# Public Data Setup - Shared vs Individual Features

## Overview
Sistem telah dikonfigurasi supaya **data adalah PUBLIC** (dikongsi oleh semua pengguna), manakala **beberapa ciri kekal INDIVIDUAL** (spesifik untuk setiap pengguna).

## 🌍 PUBLIC/SHARED (Database API)
Data berikut dikongsi oleh semua pengguna dan disimpan dalam database:

- **Routes** (Laluan)
  - Route name
  - Shift
  - Warehouse
  - Description
  
- **Locations** (Lokasi)
  - No, Code, Location name
  - Delivery schedule
  - Power Mode
  - Images, Maps, QR Codes
  - All location details
  
- **Frozen Row** (QL Kitchen)
  - Frozen row adalah location khusus dalam database
  - Semua perubahan pada frozen row disimpan ke database
  - Semua user akan nampak perubahan yang sama

### Maksudnya:
✅ Bila satu user tambah/edit/delete route atau location, **semua orang akan nampak perubahan yang sama**
✅ Data sentiasa sync dari database
✅ Tiada lagi perbezaan data antara user

## 👤 INDIVIDUAL (localStorage)
Ciri-ciri berikut kekal individual untuk setiap pengguna:

1. **Pin/Unpin Rows** (`pinnedRows`, `pinnedDialogRows`)
   - Setiap user boleh pin row mereka sendiri
   - Tidak affect user lain

2. **Column Customize** (`columnVisibility`)
   - Setiap user boleh hide/show column mengikut preference mereka
   - User A boleh hide "Image" column, User B boleh show semua

3. **Set Order** (`isCustomSorted`, `sortOrders`, `savedPresets`)
   - Setiap user boleh set custom order mereka sendiri
   - Boleh save order presets secara individual

4. **Dark Mode** (`isDark`)
   - Theme preference untuk setiap user

## Technical Changes

### CustomerService.js
```javascript
// BEFORE: localStorage enabled in dev mode
const USE_LOCALSTORAGE = import.meta.env.DEV === true;

// AFTER: localStorage disabled for data
const USE_LOCALSTORAGE = false;
```

**Impact:**
- Routes & Locations selalu fetch dari API
- Tidak simpan dalam localStorage lagi
- In-memory cache tetap aktif untuk performance

### FlexibleScrollDemo.jsx
Removed code yang clear routes/locations dari localStorage:
```javascript
// REMOVED:
// localStorage.removeItem('routes');
// localStorage.removeItem('locations');

// KEPT:
// localStorage untuk pinnedRows, columnVisibility, isCustomSorted
```

## Testing Checklist

### ✅ Public Data (Should be Shared)
- [ ] User A tambah route, User B nampak route baru
- [ ] User A edit location, User B nampak perubahan
- [ ] User A delete item, User B nampak item hilang
- [ ] Refresh browser, data masih sama dari database

### ✅ Individual Features (Should be Separate)
- [ ] User A pin row, User B tak nampak pin (individual)
- [ ] User A hide column, User B masih nampak (individual)
- [ ] User A set custom order, User B tak terkesan (individual)
- [ ] User A save preset, User B tak nampak preset tu (individual)

## Database Requirements

Pastikan environment variables configured dengan betul:

```env
# .env or .env.local
VITE_API_URL=https://your-api-domain.com/api

# Database connection
DATABASE_URL=postgresql://...
```

## Migration Notes

Jika user ada data lama dalam localStorage:
- Data lama (routes/locations) akan **diabaikan**
- Sistem akan fetch fresh data dari database
- User preferences (pin/order/columns) akan **kekal**

## Benefits

✅ **Centralized Data** - Satu sumber data untuk semua
✅ **Real-time Sync** - Semua user nampak data yang sama
✅ **Personal Preferences** - Setiap user boleh customize view mereka
✅ **Simplified Management** - Tak perlu worry pasal data sync issues

## Support

Jika ada issues:
1. Check API connection: Database must be accessible
2. Check browser console untuk errors
3. Clear localStorage if needed: `localStorage.clear()`
4. Verify database has data: Check via database client

---
**Last Updated:** December 30, 2025
**Version:** 1.0.0
