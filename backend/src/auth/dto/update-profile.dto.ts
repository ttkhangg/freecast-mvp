import { IsString, IsOptional } from 'class-validator';

export class UpdateKolProfileDto {
  @IsString() @IsOptional() fullName?: string;
  @IsString() @IsOptional() bio?: string;
  @IsString() @IsOptional() phone?: string;
  @IsString() @IsOptional() address?: string;
  @IsString() @IsOptional() bankName?: string;
  @IsString() @IsOptional() bankAccount?: string;
  @IsString() @IsOptional() socialLink?: string;
  @IsString() @IsOptional() avatar?: string;
}

export class UpdateBrandProfileDto {
  @IsString() @IsOptional() companyName?: string;
  @IsString() @IsOptional() description?: string;
  @IsString() @IsOptional() website?: string;
  @IsString() @IsOptional() industry?: string;
  @IsString() @IsOptional() address?: string;
  @IsString() @IsOptional() phone?: string;
  @IsString() @IsOptional() logo?: string; // NEW: Thêm trường logo
}
