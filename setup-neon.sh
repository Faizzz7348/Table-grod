#!/bin/bash

# Neon Database Setup Script
# Run this after setting up your Neon database

echo "🚀 Table-grod Neon Database Setup"
echo "=================================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found!"
    echo "📝 Creating .env from .env.example..."
    cp .env.example .env
    echo "✅ .env file created"
    echo ""
    echo "📌 Please update .env with your Neon DATABASE_URL:"
    echo "   DATABASE_URL=\"postgresql://user:pass@host.neon.tech/db?sslmode=require\""
    echo ""
    echo "Get it from: https://console.neon.tech"
    echo ""
    read -p "Press Enter after updating .env file..."
fi

# Check if DATABASE_URL is set
if grep -q "localhost:5432" .env; then
    echo "⚠️  DATABASE_URL still using localhost!"
    echo "📝 Please update .env with your Neon connection string"
    exit 1
fi

echo "1️⃣  Installing dependencies..."
npm install

echo ""
echo "2️⃣  Generating Prisma Client..."
npx prisma generate

echo ""
echo "3️⃣  Running database migration..."
npx prisma db push

echo ""
echo "4️⃣  Seeding initial data (optional)..."
read -p "Do you want to seed sample data? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    npx prisma db seed
    echo "✅ Database seeded with sample data"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo "   1. Start dev server: npm run dev"
echo "   2. Open: http://localhost:5173"
echo "   3. Test: Edit mode → Edit description → Save"
echo ""
echo "📚 Full guide: docs/NEON_DATABASE_SETUP.md"
