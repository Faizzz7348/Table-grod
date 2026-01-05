import { sql } from '@neondatabase/serverless';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  
  // Add caching headers for GET requests
  if (req.method === 'GET') {
    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');
  }

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Dummy data fallback when database is not configured
  const getDummyRoutes = () => [
    { id: 1, route: 'KL 7', shift: 'PM', warehouse: '3AVK04', locations: [] },
    { id: 2, route: 'KL 8', shift: 'AM', warehouse: '3AVK05', locations: [] },
    { id: 3, route: 'SG 1', shift: 'PM', warehouse: '2BVK01', locations: [] }
  ];

  // Check if database is configured
  if (!process.env.DATABASE_URL) {
    console.warn('⚠️ Database not configured, using dummy data');
    
    if (req.method === 'GET') {
      return res.status(200).json(getDummyRoutes());
    }
    
    // For write operations, return success but don't persist
    return res.status(200).json({ 
      success: true,
      message: 'Demo mode: Changes not persisted (database not configured)',
      demoMode: true
    });
  }

  try {
    if (req.method === 'GET') {
      // Get all routes with their locations
      const routes = await sql`
        SELECT r.id, r.route, r.shift, r.warehouse, r.description,
               json_agg(json_build_object(
                 'id', l.id, 'name', l.name, 'address', l.address, 
                 'latitude', l.latitude, 'longitude', l.longitude,
                 'routeId', l.route_id, 'description', l.description
               )) FILTER (WHERE l.id IS NOT NULL) as locations
        FROM route r
        LEFT JOIN location l ON r.id = l.route_id
        GROUP BY r.id, r.route, r.shift, r.warehouse, r.description
        ORDER BY r.id ASC
      `;
      
      return res.status(200).json(routes);
    }

    if (req.method === 'PUT') {
      // Update multiple routes
      const { routes } = req.body;

      if (!routes || !Array.isArray(routes)) {
        return res.status(400).json({ error: 'Invalid data format' });
      }

      // Separate new routes (timestamp IDs > 1000000000000) from existing ones
      const newRoutes = routes.filter(r => r.id > 1000000000000);
      const existingRoutes = routes.filter(r => r.id <= 1000000000000);

      const results = {
        created: 0,
        updated: 0
      };

      // Create new routes
      if (newRoutes.length > 0) {
        for (const route of newRoutes) {
          await sql`
            INSERT INTO route (route, shift, warehouse, description)
            VALUES (${route.route || ''}, ${route.shift || ''}, ${route.warehouse || ''}, ${route.description || null})
          `;
        }
        results.created = newRoutes.length;
      }

      // Update existing routes
      if (existingRoutes.length > 0) {
        for (const route of existingRoutes) {
          const result = await sql`
            UPDATE route 
            SET route = ${route.route}, 
                shift = ${route.shift}, 
                warehouse = ${route.warehouse},
                description = ${route.description || null}
            WHERE id = ${route.id}
            RETURNING id
          `;
          if (result.length > 0) results.updated++;
        }
      }

      return res.status(200).json({ 
        success: true, 
        message: 'Routes saved successfully',
        created: results.created,
        updated: results.updated,
        total: routes.length
      });
    }

    if (req.method === 'POST') {
      // Create new route
      const { route, shift, warehouse, description } = req.body;

      const result = await sql`
        INSERT INTO route (route, shift, warehouse, description)
        VALUES (${route || ''}, ${shift || ''}, ${warehouse || ''}, ${description || null})
        RETURNING id, route, shift, warehouse, description
      `;

      return res.status(201).json(result[0]);
    }

    if (req.method === 'DELETE') {
      // Delete route
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ error: 'Route ID is required' });
      }

      const result = await sql`
        DELETE FROM route WHERE id = ${parseInt(id)}
        RETURNING id
      `;

      if (result.length === 0) {
        return res.status(404).json({ error: 'Route not found' });
      }

      return res.status(200).json({ 
        success: true, 
        message: 'Route deleted successfully' 
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message
    });
  }
}
