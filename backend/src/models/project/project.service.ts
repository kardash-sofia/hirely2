import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { CreateProjectDto } from './dto/create-project.dto';
import { Project } from './entities/project.entity';
import { Task } from '../task/entities/task.entity';
import { ProjectCategory } from '../project-category/entities/project-category.entity';
import { ProjectTechnology } from '../project-technology/entities/project-technology.entity';
import { ProjectStatus } from './constants';
import { TaskStatus } from '../task/constants';
import {
  GetProjectsQueryDto,
  ProjectListItemDto,
  ProjectWithCategories,
} from './dto/get-projects.dto';

const hardcodedOwner = {
  id: '098d10c2-b014-4a3d-b650-2fe4ee453785',
  username: 'JohnDoe',
  email: 'john.doe@example.com',
};

@Injectable()
export class ProjectService {
  constructor(private readonly dataSource: DataSource) {}

  async getProjects(query: GetProjectsQueryDto) {
    const { limit = 10, offset = 0, status, categories } = query;

    const qb = this.dataSource
      .getRepository(Project)
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.projectCategories', 'pc')
      .leftJoinAndSelect('pc.category', 'category');

    if (status) {
      qb.andWhere('project.status = :status', { status });
    }

    if (categories?.length) {
      qb.andWhere('pc.categoryId IN (:...categories)', { categories });
    }

    qb.take(limit);
    qb.skip(offset);

    qb.orderBy('project.createdAt', 'DESC');

    const [projects, total] = await qb.getManyAndCount();

    const items: ProjectListItemDto[] = projects.map(project => {
      const dto: ProjectWithCategories = {
        id: project.id,
        title: project.title,
        description: project.description,
        owner: hardcodedOwner,
        budgetMin: project.budgetMin,
        budgetMax: project.budgetMax,
        categories: project.projectCategories?.map(pc => pc.category.name) ?? [],
      };

      return plainToInstance(ProjectListItemDto, dto, {
        excludeExtraneousValues: true,
      }) as ProjectListItemDto;
    });

    return { items, total };
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
        const pcs = dto.categoryIds.map(catId =>
          manager.create(ProjectCategory, {
            projectId: project.id,
            categoryId: catId,
          }),
        );

        await manager.save(pcs);
      }

      if (dto.technologyIds?.length) {
        const pts = dto.technologyIds.map(techId =>
          manager.create(ProjectTechnology, {
            projectId: project.id,
            technologyId: techId,
          }),
        );

        await manager.save(pts);
      }

      return project;
    });
  }
}
