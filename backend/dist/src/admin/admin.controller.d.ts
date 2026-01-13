import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    private checkAdmin;
    getStats(req: any): Promise<{
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
    getUsers(req: any, page: string, search: string): Promise<{
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
    toggleVerify(req: any, id: string): Promise<{
        id: string;
        email: string;
        password: string;
        role: import(".prisma/client").$Enums.Role;
        isVerified: boolean;
        isBanned: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    toggleBan(req: any, id: string): Promise<{
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
