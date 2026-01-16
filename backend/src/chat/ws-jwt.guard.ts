import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WsJwtGuard implements CanActivate {
  private logger = new Logger('WsJwtGuard');

  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
    private configService: ConfigService, // Inject ConfigService để lấy env chuẩn
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient();
    
    // Lấy token từ handshake auth hoặc headers
    const token =
      client.handshake.auth?.token || client.handshake.headers?.authorization;

    if (!token) {
      this.logger.error('No token provided in handshake');
      throw new WsException('Unauthorized: No token provided');
    }

    try {
      // Loại bỏ 'Bearer ' nếu có để lấy raw token
      const cleanToken = token.replace('Bearer ', '').trim();
      
      // FIX LỖI: Lấy JWT_SECRET chính xác từ môi trường
      // Nếu không có env thì dùng chuỗi mặc định (chỉ dùng cho dev)
      const secret = this.configService.get<string>('JWT_SECRET') || 'SuperSecretKeyForUnicornDev2026';

      // Verify thủ công với secret key cụ thể
      const payload = await this.jwtService.verifyAsync(cleanToken, {
        secret: secret
      });

      // Gắn user vào client socket để dùng sau này (trong Gateway)
      const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
      
      if (!user) {
        this.logger.warn(`User not found for ID: ${payload.sub}`);
        throw new WsException('User not found');
      }

      // @ts-ignore
      client.user = user;
      return true;
    } catch (err) {
      // Log rõ lỗi ra để debug
      this.logger.error(`Token verification failed: ${err.message}`);
      
      if (err.message === 'invalid signature') {
         this.logger.warn('Critical: Chữ ký Token không khớp. Vui lòng kiểm tra JWT_SECRET trong .env');
      }
      
      throw new WsException('Unauthorized: Invalid token');
    }
  }
}