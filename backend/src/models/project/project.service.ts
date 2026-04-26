import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { plainToInstance } from 'class-transformer';

import { CreateProjectDto } from './dto/create-project.dto';
import { Project } from './entities/project.entity';
import { Task } from '../task/entities/task.entity';
import { ProjectCategory } from '../project-category/entities/project-category.entity';
import { ProjectTechnology } from '../project-technology/entities/project-technology.entity';
import { ProjectStatus } from './constants';
import { TaskStatus } from '../task/constants';
import { GetProjectsQueryDto, ProjectDto, ProjectListItemDto } from './dto/get-projects.dto';
import { ConstantsDto } from './dto/constants.dto';
import { Category } from '../category/entities/category.entity';
import { Technology } from '../technology/entities/technology.entity';
import { ProjectApplication } from '../project-application/entities/project-application.entity';
import { ApplicationStatus } from '../project-application/types';

@Injectable()
export class ProjectService {
  constructor(private readonly dataSource: DataSource) {}

  async getProjects(query: GetProjectsQueryDto) {
    const {
      limit = 10,
      offset = 0,
      status,
      categories,
      technologies,
      sortField = 'createdAt',
      sortOrder = 'DESC',
    } = query;

    const qb = this.dataSource
      .getRepository(Project)
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.owner', 'owner')
      .leftJoinAndSelect('owner.authUser', 'ownerAuthUser')
      .leftJoinAndSelect('project.projectCategories', 'pc')
      .leftJoinAndSelect('pc.category', 'category')
      .leftJoinAndSelect('project.projectTechnologies', 'pt')
      .leftJoinAndSelect('pt.technology', 'technology');

    const normalizeArray = (value?: string[] | string) => {
      if (!value) return undefined;
      return Array.isArray(value) ? value : [value];
    };

    const categoriesArray = normalizeArray(categories);
    const technologiesArray = normalizeArray(technologies);

    if (status) {
      qb.andWhere('project.status = :status', { status });
    }

    if (categoriesArray?.length) {
      qb.andWhere('category.id IN (:...categories)', {
        categories: categoriesArray,
      });
    }

    if (technologiesArray?.length) {
      qb.andWhere('technology.id IN (:...technologies)', {
        technologies: technologiesArray,
      });
    }

    qb.take(limit);
    qb.skip(offset);
    qb.addOrderBy(`project.${sortField}`, sortOrder);

    const [projects, total] = await qb.getManyAndCount();

    const items: ProjectListItemDto[] = projects.map(project => {
      const dto: ProjectDto = {
        id: project.id,
        title: project.title,
        description: project.description,
        owner: {
          id: project.owner?.id,
          fullName: project.owner?.fullName,
          email: project.owner?.authUser?.email,
        },
        budgetMin: project.budgetMin,
        budgetMax: project.budgetMax,
        status: project.status,
        categories: project.projectCategories?.map(pc => pc.category.name) ?? [],
        technologies: project.projectTechnologies?.map(pt => pt.technology.name) ?? [],
      };

      return plainToInstance(ProjectListItemDto, dto, {
        excludeExtraneousValues: true,
      });
    });

    return { items, total };
  }

  async getProjectById(id: string) {
    const project = await this.dataSource.getRepository(Project).findOne({
      where: { id },
      relations: [
        'owner',
        'owner.authUser',
        'executor',
        'executor.authUser',
        'tasks',
        'projectCategories',
        'projectCategories.category',
        'projectTechnologies',
        'projectTechnologies.technology',
      ],
    });

    if (!project) {
      return null;
    }

    return {
      ...project,
      projectCategories:
        project.projectCategories?.map(pc => ({
          id: pc.category.id,
          name: pc.category.name,
        })) ?? [],
      projectTechnologies:
        project.projectTechnologies?.map(pt => ({
          id: pt.technology.id,
          name: pt.technology.name,
        })) ?? [],
      owner: {
        id: project.owner?.id,
        fullName: project.owner?.fullName,
        email: project.owner?.authUser?.email,
      },
      executor: project.executor
        ? {
            id: project.executor.id,
            fullName: project.executor.fullName,
            email: project.executor.authUser?.email,
          }
        : null,
    };
  }

  async createProject(dto: CreateProjectDto, ownerId: string) {
    return this.dataSource.transaction(async manager => {
      const project = manager.create(Project, {
        title: dto.title,
        description: dto.description,
        dueDate: dto.dueDate,
        budgetMin: dto.budgetMin,
        budgetMax: dto.budgetMax,
        ownerId,
        status: ProjectStatus.OPEN,
      });

      await manager.save(project);

      if (dto.tasks?.length) {
        const tasks = dto.tasks.map(t =>
          manager.create(Task, {
            ...t,
            projectId: project.id,
            status: TaskStatus.DRAFT,
          }),
        );
        await manager.save(tasks);
      }

      if (dto.categoryIds?.length) {
        const pcs = dto.categoryIds.map(categoryId =>
          manager.create(ProjectCategory, {
            projectId: project.id,
            categoryId,
          }),
        );
        await manager.save(pcs);
      }

      if (dto.technologyIds?.length) {
        const pts = dto.technologyIds.map(technologyId =>
          manager.create(ProjectTechnology, {
            projectId: project.id,
            technologyId,
          }),
        );
        await manager.save(pts);
      }

      return project;
    });
  }

  async getProjectConstants(): Promise<ConstantsDto> {
    const categories = await this.dataSource.getRepository(Category).find();
    const technologies = await this.dataSource.getRepository(Technology).find();

    return {
      categories: categories.map(item => ({ id: item.id, name: item.name })),
      technologies: technologies.map(item => ({ id: item.id, name: item.name })),
    };
  }

  async getProjectApplications(projectId: string, userId: string) {
    const project = await this.dataSource.getRepository(Project).findOne({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.ownerId !== userId) {
      throw new ForbiddenException('You can view applications only for your own project');
    }

    return this.dataSource.getRepository(ProjectApplication).find({
      where: { projectId },
      relations: {
        freelancer: { authUser: true },
      },
      order: { createdAt: 'DESC' },
    });
  }

  async getMyProjectApplication(projectId: string, userId: string) {
    return this.dataSource.getRepository(ProjectApplication).findOne({
      where: {
        projectId,
        freelancerId: userId,
      },
      relations: {
        project: true,
      },
    });
  }

  async submitForReview(projectId: string, userId: string) {
    return this.dataSource.transaction(async manager => {
      const projectRepo = manager.getRepository(Project);
      const taskRepo = manager.getRepository(Task);

      const project = await projectRepo.findOne({
        where: { id: projectId },
      });

      if (!project) {
        throw new NotFoundException('Project not found');
      }

      if (project.executorId !== userId) {
        throw new ForbiddenException('Only assigned executor can submit project for review');
      }

      if (project.status !== ProjectStatus.IN_PROGRESS) {
        throw new BadRequestException('Only projects in progress can be submitted for review');
      }

      await projectRepo.update(project.id, {
        status: ProjectStatus.PENDING_REVIEW,
      });

      await taskRepo
        .createQueryBuilder()
        .update(Task)
        .set({ status: TaskStatus.IN_REVIEW })
        .where('projectId = :projectId', { projectId })
        .andWhere('status IN (:...statuses)', {
          statuses: [TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.ON_HOLD],
        })
        .execute();

      return projectRepo.findOne({ where: { id: projectId } });
    });
  }

  async requestRework(projectId: string, userId: string) {
    return this.dataSource.transaction(async manager => {
      const projectRepo = manager.getRepository(Project);
      const taskRepo = manager.getRepository(Task);

      const project = await projectRepo.findOne({
        where: { id: projectId },
      });

      if (!project) {
        throw new NotFoundException('Project not found');
      }

      if (project.ownerId !== userId) {
        throw new ForbiddenException('Only project owner can request rework');
      }

      if (project.status !== ProjectStatus.PENDING_REVIEW) {
        throw new BadRequestException('Only projects pending review can be returned for rework');
      }

      await projectRepo.update(project.id, {
        status: ProjectStatus.IN_PROGRESS,
      });

      await taskRepo
        .createQueryBuilder()
        .update(Task)
        .set({ status: TaskStatus.IN_PROGRESS })
        .where('projectId = :projectId', { projectId })
        .andWhere('status = :status', { status: TaskStatus.IN_REVIEW })
        .execute();

      return projectRepo.findOne({ where: { id: projectId } });
    });
  }

  async completeProject(projectId: string, userId: string) {
    return this.dataSource.transaction(async manager => {
      const projectRepo = manager.getRepository(Project);
      const taskRepo = manager.getRepository(Task);

      const project = await projectRepo.findOne({
        where: { id: projectId },
      });

      if (!project) {
        throw new NotFoundException('Project not found');
      }

      if (project.ownerId !== userId) {
        throw new ForbiddenException('Only project owner can complete this project');
      }

      if (project.status !== ProjectStatus.PENDING_REVIEW) {
        throw new BadRequestException('Only projects pending review can be completed');
      }

      await projectRepo.update(project.id, {
        status: ProjectStatus.COMPLETED,
      });

      await taskRepo
        .createQueryBuilder()
        .update(Task)
        .set({ status: TaskStatus.COMPLETED })
        .where('projectId = :projectId', { projectId })
        .andWhere('status IN (:...statuses)', {
          statuses: [
            TaskStatus.TODO,
            TaskStatus.IN_PROGRESS,
            TaskStatus.ON_HOLD,
            TaskStatus.IN_REVIEW,
            TaskStatus.DRAFT,
          ],
        })
        .execute();

      return projectRepo.findOne({ where: { id: projectId } });
    });
  }

  async cancelProject(projectId: string, userId: string) {
    return this.dataSource.transaction(async manager => {
      const projectRepo = manager.getRepository(Project);
      const taskRepo = manager.getRepository(Task);
      const applicationRepo = manager.getRepository(ProjectApplication);

      const project = await projectRepo.findOne({
        where: { id: projectId },
      });

      if (!project) {
        throw new NotFoundException('Project not found');
      }

      if (project.ownerId !== userId) {
        throw new ForbiddenException('Only project owner can cancel this project');
      }

      if (
        ![ProjectStatus.OPEN, ProjectStatus.IN_PROGRESS, ProjectStatus.PENDING_REVIEW].includes(
          project.status,
        )
      ) {
        throw new BadRequestException('This project cannot be cancelled from current status');
      }

      await projectRepo.update(project.id, {
        status: ProjectStatus.CANCELLED,
      });

      await taskRepo
        .createQueryBuilder()
        .update(Task)
        .set({ status: TaskStatus.CANCELLED })
        .where('projectId = :projectId', { projectId })
        .andWhere('status IN (:...statuses)', {
          statuses: [
            TaskStatus.DRAFT,
            TaskStatus.TODO,
            TaskStatus.IN_PROGRESS,
            TaskStatus.ON_HOLD,
            TaskStatus.IN_REVIEW,
          ],
        })
        .execute();

      await applicationRepo
        .createQueryBuilder()
        .update(ProjectApplication)
        .set({ status: ApplicationStatus.REJECTED })
        .where('projectId = :projectId', { projectId })
        .andWhere('status = :status', { status: ApplicationStatus.PENDING })
        .execute();

      return projectRepo.findOne({ where: { id: projectId } });
    });
  }
}
