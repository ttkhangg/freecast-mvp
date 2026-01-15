import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards, Logger } from '@nestjs/common';
import { WsJwtGuard } from '../chat/ws-jwt.guard'; // Tái sử dụng Guard xịn của Chat

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  
  private logger = new Logger('NotificationsGateway');

  handleConnection(client: Socket) {
    // this.logger.log(`Client connected to Notif: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    // this.logger.log(`Client disconnected from Notif: ${client.id}`);
  }

  // Client sẽ join vào room riêng của mình (Room ID = User ID)
  @UseGuards(WsJwtGuard)
  @SubscribeMessage('joinNotificationChannel')
  handleJoinChannel(@ConnectedSocket() client: Socket) {
    // @ts-ignore
    const userId = client.user.id;
    client.join(`user_${userId}`);
    this.logger.log(`User ${userId} joined notification channel`);
  }

  // Hàm này để Service gọi khi muốn bắn thông báo
  sendNotificationToUser(userId: string, notification: any) {
    this.server.to(`user_${userId}`).emit('newNotification', notification);
  }
}