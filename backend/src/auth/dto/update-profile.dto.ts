import { IsString, IsOptional, IsUrl, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class UpdateProfileDto {
  @ApiProperty({ required: false, example: 'Nguyen Van A' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  fullName?: string;

  @ApiProperty({ required: false, example: 'I love coding...' })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  @Transform(({ value }) => value === '' ? null : value) // Biến "" thành null
  bio?: string;

  @ApiProperty({ required: false, example: 'https://res.cloudinary.com/...' })
  @IsString()
  @IsOptional()
  avatar?: string; 

  @ApiProperty({ required: false, example: '0912345678' })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value === '' ? null : value)
  phone?: string;

  @ApiProperty({ required: false, example: 'https://facebook.com/me' })
  @IsOptional()
  @Transform(({ value }) => value === '' ? null : value)
  @IsUrl({}, { message: 'Link mạng xã hội phải là URL hợp lệ (http/https)' })
  socialLink?: string;
}