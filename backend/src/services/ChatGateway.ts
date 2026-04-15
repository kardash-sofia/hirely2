import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from 'src/models/chat/chat.service';
import { MessageService } from 'src/models/message/message.service';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private jwtService: JwtService,
    private chatService: ChatService,
    private messageService: MessageService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;

      const user = this.jwtService.verify(token);

      client.data.user = user;
      await client.join(`user:${user.sub}`);
    } catch (e) {
      console.error('Connection error:', e.message);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log('Disconnected:', client.id);
  }

  @SubscribeMessage('createChat')
  async handleCreateChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { userIds: string[]; title?: string },
  ) {
    const chat = await this.chatService.createChat(payload.userIds, payload.title);

    chat?.participants.forEach(p => {
      this.server.to(`user:${p.userId}`).emit('newChat', chat);
    });

    return chat;
  }

  @SubscribeMessage('getChats')
  async handleGetChats(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { userId: string },
  ) {
    const chats = await this.chatService.getUserChats(payload.userId);
    return chats;
  }

  @SubscribeMessage('joinChat')
  async handleJoinChat(@MessageBody() chatId: string, @ConnectedSocket() client: Socket) {
    client.join(`chat:${chatId}`);
    const messages = await this.messageService.getMessages(chatId);

    client.emit('chatMessages', messages);
  }

  @SubscribeMessage('leaveChat')
  handleLeaveChat(@ConnectedSocket() client: Socket, @MessageBody() chatId: string) {
    client.leave(`chat:${chatId}`);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { chatId: string; content: string },
  ) {
    const user = client.data.user;

    const messageId = await this.chatService.createMessage(
      payload.chatId,
      user.sub,
      payload.content,
    );

    const message = {
      id: messageId,
      chatId: payload.chatId,
      content: payload.content,
      senderId: user.sub,
    };
    this.server.to(`chat:${payload.chatId}`).emit('newMessage', message);

    return message;
  }
}
