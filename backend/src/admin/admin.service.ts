import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CampaignStatus } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [totalUsers, totalCampaigns, activeCampaigns] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.campaign.count(),
      this.prisma.campaign.count({ where: { status: CampaignStatus.OPEN } }), // Enum chuẩn
    ]);

    return {
      totalUsers,
      totalCampaigns,
      activeCampaigns,
      revenue: 0,
    };
  }

  async findAllUsers(page: number = 1) {
    const take = 10;
    const skip = (page - 1) * take;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          fullName: true,
          role: true,
          isBanned: true,
          isEmailVerified: true,
          createdAt: true,
        },
      }),
      this.prisma.user.count(),
    ]);

    return {
      data: users,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / take),
      },
    };
  }

  async toggleBan(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    return this.prisma.user.update({
      where: { id: userId },
      data: { isBanned: !user.isBanned },
      select: { id: true, email: true, isBanned: true },
    });
  }

  async verifyUser(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { isEmailVerified: true },
    });
  }
}