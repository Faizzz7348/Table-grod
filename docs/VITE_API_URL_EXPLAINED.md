# 🔌 VITE_API_URL - Mana Dapat & Kenapa Penting

## 📍 Ringkas

**VITE_API_URL** adalah environment variable yang tell app di mana API server berada.

```
Local Development:  VITE_API_URL=/api  (uses http://localhost:5173/api)
Production/Vercel:  VITE_API_URL=/api  (uses https://yourdomain.com/api)
```

---

## 🔍 Di Mana Source-nya?

### **1. File Source: src/service/CustomerService.js**

```javascript
// Line 1 - Di sini API URL didefine:
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
```

**Penjelasan**:
- `import.meta.env.VITE_API_URL` = Get dari .env file
- `|| '/api'` = Default ke `/api` kalau env var tidak set

### **2. Env File Tempat Declare**

**Development** (Local):
```
File: .env
VITE_API_URL=/api
```

**Production** (Vercel):
```
File: Vercel Dashboard → Settings → Environment Variables
Name: VITE_API_URL
Value: /api
```

---

## ⚙️ Bagaimana App Pakai VITE_API_URL?

### **Step 1: Vite Read Environment Variable**

```javascript
// vite.config.js automatically exposes VITE_* variables
import.meta.env.VITE_API_URL  // Gets value from .env
```

### **Step 2: App Use It untuk API Calls**

```javascript
// src/service/CustomerService.js
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Kemudian pakai untuk fetch:
fetch(`${API_BASE_URL}/routes`)   // Jadi: /api/routes
fetch(`${API_BASE_URL}/locations`) // Jadi: /api/locations
fetch(`${API_BASE_URL}/upload`)   // Jadi: /api/upload
```

### **Step 3: Server Receive Request**

```
Browser: GET http://localhost:5173/api/routes
         ↓
Vite Dev Server detects /api prefix → forwards to actual API server
         ↓
API Endpoint (api/routes.js) processes request
         ↓
Returns JSON response
```

---

## 🌍 Environment Variable Hierarchy

### **Kalau macam-macam:**

```javascript
// Vite akan pakai dalam order ini:

1. Process Environment Variable (set explicitly)
   export VITE_API_URL=/custom
   
2. .env.local (if exists)
   VITE_API_URL=/custom
   
3. .env file
   VITE_API_URL=/api
   
4. Default fallback in code
   || '/api'
```

### **Check Mana yang Active:**

```javascript
// Put this in browser console:
console.log(import.meta.env.VITE_API_URL)

// Output contoh:
// Local: "/api"
// Vercel: "/api"
```

---

## 🔧 Setup untuk Different Environments

### **LOCAL DEVELOPMENT**

Create `.env` file (gitignored, only for local):
```
VITE_API_URL=/api
```

Run dev:
```bash
npm run dev
```

API requests go to: `http://localhost:5173/api`

---

### **PRODUCTION (VERCEL)**

Set in Vercel Dashboard:

1. Go: https://vercel.com/dashboard
2. Select your project
3. Click: **Settings** → **Environment Variables**
4. Add:
   ```
   Name: VITE_API_URL
   Value: /api
   ```
5. Redeploy

API requests go to: `https://yourdomain.vercel.app/api`

---

## 🛠️ Actual Flow: Local vs Vercel

### **LOCAL**

```
App (localhost:5173)
  ↓
fetch('/api/routes')  ← uses VITE_API_URL=/api
  ↓
Vite Dev Server
  ↓
Proxy forwards to: http://localhost:3000/api/routes
  ↓
Your actual API server (Node.js/Vercel Functions)
  ↓
Database query
  ↓
Returns JSON
```

### **VERCEL (Production)**

```
App (yourdomain.vercel.app)
  ↓
fetch('/api/routes')  ← uses VITE_API_URL=/api
  ↓
Vercel sees /api prefix
  ↓
Forwards to: /api/routes (Vercel Serverless Function)
  ↓
api/routes.js handles request
  ↓
Database query (Neon PostgreSQL)
  ↓
Returns JSON
```

---

## ⚠️ Common Mistakes

### ❌ WRONG: Hardcode full URL

```javascript
// ❌ Don't do this!
const API_BASE_URL = 'http://localhost:3000/api';
```

**Problem**: Breaks in production!

### ✅ CORRECT: Use environment variable

```javascript
// ✅ Do this!
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
```

**Why**: Works everywhere - auto adjusts per environment

---

### ❌ WRONG: Forget to set in Vercel

```
App deployed but:
- VITE_API_URL not set in Vercel env vars
- App uses default /api
- But API config wrong
- Result: Blank page
```

### ✅ CORRECT: Always set in Vercel

1. Set VITE_API_URL=/api in Vercel
2. Set DATABASE_URL in Vercel
3. Redeploy
4. Check browser console for errors

---

## 📊 Current Setup in Your App

### **Your Config:**

**File: src/service/CustomerService.js**
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
```

**This means:**
- Default: `/api`
- Can override with env var: `VITE_API_URL=/custom`

**Your API Endpoints:**
- `GET /api/routes` → fetch all routes
- `GET /api/locations/:routeId` → fetch locations for route
- `POST /api/locations` → create location
- `PUT /api/locations/:id` → update location
- `DELETE /api/locations/:id` → delete location
- `POST /api/upload` → upload image

---

## 🔌 Where API Requests Happen

**Main file**: src/service/CustomerService.js

```javascript
// Example: Fetch routes
static async getRoutes() {
    const cacheKey = 'routes';
    const url = `${API_BASE_URL}/routes`;  // ← Uses VITE_API_URL
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        // ... cache & return data
    }
}

// Example: Upload image
async uploadImage(file) {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData
    });
    // ... handle response
}
```

---

## ✅ Quick Checklist

- [ ] `.env` file has `VITE_API_URL=/api` (for local dev)
- [ ] Vercel env vars has `VITE_API_URL=/api` (for production)
- [ ] API folder structure correct: `api/routes.js`, `api/locations.js`, etc
- [ ] Vercel rewrites configured in `vercel.json` to forward /api requests
- [ ] `npm run dev` works locally with API calls
- [ ] `npm run preview` works with local build
- [ ] Vercel deployment successful with no API errors

---

## 🆘 Troubleshooting

### **Q: API calls failing with 404?**
**A**: Check Vercel rewrites in vercel.json:
```json
"rewrites": [
  {
    "source": "/api/(.*)",
    "destination": "/api/$1"
  }
]
```

### **Q: VITE_API_URL not working?**
**A**: Must prefix with `VITE_` for Vite to expose it:
```
✅ VITE_API_URL=/api
❌ API_URL=/api  (won't work, Vite won't expose it)
```

### **Q: App works locally but not on Vercel?**
**A**: 
1. Check Vercel env vars set
2. Check API endpoints exist as Vercel functions
3. Check database connection (DATABASE_URL)
4. Check browser console for actual error

---

**Summary**: VITE_API_URL is simple variable that tells app where API lives. Set it in .env locally, set it in Vercel for production. Done! 🎉

**Updated**: January 5, 2026
