"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AdminService = class AdminService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
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
    async getUsers(page = 1, limit = 10, search = '') {
        const skip = (page - 1) * limit;
        const where = {};
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
        const safeUsers = users.map(user => {
            const { password, ...rest } = user;
            return rest;
        });
        return {
            data: safeUsers,
            meta: { total, page, last_page: Math.ceil(total / limit) }
        };
    }
    async toggleVerifyUser(id) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user)
            throw new Error('User not found');
        return this.prisma.user.update({
            where: { id },
            data: { isVerified: !user.isVerified }
        });
    }
    async toggleBanUser(id) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user)
            throw new Error('User not found');
        return this.prisma.user.update({
            where: { id },
            data: { isBanned: !user.isBanned }
        });
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map