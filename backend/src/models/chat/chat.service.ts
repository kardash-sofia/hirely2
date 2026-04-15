import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Chat } from './entities/chat.entity';
import { ChatParticipant } from '../chat-participant/entities/chat-participant.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class ChatService {
  constructor(private readonly dataSource: DataSource) {}

  async createChat(userIds: string[], title?: string, isGroup = false) {
    return this.dataSource.transaction(async manager => {
      const chat = manager.create(Chat, { isGroup, title });
      await manager.save(chat);

      for (const userId of userIds) {
        const user = await manager.findOne(User, { where: { id: userId } });
        if (!user) continue;

        const participant = manager.create(ChatParticipant, {
          chatId: chat.id,
          userId: user.id,
          isActive: true,
        });
        await manager.save(participant);
      }

      return manager.findOne(Chat, {
        where: { id: chat.id },
        relations: ['participants', 'participants.user'],
      });
    });
  }

  async getUserChats(userId: string) {
    const chats = await this.dataSource
      .getRepository(Chat)
      .createQueryBuilder('chat')
      .innerJoin(
        'chat.participants',
        'participant',
        'participant.userId = :userId AND participant.isActive = true',
        { userId },
      )
      .leftJoinAndSelect('chat.participants', 'participants')
      .leftJoinAndSelect('participants.user', 'user')
      .getMany();

    return chats;
  }

  async createMessage(chatId: string, senderId: string, content: string) {
    const messageRepo = this.dataSource.getRepository('Message');
    const message = messageRepo.create({
      chatId,
      senderId,
      content,
      isRead: false,
    });
    await messageRepo.save(message);
    return message;
  }
}
