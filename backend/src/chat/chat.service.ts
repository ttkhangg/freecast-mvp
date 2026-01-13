import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  // 1. Lưu tin nhắn mới
  async saveMessage(applicationId: string, senderId: string, content: string) {
    return this.prisma.message.create({
      data: { applicationId, senderId, content },
      include: { 
        sender: { 
          select: { id: true, email: true, role: true, brandProfile: true, kolProfile: true } 
        } 
      }
    });
  }

  // 2. Lấy lịch sử chat của 1 đơn hàng cụ thể
  async getMessages(applicationId: string) {
    return this.prisma.message.findMany({
      where: { applicationId },
      orderBy: { createdAt: 'asc' },
      include: { 
        sender: { 
          select: { id: true, email: true, role: true, brandProfile: true, kolProfile: true } 
        } 
      }
    });
  }

  // 3. (MỚI) Lấy danh sách tất cả cuộc hội thoại của User
  async getConversations(userId: string) {
    // Bước 1: Xác định User là Brand hay KOL
    const user = await this.prisma.user.findUnique({ 
      where: { id: userId }, 
      include: { brandProfile: true, kolProfile: true }
    });

    if (!user) return [];
    
    let whereCondition = {};

    if (user.role === 'BRAND') {
       // Nếu là Brand: Lấy các đơn hàng thuộc Campaign của Brand đó
       if (!user.brandProfile) return [];
       whereCondition = { campaign: { brandId: user.brandProfile.id } };
    } else if (user.role === 'KOL') {
       // Nếu là KOL: Lấy các đơn hàng của chính KOL đó
       if (!user.kolProfile) return [];
       whereCondition = { kolId: user.kolProfile.id };
    } else {
       // Admin hoặc lỗi
       return [];
    }

    // Bước 2: Query database
    return this.prisma.application.findMany({
      where: {
        ...whereCondition,
        // Chỉ lấy các đơn đã được duyệt và bắt đầu quy trình làm việc (có thể chat)
        status: { in: ['APPROVED', 'SHIPPING', 'RECEIVED', 'SUBMITTED', 'COMPLETED', 'PAID'] } 
      },
      include: {
        campaign: { include: { brand: true } },
        kol: true,
        // Lấy tin nhắn cuối cùng để hiển thị Preview (VD: "Ok shop ơi...")
        messages: { 
          orderBy: { createdAt: 'desc' }, 
          take: 1 
        }
      },
      orderBy: { updatedAt: 'desc' } // Đơn nào mới cập nhật thì lên đầu
    });
  }
}