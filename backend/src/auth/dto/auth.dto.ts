import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// Định nghĩa Role khớp với Prisma Schema
export enum Role {
  ADMIN = 'ADMIN',
  BRAND = 'BRAND',
  KOL = 'KOL',
}

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsString()
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  password: string;

  @ApiProperty({ example: 'Nguyen Van A' })
  @IsString()
  @IsNotEmpty({ message: 'Họ tên không được để trống' })
  fullName: string;

  @ApiProperty({ enum: Role, example: 'KOL' })
  @IsEnum(Role, { message: 'Role phải là ADMIN, BRAND hoặc KOL' })
  role: Role;
}

export class LoginDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class AuthResponseDto {
  token: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: Role;
  };
}