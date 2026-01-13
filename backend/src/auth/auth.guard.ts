import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service'; // Import Prisma để check DB
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService // Inject Prisma Service
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      // 1. Xác thực Token
      const payload = await this.jwtService.verifyAsync(token, {
        secret: 'SUPER_SECRET_KEY_123', // Lưu ý: Nên dùng process.env.JWT_SECRET ở môi trường thật
      });

      // 2. KIỂM TRA TRẠNG THÁI BAN (Logic mới cho Phase 7.2.3)
      // Truy vấn DB để xem user có bị khóa không
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub }
      });

      if (!user) {
        throw new UnauthorizedException('User no longer exists');
      }

      if (user.isBanned) {
        throw new ForbiddenException('Tài khoản của bạn đã bị khóa vĩnh viễn do vi phạm chính sách.');
      }

      // 3. Gán user vào request để các Controller sử dụng
      // Payload chứa: sub (id), email, role
      request['user'] = { ...payload, role: user.role }; 

    } catch (error) {
      // Nếu là lỗi bị Ban (Forbidden) thì ném ra nguyên văn
      if (error instanceof ForbiddenException) {
        throw error;
      }
      // Các lỗi khác (token hết hạn, sai token...) thì báo Unauthorized
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}