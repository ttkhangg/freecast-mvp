import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UseGuards, Logger } from '@nestjs/common';
import { WsJwtGuard } from './ws-jwt.guard';

@WebSocketGateway({
  cors: {
    origin: '*', 
    credentials: true,
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;
  private logger = new Logger('ChatGateway');

  constructor(private readonly chatService: ChatService) {}

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('joinRoom')
  handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() payload: { applicationId: string }) {
    client.join(payload.applicationId);
    this.logger.log(`Client ${client.id} joined room ${payload.applicationId}`);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('sendMessage')
  async handleMessage(@ConnectedSocket() client: Socket, @MessageBody() payload: CreateMessageDto) {
    try {
      // @ts-ignore
      const userId = client.user.id;
      
      // 1. LƯU VÀO DB TRƯỚC
      const message = await this.chatService.saveMessage(userId, payload);
      this.logger.log(`Message saved to DB: ${message.id}`);

      // 2. GỬI LẠI CHO PHÒNG CHAT
      this.server.to(payload.applicationId).emit('newMessage', message);
      
      return message;
    } catch (error) {
      this.logger.error(`Send message failed: ${error.message}`);
      client.emit('error', 'Gửi tin nhắn thất bại: ' + error.message);
    }
  }
}