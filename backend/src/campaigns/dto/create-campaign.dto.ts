import { IsNotEmpty, IsString } from 'class-validator';

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

  @IsNotEmpty()
  brandId: string; // Tạm thời client gửi lên, sau này sẽ lấy từ Token
}
