import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Task } from '../task/entities/task.entity';

import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { ProjectApplication } from '../project-application/entities/project-application.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project, Task, ProjectApplication])],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectsModule {}
