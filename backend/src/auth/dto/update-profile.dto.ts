import { IsString, IsOptional, IsUrl, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
  bio?: string;

  @ApiProperty({ required: false, example: 'https://res.cloudinary.com/...' })
  @IsString() // Avatar là chuỗi URL, nhưng ta dùng IsString để dễ tính hơn (hoặc IsUrl cũng được)
  @IsOptional()
  avatar?: string; 

  @ApiProperty({ required: false, example: '0912345678' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ required: false, example: 'https://facebook.com/me' })
  @IsUrl({}, { message: 'Link mạng xã hội không hợp lệ' }) // Chỉ validate nếu giá trị khác null/undefined
  @IsOptional()
  socialLink?: string;
}