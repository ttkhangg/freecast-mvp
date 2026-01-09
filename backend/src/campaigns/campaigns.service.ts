import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';

@Injectable()
export class CampaignsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCampaignDto) {
    // Cần tìm BrandProfile ID dựa trên User ID (Logic nâng cao sau)
    // Tạm thời MVP: Client gửi brandId (là ID của BrandProfile)
    return this.prisma.campaign.create({
      data: {
        title: dto.title,
        description: dto.description,
        productName: dto.productName,
        productValue: dto.productValue,
        requirements: dto.requirements,
        platform: dto.platform,
        brand: { connect: { id: dto.brandId } }
      },
    });
  }

  async findAll() {
    return this.prisma.campaign.findMany({
      include: { brand: true }, // Lấy kèm thông tin Brand
      orderBy: { createdAt: 'desc' }
    });
  }
}
