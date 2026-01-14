import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async saveMessage(userId: string, dto: CreateMessageDto) {
    await this.validateAccess(userId, dto.applicationId);
    return this.prisma.chatMessage.create({
      data: { content: dto.content, senderId: userId, applicationId: dto.applicationId },
      include: { sender: { select: { id: true, fullName: true, avatar: true } } },
    });
  }

  async getMessages(userId: string, applicationId: string) {
    await this.validateAccess(userId, applicationId);
    return this.prisma.chatMessage.findMany({
      where: { applicationId },
      orderBy: { createdAt: 'asc' },
      include: { sender: { select: { id: true, fullName: true, avatar: true } } },
    });
  }

  // --- API LẤY DANH SÁCH CONVERSATIONS ---
  async getConversations(userId: string) {
    return this.prisma.application.findMany({
      where: {
        status: 'APPROVED',
        OR: [{ kolId: userId }, { campaign: { brandId: userId } }],
      },
      include: {
        campaign: { select: { id: true, title: true, brandId: true } },
        kol: { select: { id: true, fullName: true, avatar: true } },
        // Lấy thêm tin nhắn cuối cùng để hiển thị preview
        messages: {
            take: 1,
            orderBy: { createdAt: 'desc' },
            select: { content: true, createdAt: true }
        }
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async validateAccess(userId: string, applicationId: string) {
    const app = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: { campaign: true },
    });
    if (!app) throw new NotFoundException('Application not found');
    const isKOL = app.kolId === userId;
    const isBrand = app.campaign.brandId === userId;
    if (!isKOL && !isBrand) throw new ForbiddenException('Cấm truy cập');
    return true;
  }
}