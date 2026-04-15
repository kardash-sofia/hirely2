import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './infrastructure/database/typeorm.config';
import { ProjectsModule } from './models/project/project.module';
import { AuthModule } from './models/auth/auth.module';
import { ChatModule } from './models/chat/chat.module';
import { MessageModule } from './models/message/message.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    ProjectsModule,
    AuthModule,
    ChatModule,
    MessageModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
