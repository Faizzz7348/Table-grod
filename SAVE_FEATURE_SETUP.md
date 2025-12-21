# Setup Save Feature - Database Integration

## ✅ Perubahan Yang Telah Dibuat:

### 1. API Endpoints Created
- `/api/routes.js` - Handle CRUD operations untuk routes
- `/api/locations.js` - Handle CRUD operations untuk locations

### 2. CustomerService Updated
- `getRoutes()` - Fetch routes dari API/database
- `getDetailData()` - Fetch locations dari API/database  
- `saveRoutes(routes)` - Save routes ke database
- `saveLocations(locations)` - Save locations ke database
- `deleteLocation(id)` - Delete location dari database

### 3. FlexibleScrollDemo Updated
- `handleSaveChanges()` - Sekarang save data ke database (bukan simulate sahaja)
- Double-click edit cell dah enabled dalam dialog

### 4. Vercel Config Updated
- API routes configured
- Prisma generate added to build command

---

## 📋 Setup Steps:

### Step 1: Push Database Schema
```bash
npm run db:push
```

### Step 2: Seed Database dengan Data
```bash
npm run db:seed
```

### Step 3: Generate Prisma Client
```bash
npm run db:generate
```

### Step 4: Run Development Server
```bash
npm run dev
```

---

## 🧪 Testing Save Feature:

1. **Buka aplikasi** di browser
2. **Click "Edit Mode"** button
3. **Click "Show" (👁️)** button untuk buka dialog
4. **Double-click** pada cell untuk edit (Code, Location, atau Delivery)
5. **Edit data** dan tekan Enter
6. **Click "Save Changes"** button
7. **Refresh page** - data sepatutnya kekal (saved to database)

---

## 📡 API Endpoints:

### GET /api/routes
Fetch all routes dengan locations

### PUT /api/routes  
Update multiple routes
```json
{
  "routes": [
    { "id": 1, "route": "KL 7", "shift": "PM", "warehouse": "3AVK04" }
  ]
}
```

### GET /api/locations
Fetch all locations

### PUT /api/locations
Update multiple locations
```json
{
  "locations": [
    { "id": 1, "no": 1, "code": "34", "location": "Wisma Cimb", "delivery": "Daily", "powerMode": "Daily", "images": [] }
  ]
}
```

### DELETE /api/locations
Delete a location
```json
{
  "id": 1
}
```

---

## 🔍 Troubleshooting:

### Jika API Error:
1. Check `.env` file - pastikan `DATABASE_URL` betul
2. Run `npm run db:push` untuk push schema
3. Check console untuk error messages

### Jika Data Tak Save:
1. Open browser DevTools → Network tab
2. Check API calls - pastikan status 200
3. Check Console untuk error messages
4. Verify database connection

### Jika Fallback ke Dummy Data:
- API call failed, check backend/database connection
- Check browser console untuk error details

---

## 🚀 Deploy to Vercel:

Bila deploy ke Vercel, pastikan:
1. Environment variable `DATABASE_URL` ada dalam Vercel settings
2. Vercel akan auto run `npx prisma generate` during build
3. API routes akan automatically available di `/api/*`

```bash
vercel --prod
```

---

## ✨ Features Sekarang:

- ✅ Double-click edit cells
- ✅ Save changes to database  
- ✅ Load data from database
- ✅ Delete rows
- ✅ Add new rows
- ✅ Reorder rows (drag & drop)
- ✅ Custom sort order
- ✅ Unsaved changes detection
- ✅ Auto-reload data from database
