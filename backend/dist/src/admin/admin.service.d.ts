import { PrismaService } from '../prisma/prisma.service';
export declare class AdminService {
    private prisma;
    constructor(prisma: PrismaService);
    getStats(): Promise<{
        totalUsers: number;
        totalCampaigns: number;
        totalApplications: number;
        applicationStats: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.ApplicationGroupByOutputType, "status"[]> & {
            _count: {
                id: number;
            };
        })[];
        growthData: {
            name: string;
            users: number;
            revenue: number;
        }[];
    }>;
    getUsers(page?: number, limit?: number, search?: string): Promise<{
        data: {
            brandProfile: {
                companyName: string;
            } | null;
            kolProfile: {
                fullName: string;
            } | null;
            id: string;
            email: string;
            role: import(".prisma/client").$Enums.Role;
            isVerified: boolean;
            isBanned: boolean;
            createdAt: Date;
            updatedAt: Date;
        }[];
        meta: {
            total: number;
            page: number;
            last_page: number;
        };
    }>;
    toggleVerifyUser(id: string): Promise<{
        id: string;
        email: string;
        password: string;
        role: import(".prisma/client").$Enums.Role;
        isVerified: boolean;
        isBanned: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    toggleBanUser(id: string): Promise<{
        id: string;
        email: string;
        password: string;
        role: import(".prisma/client").$Enums.Role;
        isVerified: boolean;
        isBanned: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
