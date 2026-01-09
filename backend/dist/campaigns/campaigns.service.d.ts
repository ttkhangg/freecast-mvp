import { PrismaService } from '../prisma/prisma.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
export declare class CampaignsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateCampaignDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        title: string;
        productName: string;
        productValue: string;
        requirements: string;
        platform: string;
        brandId: string;
        status: import(".prisma/client").$Enums.CampaignStatus;
        deadline: Date | null;
    }>;
    findAll(): Promise<({
        brand: {
            id: string;
            companyName: string;
            website: string | null;
            industry: string | null;
            description: string | null;
            logo: string | null;
            userId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        title: string;
        productName: string;
        productValue: string;
        requirements: string;
        platform: string;
        brandId: string;
        status: import(".prisma/client").$Enums.CampaignStatus;
        deadline: Date | null;
    })[]>;
}
