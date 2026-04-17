import { BadRequestException, Injectable } from '@nestjs/common';
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

  async findOrCreateDirectChat(currentUserId: string, targetUserId: string) {
    if (!currentUserId || !targetUserId) {
      throw new BadRequestException('Both users are required');
    }

    if (currentUserId === targetUserId) {
      throw new BadRequestException('Cannot create chat with yourself');
    }

    const existingChats = await this.dataSource
      .getRepository(Chat)
      .createQueryBuilder('chat')
      .leftJoinAndSelect('chat.participants', 'participant')
      .where('participant.userId IN (:...userIds)', {
        userIds: [currentUserId, targetUserId],
      })
      .getMany();

    const existingDirectChat = existingChats.find(chat => {
      if (!chat.participants || chat.participants.length !== 2) return false;

      const ids = chat.participants.map(p => p.userId).sort();
      const expected = [currentUserId, targetUserId].sort();

      return ids[0] === expected[0] && ids[1] === expected[1];
    });

    if (existingDirectChat) {
      return existingDirectChat;
    }

    const chat = this.dataSource.getRepository(Chat).create({
      title: undefined,
    });

    const savedChat = await this.dataSource.getRepository(Chat).save(chat);

    const participants = this.dataSource.getRepository(ChatParticipant).create([
      {
        chatId: savedChat.id,
        userId: currentUserId,
      },
      {
        chatId: savedChat.id,
        userId: targetUserId,
      },
    ]);

    await this.dataSource.getRepository(ChatParticipant).save(participants);

    return this.dataSource.getRepository(Chat).findOne({
      where: { id: savedChat.id },
      relations: {
        participants: true,
      },
    });
  }

  async getUserChats(userId: string) {
    const chatsRaw = await this.dataSource
      .getRepository(Chat)
      .createQueryBuilder('chat')
      .leftJoinAndSelect('chat.participants', 'participant')
      .leftJoinAndSelect('participant.user', 'user')
      .innerJoin('chat.participants', 'myParticipant', 'myParticipant.userId = :userId', { userId })
      .orderBy('chat.updatedAt', 'DESC')
      .getMany();

    const chats = chatsRaw.map(chat => {
      const otherParticipant = chat.participants.find(p => p.userId !== userId);

      return {
        ...chat,
        title: otherParticipant?.user?.fullName || chat.title || '-',
      };
    });

    return chats;
  }
  async isParticipant(chatId: string, userId: string) {
    const participant = await this.dataSource.getRepository(ChatParticipant).findOne({
      where: {
        chatId,
        userId,
      },
    });

    return !!participant;
  }
}
