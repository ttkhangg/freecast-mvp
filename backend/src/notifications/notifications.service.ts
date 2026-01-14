import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  // Tạo thông báo mới (Hàm này sẽ được gọi từ các module khác)
  async create(userId: string, content: string, type: string = 'SYSTEM') {
    return this.prisma.notification.create({
      data: {
        userId,
        content,
        type,
        isRead: false,
      },
    });
  }

  // Lấy danh sách thông báo của User
  async findAll(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20, // Chỉ lấy 20 thông báo mới nhất
    });
  }

  // Đánh dấu đã đọc
  async markAsRead(id: string, userId: string) {
    // Verify ownership
    const notif = await this.prisma.notification.findFirst({
        where: { id, userId }
    });
    
    if (!notif) return null;

    return this.prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }

  // Đánh dấu tất cả là đã đọc
  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true }
    });
  }
}