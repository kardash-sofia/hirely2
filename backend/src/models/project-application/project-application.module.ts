import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectApplication } from '../project-application/entities/project-application.entity';
import { ProjectApplicationService } from './project-application.service';
import { ProjectApplicationController } from './project-application.controller';
import { Project } from '../project/entities/project.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project, ProjectApplication])],
  controllers: [ProjectApplicationController],
  providers: [ProjectApplicationService],
})
export class ProjectApplicationModule {}
