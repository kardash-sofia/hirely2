import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '../user/entities/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthUser } from '../auth/entities/auth.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, AuthUser])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UsersModule {}
