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
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ChatService = class ChatService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async saveMessage(applicationId, senderId, content) {
        return this.prisma.message.create({
            data: { applicationId, senderId, content },
            include: {
                sender: {
                    select: { id: true, email: true, role: true, brandProfile: true, kolProfile: true }
                }
            }
        });
    }
    async getMessages(applicationId) {
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
    async getConversations(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { brandProfile: true, kolProfile: true }
        });
        if (!user)
            return [];
        let whereCondition = {};
        if (user.role === 'BRAND') {
            if (!user.brandProfile)
                return [];
            whereCondition = { campaign: { brandId: user.brandProfile.id } };
        }
        else if (user.role === 'KOL') {
            if (!user.kolProfile)
                return [];
            whereCondition = { kolId: user.kolProfile.id };
        }
        else {
            return [];
        }
        return this.prisma.application.findMany({
            where: {
                ...whereCondition,
                status: { in: ['APPROVED', 'SHIPPING', 'RECEIVED', 'SUBMITTED', 'COMPLETED', 'PAID'] }
            },
            include: {
                campaign: { include: { brand: true } },
                kol: true,
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1
                }
            },
            orderBy: { updatedAt: 'desc' }
        });
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ChatService);
//# sourceMappingURL=chat.service.js.map