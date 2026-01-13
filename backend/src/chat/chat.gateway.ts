import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: { origin: '*' }, // Cho phép Frontend kết nối
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  // 1. Khi User vào trang chi tiết đơn hàng -> Join vào "phòng chat" riêng của đơn đó
  @SubscribeMessage('joinRoom')
  handleJoinRoom(@MessageBody() applicationId: string, @ConnectedSocket() client: Socket) {
    client.join(applicationId); // Join room theo ID đơn hàng
  }

  // 2. Khi User gửi tin nhắn
  @SubscribeMessage('sendMessage')
  async handleMessage(@MessageBody() payload: { applicationId: string, senderId: string, content: string }) {
    // Lưu vào DB
    const newMessage = await this.chatService.saveMessage(payload.applicationId, payload.senderId, payload.content);
    
    // Bắn tin nhắn này tới TẤT CẢ mọi người trong phòng (bao gồm cả người gửi)
    this.server.to(payload.applicationId).emit('newMessage', newMessage);
  }
}