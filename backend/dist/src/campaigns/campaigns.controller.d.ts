import { CampaignsService } from './campaigns.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { ApproveApplicationDto, SubmitContentDto } from './dto/booking.dto';
export declare class CampaignsController {
    private readonly campaignsService;
    constructor(campaignsService: CampaignsService);
    create(req: any, createCampaignDto: CreateCampaignDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        title: string;
        productName: string;
        productImage: string | null;
        productValue: string;
        requirements: string;
        platform: string;
        status: import(".prisma/client").$Enums.CampaignStatus;
        deadline: Date | null;
        brandId: string;
    }>;
    findAll(search?: string, platform?: string): Promise<({
        brand: {
            user: {
                isVerified: boolean;
            };
        } & {
            id: string;
            companyName: string;
            logo: string | null;
            website: string | null;
            industry: string | null;
            description: string | null;
            taxCode: string | null;
            address: string | null;
            phone: string | null;
            userId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        title: string;
        productName: string;
        productImage: string | null;
        productValue: string;
        requirements: string;
        platform: string;
        status: import(".prisma/client").$Enums.CampaignStatus;
        deadline: Date | null;
        brandId: string;
    })[]>;
    getMyCampaigns(req: any): Promise<({
        _count: {
            applications: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        title: string;
        productName: string;
        productImage: string | null;
        productValue: string;
        requirements: string;
        platform: string;
        status: import(".prisma/client").$Enums.CampaignStatus;
        deadline: Date | null;
        brandId: string;
    })[]>;
    getApplicants(id: string): Promise<({
        kol: {
            user: {
                isVerified: boolean;
            };
        } & {
            id: string;
            address: string | null;
            phone: string | null;
            fullName: string;
            avatar: string | null;
            bio: string | null;
            categories: string[];
            platforms: import("@prisma/client/runtime/library").JsonValue | null;
            followers: number;
            socialLink: string | null;
            city: string | null;
            bankName: string | null;
            bankAccount: string | null;
            userId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ApplicationStatus;
        shippingCode: string | null;
        carrier: string | null;
        contentLink: string | null;
        submitNote: string | null;
        approvedAt: Date | null;
        shippedAt: Date | null;
        receivedAt: Date | null;
        submittedAt: Date | null;
        completedAt: Date | null;
        rating: number | null;
        review: string | null;
        kolRating: number | null;
        kolReview: string | null;
        campaignId: string;
        kolId: string;
    })[]>;
    apply(id: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ApplicationStatus;
        shippingCode: string | null;
        carrier: string | null;
        contentLink: string | null;
        submitNote: string | null;
        approvedAt: Date | null;
        shippedAt: Date | null;
        receivedAt: Date | null;
        submittedAt: Date | null;
        completedAt: Date | null;
        rating: number | null;
        review: string | null;
        kolRating: number | null;
        kolReview: string | null;
        campaignId: string;
        kolId: string;
    }>;
    getMyJobs(req: any): Promise<({
        campaign: {
            brand: {
                id: string;
                companyName: string;
                logo: string | null;
                website: string | null;
                industry: string | null;
                description: string | null;
                taxCode: string | null;
                address: string | null;
                phone: string | null;
                userId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            title: string;
            productName: string;
            productImage: string | null;
            productValue: string;
            requirements: string;
            platform: string;
            status: import(".prisma/client").$Enums.CampaignStatus;
            deadline: Date | null;
            brandId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ApplicationStatus;
        shippingCode: string | null;
        carrier: string | null;
        contentLink: string | null;
        submitNote: string | null;
        approvedAt: Date | null;
        shippedAt: Date | null;
        receivedAt: Date | null;
        submittedAt: Date | null;
        completedAt: Date | null;
        rating: number | null;
        review: string | null;
        kolRating: number | null;
        kolReview: string | null;
        campaignId: string;
        kolId: string;
    })[]>;
    getJobDetail(id: string): Promise<({
        campaign: {
            brand: {
                id: string;
                companyName: string;
                logo: string | null;
                website: string | null;
                industry: string | null;
                description: string | null;
                taxCode: string | null;
                address: string | null;
                phone: string | null;
                userId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            title: string;
            productName: string;
            productImage: string | null;
            productValue: string;
            requirements: string;
            platform: string;
            status: import(".prisma/client").$Enums.CampaignStatus;
            deadline: Date | null;
            brandId: string;
        };
        kol: {
            id: string;
            address: string | null;
            phone: string | null;
            fullName: string;
            avatar: string | null;
            bio: string | null;
            categories: string[];
            platforms: import("@prisma/client/runtime/library").JsonValue | null;
            followers: number;
            socialLink: string | null;
            city: string | null;
            bankName: string | null;
            bankAccount: string | null;
            userId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ApplicationStatus;
        shippingCode: string | null;
        carrier: string | null;
        contentLink: string | null;
        submitNote: string | null;
        approvedAt: Date | null;
        shippedAt: Date | null;
        receivedAt: Date | null;
        submittedAt: Date | null;
        completedAt: Date | null;
        rating: number | null;
        review: string | null;
        kolRating: number | null;
        kolReview: string | null;
        campaignId: string;
        kolId: string;
    }) | null>;
    approve(id: string, dto: ApproveApplicationDto): Promise<{
        campaign: {
            brand: {
                id: string;
                companyName: string;
                logo: string | null;
                website: string | null;
                industry: string | null;
                description: string | null;
                taxCode: string | null;
                address: string | null;
                phone: string | null;
                userId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            title: string;
            productName: string;
            productImage: string | null;
            productValue: string;
            requirements: string;
            platform: string;
            status: import(".prisma/client").$Enums.CampaignStatus;
            deadline: Date | null;
            brandId: string;
        };
        kol: {
            id: string;
            address: string | null;
            phone: string | null;
            fullName: string;
            avatar: string | null;
            bio: string | null;
            categories: string[];
            platforms: import("@prisma/client/runtime/library").JsonValue | null;
            followers: number;
            socialLink: string | null;
            city: string | null;
            bankName: string | null;
            bankAccount: string | null;
            userId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ApplicationStatus;
        shippingCode: string | null;
        carrier: string | null;
        contentLink: string | null;
        submitNote: string | null;
        approvedAt: Date | null;
        shippedAt: Date | null;
        receivedAt: Date | null;
        submittedAt: Date | null;
        completedAt: Date | null;
        rating: number | null;
        review: string | null;
        kolRating: number | null;
        kolReview: string | null;
        campaignId: string;
        kolId: string;
    }>;
    receive(id: string): Promise<{
        campaign: {
            brand: {
                id: string;
                companyName: string;
                logo: string | null;
                website: string | null;
                industry: string | null;
                description: string | null;
                taxCode: string | null;
                address: string | null;
                phone: string | null;
                userId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            title: string;
            productName: string;
            productImage: string | null;
            productValue: string;
            requirements: string;
            platform: string;
            status: import(".prisma/client").$Enums.CampaignStatus;
            deadline: Date | null;
            brandId: string;
        };
        kol: {
            id: string;
            address: string | null;
            phone: string | null;
            fullName: string;
            avatar: string | null;
            bio: string | null;
            categories: string[];
            platforms: import("@prisma/client/runtime/library").JsonValue | null;
            followers: number;
            socialLink: string | null;
            city: string | null;
            bankName: string | null;
            bankAccount: string | null;
            userId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ApplicationStatus;
        shippingCode: string | null;
        carrier: string | null;
        contentLink: string | null;
        submitNote: string | null;
        approvedAt: Date | null;
        shippedAt: Date | null;
        receivedAt: Date | null;
        submittedAt: Date | null;
        completedAt: Date | null;
        rating: number | null;
        review: string | null;
        kolRating: number | null;
        kolReview: string | null;
        campaignId: string;
        kolId: string;
    }>;
    submit(id: string, dto: SubmitContentDto): Promise<{
        campaign: {
            brand: {
                id: string;
                companyName: string;
                logo: string | null;
                website: string | null;
                industry: string | null;
                description: string | null;
                taxCode: string | null;
                address: string | null;
                phone: string | null;
                userId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            title: string;
            productName: string;
            productImage: string | null;
            productValue: string;
            requirements: string;
            platform: string;
            status: import(".prisma/client").$Enums.CampaignStatus;
            deadline: Date | null;
            brandId: string;
        };
        kol: {
            id: string;
            address: string | null;
            phone: string | null;
            fullName: string;
            avatar: string | null;
            bio: string | null;
            categories: string[];
            platforms: import("@prisma/client/runtime/library").JsonValue | null;
            followers: number;
            socialLink: string | null;
            city: string | null;
            bankName: string | null;
            bankAccount: string | null;
            userId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ApplicationStatus;
        shippingCode: string | null;
        carrier: string | null;
        contentLink: string | null;
        submitNote: string | null;
        approvedAt: Date | null;
        shippedAt: Date | null;
        receivedAt: Date | null;
        submittedAt: Date | null;
        completedAt: Date | null;
        rating: number | null;
        review: string | null;
        kolRating: number | null;
        kolReview: string | null;
        campaignId: string;
        kolId: string;
    }>;
    review(id: string, body: {
        rating: number;
        review: string;
    }): Promise<{
        campaign: {
            brand: {
                id: string;
                companyName: string;
                logo: string | null;
                website: string | null;
                industry: string | null;
                description: string | null;
                taxCode: string | null;
                address: string | null;
                phone: string | null;
                userId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            title: string;
            productName: string;
            productImage: string | null;
            productValue: string;
            requirements: string;
            platform: string;
            status: import(".prisma/client").$Enums.CampaignStatus;
            deadline: Date | null;
            brandId: string;
        };
        kol: {
            id: string;
            address: string | null;
            phone: string | null;
            fullName: string;
            avatar: string | null;
            bio: string | null;
            categories: string[];
            platforms: import("@prisma/client/runtime/library").JsonValue | null;
            followers: number;
            socialLink: string | null;
            city: string | null;
            bankName: string | null;
            bankAccount: string | null;
            userId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ApplicationStatus;
        shippingCode: string | null;
        carrier: string | null;
        contentLink: string | null;
        submitNote: string | null;
        approvedAt: Date | null;
        shippedAt: Date | null;
        receivedAt: Date | null;
        submittedAt: Date | null;
        completedAt: Date | null;
        rating: number | null;
        review: string | null;
        kolRating: number | null;
        kolReview: string | null;
        campaignId: string;
        kolId: string;
    }>;
    kolReview(id: string, body: {
        rating: number;
        review: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ApplicationStatus;
        shippingCode: string | null;
        carrier: string | null;
        contentLink: string | null;
        submitNote: string | null;
        approvedAt: Date | null;
        shippedAt: Date | null;
        receivedAt: Date | null;
        submittedAt: Date | null;
        completedAt: Date | null;
        rating: number | null;
        review: string | null;
        kolRating: number | null;
        kolReview: string | null;
        campaignId: string;
        kolId: string;
    }>;
    cancelApp(id: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ApplicationStatus;
        shippingCode: string | null;
        carrier: string | null;
        contentLink: string | null;
        submitNote: string | null;
        approvedAt: Date | null;
        shippedAt: Date | null;
        receivedAt: Date | null;
        submittedAt: Date | null;
        completedAt: Date | null;
        rating: number | null;
        review: string | null;
        kolRating: number | null;
        kolReview: string | null;
        campaignId: string;
        kolId: string;
    }>;
    closeCampaign(id: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        title: string;
        productName: string;
        productImage: string | null;
        productValue: string;
        requirements: string;
        platform: string;
        status: import(".prisma/client").$Enums.CampaignStatus;
        deadline: Date | null;
        brandId: string;
    }>;
    update(id: string, updateData: any, req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        title: string;
        productName: string;
        productImage: string | null;
        productValue: string;
        requirements: string;
        platform: string;
        status: import(".prisma/client").$Enums.CampaignStatus;
        deadline: Date | null;
        brandId: string;
    }>;
    remove(id: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        title: string;
        productName: string;
        productImage: string | null;
        productValue: string;
        requirements: string;
        platform: string;
        status: import(".prisma/client").$Enums.CampaignStatus;
        deadline: Date | null;
        brandId: string;
    }>;
    findOne(id: string): Promise<{
        brand: {
            user: {
                isVerified: boolean;
            };
        } & {
            id: string;
            companyName: string;
            logo: string | null;
            website: string | null;
            industry: string | null;
            description: string | null;
            taxCode: string | null;
            address: string | null;
            phone: string | null;
            userId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        title: string;
        productName: string;
        productImage: string | null;
        productValue: string;
        requirements: string;
        platform: string;
        status: import(".prisma/client").$Enums.CampaignStatus;
        deadline: Date | null;
        brandId: string;
    }>;
}
