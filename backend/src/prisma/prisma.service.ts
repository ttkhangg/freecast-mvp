import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  // Kết nối khi Module khởi chạy
  async onModuleInit() {
    await this.$connect();
  }

  // Ngắt kết nối sạch sẽ khi Module tắt
  async onModuleDestroy() {
    await this.$disconnect();
  }
}