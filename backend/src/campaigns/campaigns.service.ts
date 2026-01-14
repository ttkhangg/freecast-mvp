import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCampaignDto, UpdateCampaignDto } from './dto/create-campaign.dto';
import { CampaignStatus, ApplicationStatus, Prisma } from '@prisma/client';

@Injectable()
export class CampaignsService {
  constructor(private prisma: PrismaService) {}

  // --- CRUD CƠ BẢN ---
  async create(userId: string, dto: CreateCampaignDto) {
    return this.prisma.campaign.create({
      data: { ...dto, brandId: userId, status: CampaignStatus.OPEN },
    });
  }

  async findAll() {
    return this.prisma.campaign.findMany({
      where: { status: CampaignStatus.OPEN },
      include: {
        brand: { select: { id: true, fullName: true, avatar: true } },
        _count: { select: { applications: true } }
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findMyCampaigns(userId: string) {
    return this.prisma.campaign.findMany({
      where: { brandId: userId },
      include: { _count: { select: { applications: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const campaign = await this.prisma.campaign.findUnique({
      where: { id },
      include: {
        brand: { select: { id: true, fullName: true, avatar: true, bio: true } },
        applications: {
            include: { kol: { select: { id: true, fullName: true, avatar: true, email: true, phone: true } } }
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

  // --- APPLICATION FLOW ---
  async apply(campaignId: string, kolId: string) {
    const campaign = await this.prisma.campaign.findUnique({ where: { id: campaignId } });
    if (!campaign || campaign.status !== CampaignStatus.OPEN) throw new BadRequestException('Chiến dịch đã đóng');
    const existing = await this.prisma.application.findUnique({ where: { campaignId_kolId: { campaignId, kolId } } });
    if (existing) throw new BadRequestException('Bạn đã ứng tuyển rồi');
    return this.prisma.application.create({ data: { campaignId, kolId, status: ApplicationStatus.PENDING } });
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
    return this.prisma.application.update({ where: { id: applicationId }, data: { status: ApplicationStatus.APPROVED } });
  }

  async rejectApplication(applicationId: string, brandId: string) {
    const app = await this.prisma.application.findUnique({ where: { id: applicationId }, include: { campaign: true } });
    if (!app || app.campaign.brandId !== brandId) throw new ForbiddenException('Không có quyền');
    return this.prisma.application.update({ where: { id: applicationId }, data: { status: ApplicationStatus.REJECTED } });
  }

  // --- BOOKING FLOW (NEW V2.1) ---

  async updateTracking(applicationId: string, brandId: string, trackingCode: string) {
    const app = await this.prisma.application.findUnique({ where: { id: applicationId }, include: { campaign: true } });
    if (!app || app.campaign.brandId !== brandId) throw new ForbiddenException('Không có quyền');
    return this.prisma.application.update({ where: { id: applicationId }, data: { trackingCode } });
  }

  async confirmProductReceived(applicationId: string, kolId: string) {
    const app = await this.prisma.application.findUnique({ where: { id: applicationId } });
    if (!app || app.kolId !== kolId) throw new ForbiddenException('Không có quyền');
    return this.prisma.application.update({ where: { id: applicationId }, data: { isProductReceived: true } });
  }

  async submitWork(applicationId: string, kolId: string, submissionLink: string) {
    const app = await this.prisma.application.findUnique({ where: { id: applicationId } });
    if (!app || app.kolId !== kolId) throw new ForbiddenException('Không có quyền');
    return this.prisma.application.update({ where: { id: applicationId }, data: { submissionLink } });
  }

  async completeJob(applicationId: string, brandId: string) {
    const app = await this.prisma.application.findUnique({ where: { id: applicationId }, include: { campaign: true } });
    if (!app || app.campaign.brandId !== brandId) throw new ForbiddenException('Không có quyền');
    return this.prisma.application.update({ where: { id: applicationId }, data: { status: ApplicationStatus.COMPLETED } });
  }

  // Lấy chi tiết đơn để Brand xem địa chỉ KOL (chỉ khi Approved)
  async getApplicationDetail(applicationId: string, userId: string) {
    const app = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        kol: { select: { id: true, fullName: true, email: true, phone: true, address: true, avatar: true } },
        campaign: true
      }
    });
    if (!app) throw new NotFoundException();
    if (app.campaign.brandId !== userId && app.kolId !== userId) throw new ForbiddenException();
    return app;
  }
}