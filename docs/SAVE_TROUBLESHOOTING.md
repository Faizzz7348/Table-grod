# 🔧 Save Feature Troubleshooting Guide

## ✅ Perubahan Yang Telah Dibuat:

### 1. **Fixed New Row ID Generation**
- ✅ Changed from string `new_${Date.now()}` to numeric `Date.now()`
- ✅ Ensures ID > 1000000000000 (13 digits) for API detection
- ✅ Consistent with API handler in `/api/routes.js` and `/api/locations.js`

### 2. **Improved Logging**
- ✅ Added console logs untuk track save operations
- ✅ Shows created vs updated counts
- ✅ Better error messages dengan details

### 3. **Fixed Filter Logic**
- ✅ Updated CustomerService to use `id > 1000000000000` (13 digits)
- ✅ Matches Date.now() output (~1734953400000)
- ✅ Properly separates new rows from existing rows

---

## 🧪 Testing Steps:

### **Test 1: Add New Location**
1. ✅ Click "Edit Mode" button
2. ✅ Click "Show" (👁️) pada any route
3. ✅ Click "Add New Row" dalam dialog
4. ✅ Fill in: Code, Location, Delivery
5. ✅ Click "Save Changes"
6. ✅ Check console - should show:
   ```
   💾 Starting save operation...
   📊 Routes to save: X [...]
   📍 Locations to save: Y [...]
   ✅ Locations saved successfully to database: {created: 1, updated: X}
   ```

### **Test 2: Edit Existing Location**
1. ✅ Double-click pada cell untuk edit
2. ✅ Change value
3. ✅ Press Enter
4. ✅ Click "Save Changes"
5. ✅ Check console - should show `updated: 1`

### **Test 3: Refresh Page**
1. ✅ Refresh browser (Ctrl+R / Cmd+R)
2. ✅ Data should persist (loaded from database)

---

## 🐛 Common Issues & Solutions:

### ❌ Issue: "Database not configured"
**Cause:** `DATABASE_URL` tidak di-set dalam Vercel
**Solution:**
1. Go to Vercel Dashboard → Project → Settings → Environment Variables
2. Add: `DATABASE_URL=postgresql://...`
3. Redeploy

### ❌ Issue: New rows not saving
**Cause:** ID format tidak match dengan API filter
**Solution:** ✅ Already fixed! New rows now use numeric timestamp ID

### ❌ Issue: Data hilang selepas refresh (Development Mode)
**Cause:** Using localStorage in dev mode
**Solution:** 
- Development mode uses localStorage - data kekal in browser
- Production mode uses database - data permanent

### ❌ Issue: API returns 500 error
**Cause:** Prisma client not generated or database migration not run
**Solution:**
```bash
# In Vercel, build command automatically runs:
npm run build && npx prisma generate

# If testing locally:
npm run db:push
npm run db:generate
npm run db:seed
```

### ❌ Issue: CORS error
**Cause:** API tidak allow requests dari frontend
**Solution:** ✅ Already handled in `/api/routes.js` and `/api/locations.js`

---

## 📊 How Detection Works:

### **New Row Detection:**
```javascript
// FlexibleScrollDemo.jsx - Generate temp ID
const tempId = Date.now(); // Example: 1734953400000 (13 digits)

// CustomerService.js - Filter new rows
const newRoutes = routes.filter(route => route.id > 1000000000000);

// API routes.js - Separate new from existing
const newRoutes = routes.filter(r => r.id > 1000000000000);
```

### **ID Ranges:**
- ✅ Database IDs: 1, 2, 3, ... (auto-increment)
- ✅ Temp IDs: 1734953400000, 1734953401234, ... (Date.now())
- ✅ Threshold: 1000000000000 (13 zeros)

---

## 🔍 Debug Checklist:

When save is not working, check console for:

1. **Request Details:**
   ```
   💾 Starting save operation...
   📊 Routes to save: X [...]
   📍 Locations to save: Y [...]
   ```

2. **API Calls:**
   ```
   📦 Saving routes to database: [...]
   ➕ New routes to create: X [...]
   ✏️ Existing routes to update: Y [...]
   ```

3. **Success Messages:**
   ```
   ✅ Routes saved successfully to database
   ✅ Locations saved successfully to database: {created: X, updated: Y}
   ```

4. **Error Messages (if any):**
   ```
   ❌ Error saving routes: Error message here
   ❌ Failed to save locations: 500 Internal Server Error
   ```

---

## 🎯 Expected Behavior:

### **In Development Mode (`npm run dev`):**
- ✅ Data saved to `localStorage`
- ✅ Data persists in browser only
- ✅ Not shared between devices/browsers
- ✅ Alert shows "💾 Using localStorage"

### **In Production Mode (Vercel):**
- ✅ Data saved to PostgreSQL database
- ✅ Data persists permanently
- ✅ Shared across all users
- ✅ Alert shows "🗄️ Saved to Database"

---

## 📝 Vercel Deployment Checklist:

1. ✅ **Environment Variables Set:**
   - `DATABASE_URL` - PostgreSQL connection string

2. ✅ **Build Command:**
   ```
   npm run build && npx prisma generate
   ```

3. ✅ **Database Schema Pushed:**
   ```bash
   npx prisma db push
   ```

4. ✅ **Seed Data (Optional):**
   ```bash
   npm run db:seed
   ```

5. ✅ **Vercel Functions Configured:**
   - `/api/routes.js` - Handle routes CRUD
   - `/api/locations.js` - Handle locations CRUD

---

## 🆘 Still Not Working?

Check browser console (F12) dan share:
1. ✅ All console.log messages
2. ✅ Network tab - API request/response
3. ✅ Any error messages

Atau test dengan curl:
```bash
# Test GET routes
curl https://your-app.vercel.app/api/routes

# Test CREATE route
curl -X POST https://your-app.vercel.app/api/routes \
  -H "Content-Type: application/json" \
  -d '{"route":"Test","shift":"AM","warehouse":"TEST"}'
```

---

Last Updated: 2025-12-23
