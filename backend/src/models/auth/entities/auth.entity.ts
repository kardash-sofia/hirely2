import { Column, Entity, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../common/base/base.entity';
import { User } from '../../../models/user/entities/user.entity';

@Entity('auth_users')
export class AuthUser extends BaseEntity {
  @Column()
  email: string;

  @Column()
  password_hash: string;

  @Column({ nullable: true })
  refresh_token: string;

  @OneToOne(() => User, user => user.authUser)
  user: User;
}
