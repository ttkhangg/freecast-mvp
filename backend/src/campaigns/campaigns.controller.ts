import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { CreateCampaignDto, UpdateCampaignDto } from './dto/create-campaign.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/dto/auth.dto';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@ApiTags('Campaigns')
@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.BRAND)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo chiến dịch' })
  create(@Request() req, @Body() createCampaignDto: CreateCampaignDto) {
    return this.campaignsService.create(req.user.id, createCampaignDto);
  }

  @Get('brand/my-campaigns')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.BRAND)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy chiến dịch của Brand' })
  findMyCampaigns(@Request() req) {
    return this.campaignsService.findMyCampaigns(req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy tất cả chiến dịch (Public)' })
  findAll() {
    return this.campaignsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Xem chi tiết chiến dịch' })
  findOne(@Param('id') id: string) {
    return this.campaignsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.BRAND)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật chiến dịch' })
  update(@Request() req, @Param('id') id: string, @Body() updateCampaignDto: UpdateCampaignDto) {
    return this.campaignsService.update(id, req.user.id, updateCampaignDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.BRAND, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa chiến dịch' })
  remove(@Request() req, @Param('id') id: string) {
    return this.campaignsService.remove(id, req.user.id);
  }

  // --- BOOKING & APPLICATION API ---

  @Post(':id/apply')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.KOL)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'KOL Ứng tuyển' })
  apply(@Request() req, @Param('id') id: string) {
    return this.campaignsService.apply(id, req.user.id);
  }

  @Delete(':id/apply')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.KOL)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'KOL Huỷ Ứng tuyển' })
  cancelApply(@Request() req, @Param('id') id: string) {
    return this.campaignsService.cancelApplication(id, req.user.id);
  }

  @Patch('application/:id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.BRAND)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Duyệt đơn ứng tuyển' })
  approveApplication(@Request() req, @Param('id') id: string) {
    return this.campaignsService.approveApplication(id, req.user.id);
  }

  @Patch('application/:id/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.BRAND)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Từ chối đơn ứng tuyển' })
  rejectApplication(@Request() req, @Param('id') id: string) {
    return this.campaignsService.rejectApplication(id, req.user.id);
  }

  @Get('application/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy chi tiết đơn (Kèm địa chỉ KOL)' })
  getAppDetail(@Request() req, @Param('id') id: string) {
    return this.campaignsService.getApplicationDetail(id, req.user.id);
  }

  @Patch('application/:id/tracking')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.BRAND)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Brand cập nhật mã vận đơn' })
  @ApiBody({ schema: { properties: { trackingCode: { type: 'string' } } } })
  updateTracking(@Request() req, @Param('id') id: string, @Body('trackingCode') code: string) {
    return this.campaignsService.updateTracking(id, req.user.id, code);
  }

  @Patch('application/:id/receive')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.KOL)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'KOL xác nhận nhận hàng' })
  confirmProduct(@Request() req, @Param('id') id: string) {
    return this.campaignsService.confirmProductReceived(id, req.user.id);
  }

  @Patch('application/:id/submit')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.KOL)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'KOL nộp link bài đăng' })
  @ApiBody({ schema: { properties: { link: { type: 'string' } } } })
  submitWork(@Request() req, @Param('id') id: string, @Body('link') link: string) {
    return this.campaignsService.submitWork(id, req.user.id, link);
  }

  @Patch('application/:id/complete')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.BRAND)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Brand hoàn tất đơn hàng' })
  completeJob(@Request() req, @Param('id') id: string) {
    return this.campaignsService.completeJob(id, req.user.id);
  }
}