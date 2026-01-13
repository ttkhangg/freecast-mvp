"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Đang khởi tạo dữ liệu mẫu...');
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
        include: { brandProfile: true }
    });
    console.log(`✅ Đã tạo Brand: ${brandUser.email}`);
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
//# sourceMappingURL=seed.js.map