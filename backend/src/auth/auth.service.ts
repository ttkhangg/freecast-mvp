import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto, AuthResponseDto } from './dto/auth.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    const existingUser = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existingUser) throw new ConflictException('Email đã tồn tại');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    const user = await this.prisma.user.create({
      data: { email: dto.email, password: hashedPassword, fullName: dto.fullName, role: dto.role },
    });

    const token = this.generateToken(user.id, user.email, user.role);
    return { token, user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role as any } };
  }

  async login(dto: LoginDto): Promise<AuthResponseDto & { rating?: number }> {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Sai thông tin đăng nhập');
    }
    if (user.isBanned) throw new UnauthorizedException('Tài khoản bị khóa');

    const token = this.generateToken(user.id, user.email, user.role);
    const rating = await this.calculateUserRating(user.id);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role as any,
        avatar: user.avatar,
      },
      rating,
    };
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    
    const cleanData = { ...dto };
    if (cleanData.socialLink === '') cleanData.socialLink = null;
    if (cleanData.bio === '') cleanData.bio = null;
    if (cleanData.phone === '') cleanData.phone = null;

    return this.prisma.user.update({
      where: { id: userId },
      data: cleanData,
      select: { id: true, email: true, fullName: true, avatar: true, bio: true, phone: true, socialLink: true, role: true, isEmailVerified: true }
    });
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true, email: true, fullName: true, avatar: true, bio: true, phone: true, socialLink: true, role: true, isEmailVerified: true, createdAt: true
        }
    });
    
    if (user) {
        const rating = await this.calculateUserRating(userId);
        return { ...user, rating };
    }
    return null;
  }

  private generateToken(userId: string, email: string, role: string): string {
    const payload = { sub: userId, email, role };
    return this.jwtService.sign(payload);
  }

  private async calculateUserRating(userId: string): Promise<number> {
    const reviews = await this.prisma.review.findMany({
        where: { targetId: userId },
        select: { rating: true }
    });

    if (reviews.length === 0) return 0;
    const total = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    return Number((total / reviews.length).toFixed(1));
  }
}