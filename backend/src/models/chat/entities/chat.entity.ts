import { ChatParticipant } from '../../chat-participant/entities/chat-participant.entity';
import { BaseEntity } from '../../../common/base/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Message } from '../../message/entities/message.entity';

@Entity('chats')
export class Chat extends BaseEntity {
  @Column({ default: false })
  isGroup: boolean;

  @Column({ nullable: true })
  title: string;

  @OneToMany(() => ChatParticipant, cp => cp.chat)
  participants: ChatParticipant[];

  @OneToMany(() => Message, message => message.chat)
  messages: Message[];
}
