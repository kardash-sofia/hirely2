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
import { GetProjectsQueryDto, ProjectDto, ProjectListItemDto } from './dto/get-projects.dto';
import { ConstantsDto } from './dto/constants.dto';
import { Category } from '../category/entities/category.entity';
import { Technology } from '../technology/entities/technology.entity';

const hardcodedOwner = {
  id: '098d10c2-b014-4a3d-b650-2fe4ee453785',
  fullName: 'John Doe',
  email: 'john.doe@example.com',
};

@Injectable()
export class ProjectService {
  constructor(private readonly dataSource: DataSource) {}

  async getProjects(query: GetProjectsQueryDto) {
    console.log('Query received in service:', query);
    const {
      limit = 10,
      offset = 0,
      status,
      categories,
      technologies,
      sorts = [{ field: 'createdAt', order: 'DESC' }],
    } = query;

    const qb = this.dataSource
      .getRepository(Project)
      .createQueryBuilder('project')
      //.leftJoinAndSelect('project.owner', 'owner')
      .leftJoinAndSelect('project.projectCategories', 'pc')
      .leftJoinAndSelect('pc.category', 'category')
      .leftJoinAndSelect('project.projectTechnologies', 'pt')
      .leftJoinAndSelect('pt.technology', 'technology');

    if (status) {
      qb.andWhere('project.status = :status', { status });
    }

    if (categories?.length) {
      qb.andWhere('category.id IN (:...categories)', { categories });
    }

    if (technologies?.length) {
      qb.andWhere('technology.id IN (:...technologies)', { technologies });
    }

    qb.take(limit);
    qb.skip(offset);

    sorts.forEach(sort => {
      qb.addOrderBy(`project.${sort.field}`, sort.order);
    });

    const [projects, total] = await qb.getManyAndCount();

    const items: ProjectListItemDto[] = projects.map(project => {
      const dto: ProjectDto = {
        id: project.id,
        title: project.title,
        description: project.description,
        owner: {
          id: project.owner?.id || hardcodedOwner.id,
          fullName: project.owner?.fullName || hardcodedOwner.fullName,
          email: project.owner?.authUser?.email || hardcodedOwner.email,
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
    console.log('Getting project by ID:', id);
    const project = await this.dataSource.getRepository(Project).findOne({
      where: { id },
      relations: [
        'projectCategories',
        'projectCategories.category',
        'projectTechnologies',
        'projectTechnologies.technology',
      ],
      //   'owner',
      //   'executor',
      //   'tasks',
      //   'projectCategories',
      //   'projectCategories.category',
      //   'projectTechnologies',
      //   'projectTechnologies.technology',
      // ],
    });

    if (!project) {
      return null;
    }

    return {
      ...project,
      projectCategories: project.projectCategories?.map(pc => ({
        id: pc.category.id,
        name: pc.category.name,
      })),
      projectTechnologies: project.projectTechnologies?.map(pt => ({
        id: pt.technology.id,
        name: pt.technology.name,
      })),
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

  async getProjectConstants(): Promise<ConstantsDto> {
    const categories = await this.dataSource.getRepository(Category).find();

    const technologies = await this.dataSource.getRepository(Technology).find();

    return {
      categories: categories.map(pc => ({
        id: pc.id,
        name: pc.name,
      })),
      technologies: technologies.map(pt => ({
        id: pt.id,
        name: pt.name,
      })),
    };
  }
}
