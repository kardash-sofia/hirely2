import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

import { User } from '../user/entities/user.entity';
import { Project } from '../project/entities/project.entity';
import { ProjectApplication } from '../project-application/entities/project-application.entity';
import { Message } from '../message/entities/message.entity';
import { ProjectCategory } from '../project-category/entities/project-category.entity';
import { ProjectTechnology } from '../project-technology/entities/project-technology.entity';

import { AdminGuard } from '../../common/guards/admin.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Project,
      ProjectApplication,
      Message,
      ProjectCategory,
      ProjectTechnology,
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService, AdminGuard],
})
export class AdminModule {}
