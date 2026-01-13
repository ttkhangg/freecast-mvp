import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { UpdateBrandProfileDto, UpdateKolProfileDto } from './dto/update-profile.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async register(dto: RegisterDto) {
    const userExists = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (userExists) throw new BadRequestException('Email đã tồn tại');

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        role: dto.role,
        brandProfile: dto.role === 'BRAND' ? { create: { companyName: dto.name } } : undefined,
        kolProfile: dto.role === 'KOL' ? { create: { fullName: dto.name } } : undefined,
      },
    });
    return { message: 'Đăng ký thành công', userId: user.id };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Sai thông tin đăng nhập');
    }
    
    // Check Ban status (Tech Debt #4)
    if (user.isBanned) {
      throw new UnauthorizedException('Tài khoản của bạn đã bị khóa vĩnh viễn do vi phạm chính sách.');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    return { access_token: await this.jwtService.signAsync(payload), role: user.role };
  }

  async updateKolProfile(userId: string, dto: UpdateKolProfileDto) {
    // Với KOL, trường ảnh là 'avatar'
    return this.prisma.kolProfile.update({
      where: { userId },
      data: {
        fullName: dto.fullName,
        bio: dto.bio,
        phone: dto.phone,
        address: dto.address,
        bankName: dto.bankName,
        bankAccount: dto.bankAccount,
        socialLink: dto.socialLink,
        avatar: dto.avatar, 
      }
    });
  }

  async updateBrandProfile(userId: string, dto: UpdateBrandProfileDto) {
    // Với Brand, trường ảnh là 'logo'. 
    // DTO đã được chuẩn hóa ở Bước 6.1 Hành động 1 để có trường 'logo'.
    return this.prisma.brandProfile.update({
      where: { userId },
      data: {
        companyName: dto.companyName,
        description: dto.description,
        website: dto.website,
        industry: dto.industry,
        address: dto.address,
        phone: dto.phone,
        logo: dto.logo, // Sử dụng đúng trường logo
      }
    });
  }

  async getMe(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: { brandProfile: true, kolProfile: true }
    });
  }

  async getNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20 
    });
  }

  async markRead(notiId: string) {
    return this.prisma.notification.update({
      where: { id: notiId },
      data: { isRead: true }
    });
  }

  async getPublicKolProfile(kolId: string) {
    const kol = await this.prisma.kolProfile.findUnique({
      where: { id: kolId },
      include: {
        user: { select: { isVerified: true } }
      }
    });

    if (!kol) throw new NotFoundException('Không tìm thấy KOL này');
    return kol;
  }
}