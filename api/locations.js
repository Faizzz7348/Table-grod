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
      // Get all locations or filter by routeId
      const { routeId } = req.query;
      
      const whereClause = routeId ? { routeId: parseInt(routeId) } : {};
      
      const locations = await prisma.location.findMany({
        where: whereClause,
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

      // Separate new locations (timestamp IDs > 1000000000000) from existing ones
      const newLocations = locations.filter(loc => loc.id > 1000000000000); // Timestamp IDs
      const existingLocations = locations.filter(loc => loc.id <= 1000000000000); // Database IDs

      const results = {
        created: 0,
        updated: 0
      };

      // Create new locations
      if (newLocations.length > 0) {
        const createPromises = newLocations.map(location =>
          prisma.location.create({
            data: {
              no: location.no,
              code: location.code,
              location: location.location,
              delivery: location.delivery,
              powerMode: location.powerMode,
              images: location.images || [],
              routeId: location.routeId || null,
              latitude: location.latitude !== undefined ? location.latitude : null,
              longitude: location.longitude !== undefined ? location.longitude : null,
              address: location.address !== undefined ? location.address : null,
              description: location.description || null,
              websiteLink: location.websiteLink || null,
              qrCodeImageUrl: location.qrCodeImageUrl || null,
              qrCodeDestinationUrl: location.qrCodeDestinationUrl || null
            }
          })
        );
        await Promise.all(createPromises);
        results.created = newLocations.length;
      }

      // Update existing locations
      if (existingLocations.length > 0) {
        const updatePromises = existingLocations.map(location =>
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
              address: location.address !== undefined ? location.address : null,
              description: location.description || null,
              websiteLink: location.websiteLink || null,
              qrCodeImageUrl: location.qrCodeImageUrl || null,
              qrCodeDestinationUrl: location.qrCodeDestinationUrl || null
            }
          })
        );
        await Promise.all(updatePromises);
        results.updated = existingLocations.length;
      }

      return res.status(200).json({ 
        success: true, 
        message: 'Locations saved successfully',
        created: results.created,
        updated: results.updated,
        total: locations.length
      });
    }

    if (req.method === 'POST') {
      // Create new location
      const { no, code, location, delivery, powerMode, images, routeId, latitude, longitude, address, description } = req.body;

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
          address: address !== undefined ? address : null,
          description: description || null
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
