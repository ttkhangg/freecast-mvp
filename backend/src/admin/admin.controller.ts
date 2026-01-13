import { Controller, Get, Patch, Param, Query, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // Middleware nội bộ: Kiểm tra quyền Admin
  // (Đảm bảo chỉ user có role 'ADMIN' mới được gọi các API này)
  private checkAdmin(req: any) {
    if (req.user.role !== 'ADMIN') throw new ForbiddenException('Access Denied: Admin Only');
  }

  @UseGuards(AuthGuard)
  @Get('stats')
  getStats(@Request() req) {
    this.checkAdmin(req); // Bắt buộc check quyền
    return this.adminService.getStats();
  }

  // --- API MỚI: Quản lý User (Có phân trang & tìm kiếm) ---
  @UseGuards(AuthGuard)
  @Get('users')
  getUsers(@Request() req, @Query('page') page: string, @Query('search') search: string) {
    this.checkAdmin(req);
    return this.adminService.getUsers(Number(page) || 1, 10, search);
  }

  // --- API MỚI: Xác thực User (Tick xanh) ---
  @UseGuards(AuthGuard)
  @Patch('users/:id/verify')
  toggleVerify(@Request() req, @Param('id') id: string) {
    this.checkAdmin(req);
    return this.adminService.toggleVerifyUser(id);
  }

  // --- API MỚI: Chặn / Bỏ chặn User (Tech Debt #4) ---
  @UseGuards(AuthGuard)
  @Patch('users/:id/ban')
  toggleBan(@Request() req, @Param('id') id: string) {
    this.checkAdmin(req);
    return this.adminService.toggleBanUser(id);
  }
}