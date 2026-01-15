import { Module } from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { CampaignsController } from './campaigns.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module'; // Để dùng Guard
import { NotificationsModule } from '../notifications/notifications.module'; // QUAN TRỌNG: Import module này

@Module({
  imports: [
    PrismaModule, 
    AuthModule,
    NotificationsModule // Thêm vào đây để CampaignsService dùng được NotificationsService
  ],
  controllers: [CampaignsController],
  providers: [CampaignsService],
  exports: [CampaignsService],
})
export class CampaignsModule {}