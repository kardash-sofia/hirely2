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

      if (!token) {
        client.disconnect();
        return;
      }

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

  @SubscribeMessage('createDirectChat')
  async handleCreateDirectChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { targetUserId: string },
  ) {
    try {
      const currentUserId = client.data.user?.sub;

      if (!currentUserId) {
        return { error: 'Unauthorized' };
      }

      if (!payload?.targetUserId) {
        return { error: 'targetUserId is required' };
      }

      const chat = await this.chatService.findOrCreateDirectChat(
        currentUserId,
        payload.targetUserId,
      );

      chat?.participants.forEach(p => {
        this.server.to(`user:${p.userId}`).emit('newChat', chat);
      });

      return chat;
    } catch (error) {
      console.error('createDirectChat error:', error);
      return {
        error: error instanceof Error ? error.message : 'Something went wrong',
      };
    }
  }

  @SubscribeMessage('getChats')
  async handleGetChats(@ConnectedSocket() client: Socket) {
    try {
      const currentUserId = client.data.user?.sub;

      if (!currentUserId) {
        return { error: 'Unauthorized' };
      }

      const chats = await this.chatService.getUserChats(currentUserId);
      return chats;
    } catch (error) {
      console.error('getChats error:', error);
      return {
        error: error instanceof Error ? error.message : 'Something went wrong',
      };
    }
  }

  @SubscribeMessage('joinChat')
  async handleJoinChat(@MessageBody() chatId: string, @ConnectedSocket() client: Socket) {
    try {
      const currentUserId = client.data.user?.sub;

      if (!currentUserId) {
        return { error: 'Unauthorized' };
      }

      if (!chatId) {
        return { error: 'chatId is required' };
      }

      const hasAccess = await this.chatService.isParticipant(chatId, currentUserId);

      if (!hasAccess) {
        return { error: 'Access denied' };
      }

      await client.join(`chat:${chatId}`);

      const messages = await this.messageService.getMessages(chatId);
      client.emit('chatMessages', messages);

      return { success: true };
    } catch (error) {
      console.error('joinChat error:', error);
      return {
        error: error instanceof Error ? error.message : 'Something went wrong',
      };
    }
  }

  @SubscribeMessage('leaveChat')
  handleLeaveChat(@ConnectedSocket() client: Socket, @MessageBody() chatId: string) {
    if (!chatId) {
      return { error: 'chatId is required' };
    }

    client.leave(`chat:${chatId}`);
    return { success: true };
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { chatId: string; content: string },
  ) {
    try {
      const currentUserId = client.data.user?.sub;

      if (!currentUserId) {
        return { error: 'Unauthorized' };
      }

      if (!payload?.chatId) {
        return { error: 'chatId is required' };
      }

      if (!payload?.content?.trim()) {
        return { error: 'Message content is required' };
      }

      const hasAccess = await this.chatService.isParticipant(payload.chatId, currentUserId);

      if (!hasAccess) {
        return { error: 'Access denied' };
      }

      const messageId = await this.chatService.createMessage(
        payload.chatId,
        currentUserId,
        payload.content,
      );

      const message = {
        id: messageId,
        chatId: payload.chatId,
        content: payload.content,
        senderId: currentUserId,
      };

      this.server.to(`chat:${payload.chatId}`).emit('newMessage', message);

      return message;
    } catch (error) {
      console.error('sendMessage error:', error);
      return {
        error: error instanceof Error ? error.message : 'Something went wrong',
      };
    }
  }
}
