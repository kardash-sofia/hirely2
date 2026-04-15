import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { User } from '../user/entities/user.entity';
import { Chat } from '../chat/entities/chat.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepo: Repository<Message>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Chat)
    private chatRepo: Repository<Chat>,
  ) {}

  async getMessages(chatId: string) {
    const messages = await this.messageRepo.find({
      where: { chatId },
      order: { createdAt: 'ASC' },
      relations: ['sender'],
    });
    console.log(`Fetched ${messages.length} messages for chat ${chatId}`);
    console.log(messages);
    return messages;
  }
}
