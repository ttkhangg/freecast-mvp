import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Chat')
@Controller('chat')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('conversations')
  @ApiOperation({ summary: 'Lấy danh sách các cuộc hội thoại' })
  async getConversations(@Request() req) {
    return this.chatService.getConversations(req.user.id);
  }

  @Get(':applicationId')
  @ApiOperation({ summary: 'Lấy lịch sử tin nhắn' })
  async getMessages(@Request() req, @Param('applicationId') applicationId: string) {
    return this.chatService.getMessages(req.user.id, applicationId);
  }
}