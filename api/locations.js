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
      // Get all locations
      const locations = await prisma.location.findMany({
        orderBy: {
          no: 'asc'
        }
      });
      
      return res.status(200).json(locations);
    }

    if (req.method === 'PUT') {
      // Update multiple locations
      const { locations } = req.body;

      if (!locations || !Array.isArray(locations)) {
        return res.status(400).json({ error: 'Invalid data format' });
      }

      // Update each location
      const updates = locations.map(location => 
        prisma.location.update({
          where: { id: location.id },
          data: {
            no: location.no,
            code: location.code,
            location: location.location,
            delivery: location.delivery,
            powerMode: location.powerMode,
            images: location.images || [],
            latitude: location.latitude !== undefined ? location.latitude : null,
            longitude: location.longitude !== undefined ? location.longitude : null,
            address: location.address !== undefined ? location.address : null
          }
        })
      );

      await Promise.all(updates);

      return res.status(200).json({ 
        success: true, 
        message: 'Locations updated successfully',
        count: locations.length
      });
    }

    if (req.method === 'POST') {
      // Create new location
      const { no, code, location, delivery, powerMode, images, routeId, latitude, longitude, address } = req.body;

      const newLocation = await prisma.location.create({
        data: {
          no: no || 0,
          code: code || '',
          location: location || '',
          delivery: delivery || 'Daily',
          powerMode: powerMode || 'Daily',
          images: images || [],
          routeId: routeId || null,
          latitude: latitude !== undefined ? latitude : null,
          longitude: longitude !== undefined ? longitude : null,
          address: address !== undefined ? address : null
        }
      });

      return res.status(201).json(newLocation);
    }

    if (req.method === 'DELETE') {
      // Delete location
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ error: 'Location ID is required' });
      }

      await prisma.location.delete({
        where: { id: parseInt(id) }
      });

      return res.status(200).json({ 
        success: true, 
        message: 'Location deleted successfully' 
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  } finally {
    await prisma.$disconnect();
  }
}
