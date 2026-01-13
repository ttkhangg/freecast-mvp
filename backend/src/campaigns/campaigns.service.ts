import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { ApproveApplicationDto, SubmitContentDto } from './dto/booking.dto';

@Injectable()
export class CampaignsService {
  constructor(private prisma: PrismaService) {}

  // --- FIX GÓI 1: Logic tạo campaign bảo mật ---
  async create(userId: string, dto: CreateCampaignDto) {
    // 1. Tìm Brand Profile của user đang đăng nhập
    const brand = await this.prisma.brandProfile.findUnique({ where: { userId } });
    
    if (!brand) {
        throw new BadRequestException('Bạn chưa tạo hồ sơ Brand hoặc tài khoản không hợp lệ.');
    }

    // 2. Tạo Campaign gắn với Brand đó
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
        productImage: dto.productImage, // FIX: Lưu ảnh vào DB
        brand: { connect: { id: brand.id } } // Lấy ID từ DB, không tin tưởng client
      },
    });
  }

  async findAll(search?: string, platform?: string) {
    const where: any = { status: 'ACTIVE' }; 
    
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
              // --- FIX GÓI 3: Include isVerified ---
              include: { user: { select: { isVerified: true } } }
          }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async apply(campaignId: string, userId: string) {
    const kol = await this.prisma.kolProfile.findUnique({ where: { userId } });
    if (!kol) throw new BadRequestException('User không phải là KOL');
    if (!kol.address || !kol.phone) throw new BadRequestException('Vui lòng cập nhật địa chỉ nhận hàng trong Profile trước khi ứng tuyển.');

    return this.prisma.application.create({
      data: { campaignId, kolId: kol.id, status: 'PENDING' }
    });
  }

  // --- MỚI (PHASE 7.3): Sửa thông tin Campaign ---
  async update(id: string, userId: string, data: any) {
    // 1. Check quyền
    const campaign = await this.prisma.campaign.findUnique({ where: { id }, include: { brand: true } });
    if (!campaign || campaign.brand.userId !== userId) throw new BadRequestException("Không có quyền sửa chiến dịch này");
    
    // 2. Update
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

  // --- MỚI (PHASE 7.3): Xóa Campaign ---
  async remove(id: string, userId: string) {
    const campaign = await this.prisma.campaign.findUnique({ where: { id }, include: { brand: true } });
    if (!campaign || campaign.brand.userId !== userId) throw new BadRequestException("Không có quyền xóa chiến dịch này");

    // Xóa tất cả application liên quan trước (hoặc dùng Cascade trong DB, nhưng xử lý code cho an toàn)
    await this.prisma.application.deleteMany({ where: { campaignId: id } });

    return this.prisma.campaign.delete({ where: { id } });
  }

  async approveApplication(applicationId: string, dto: ApproveApplicationDto) {
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

  async confirmReceived(applicationId: string) {
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

  async submitContent(applicationId: string, dto: SubmitContentDto) {
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

  async reviewApplication(applicationId: string, rating: number, review: string) {
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

  async kolReviewBrand(applicationId: string, rating: number, review: string) {
    const app = await this.prisma.application.findUnique({ where: { id: applicationId }, include: { campaign: { include: { brand: true } }, kol: true } });
    if (!app || app.status !== 'COMPLETED') throw new BadRequestException('Đơn hàng chưa hoàn tất');

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

  async getMyJobs(userId: string) {
    const kol = await this.prisma.kolProfile.findUnique({ where: { userId } });
    if (!kol) return [];
    return this.prisma.application.findMany({
      where: { kolId: kol.id },
      include: { campaign: { include: { brand: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getJobDetail(id: string) {
    return this.prisma.application.findUnique({
      where: { id },
      include: { campaign: { include: { brand: true } }, kol: true }
    });
  }

  // --- FIX GÓI 3: Include isVerified ---
  async findOne(id: string) {
    const campaign = await this.prisma.campaign.findUnique({
      where: { id },
      include: { 
          brand: {
              include: { user: { select: { isVerified: true } } }
          }
      }
    });
    if (!campaign) throw new NotFoundException('Chiến dịch không tồn tại');
    return campaign;
  }

  async getBrandCampaigns(userId: string) {
    const brand = await this.prisma.brandProfile.findUnique({ where: { userId } });
    if (!brand) return [];
    
    return this.prisma.campaign.findMany({
      where: { brandId: brand.id },
      include: { _count: { select: { applications: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }
  
  // --- FIX GÓI 3: Include isVerified ---
  async getApplicants(campaignId: string) {
    return this.prisma.application.findMany({
      where: { campaignId },
      include: { 
          kol: {
              include: { user: { select: { isVerified: true } } }
          }
      }
    });
  }

  async cancelApplication(applicationId: string, userId: string) {
    const app = await this.prisma.application.findUnique({ where: { id: applicationId }, include: { kol: true } });
    
    if (!app || app.kol.userId !== userId) throw new BadRequestException('Không có quyền hủy đơn này');
    if (app.status !== 'PENDING') throw new BadRequestException('Chỉ có thể hủy khi đơn chưa được duyệt');

    return this.prisma.application.update({
      where: { id: applicationId },
      data: { status: 'REJECTED' } 
    });
  }

  async closeCampaign(campaignId: string, userId: string) {
    const campaign = await this.prisma.campaign.findUnique({ where: { id: campaignId }, include: { brand: true } });
    
    if (!campaign || campaign.brand.userId !== userId) throw new BadRequestException('Không có quyền sửa chiến dịch này');

    return this.prisma.campaign.update({
      where: { id: campaignId },
      data: { status: 'LOCKED' }
    });
  }
}