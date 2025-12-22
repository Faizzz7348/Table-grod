import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Check if database is configured
  if (!process.env.DATABASE_URL) {
    return res.status(500).json({ 
      error: 'Database not configured',
      message: 'Please set up Vercel Postgres database in your project settings'
    });
  }

  try {
    if (req.method === 'GET') {
      // Get all routes
      const routes = await prisma.route.findMany({
        include: {
          locations: true
        },
        orderBy: {
          id: 'asc'
        }
      });
      
      return res.status(200).json(routes);
    }

    if (req.method === 'PUT') {
      // Update multiple routes
      const { routes } = req.body;

      if (!routes || !Array.isArray(routes)) {
        return res.status(400).json({ error: 'Invalid data format' });
      }

      // Separate new routes (timestamp IDs > 1000000000000) from existing ones
      const newRoutes = routes.filter(r => r.id > 1000000000000); // Timestamp IDs
      const existingRoutes = routes.filter(r => r.id <= 1000000000000); // Database IDs

      const results = {
        created: 0,
        updated: 0
      };

      // Create new routes
      if (newRoutes.length > 0) {
        const createPromises = newRoutes.map(route =>
          prisma.route.create({
            data: {
              route: route.route,
              shift: route.shift,
              warehouse: route.warehouse
            }
          })
        );
        await Promise.all(createPromises);
        results.created = newRoutes.length;
      }

      // Update existing routes
      if (existingRoutes.length > 0) {
        const updatePromises = existingRoutes.map(async route => {
          try {
            // Check if route exists first
            const existingRoute = await prisma.route.findUnique({
              where: { id: route.id }
            });

            if (!existingRoute) {
              console.warn(`Route with id ${route.id} not found, skipping`);
              return null;
            }

            return await prisma.route.update({
              where: { id: route.id },
              data: {
                route: route.route,
                shift: route.shift,
                warehouse: route.warehouse
              }
            });
          } catch (err) {
            console.error(`Error updating route ${route.id}:`, err);
            throw err;
          }
        });

        const updateResults = await Promise.all(updatePromises);
        results.updated = updateResults.filter(r => r !== null).length;
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
      const { route, shift, warehouse } = req.body;

      const newRoute = await prisma.route.create({
        data: {
          route: route || '',
          shift: shift || '',
          warehouse: warehouse || ''
        }
      });

      return res.status(201).json(newRoute);
    }

    if (req.method === 'DELETE') {
      // Delete route
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ error: 'Route ID is required' });
      }

      await prisma.route.delete({
        where: { id: parseInt(id) }
      });

      return res.status(200).json({ 
        success: true, 
        message: 'Route deleted successfully' 
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('API Error:', error);
    
    // Handle Prisma specific errors
    if (error.code === 'P2025') {
      return res.status(404).json({ 
        error: 'Record not found',
        details: error.message 
      });
    }
    
    if (error.code === 'P2002') {
      return res.status(409).json({ 
        error: 'Unique constraint violation',
        details: error.message 
      });
    }
    
    if (error.code === 'P2003') {
      return res.status(400).json({ 
        error: 'Foreign key constraint violation',
        details: error.message 
      });
    }
    
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message,
      code: error.code || 'UNKNOWN'
    });
  } finally {
    await prisma.$disconnect();
  }
}
