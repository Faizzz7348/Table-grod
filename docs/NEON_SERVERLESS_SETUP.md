# 🚀 Neon Serverless Driver Setup Guide

## ✅ What Changed

Removed Prisma ORM, now using **Neon Serverless Driver** (@neondatabase/serverless) untuk direct SQL queries.

**Benefits:**
- ✅ Lighter weight (no ORM overhead)
- ✅ Faster performance
- ✅ Better for serverless functions (Vercel)
- ✅ Direct control over SQL
- ❌ Manual schema management (no migrations)
- ❌ Need to write raw SQL

---

## 📦 Installation

```bash
# Remove Prisma
npm uninstall @prisma/client prisma

# Install Neon serverless driver
npm install @neondatabase/serverless
```

---

## 🔧 Updated API Files

### **api/routes.js**
```javascript
import { sql } from '@neondatabase/serverless';

export default async function handler(req, res) {
  // CORS setup...
  
  if (req.method === 'GET') {
    // Get all routes with locations
    const routes = await sql`
      SELECT r.id, r.route, r.shift, r.warehouse, r.description,
             json_agg(json_build_object(...)) FILTER (WHERE l.id IS NOT NULL) as locations
      FROM route r
      LEFT JOIN location l ON r.id = l.route_id
      GROUP BY r.id
      ORDER BY r.id ASC
    `;
    
    return res.status(200).json(routes);
  }
  
  if (req.method === 'POST') {
    const { route, shift, warehouse, description } = req.body;
    
    const result = await sql`
      INSERT INTO route (route, shift, warehouse, description)
      VALUES (${route}, ${shift}, ${warehouse}, ${description || null})
      RETURNING id, route, shift, warehouse, description
    `;
    
    return res.status(201).json(result[0]);
  }
  // ... more methods
}
```

### **api/locations.js**
```javascript
import { sql } from '@neondatabase/serverless';

export default async function handler(req, res) {
  // CORS setup...
  
  if (req.method === 'GET') {
    const { routeId } = req.query;
    
    let locations;
    if (routeId) {
      locations = await sql`
        SELECT id, no, code, location, delivery, power_mode as powerMode,
               images, route_id as routeId, latitude, longitude, address
        FROM location
        WHERE route_id = ${parseInt(routeId)}
        ORDER BY no ASC
      `;
    } else {
      locations = await sql`
        SELECT id, no, code, location, delivery, power_mode as powerMode,
               images, route_id as routeId, latitude, longitude, address
        FROM location
        ORDER BY no ASC
      `;
    }
    
    return res.status(200).json(locations);
  }
  // ... more methods
}
```

### **api/upload.js**
- No changes needed (doesn't use Prisma)

---

## 📊 Database Schema Required

Make sure your Neon database has these tables:

### **route table**
```sql
CREATE TABLE route (
  id SERIAL PRIMARY KEY,
  route VARCHAR(255),
  shift VARCHAR(255),
  warehouse VARCHAR(255),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **location table**
```sql
CREATE TABLE location (
  id SERIAL PRIMARY KEY,
  no INTEGER,
  code VARCHAR(255),
  location VARCHAR(255),
  delivery VARCHAR(255),
  power_mode VARCHAR(255),
  images JSONB DEFAULT '[]',
  route_id INTEGER REFERENCES route(id),
  latitude FLOAT,
  longitude FLOAT,
  address TEXT,
  description TEXT,
  website_link VARCHAR(255),
  qr_code_image_url VARCHAR(255),
  qr_code_destination_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## ⚙️ Environment Setup

### **Local Development (.env)**
```
DATABASE_URL=postgresql://user:password@ep-xxx.neon.tech/database_name?sslmode=require
VITE_API_URL=/api
```

### **Production (Vercel)**
1. Go: https://vercel.com/dashboard
2. Select project → Settings → Environment Variables
3. Add:
   ```
   DATABASE_URL=postgresql://user:password@ep-xxx.neon.tech/database_name?sslmode=require
   VITE_API_URL=/api
   BLOB_READ_WRITE_TOKEN=your_token
   ```
4. Redeploy

---

## 🔍 Key Differences: Prisma vs Neon Serverless

### **Prisma**
```javascript
// Prisma way
const users = await prisma.user.findMany({
  where: { age: { gte: 18 } }
});
```

### **Neon Serverless**
```javascript
// Neon way
const users = await sql`
  SELECT * FROM "user" WHERE age >= 18
`;
```

---

## ⚠️ Important Notes

### **SQL Injection Protection**
Neon serverless uses prepared statements automatically:
```javascript
// ✅ Safe - uses prepared statements
await sql`
  SELECT * FROM route WHERE id = ${id}
`;

// ❌ Wrong - string concatenation (don't do this!)
// const query = `SELECT * FROM route WHERE id = ${id}`;
```

### **Camelcase to Snake_case**
Database columns use snake_case, but API returns camelCase:

```sql
-- Database column
power_mode

-- SQL query
SELECT power_mode as powerMode FROM location

-- Response
{ powerMode: "Daily" }
```

---

## 🚀 Deployment Checklist

- [ ] Removed `@prisma/client` from dependencies
- [ ] Installed `@neondatabase/serverless`
- [ ] Updated api/routes.js to use sql``
- [ ] Updated api/locations.js to use sql``
- [ ] DATABASE_URL set in Vercel
- [ ] Database schema created in Neon
- [ ] `npm install` to update packages
- [ ] `npm run build` works
- [ ] Local testing: `npm run dev` works
- [ ] Vercel deployment successful

---

## 📚 Example Queries

### **Create with RETURNING**
```javascript
const result = await sql`
  INSERT INTO route (route, shift, warehouse)
  VALUES (${route}, ${shift}, ${warehouse})
  RETURNING id, route, shift, warehouse
`;
return res.json(result[0]); // Get first (and only) result
```

### **Update with Condition**
```javascript
const result = await sql`
  UPDATE location
  SET name = ${name}, address = ${address}
  WHERE id = ${id}
  RETURNING id
`;
if (result.length === 0) {
  return res.status(404).json({ error: 'Not found' });
}
```

### **Delete and Get Count**
```javascript
const result = await sql`
  DELETE FROM route WHERE id = ${id}
  RETURNING id
`;
if (result.length === 0) {
  return res.status(404).json({ error: 'Route not found' });
}
return res.json({ success: true, deleted: result[0].id });
```

### **Join with Aggregation**
```javascript
const routes = await sql`
  SELECT r.id, r.route,
         COUNT(l.id) as location_count,
         json_agg(json_build_object('id', l.id, 'name', l.location)) as locations
  FROM route r
  LEFT JOIN location l ON r.id = l.route_id
  GROUP BY r.id
  ORDER BY r.id
`;
```

---

## 🆘 Troubleshooting

### **Error: "DATABASE_URL is not set"**
- Check .env file has DATABASE_URL
- Check Vercel env vars set
- Redeploy after setting env vars

### **Error: "Connection refused"**
- Verify DATABASE_URL is correct
- Check network access allowed in Neon settings
- Make sure Vercel IP is whitelisted (if using IP restrictions)

### **Slow queries**
- Add indexes for frequently queried columns
- Use EXPLAIN ANALYZE to check query plans
- Aggregate data at API level, not database level

---

**Updated**: January 5, 2026
**Status**: Ready to use - Neon Serverless Driver fully integrated
