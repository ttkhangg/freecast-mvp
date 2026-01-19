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
@Roles(Role.ADMIN)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Lấy thống kê hệ thống' })
  getStats() {
    return this.adminService.getStats();
  }

  @Get('activity')
  @ApiOperation({ summary: 'Lấy hoạt động gần đây' })
  getActivity() {
      return this.adminService.getRecentActivities();
  }

  @Get('users')
  @ApiOperation({ summary: 'Quản lý Users' })
  getUsers(
      @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
      @Query('search') search?: string
  ) {
    return this.adminService.findAllUsers(page, search);
  }

  @Patch('users/:id/ban')
  banUser(@Param('id') id: string) {
    return this.adminService.toggleBan(id);
  }

  @Patch('users/:id/verify')
  verifyUser(@Param('id') id: string) {
    return this.adminService.verifyUser(id);
  }

  @Get('campaigns')
  @ApiOperation({ summary: 'Quản lý Campaigns toàn hệ thống' })
  getCampaigns(
      @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
      @Query('search') search?: string
  ) {
      return this.adminService.findAllCampaigns(page, search);
  }
}