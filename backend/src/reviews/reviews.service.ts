import { Injectable, ForbiddenException, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './create-review.dto';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ReviewsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService
  ) {}

  async create(userId: string, dto: CreateReviewDto) {
    const app = await this.prisma.application.findUnique({
      where: { id: dto.applicationId },
      include: { campaign: true },
    });

    if (!app) throw new NotFoundException('Application not found');
    
    if (app.status !== 'COMPLETED') {
        throw new BadRequestException('Chỉ được đánh giá khi đơn hàng đã hoàn tất');
    }

    let targetId = '';
    const isBrand = app.campaign.brandId === userId;
    const isKOL = app.kolId === userId;

    if (isBrand) targetId = app.kolId;
    else if (isKOL) targetId = app.campaign.brandId;
    else throw new ForbiddenException('Bạn không liên quan đến đơn này');

    const existing = await this.prisma.review.findFirst({
        where: { applicationId: dto.applicationId, authorId: userId }
    });
    if (existing) throw new BadRequestException('Bạn đã đánh giá rồi');

    const review = await this.prisma.review.create({
      data: {
        applicationId: dto.applicationId,
        authorId: userId,
        targetId: targetId,
        rating: dto.rating,
        comment: dto.comment,
      },
    });

    await this.notificationsService.create(targetId, `Bạn vừa nhận được đánh giá ${dto.rating} sao!`, 'REVIEW');
    return review;
  }
}