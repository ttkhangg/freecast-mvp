import { IsString, IsNotEmpty, IsNumber, Min, IsDateString, IsOptional, IsEnum, IsArray } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export enum CampaignStatus {
  OPEN = 'OPEN',
  PAUSED = 'PAUSED',
  CLOSED = 'CLOSED',
  COMPLETED = 'COMPLETED',
}

export class CreateCampaignDto {
  @ApiProperty({ example: 'Chiến dịch Review Mỹ Phẩm Mùa Hè' })
  @IsString()
  @IsNotEmpty({ message: 'Tiêu đề không được để trống' })
  title: string;

  @ApiProperty({ example: 'Cần 5 KOL review son dưỡng...' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'Yêu cầu: Nữ, 18-25 tuổi, da sáng...' })
  @IsString()
  @IsOptional()
  requirements?: string;

  @ApiProperty({ example: 5000000, description: 'Nếu = 0 nghĩa là Tặng sản phẩm / Thương lượng' })
  @IsNumber()
  @Min(0, { message: 'Ngân sách không được âm' })
  budget: number;

  @ApiProperty({ example: '2026-12-31T00:00:00.000Z' })
  @IsDateString({}, { message: 'Deadline phải là định dạng ngày tháng hợp lệ' })
  deadline: string;

  // NEW: Album ảnh (V2.4)
  @ApiProperty({ example: ['https://img1.com', 'https://img2.com'], required: false })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  images?: string[];
}

export class UpdateCampaignDto extends PartialType(CreateCampaignDto) {
  @ApiProperty({ enum: CampaignStatus, required: false })
  @IsEnum(CampaignStatus)
  @IsOptional()
  status?: CampaignStatus;
}