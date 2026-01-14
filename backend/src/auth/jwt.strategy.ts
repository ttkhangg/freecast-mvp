import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      // Lấy token từ header: Authorization: Bearer <token>
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'SuperSecretKeyForUnicornDev2026',
    });
  }

  // Hàm này chạy sau khi Token đã được verify chữ ký thành công
  async validate(payload: any) {
    // Kiểm tra xem User còn tồn tại trong DB không (phòng trường hợp đã bị xóa)
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException('Người dùng không còn tồn tại');
    }

    if (user.isBanned) {
      throw new UnauthorizedException('Tài khoản của bạn đã bị khóa');
    }

    // Trả về user object, nó sẽ được gắn vào request.user
    // Các field nhạy cảm như password đã bị loại bỏ ở service, nhưng cẩn thận thì bỏ ở đây nữa cũng được
    return { 
      id: user.id, 
      email: user.email, 
      role: user.role, 
      fullName: user.fullName 
    };
  }
}