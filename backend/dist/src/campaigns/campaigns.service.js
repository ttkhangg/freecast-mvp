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
exports.CampaignsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CampaignsService = class CampaignsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, dto) {
        const brand = await this.prisma.brandProfile.findUnique({ where: { userId } });
        if (!brand) {
            throw new common_1.BadRequestException('Bạn chưa tạo hồ sơ Brand hoặc tài khoản không hợp lệ.');
        }
        return this.prisma.campaign.create({
            data: {
                title: dto.title,
                description: dto.description,
                productName: dto.productName,
                productValue: dto.productValue,
                requirements: dto.requirements,
                platform: dto.platform,
                deadline: dto.deadline ? new Date(dto.deadline) : undefined,
                status: 'ACTIVE',
                productImage: dto.productImage,
                brand: { connect: { id: brand.id } }
            },
        });
    }
    async findAll(search, platform) {
        const where = { status: 'ACTIVE' };
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { brand: { companyName: { contains: search, mode: 'insensitive' } } }
            ];
        }
        if (platform && platform !== 'ALL') {
            where.platform = platform;
        }
        return this.prisma.campaign.findMany({
            where,
            include: {
                brand: {
                    include: { user: { select: { isVerified: true } } }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    async apply(campaignId, userId) {
        const kol = await this.prisma.kolProfile.findUnique({ where: { userId } });
        if (!kol)
            throw new common_1.BadRequestException('User không phải là KOL');
        if (!kol.address || !kol.phone)
            throw new common_1.BadRequestException('Vui lòng cập nhật địa chỉ nhận hàng trong Profile trước khi ứng tuyển.');
        return this.prisma.application.create({
            data: { campaignId, kolId: kol.id, status: 'PENDING' }
        });
    }
    async update(id, userId, data) {
        const campaign = await this.prisma.campaign.findUnique({ where: { id }, include: { brand: true } });
        if (!campaign || campaign.brand.userId !== userId)
            throw new common_1.BadRequestException("Không có quyền sửa chiến dịch này");
        return this.prisma.campaign.update({
            where: { id },
            data: {
                title: data.title,
                description: data.description,
                productName: data.productName,
                productValue: data.productValue,
                requirements: data.requirements,
                deadline: data.deadline ? new Date(data.deadline) : undefined,
                platform: data.platform
            }
        });
    }
    async remove(id, userId) {
        const campaign = await this.prisma.campaign.findUnique({ where: { id }, include: { brand: true } });
        if (!campaign || campaign.brand.userId !== userId)
            throw new common_1.BadRequestException("Không có quyền xóa chiến dịch này");
        await this.prisma.application.deleteMany({ where: { campaignId: id } });
        return this.prisma.campaign.delete({ where: { id } });
    }
    async approveApplication(applicationId, dto) {
        const application = await this.prisma.application.update({
            where: { id: applicationId },
            data: {
                status: dto.shippingCode ? 'SHIPPING' : 'APPROVED',
                shippingCode: dto.shippingCode,
                carrier: dto.carrier,
                approvedAt: new Date(),
                shippedAt: dto.shippingCode ? new Date() : undefined,
            },
            include: { kol: true, campaign: { include: { brand: true } } }
        });
        if (application.kol) {
            await this.prisma.notification.create({
                data: {
                    userId: application.kol.userId,
                    title: 'Đơn hàng được duyệt 🎉',
                    message: `Brand ${application.campaign.brand.companyName} đã duyệt đơn` + (dto.shippingCode ? ` và gửi hàng. Mã vận đơn: ${dto.shippingCode}` : `.`),
                    link: `/my-jobs/${application.id}`
                }
            });
        }
        return application;
    }
    async confirmReceived(applicationId) {
        const app = await this.prisma.application.update({
            where: { id: applicationId },
            data: { status: 'RECEIVED', receivedAt: new Date() },
            include: { campaign: { include: { brand: true } }, kol: true }
        });
        if (app.campaign.brand) {
            await this.prisma.notification.create({
                data: {
                    userId: app.campaign.brand.userId,
                    title: 'KOL đã nhận được hàng 🎁',
                    message: `${app.kol.fullName} đã xác nhận nhận được sản phẩm cho chiến dịch "${app.campaign.title}".`,
                    link: `/brand/campaigns/${app.campaign.id}`
                }
            });
        }
        return app;
    }
    async submitContent(applicationId, dto) {
        const app = await this.prisma.application.update({
            where: { id: applicationId },
            data: { status: 'SUBMITTED', contentLink: dto.link, submitNote: dto.note, submittedAt: new Date() },
            include: { campaign: { include: { brand: true } }, kol: true }
        });
        if (app.campaign.brand) {
            await this.prisma.notification.create({
                data: {
                    userId: app.campaign.brand.userId,
                    title: 'KOL đã nộp bài 📝',
                    message: `${app.kol.fullName} đã nộp link review cho chiến dịch "${app.campaign.title}". Hãy kiểm tra ngay!`,
                    link: `/brand/campaigns/${app.campaign.id}`
                }
            });
        }
        return app;
    }
    async reviewApplication(applicationId, rating, review) {
        const app = await this.prisma.application.update({
            where: { id: applicationId },
            data: { status: 'COMPLETED', completedAt: new Date(), rating, review },
            include: { kol: true, campaign: { include: { brand: true } } }
        });
        if (app.kol) {
            await this.prisma.notification.create({
                data: {
                    userId: app.kol.userId,
                    title: 'Bạn nhận được đánh giá mới ⭐',
                    message: `Brand ${app.campaign.brand.companyName} đã hoàn tất đơn hàng và đánh giá ${rating} sao.`,
                    link: `/my-jobs/${applicationId}`
                }
            });
        }
        return app;
    }
    async kolReviewBrand(applicationId, rating, review) {
        const app = await this.prisma.application.findUnique({ where: { id: applicationId }, include: { campaign: { include: { brand: true } }, kol: true } });
        if (!app || app.status !== 'COMPLETED')
            throw new common_1.BadRequestException('Đơn hàng chưa hoàn tất');
        const updated = await this.prisma.application.update({
            where: { id: applicationId },
            data: { kolRating: rating, kolReview: review }
        });
        if (app.campaign.brand) {
            await this.prisma.notification.create({
                data: {
                    userId: app.campaign.brand.userId,
                    title: 'KOL đã đánh giá bạn ⭐',
                    message: `${app.kol.fullName} đã gửi đánh giá ${rating} sao về sự hợp tác với bạn.`,
                    link: `/brand/campaigns/${app.campaign.id}`
                }
            });
        }
        return updated;
    }
    async getMyJobs(userId) {
        const kol = await this.prisma.kolProfile.findUnique({ where: { userId } });
        if (!kol)
            return [];
        return this.prisma.application.findMany({
            where: { kolId: kol.id },
            include: { campaign: { include: { brand: true } } },
            orderBy: { createdAt: 'desc' }
        });
    }
    async getJobDetail(id) {
        return this.prisma.application.findUnique({
            where: { id },
            include: { campaign: { include: { brand: true } }, kol: true }
        });
    }
    async findOne(id) {
        const campaign = await this.prisma.campaign.findUnique({
            where: { id },
            include: {
                brand: {
                    include: { user: { select: { isVerified: true } } }
                }
            }
        });
        if (!campaign)
            throw new common_1.NotFoundException('Chiến dịch không tồn tại');
        return campaign;
    }
    async getBrandCampaigns(userId) {
        const brand = await this.prisma.brandProfile.findUnique({ where: { userId } });
        if (!brand)
            return [];
        return this.prisma.campaign.findMany({
            where: { brandId: brand.id },
            include: { _count: { select: { applications: true } } },
            orderBy: { createdAt: 'desc' }
        });
    }
    async getApplicants(campaignId) {
        return this.prisma.application.findMany({
            where: { campaignId },
            include: {
                kol: {
                    include: { user: { select: { isVerified: true } } }
                }
            }
        });
    }
    async cancelApplication(applicationId, userId) {
        const app = await this.prisma.application.findUnique({ where: { id: applicationId }, include: { kol: true } });
        if (!app || app.kol.userId !== userId)
            throw new common_1.BadRequestException('Không có quyền hủy đơn này');
        if (app.status !== 'PENDING')
            throw new common_1.BadRequestException('Chỉ có thể hủy khi đơn chưa được duyệt');
        return this.prisma.application.update({
            where: { id: applicationId },
            data: { status: 'REJECTED' }
        });
    }
    async closeCampaign(campaignId, userId) {
        const campaign = await this.prisma.campaign.findUnique({ where: { id: campaignId }, include: { brand: true } });
        if (!campaign || campaign.brand.userId !== userId)
            throw new common_1.BadRequestException('Không có quyền sửa chiến dịch này');
        return this.prisma.campaign.update({
            where: { id: campaignId },
            data: { status: 'LOCKED' }
        });
    }
};
exports.CampaignsService = CampaignsService;
exports.CampaignsService = CampaignsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CampaignsService);
//# sourceMappingURL=campaigns.service.js.map