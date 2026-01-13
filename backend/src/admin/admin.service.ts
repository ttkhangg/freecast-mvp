import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [totalUsers, totalCampaigns, totalApplications] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.campaign.count(),
      this.prisma.application.count(),
    ]);

    const applicationStats = await this.prisma.application.groupBy({
      by: ['status'],
      _count: { id: true },
    });
    
    // Mock data
    const growthData = [
      { name: 'Tháng 1', users: 10, revenue: 2400 },
      { name: 'Tháng 2', users: 25, revenue: 1398 },
      { name: 'Tháng 3', users: 50, revenue: 9800 },
      { name: 'Tháng 4', users: 80, revenue: 3908 },
      { name: 'Tháng 5', users: 120, revenue: 4800 },
      { name: 'Tháng 6', users: 200, revenue: 8800 },
    ];

    return { totalUsers, totalCampaigns, totalApplications, applicationStats, growthData };
  }

  // --- MỚI: Lấy danh sách User có phân trang ---
  async getUsers(page: number = 1, limit: number = 10, search: string = '') {
    const skip = (page - 1) * limit;
    const where: any = {};
    
    if (search) {
      where.email = { contains: search, mode: 'insensitive' };
    }
    
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        where,
        orderBy: { createdAt: 'desc' },
        include: { 
            brandProfile: { select: { companyName: true } }, 
            kolProfile: { select: { fullName: true } } 
        },
      }),
      this.prisma.user.count({ where })
    ]);
    
    // Clean data trước khi trả về (bỏ password)
    const safeUsers = users.map(user => {
      const { password, ...rest } = user;
      return rest;
    });

    return {
      data: safeUsers,
      meta: { total, page, last_page: Math.ceil(total / limit) }
    };
  }

  // --- MỚI: Xác thực User (Tick xanh) ---
  async toggleVerifyUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new Error('User not found');
    
    return this.prisma.user.update({
        where: { id },
        data: { isVerified: !user.isVerified }
    });
  }

  // --- MỚI: Chặn / Bỏ chặn User (Ban Hammer) ---
  async toggleBanUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new Error('User not found');
    
    return this.prisma.user.update({
        where: { id },
        data: { isBanned: !user.isBanned }
    });
  }
}
