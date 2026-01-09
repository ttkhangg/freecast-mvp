import { IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';

// Dữ liệu khi Đăng ký
export class RegisterDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6, { message: 'Password phải có ít nhất 6 ký tự' })
  password: string;

  @IsEnum(['BRAND', 'KOL'], { message: 'Role phải là BRAND hoặc KOL' })
  role: 'BRAND' | 'KOL';
  
  @IsNotEmpty()
  name: string; // Tên công ty hoặc Tên KOL
}

// Dữ liệu khi Đăng nhập
export class LoginDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}


