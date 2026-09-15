import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Purge any existing records
  await prisma.user.deleteMany();

  // Insert seed resources
  await prisma.user.createMany({
    data: [
      { name: 'Alice Johnson', email: 'alice@example.com', role: 'admin' },
      { name: 'Bob Smith', email: 'bob@example.com', role: 'user' },
      { name: 'Charlie Brown', email: 'charlie@example.com', role: 'user' },
    ],
  });

  console.log('✅ Local dev.db database initialized and seeded successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Database seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });