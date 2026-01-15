import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    private prisma: PrismaService,
    private notificationsGateway: NotificationsGateway // Inject Gateway
  ) {}

  // Tạo thông báo mới và bắn Realtime
  async create(userId: string, content: string, type: string = 'SYSTEM') {
    // 1. Lưu DB
    const notification = await this.prisma.notification.create({
      data: {
        userId,
        content,
        type,
        isRead: false,
      },
    });

    // 2. Bắn Socket ngay lập tức
    this.notificationsGateway.sendNotificationToUser(userId, notification);

    return notification;
  }

  async findAll(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  }

  async markAsRead(id: string, userId: string) {
    const notif = await this.prisma.notification.findFirst({
        where: { id, userId }
    });
    if (!notif) return null;

    return this.prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true }
    });
  }
}