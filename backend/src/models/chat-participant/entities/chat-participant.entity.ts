import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/base/base.entity';
import { User } from '../../user/entities/user.entity';
import { Chat } from '../../chat/entities/chat.entity';

@Entity('chat_participants')
export class ChatParticipant extends BaseEntity {
  @Column()
  chatId: string;

  @Column()
  userId: string;

  @ManyToOne(() => Chat, chat => chat.participants)
  @JoinColumn({ name: 'chatId' })
  chat: Chat;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ default: true })
  isActive: boolean;
}
