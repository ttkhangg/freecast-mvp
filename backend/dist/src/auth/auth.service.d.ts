import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { UpdateBrandProfileDto, UpdateKolProfileDto } from './dto/update-profile.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(dto: RegisterDto): Promise<{
        message: string;
        userId: string;
    }>;
    login(dto: LoginDto): Promise<{
        access_token: string;
        role: import(".prisma/client").$Enums.Role;
    }>;
    updateKolProfile(userId: string, dto: UpdateKolProfileDto): Promise<{
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
    updateBrandProfile(userId: string, dto: UpdateBrandProfileDto): Promise<{
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
    getMe(userId: string): Promise<({
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
    getNotifications(userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        title: string;
        message: string;
        isRead: boolean;
        link: string | null;
    }[]>;
    markRead(notiId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        title: string;
        message: string;
        isRead: boolean;
        link: string | null;
    }>;
    getPublicKolProfile(kolId: string): Promise<{
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
