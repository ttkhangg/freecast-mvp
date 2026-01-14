import { Controller, Get, Patch, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/dto/auth.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN) // CHỈ ADMIN MỚI VÀO ĐƯỢC
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Lấy thống kê hệ thống' })
  getStats() {
    return this.adminService.getStats();
  }

  @Get('users')
  @ApiOperation({ summary: 'Lấy danh sách người dùng (Phân trang)' })
  getUsers(@Query('page', new ParseIntPipe({ optional: true })) page: number = 1) {
    return this.adminService.findAllUsers(page);
  }

  @Patch('users/:id/ban')
  @ApiOperation({ summary: 'Khóa/Mở khóa tài khoản' })
  banUser(@Param('id') id: string) {
    return this.adminService.toggleBan(id);
  }

  @Patch('users/:id/verify')
  @ApiOperation({ summary: 'Duyệt xác minh tài khoản' })
  verifyUser(@Param('id') id: string) {
    return this.adminService.verifyUser(id);
  }
}