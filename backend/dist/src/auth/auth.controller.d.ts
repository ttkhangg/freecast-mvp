import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { UpdateBrandProfileDto, UpdateKolProfileDto } from './dto/update-profile.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        message: string;
        userId: string;
    }>;
    login(dto: LoginDto): Promise<{
        access_token: string;
        role: import(".prisma/client").$Enums.Role;
    }>;
    getMe(req: any): Promise<({
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
    } & {
        id: string;
        email: string;
        password: string;
        role: import(".prisma/client").$Enums.Role;
        isVerified: boolean;
        isBanned: boolean;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
    updateKol(req: any, dto: UpdateKolProfileDto): Promise<{
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
    }>;
    updateBrand(req: any, dto: UpdateBrandProfileDto): Promise<{
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
    }>;
    getNotifications(req: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        title: string;
        message: string;
        isRead: boolean;
        link: string | null;
    }[]>;
    markRead(id: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        title: string;
        message: string;
        isRead: boolean;
        link: string | null;
    }>;
    getPublicKol(id: string): Promise<{
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
    }>;
}
