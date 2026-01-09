import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module'; // <-- THÊM DÒNG NÀY

@Module({
  imports: [
    PrismaModule, // <-- THÊM DÒNG NÀY ĐỂ SỬA LỖI
    JwtModule.register({
      global: true,
      secret: 'SUPER_SECRET_KEY_123', // Thực tế nên để trong .env
      signOptions: { expiresIn: '1d' }, // Token hết hạn sau 1 ngày
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}


