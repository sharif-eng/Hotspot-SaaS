#!/bin/bash

echo "🚀 Sharif Digital Hub - WiFi Billing System Setup"
echo "================================================"

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install
cd api && pnpm install && cd ..
cd dashboard && pnpm install && cd ..

# Setup database
echo "🗄️ Setting up database..."
cd api
pnpm prisma generate
pnpm prisma db push

# Create admin user
echo "👤 Creating admin user..."
node -e "
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function createAdmin() {
  const hash = await bcrypt.hash('admin123', 12);
  await prisma.user.create({
    data: {
      email: 'admin@sharifdigitalhub.com',
      passwordHash: hash,
      role: 'SUPER_ADMIN',
      profile: {
        create: {
          fullName: 'System Administrator'
        }
      }
    }
  });
  console.log('✅ Admin user created: admin@sharifdigitalhub.com / admin123');
}
createAdmin().catch(console.error).finally(() => prisma.\$disconnect());
"

cd ..
echo "✅ Setup complete!"
echo ""
echo "🔧 Next steps:"
echo "1. Update api/.env with your API keys"
echo "2. Run: pnpm run dev"
echo "3. Visit: http://localhost:5173"
echo "4. Login: admin@sharifdigitalhub.com / admin123"