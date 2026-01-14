import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WsJwtGuard implements CanActivate {
  private logger = new Logger('WsJwtGuard');

  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient();
    
    // Lấy token từ handshake auth hoặc headers
    const token =
      client.handshake.auth?.token || client.handshake.headers?.authorization;

    if (!token) {
      this.logger.error('No token provided');
      throw new WsException('Unauthorized');
    }

    try {
      // Loại bỏ 'Bearer ' nếu có
      const cleanToken = token.replace('Bearer ', '');
      const payload = this.jwtService.verify(cleanToken, {
        secret: process.env.JWT_SECRET,
      });

      // Gắn user vào client socket để dùng sau này
      const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
      if (!user) {
        throw new WsException('User not found');
      }

      // @ts-ignore
      client.user = user;
      return true;
    } catch (err) {
      this.logger.error('Token invalid');
      throw new WsException('Unauthorized');
    }
  }
}