import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCampaignDto, UpdateCampaignDto } from './dto/create-campaign.dto';
import { CampaignStatus, ApplicationStatus, Prisma } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class CampaignsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService
  ) {}

  async create(userId: string, dto: CreateCampaignDto) {
    const data: Prisma.CampaignCreateInput = {
      title: dto.title,
      description: dto.description,
      requirements: dto.requirements,
      budget: dto.budget,
      deadline: dto.deadline,
      // @ts-ignore
      images: dto.images || [], 
      status: CampaignStatus.OPEN,
      brand: { connect: { id: userId } }
    };

    return this.prisma.campaign.create({ data });
  }

  async findAll(query: PaginationDto) {
    const { page = 1, take = 10 } = query;
    const skip = (page - 1) * take;

    const [data, total] = await Promise.all([
      this.prisma.campaign.findMany({
        where: { status: CampaignStatus.OPEN },
        include: { 
            brand: { select: { id: true, fullName: true, avatar: true } }, 
            _count: { select: { applications: true } } 
        },
        orderBy: { createdAt: 'desc' },
        skip: Number(skip),
        take: Number(take),
      }),
      this.prisma.campaign.count({ where: { status: CampaignStatus.OPEN } })
    ]);

    return {
      data,
      meta: {
        total,
        page: Number(page),
        lastPage: Math.ceil(total / take),
      }
    };
  }

  async findMyCampaigns(userId: string) {
    return this.prisma.campaign.findMany({ 
        where: { brandId: userId }, 
        include: { _count: { select: { applications: true } } }, 
        orderBy: { createdAt: 'desc' } 
    });
  }

  async findMyApplications(userId: string) {
    return this.prisma.application.findMany({ 
        where: { kolId: userId }, 
        include: { 
            campaign: { 
                include: { brand: { select: { id: true, fullName: true, avatar: true } } } 
            } 
        }, 
        orderBy: { createdAt: 'desc' } 
    });
  }

  // --- ZERO TRUST: DATA SANITIZATION ---
  async findOne(id: string) {
    const campaign = await this.prisma.campaign.findUnique({
      where: { id },
      include: {
        brand: { select: { id: true, fullName: true, avatar: true, bio: true } },
        applications: {
            include: { 
                // Chỉ lấy những trường cơ bản trước, lọc sau
                kol: { 
                    select: { 
                        id: true, fullName: true, avatar: true, 
                        email: true, phone: true, address: true, socialLink: true 
                    } 
                },
                reviews: { include: { author: { select: { fullName: true, avatar: true } } } }
            } 
        }, 
      },
    });
    if (!campaign) throw new NotFoundException('Không tìm thấy chiến dịch');

    // TECH DEBT #3 & #4: Logic ẩn/hiện thông tin KOL
    // Brand cần xem socialLink để duyệt, nhưng không được thấy sđt/địa chỉ
    campaign.applications = campaign.applications.map(app => {
        // Nếu chưa Approved, ẩn thông tin nhạy cảm
        if (app.status === ApplicationStatus.PENDING || app.status === ApplicationStatus.REJECTED || app.status === ApplicationStatus.CANCELLED) {
            return {
                ...app,
                kol: {
                    ...app.kol,
                    email: '*********', // Mask email
                    phone: null,        // Hide phone
                    address: null,      // Hide address
                    // Giữ nguyên socialLink để Brand check kênh
                }
            };
        }
        return app; // Nếu Approved/Completed thì hiện full
    });

    return campaign;
  }
  
  async update(id: string, userId: string, dto: UpdateCampaignDto) {
    const campaign = await this.prisma.campaign.findUnique({ where: { id }});
    if (!campaign) throw new NotFoundException('Campaign not found');
    if (campaign.brandId !== userId) throw new ForbiddenException('Không có quyền chỉnh sửa chiến dịch này');
    
    const data: any = { 
        ...dto, 
        ...(dto.status && { status: dto.status as CampaignStatus }),
    };
    if (dto.images) data.images = dto.images;
    return this.prisma.campaign.update({ where: { id }, data });
  }

  // TECH DEBT #1: Xóa chiến dịch
  async remove(id: string, userId: string) {
    const campaign = await this.prisma.campaign.findUnique({ where: { id }});
    if (!campaign) throw new NotFoundException('Campaign not found');
    if (campaign.brandId !== userId) throw new ForbiddenException('Không có quyền xóa');
    
    // Logic an toàn: Nếu đã có ứng viên approved, không cho xóa cứng, chỉ đóng
    const hasActiveApps = await this.prisma.application.count({
        where: { campaignId: id, status: { in: [ApplicationStatus.APPROVED, ApplicationStatus.COMPLETED] } }
    });

    if (hasActiveApps > 0) {
        throw new BadRequestException('Chiến dịch đã có KOL đang làm việc. Chỉ có thể Đóng chiến dịch, không thể Xóa.');
    }

    return this.prisma.campaign.delete({ where: { id } });
  }

  // TECH DEBT #1: Ngừng chiến dịch (Quick Action)
  async stopCampaign(id: string, userId: string) {
      const campaign = await this.prisma.campaign.findUnique({ where: { id }});
      if (!campaign) throw new NotFoundException('Campaign not found');
      if (campaign.brandId !== userId) throw new ForbiddenException('Không có quyền');

      return this.prisma.campaign.update({
          where: { id },
          data: { status: CampaignStatus.CLOSED }
      });
  }

  async apply(campaignId: string, kolId: string) {
    const campaign = await this.prisma.campaign.findUnique({ where: { id: campaignId } });
    if (!campaign || campaign.status !== CampaignStatus.OPEN) throw new BadRequestException('Chiến dịch đã đóng hoặc tạm dừng');
    
    const existing = await this.prisma.application.findUnique({ where: { campaignId_kolId: { campaignId, kolId } } });
    if (existing) throw new BadRequestException('Bạn đã ứng tuyển rồi');
    
    // Kiểm tra xem KOL đã cập nhật Link kênh chưa (Tech debt #3 prerequisite)
    const kol = await this.prisma.user.findUnique({ where: { id: kolId }});
    if (!kol?.socialLink) {
        throw new BadRequestException('Vui lòng cập nhật Link kênh (TikTok/Facebook/Youtube) trong Hồ sơ trước khi ứng tuyển.');
    }

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
    await this.notificationsService.create(app.kolId, `Tin vui! Brand đã DUYỆT bạn vào chiến dịch "${app.campaign.title}". Hãy kiểm tra thông tin liên hệ ngay.`, 'BOOKING');
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

  // API cho Brand/KOL xem chi tiết đơn hàng (Dùng trong BookingManager)
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

    // Zero Trust Data Masking
    if (app.campaign.brandId === userId) {
        // Brand xem: Nếu chưa Approved thì che contact
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