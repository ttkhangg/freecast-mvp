import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCampaignDto, UpdateCampaignDto } from './dto/create-campaign.dto';
import { CampaignStatus, ApplicationStatus, Prisma } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class CampaignsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService
  ) {}

  async create(userId: string, dto: CreateCampaignDto) {
    return this.prisma.campaign.create({ data: { ...dto, brandId: userId, status: CampaignStatus.OPEN } });
  }

  async findAll() {
    return this.prisma.campaign.findMany({
      where: { status: CampaignStatus.OPEN },
      include: { brand: { select: { id: true, fullName: true, avatar: true } }, _count: { select: { applications: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findMyCampaigns(userId: string) {
    return this.prisma.campaign.findMany({ where: { brandId: userId }, include: { _count: { select: { applications: true } } }, orderBy: { createdAt: 'desc' } });
  }

  async findMyApplications(userId: string) {
    return this.prisma.application.findMany({ where: { kolId: userId }, include: { campaign: { include: { brand: { select: { id: true, fullName: true, avatar: true } } } } }, orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string) {
    const campaign = await this.prisma.campaign.findUnique({
      where: { id },
      include: {
        brand: { select: { id: true, fullName: true, avatar: true, bio: true } },
        applications: {
            include: { 
                kol: { select: { id: true, fullName: true, avatar: true } },
                reviews: { include: { author: { select: { fullName: true, avatar: true } } } }
            } 
        }, 
      },
    });
    if (!campaign) throw new NotFoundException('Không tìm thấy chiến dịch');
    return campaign;
  }
  
  async update(id: string, userId: string, dto: UpdateCampaignDto) {
    const campaign = await this.findOne(id);
    if (campaign.brandId !== userId) throw new ForbiddenException('Không có quyền');
    const data: Prisma.CampaignUpdateInput = { ...dto, ...(dto.status && { status: dto.status as CampaignStatus }) };
    return this.prisma.campaign.update({ where: { id }, data });
  }

  async remove(id: string, userId: string) {
    const campaign = await this.findOne(id);
    if (campaign.brandId !== userId) throw new ForbiddenException('Không có quyền');
    return this.prisma.campaign.delete({ where: { id } });
  }

  async apply(campaignId: string, kolId: string) {
    const campaign = await this.prisma.campaign.findUnique({ where: { id: campaignId } });
    if (!campaign || campaign.status !== CampaignStatus.OPEN) throw new BadRequestException('Chiến dịch đã đóng');
    const existing = await this.prisma.application.findUnique({ where: { campaignId_kolId: { campaignId, kolId } } });
    if (existing) throw new BadRequestException('Bạn đã ứng tuyển rồi');
    const app = await this.prisma.application.create({ data: { campaignId, kolId, status: ApplicationStatus.PENDING } });
    await this.notificationsService.create(campaign.brandId, `Có người vừa ứng tuyển vào chiến dịch "${campaign.title}"`, 'CAMPAIGN');
    return app;
  }

  async cancelApplication(campaignId: string, kolId: string) {
    const app = await this.prisma.application.findUnique({ where: { campaignId_kolId: { campaignId, kolId } } });
    if (!app) throw new NotFoundException('Chưa ứng tuyển');
    if (app.status !== ApplicationStatus.PENDING) throw new BadRequestException('Không thể hủy đơn này');
    return this.prisma.application.delete({ where: { id: app.id } });
  }

  async approveApplication(applicationId: string, brandId: string) {
    const app = await this.prisma.application.findUnique({ where: { id: applicationId }, include: { campaign: true } });
    if (!app || app.campaign.brandId !== brandId) throw new ForbiddenException('Không có quyền');
    const updated = await this.prisma.application.update({ where: { id: applicationId }, data: { status: ApplicationStatus.APPROVED } });
    await this.notificationsService.create(app.kolId, `Tin vui! Bạn đã được DUYỆT vào chiến dịch "${app.campaign.title}"`, 'BOOKING');
    return updated;
  }

  async rejectApplication(applicationId: string, brandId: string) {
    const app = await this.prisma.application.findUnique({ where: { id: applicationId }, include: { campaign: true } });
    if (!app || app.campaign.brandId !== brandId) throw new ForbiddenException('Không có quyền');
    return this.prisma.application.update({ where: { id: applicationId }, data: { status: ApplicationStatus.REJECTED } });
  }

  async updateTracking(applicationId: string, brandId: string, trackingCode: string) {
    const app = await this.prisma.application.findUnique({ where: { id: applicationId }, include: { campaign: true } });
    if (!app || app.campaign.brandId !== brandId) throw new ForbiddenException('Không có quyền');
    const updated = await this.prisma.application.update({ where: { id: applicationId }, data: { trackingCode } });
    await this.notificationsService.create(app.kolId, `Sản phẩm cho "${app.campaign.title}" đã gửi. Mã: ${trackingCode}`, 'SHIPPING');
    return updated;
  }

  async confirmProductReceived(applicationId: string, kolId: string) {
    const app = await this.prisma.application.findUnique({ where: { id: applicationId }, include: { campaign: true } });
    if (!app || app.kolId !== kolId) throw new ForbiddenException('Không có quyền');
    const updated = await this.prisma.application.update({ where: { id: applicationId }, data: { isProductReceived: true } });
    await this.notificationsService.create(app.campaign.brandId, `KOL đã nhận hàng cho chiến dịch "${app.campaign.title}"`, 'SHIPPING');
    return updated;
  }

  async submitWork(applicationId: string, kolId: string, submissionLink: string) {
    const app = await this.prisma.application.findUnique({ where: { id: applicationId }, include: { campaign: true } });
    if (!app || app.kolId !== kolId) throw new ForbiddenException('Không có quyền');
    const updated = await this.prisma.application.update({ where: { id: applicationId }, data: { submissionLink } });
    await this.notificationsService.create(app.campaign.brandId, `KOL nộp bài cho chiến dịch "${app.campaign.title}"`, 'WORK');
    return updated;
  }

  async completeJob(applicationId: string, brandId: string) {
    const app = await this.prisma.application.findUnique({ where: { id: applicationId }, include: { campaign: true } });
    if (!app || app.campaign.brandId !== brandId) throw new ForbiddenException('Không có quyền');
    const updated = await this.prisma.application.update({ where: { id: applicationId }, data: { status: ApplicationStatus.COMPLETED } });
    await this.notificationsService.create(app.kolId, `Chiến dịch "${app.campaign.title}" hoàn tất.`, 'PAYMENT');
    return updated;
  }

  async getApplicationDetail(applicationId: string, userId: string) {
    const app = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        kol: { select: { id: true, fullName: true, email: true, phone: true, address: true, avatar: true } },
        campaign: true,
        reviews: true,
      }
    });

    if (!app) throw new NotFoundException();
    if (app.campaign.brandId !== userId && app.kolId !== userId) throw new ForbiddenException();

    if (app.campaign.brandId === userId) {
        const sensitiveStatuses = [ApplicationStatus.PENDING, ApplicationStatus.REJECTED, ApplicationStatus.CANCELLED];
        // @ts-ignore
        if (sensitiveStatuses.includes(app.status)) {
            app.kol.phone = null;
            app.kol.address = null;
            app.kol.email = '********';
        }
    }
    return app;
  }
}