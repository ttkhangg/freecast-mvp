import { PrismaService } from '../prisma/prisma.service';
export declare class ChatService {
    private prisma;
    constructor(prisma: PrismaService);
    saveMessage(applicationId: string, senderId: string, content: string): Promise<{
        sender: {
            id: string;
            email: string;
            role: import(".prisma/client").$Enums.Role;
            brandProfile: {
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
            } | null;
            kolProfile: {
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
            } | null;
        };
    } & {
        id: string;
        createdAt: Date;
        content: string;
        senderId: string;
        applicationId: string;
    }>;
    getMessages(applicationId: string): Promise<({
        sender: {
            id: string;
            email: string;
            role: import(".prisma/client").$Enums.Role;
            brandProfile: {
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
            } | null;
            kolProfile: {
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
            } | null;
        };
    } & {
        id: string;
        createdAt: Date;
        content: string;
        senderId: string;
        applicationId: string;
    })[]>;
    getConversations(userId: string): Promise<({
        messages: {
            id: string;
            createdAt: Date;
            content: string;
            senderId: string;
            applicationId: string;
        }[];
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
    })[]>;
}
