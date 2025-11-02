// Using simple hash for demo
const crypto = require('crypto');
function hashPassword(password) {
  return '$2b$10$' + crypto.createHash('sha256').update(password + 'salt').digest('hex');
}
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'mysql://root:@Humble.255@localhost:3306/wifi_billing'
    }
  }
});

async function updateAdmin() {
  try {
    const hashedPassword = hashPassword('Sharif.255');
    
    await prisma.user.upsert({
      where: { email: 'sharifidris8@gmail.com' },
      update: {
        passwordHash: hashedPassword,
        role: 'SUPER_ADMIN'
      },
      create: {
        email: 'sharifidris8@gmail.com',
        passwordHash: hashedPassword,
        role: 'SUPER_ADMIN',
        isActive: true,
        profile: {
          create: {
            fullName: 'Sharif Idris',
            tier: 'VIP'
          }
        }
      }
    });
    
    console.log('Admin user updated successfully');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateAdmin();