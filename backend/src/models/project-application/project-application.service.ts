import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateProjectApplicationDto } from './dto/create-project-application.dto';
import { Project } from '../project/entities/project.entity';
import { ProjectStatus } from '../project/constants';
import { ProjectApplication } from './entities/project-application.entity';
import { ApplicationStatus } from './types';

@Injectable()
export class ProjectApplicationService {
  constructor(private readonly dataSource: DataSource) {}

  async create(dto: CreateProjectApplicationDto, currentUserId: string) {
    const project = await this.dataSource.getRepository(Project).findOne({
      where: { id: dto.projectId },
      relations: ['owner'],
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.status !== ProjectStatus.OPEN) {
      throw new BadRequestException('Project is not open for applications');
    }

    const existing = await this.dataSource.getRepository(ProjectApplication).findOne({
      where: {
        projectId: dto.projectId,
        freelancerId: currentUserId,
      },
    });

    if (existing) {
      throw new ConflictException('You already applied to this project');
    }

    const application = this.dataSource.getRepository(ProjectApplication).create({
      ...dto,
      freelancerId: currentUserId,
      status: ApplicationStatus.PENDING,
    });

    return await this.dataSource.getRepository(ProjectApplication).save(application);
  }

  async accept(applicationId: string, currentUserId: string) {
    return await this.dataSource.transaction(async manager => {
      const applicationRepo = manager.getRepository(ProjectApplication);
      const projectRepo = manager.getRepository(Project);

      const application = await applicationRepo.findOne({
        where: { id: applicationId },
        relations: ['project'],
      });

      if (!application) {
        throw new NotFoundException('Application not found');
      }

      if (application.project.ownerId !== currentUserId) {
        throw new ForbiddenException('You cannot accept this application');
      }

      if (application.status !== ApplicationStatus.PENDING) {
        throw new BadRequestException('Application is not pending');
      }

      if (application.project.status !== ProjectStatus.OPEN) {
        throw new BadRequestException('Project is not open');
      }

      application.status = ApplicationStatus.ACCEPTED;
      await applicationRepo.save(application);

      await projectRepo.update(application.projectId, {
        executorId: application.freelancerId,
        status: ProjectStatus.IN_PROGRESS,
      });

      await applicationRepo
        .createQueryBuilder()
        .update(ProjectApplication)
        .set({ status: ApplicationStatus.REJECTED })
        .where('projectId = :projectId', { projectId: application.projectId })
        .andWhere('id != :id', { id: application.id })
        .andWhere('status = :status', { status: ApplicationStatus.PENDING })
        .execute();

      return application;
    });
  }

  async getMyApplications(userId: string) {
    return await this.dataSource.getRepository(ProjectApplication).find({
      where: { freelancerId: userId },
      relations: {
        project: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async withdraw(applicationId: string, userId: string) {
    const application = await this.dataSource.getRepository(ProjectApplication).findOne({
      where: { id: applicationId },
      relations: {
        project: true,
      },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    if (application.freelancerId !== userId) {
      throw new ForbiddenException('You can withdraw only your own application');
    }

    if (application.status !== ApplicationStatus.PENDING) {
      throw new BadRequestException('Only pending applications can be withdrawn');
    }

    if (application.project.status !== ProjectStatus.OPEN) {
      throw new BadRequestException(
        'Application cannot be withdrawn because project is no longer open',
      );
    }

    application.status = ApplicationStatus.WITHDRAWN;

    return await this.dataSource.getRepository(ProjectApplication).save(application);
  }

  async reject(applicationId: string, userId: string) {
    const application = await this.dataSource.getRepository(ProjectApplication).findOne({
      where: { id: applicationId },
      relations: {
        project: true,
      },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    if (!application.project) {
      throw new NotFoundException('Project not found');
    }

    if (application.project.ownerId !== userId) {
      throw new ForbiddenException('You can reject applications only for your own projects');
    }

    if (application.status !== ApplicationStatus.PENDING) {
      throw new BadRequestException('Only pending applications can be rejected');
    }

    if (application.project.status !== ProjectStatus.OPEN) {
      throw new BadRequestException('Only applications for open projects can be rejected');
    }

    application.status = ApplicationStatus.REJECTED;

    return await this.dataSource.getRepository(ProjectApplication).save(application);
  }
}
