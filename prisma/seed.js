import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.location.deleteMany();
  await prisma.route.deleteMany();

  // Create routes
  const route1 = await prisma.route.create({
    data: {
      route: 'KL 7',
      shift: 'PM',
      warehouse: '3AVK04'
    }
  });

  const route2 = await prisma.route.create({
    data: {
      route: 'KL 8',
      shift: 'AM',
      warehouse: '3AVK05'
    }
  });

  const route3 = await prisma.route.create({
    data: {
      route: 'SG 1',
      shift: 'PM',
      warehouse: '2BVK01'
    }
  });

  // Create locations for route 1
  await prisma.location.createMany({
    data: [
      {
        no: 1,
        code: '34',
        location: 'Wisma Cimb',
        delivery: 'Daily',
        powerMode: 'Daily',
        images: ['https://picsum.photos/200/150?random=1', 'https://picsum.photos/200/150?random=2'],
        routeId: route1.id
      },
      {
        no: 2,
        code: '42',
        location: 'Plaza Rakyat',
        delivery: 'Weekly',
        powerMode: 'Alt 1',
        images: ['https://picsum.photos/200/150?random=3'],
        routeId: route1.id
      },
      {
        no: 3,
        code: '51',
        location: 'KLCC Tower',
        delivery: 'Daily',
        powerMode: 'Alt 2',
        images: ['https://picsum.photos/200/150?random=4', 'https://picsum.photos/200/150?random=5'],
        routeId: route1.id
      },
      {
        no: 4,
        code: '67',
        location: 'Menara TM',
        delivery: 'Monthly',
        powerMode: 'Weekday',
        images: ['https://picsum.photos/200/150?random=6'],
        routeId: route1.id
      },
      {
        no: 5,
        code: '89',
        location: 'Pavilion KL',
        delivery: 'Daily',
        powerMode: 'Daily',
        images: ['https://picsum.photos/200/150?random=7', 'https://picsum.photos/200/150?random=8'],
        routeId: route1.id
      },
      {
        no: 6,
        code: '23',
        location: 'Suria KLCC',
        delivery: 'Weekly',
        powerMode: 'Alt 1',
        images: ['https://picsum.photos/200/150?random=9'],
        routeId: route1.id
      },
      {
        no: 7,
        code: '76',
        location: 'Mid Valley',
        delivery: 'Daily',
        powerMode: 'Alt 2',
        images: ['https://picsum.photos/200/150?random=10'],
        routeId: route1.id
      },
      {
        no: 8,
        code: '94',
        location: 'Bangsar Village',
        delivery: 'Weekly',
        powerMode: 'Weekday',
        images: ['https://picsum.photos/200/150?random=11', 'https://picsum.photos/200/150?random=12'],
        routeId: route1.id
      },
      {
        no: 9,
        code: '12',
        location: 'One Utama',
        delivery: 'Daily',
        powerMode: 'Daily',
        images: ['https://picsum.photos/200/150?random=13'],
        routeId: route1.id
      },
      {
        no: 10,
        code: '56',
        location: 'Sunway Pyramid',
        delivery: 'Weekly',
        powerMode: 'Alt 1',
        images: ['https://picsum.photos/200/150?random=14', 'https://picsum.photos/200/150?random=15'],
        routeId: route1.id
      }
    ]
  });

  // Create frozen row - QL Kitchen (independent location, no route)
  await prisma.location.create({
    data: {
      no: 0,
      code: 'QLK',
      location: 'QL Kitchen',
      delivery: 'Available',
      powerMode: 'Daily',
      images: [],
      latitude: 3.0738,
      longitude: 101.5183,
      address: 'QL Kitchen, Shah Alam',
      description: 'Main kitchen location for QL Resources',
      routeId: null // Independent location, not assigned to any route
    }
  });

  console.log('✅ Database seeded successfully!');
  console.log('✅ Frozen row (QL Kitchen) created with code: QLK');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
