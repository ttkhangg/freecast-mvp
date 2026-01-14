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
    this.logger.log(`Registering new user: ${dto.email}`);

    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      this.logger.warn(`Registration failed: Email ${dto.email} already exists`);
      throw new ConflictException('Email này đã được sử dụng');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        fullName: dto.fullName,
        role: dto.role,
      },
    });

    const token = this.generateToken(user.id, user.email, user.role);
    
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role as any,
      },
    };
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    if (user.isBanned) {
      throw new UnauthorizedException('Tài khoản đã bị khóa');
    }

    const token = this.generateToken(user.id, user.email, user.role);
    this.logger.log(`User logged in: ${user.id}`);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role as any,
      },
    };
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    this.logger.log(`Updating profile for user: ${userId}`);
    
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    // CLEAN DATA: Chuyển chuỗi rỗng thành null để tránh lỗi validation DB hoặc logic sau này
    const cleanData = { ...dto };
    if (cleanData.socialLink === '') cleanData.socialLink = null;
    if (cleanData.bio === '') cleanData.bio = null;
    if (cleanData.phone === '') cleanData.phone = null;

    try {
      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: cleanData,
        select: {
          id: true,
          email: true,
          fullName: true,
          avatar: true,
          bio: true,
          phone: true,
          socialLink: true,
          role: true,
          isEmailVerified: true,
          createdAt: true,
        }
      });
      
      this.logger.log(`Profile updated successfully for: ${userId}`);
      // Chuẩn hóa response trả về đúng format User Interface ở Frontend
      return {
        ...updatedUser,
        createdAt: updatedUser.createdAt.toISOString(),
      };
    } catch (error) {
      this.logger.error(`Failed to update profile: ${error.message}`);
      throw error;
    }
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true, email: true, fullName: true, avatar: true, bio: true, phone: true, socialLink: true, role: true, isEmailVerified: true, createdAt: true
        }
    });
    
    if (user) {
        return {
            ...user,
            createdAt: user.createdAt.toISOString()
        }
    }
    return null;
  }

  private generateToken(userId: string, email: string, role: string): string {
    const payload = { sub: userId, email, role };
    return this.jwtService.sign(payload);
  }
}