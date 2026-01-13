import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get(':applicationId')
  getMessages(@Param('applicationId') applicationId: string) {
    return this.chatService.getMessages(applicationId);
  }

  // --- API MỚI ---
  @UseGuards(AuthGuard)
  @Get('conversations/all')
  getConversations(@Request() req) {
    return this.chatService.getConversations(req.user.sub);
  }
}