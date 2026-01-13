import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
export declare class ChatGateway {
    private readonly chatService;
    server: Server;
    constructor(chatService: ChatService);
    handleJoinRoom(applicationId: string, client: Socket): void;
    handleMessage(payload: {
        applicationId: string;
        senderId: string;
        content: string;
    }): Promise<void>;
}
