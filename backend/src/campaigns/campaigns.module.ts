import { Module } from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { CampaignsController } from './campaigns.controller';
import { PrismaModule } from '../prisma/prisma.module'; // <-- IMPORT PRISMA

@Module({
  imports: [PrismaModule], // <-- THÊM VÀO ĐÂY
  controllers: [CampaignsController],
  providers: [CampaignsService],
})
export class CampaignsModule {}
