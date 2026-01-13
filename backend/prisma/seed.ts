import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Đang khởi tạo dữ liệu mẫu...');

  // 1. Tạo Brand User & Profile
  const brandPassword = await bcrypt.hash('123456', 10);
  const brandUser = await prisma.user.upsert({
    where: { email: 'brand@demo.com' },
    update: {},
    create: {
      email: 'brand@demo.com',
      password: brandPassword,
      role: 'BRAND',
      brandProfile: {
        create: {
          companyName: 'Samsung Vina',
          industry: 'Technology',
          description: 'Nhà sản xuất thiết bị điện tử hàng đầu.',
          website: 'https://samsung.com',
          address: 'Bitexco Financial Tower, Q1, TP.HCM',
          phone: '1800588889'
        }
      }
    },
    include: { brandProfile: true } // Để lấy ID profile
  });

  console.log(`✅ Đã tạo Brand: ${brandUser.email}`);

  // 2. Tạo KOL User & Profile
  const kolPassword = await bcrypt.hash('123456', 10);
  const kolUser = await prisma.user.upsert({
    where: { email: 'kol@demo.com' },
    update: {},
    create: {
      email: 'kol@demo.com',
      password: kolPassword,
      role: 'KOL',
      kolProfile: {
        create: {
          fullName: 'Vinh Vật Vờ',
          bio: 'Reviewer công nghệ số 1 Việt Nam',
          phone: '0909000111',
          address: 'Cầu Giấy, Hà Nội',
          bankName: 'Techcombank',
          bankAccount: '190333888999'
        }
      }
    }
  });

  console.log(`✅ Đã tạo KOL: ${kolUser.email}`);

  // 3. Tạo Campaign (Gắn với Brand trên)
  if (brandUser.brandProfile) {
    const campaign = await prisma.campaign.create({
      data: {
        title: 'Review Galaxy S24 Ultra - Quyền năng AI',
        description: 'Trải nghiệm các tính năng AI mới nhất trên Galaxy S24 Ultra. Yêu cầu quay video dọc, thời lượng > 1 phút.',
        requirements: '- Quay video rõ nét\n- Nhắc đến tính năng Note Assist\n- Hashtag #GalaxyS24 #AI',
        productName: 'Samsung Galaxy S24 Ultra',
        productValue: '30.000.000 VNĐ',
        platform: 'TikTok',
        status: 'ACTIVE',
        deadline: new Date('2024-12-31'),
        brandId: brandUser.brandProfile.id
      }
    });
    console.log(`✅ Đã tạo Campaign: ${campaign.title}`);
  }

  console.log('🏁 Hoàn tất seed dữ liệu!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });