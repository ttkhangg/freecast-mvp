import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // 1. ĐĂNG KÝ
  async register(dto: RegisterDto) {
    // Check xem email tồn tại chưa
    const userExists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (userExists) throw new BadRequestException('Email đã tồn tại');

    // Mã hóa password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Lưu User vào DB
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        role: dto.role,
        // Tạo luôn Profile tương ứng
        brandProfile: dto.role === 'BRAND' ? { create: { companyName: dto.name } } : undefined,
        kolProfile: dto.role === 'KOL' ? { create: { fullName: dto.name } } : undefined,
      },
    });

    return { message: 'Đăng ký thành công', userId: user.id };
  }

  // 2. ĐĂNG NHẬP
  async login(dto: LoginDto) {
    // Tìm user
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) throw new UnauthorizedException('Email hoặc mật khẩu sai');

    // So sánh password
    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Email hoặc mật khẩu sai');

    // Tạo Token
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
      role: user.role,
    };
  }
}


