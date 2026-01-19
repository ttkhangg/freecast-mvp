import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CampaignStatus } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [totalUsers, totalCampaigns, activeCampaigns, totalApplications] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.campaign.count(),
      this.prisma.campaign.count({ where: { status: CampaignStatus.OPEN } }),
      this.prisma.application.count(),
    ]);

    // Mock data biểu đồ tăng trưởng (Thực tế nên query group by date)
    const growthData = [
      { name: 'T1', users: 400 },
      { name: 'T2', users: 300 },
      { name: 'T3', users: 500 },
      { name: 'T4', users: 280 },
      { name: 'T5', users: 590 },
      { name: 'T6', users: 800 }, // Current
    ];

    // Thống kê trạng thái đơn hàng
    const applicationStats = await this.prisma.application.groupBy({
        by: ['status'],
        _count: { id: true }
    });

    return {
      totalUsers,
      totalCampaigns,
      activeCampaigns,
      totalApplications,
      growthData,
      applicationStats
    };
  }

  // --- USER MANAGEMENT ---
  async findAllUsers(page: number = 1, search: string = '') {
    const take = 10;
    const skip = (page - 1) * take;

    const whereClause = search ? {
        OR: [
            { email: { contains: search, mode: 'insensitive' as const } },
            { fullName: { contains: search, mode: 'insensitive' as const } }
        ]
    } : {};

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where: whereClause,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, email: true, fullName: true, role: true, 
          isBanned: true, isEmailVerified: true, createdAt: true,
          _count: { select: { campaigns: true, applications: true } } // Đếm số job đã tạo/làm
        },
      }),
      this.prisma.user.count({ where: whereClause }),
    ]);

    return {
      data: users,
      meta: { total, page, lastPage: Math.ceil(total / take) },
    };
  }

  async toggleBan(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    return this.prisma.user.update({
      where: { id: userId },
      data: { isBanned: !user.isBanned },
    });
  }

  async verifyUser(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { isEmailVerified: true },
    });
  }

  // --- NEW: CAMPAIGN MANAGEMENT (Xem tất cả chiến dịch) ---
  async findAllCampaigns(page: number = 1, search: string = '') {
    const take = 10;
    const skip = (page - 1) * take;

    const whereClause = search ? {
        title: { contains: search, mode: 'insensitive' as const }
    } : {};

    const [campaigns, total] = await Promise.all([
        this.prisma.campaign.findMany({
            where: whereClause,
            skip,
            take,
            orderBy: { createdAt: 'desc' },
            include: {
                brand: { select: { fullName: true, email: true } },
                _count: { select: { applications: true } }
            }
        }),
        this.prisma.campaign.count({ where: whereClause })
    ]);

    return {
        data: campaigns,
        meta: { total, page, lastPage: Math.ceil(total / take) }
    };
  }

  // --- NEW: SYSTEM ACTIVITY LOG (Giả lập logs để Admin nắm tình hình) ---
  // Trong thực tế nên tạo bảng ActivityLog riêng
  async getRecentActivities() {
      // Lấy 5 đơn ứng tuyển mới nhất làm "hoạt động"
      const recentApps = await this.prisma.application.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
              kol: { select: { fullName: true } },
              campaign: { select: { title: true } }
          }
      });

      return recentApps.map(app => ({
          id: app.id,
          type: 'APPLICATION',
          message: `${app.kol.fullName} vừa ứng tuyển vào "${app.campaign.title}"`,
          time: app.createdAt
      }));
  }
}