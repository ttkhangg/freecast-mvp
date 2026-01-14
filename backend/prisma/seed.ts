import { PrismaClient, Role, CampaignStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Seeding...');

  // 1. Hash Password
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash('password123', salt);

  // 2. Create Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@freecast.com' },
    update: {},
    create: {
      email: 'admin@freecast.com',
      password,
      fullName: 'Super Admin',
      role: Role.ADMIN, // Dùng Enum
      isEmailVerified: true,
    },
  });
  console.log(`Created Admin: ${admin.email}`);

  // 3. Create Brand
  const brand = await prisma.user.upsert({
    where: { email: 'brand@tesla.com' },
    update: {},
    create: {
      email: 'brand@tesla.com',
      password,
      fullName: 'Tesla Inc.',
      role: Role.BRAND, // Dùng Enum
      bio: 'We build cars and robots.',
      isEmailVerified: true,
    },
  });
  console.log(`Created Brand: ${brand.email}`);

  // 4. Create KOL
  const kol = await prisma.user.upsert({
    where: { email: 'kol@sontung.com' },
    update: {},
    create: {
      email: 'kol@sontung.com',
      password,
      fullName: 'Son Tung MTP',
      role: Role.KOL, // Dùng Enum
      bio: 'Sky oi say oh yeah!',
      isEmailVerified: true,
    },
  });
  console.log(`Created KOL: ${kol.email}`);

  // 5. Create Campaign
  const campaign = await prisma.campaign.create({
    data: {
      title: 'Review Tesla Cybertruck',
      description: 'Need a cool KOL to drive our new truck.',
      budget: 10000,
      deadline: new Date('2026-12-31'),
      status: CampaignStatus.OPEN, // Dùng Enum
      brandId: brand.id,
    },
  });
  console.log(`Created Campaign: ${campaign.title}`);

  console.log('✅ Seeding Finished!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });