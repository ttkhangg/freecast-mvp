import { Body, Controller, Post, Get, Put, Request, UseGuards, Patch, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { UpdateBrandProfileDto, UpdateKolProfileDto } from './dto/update-profile.dto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) { return this.authService.register(dto); }

  @Post('login')
  login(@Body() dto: LoginDto) { return this.authService.login(dto); }

  @UseGuards(AuthGuard)
  @Get('me')
  getMe(@Request() req) { return this.authService.getMe(req.user.sub); }

  @UseGuards(AuthGuard)
  @Put('profile/kol')
  updateKol(@Request() req, @Body() dto: UpdateKolProfileDto) {
    return this.authService.updateKolProfile(req.user.sub, dto);
  }

  @UseGuards(AuthGuard)
  @Put('profile/brand')
  updateBrand(@Request() req, @Body() dto: UpdateBrandProfileDto) {
    return this.authService.updateBrandProfile(req.user.sub, dto);
  }

  @UseGuards(AuthGuard)
  @Get('notifications')
  getNotifications(@Request() req) {
    return this.authService.getNotifications(req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Patch('notifications/:id/read')
  markRead(@Param('id') id: string) {
    return this.authService.markRead(id);
  }

  // --- MỚI (PHASE 7.3): Public Profile API ---
  // API này không cần AuthGuard vì Brand chưa đăng nhập cũng có thể xem (Viral)
  // Hoặc Brand đã đăng nhập xem chi tiết ứng viên
  @Get('public/kol/:id')
  getPublicKol(@Param('id') id: string) {
    return this.authService.getPublicKolProfile(id);
  }
}