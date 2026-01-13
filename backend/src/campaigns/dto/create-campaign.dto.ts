import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateCampaignDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  productName: string;

  @IsNotEmpty()
  productValue: string;

  @IsNotEmpty()
  requirements: string;

  @IsNotEmpty()
  platform: string;

  @IsOptional()
  @IsString()
  deadline?: string;

  @IsOptional()
  brandId?: string; 

  // FIX: Thêm trường này để lưu ảnh
  @IsOptional()
  @IsString()
  productImage?: string;
}
