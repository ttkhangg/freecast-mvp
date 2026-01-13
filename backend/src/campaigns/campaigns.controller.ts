import { Body, Controller, Get, Post, Param, UseGuards, Request, Patch, Query, Delete } from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { ApproveApplicationDto, SubmitContentDto } from './dto/booking.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  // --- FIX GÓI 1: Tự động lấy Brand ID từ Token ---
  @UseGuards(AuthGuard)
  @Post()
  create(@Request() req, @Body() createCampaignDto: CreateCampaignDto) {
    // Truyền userId (req.user.sub) xuống service để tự tìm Brand Profile
    return this.campaignsService.create(req.user.sub, createCampaignDto);
  }

  @Get()
  findAll(@Query('search') search?: string, @Query('platform') platform?: string) {
    return this.campaignsService.findAll(search, platform);
  }

  @UseGuards(AuthGuard)
  @Get('brand/my-campaigns')
  getMyCampaigns(@Request() req) {
    return this.campaignsService.getBrandCampaigns(req.user.sub);
  }

  @Get(':id/applicants')
  getApplicants(@Param('id') id: string) {
    return this.campaignsService.getApplicants(id);
  }

  @UseGuards(AuthGuard)
  @Post(':id/apply')
  apply(@Param('id') id: string, @Request() req) {
    return this.campaignsService.apply(id, req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Get('my-jobs')
  getMyJobs(@Request() req) {
    return this.campaignsService.getMyJobs(req.user.sub);
  }

  @Get('application/:id')
  getJobDetail(@Param('id') id: string) {
    return this.campaignsService.getJobDetail(id);
  }

  @Patch('application/:id/approve')
  approve(@Param('id') id: string, @Body() dto: ApproveApplicationDto) {
    return this.campaignsService.approveApplication(id, dto);
  }

  @Patch('application/:id/receive')
  receive(@Param('id') id: string) {
    return this.campaignsService.confirmReceived(id);
  }

  @Patch('application/:id/submit')
  submit(@Param('id') id: string, @Body() dto: SubmitContentDto) {
    return this.campaignsService.submitContent(id, dto);
  }

  @Patch('application/:id/review')
  review(@Param('id') id: string, @Body() body: { rating: number, review: string }) {
    return this.campaignsService.reviewApplication(id, body.rating, body.review);
  }

  @Patch('application/:id/kol-review')
  kolReview(@Param('id') id: string, @Body() body: { rating: number, review: string }) {
    return this.campaignsService.kolReviewBrand(id, body.rating, body.review);
  }

  @UseGuards(AuthGuard)
  @Patch('application/:id/cancel')
  cancelApp(@Param('id') id: string, @Request() req) {
    return this.campaignsService.cancelApplication(id, req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Patch(':id/close')
  closeCampaign(@Param('id') id: string, @Request() req) {
    return this.campaignsService.closeCampaign(id, req.user.sub);
  }

  // --- MỚI (PHASE 7.3): Sửa thông tin Campaign ---
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateData: any, @Request() req) {
    return this.campaignsService.update(id, req.user.sub, updateData);
  }

  // --- MỚI (PHASE 7.3): Xóa Campaign ---
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.campaignsService.remove(id, req.user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.campaignsService.findOne(id);
  }
}