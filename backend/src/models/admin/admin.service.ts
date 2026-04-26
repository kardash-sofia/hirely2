import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../user/entities/user.entity';
import { Roles } from '../user/constants';
import { Project } from '../project/entities/project.entity';
import { ProjectStatus } from '../project/constants';
import { ProjectApplication } from '../project-application/entities/project-application.entity';
import { Message } from '../message/entities/message.entity';
import { ProjectCategory } from '../project-category/entities/project-category.entity';
import { ProjectTechnology } from '../project-technology/entities/project-technology.entity';
import {
  AdminDashboardDto,
  BudgetByCategoryDto,
  ChartItemDto,
  MonthlyChartItemDto,
} from './dto/admin-dashboard.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,

    @InjectRepository(ProjectApplication)
    private readonly applicationRepository: Repository<ProjectApplication>,

    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,

    @InjectRepository(ProjectCategory)
    private readonly projectCategoryRepository: Repository<ProjectCategory>,

    @InjectRepository(ProjectTechnology)
    private readonly projectTechnologyRepository: Repository<ProjectTechnology>,
  ) {}

  async getDashboard(): Promise<AdminDashboardDto> {
    const [
      users,
      freelancers,
      customers,
      admins,
      projects,
      openProjects,
      completedProjects,
      applications,
      messages,
      usersByRole,
      projectsByStatus,
      applicationsByStatus,
      projectsByCategory,
      mostUsedTechnologies,
      projectsByMonth,
      applicationsByMonth,
      averageBudgetByCategory,
      budget,
    ] = await Promise.all([
      this.userRepository.count(),
      this.userRepository.count({ where: { role: Roles.FREELANCER } }),
      this.userRepository.count({ where: { role: Roles.CUSTOMER } }),
      this.userRepository.count({ where: { role: Roles.ADMIN } }),
      this.projectRepository.count(),
      this.projectRepository.count({ where: { status: ProjectStatus.OPEN } }),
      this.projectRepository.count({ where: { status: ProjectStatus.COMPLETED } }),
      this.applicationRepository.count(),
      this.messageRepository.count(),

      this.getUsersByRole(),
      this.getProjectsByStatus(),
      this.getApplicationsByStatus(),
      this.getProjectsByCategory(),
      this.getMostUsedTechnologies(),
      this.getProjectsByMonth(),
      this.getApplicationsByMonth(),
      this.getAverageBudgetByCategory(),
      this.getBudgetAnalytics(),
    ]);

    return {
      totals: {
        users,
        freelancers,
        customers,
        admins,
        projects,
        openProjects,
        completedProjects,
        applications,
        messages,
      },
      budget,
      usersByRole,
      projectsByStatus,
      applicationsByStatus,
      projectsByCategory,
      mostUsedTechnologies,
      projectsByMonth,
      applicationsByMonth,
      averageBudgetByCategory,
    };
  }

  private async getUsersByRole(): Promise<ChartItemDto[]> {
    const rows = await this.userRepository
      .createQueryBuilder('user')
      .select('user.role', 'label')
      .addSelect('COUNT(user.id)', 'value')
      .groupBy('user.role')
      .orderBy('COUNT(user.id)', 'DESC')
      .getRawMany<{ label: string; value: string }>();

    return rows.map(row => ({
      label: row.label,
      value: Number(row.value),
    }));
  }

  private async getProjectsByStatus(): Promise<ChartItemDto[]> {
    const rows = await this.projectRepository
      .createQueryBuilder('project')
      .select('project.status', 'label')
      .addSelect('COUNT(project.id)', 'value')
      .groupBy('project.status')
      .orderBy('COUNT(project.id)', 'DESC')
      .getRawMany<{ label: string; value: string }>();

    return rows.map(row => ({
      label: row.label,
      value: Number(row.value),
    }));
  }

  private async getApplicationsByStatus(): Promise<ChartItemDto[]> {
    const rows = await this.applicationRepository
      .createQueryBuilder('application')
      .select('application.status', 'label')
      .addSelect('COUNT(application.id)', 'value')
      .groupBy('application.status')
      .orderBy('COUNT(application.id)', 'DESC')
      .getRawMany<{ label: string; value: string }>();

    return rows.map(row => ({
      label: row.label,
      value: Number(row.value),
    }));
  }

  private async getProjectsByCategory(): Promise<ChartItemDto[]> {
    const rows = await this.projectCategoryRepository
      .createQueryBuilder('projectCategory')
      .leftJoin('projectCategory.category', 'category')
      .select('category.name', 'label')
      .addSelect('COUNT(projectCategory.projectId)', 'value')
      .where('category.name IS NOT NULL')
      .groupBy('category.name')
      .orderBy('COUNT(projectCategory.projectId)', 'DESC')
      .limit(8)
      .getRawMany<{ label: string; value: string }>();

    return rows.map(row => ({
      label: row.label,
      value: Number(row.value),
    }));
  }

  private async getMostUsedTechnologies(): Promise<ChartItemDto[]> {
    const rows = await this.projectTechnologyRepository
      .createQueryBuilder('projectTechnology')
      .leftJoin('projectTechnology.technology', 'technology')
      .select('technology.name', 'label')
      .addSelect('COUNT(projectTechnology.projectId)', 'value')
      .where('technology.name IS NOT NULL')
      .groupBy('technology.name')
      .orderBy('COUNT(projectTechnology.projectId)', 'DESC')
      .limit(10)
      .getRawMany<{ label: string; value: string }>();

    return rows.map(row => ({
      label: row.label,
      value: Number(row.value),
    }));
  }

  private async getProjectsByMonth(): Promise<MonthlyChartItemDto[]> {
    const rows = await this.projectRepository
      .createQueryBuilder('project')
      .select(`TO_CHAR(DATE_TRUNC('month', project."createdAt"), 'YYYY-MM')`, 'month')
      .addSelect('COUNT(project.id)', 'value')
      .groupBy(`DATE_TRUNC('month', project."createdAt")`)
      .orderBy(`DATE_TRUNC('month', project."createdAt")`, 'ASC')
      .limit(12)
      .getRawMany<{ month: string; value: string }>();

    return rows.map(row => ({
      month: row.month,
      value: Number(row.value),
    }));
  }

  private async getApplicationsByMonth(): Promise<MonthlyChartItemDto[]> {
    const rows = await this.applicationRepository
      .createQueryBuilder('application')
      .select(`TO_CHAR(DATE_TRUNC('month', application."createdAt"), 'YYYY-MM')`, 'month')
      .addSelect('COUNT(application.id)', 'value')
      .groupBy(`DATE_TRUNC('month', application."createdAt")`)
      .orderBy(`DATE_TRUNC('month', application."createdAt")`, 'ASC')
      .limit(12)
      .getRawMany<{ month: string; value: string }>();

    return rows.map(row => ({
      month: row.month,
      value: Number(row.value),
    }));
  }

  private async getAverageBudgetByCategory(): Promise<BudgetByCategoryDto[]> {
    const rows = await this.projectCategoryRepository
      .createQueryBuilder('projectCategory')
      .leftJoin('projectCategory.category', 'category')
      .leftJoin('projectCategory.project', 'project')
      .select('category.name', 'category')
      .addSelect(
        `
          AVG(
            CASE
              WHEN project."budgetMin" IS NOT NULL AND project."budgetMax" IS NOT NULL
                THEN (project."budgetMin" + project."budgetMax") / 2.0
              WHEN project."budgetMin" IS NOT NULL
                THEN project."budgetMin"
              WHEN project."budgetMax" IS NOT NULL
                THEN project."budgetMax"
              ELSE NULL
            END
          )
        `,
        'averageBudget',
      )
      .addSelect('COUNT(project.id)', 'projectsCount')
      .where('category.name IS NOT NULL')
      .groupBy('category.name')
      .orderBy('AVG(project."budgetMax")', 'DESC')
      .limit(8)
      .getRawMany<{
        category: string;
        averageBudget: string | null;
        projectsCount: string;
      }>();

    return rows.map(row => ({
      category: row.category,
      averageBudget: Math.round(Number(row.averageBudget ?? 0)),
      projectsCount: Number(row.projectsCount),
    }));
  }

  private async getBudgetAnalytics() {
    const row = await this.projectRepository
      .createQueryBuilder('project')
      .select(
        `
          AVG(
            CASE
              WHEN project."budgetMin" IS NOT NULL AND project."budgetMax" IS NOT NULL
                THEN (project."budgetMin" + project."budgetMax") / 2.0
              WHEN project."budgetMin" IS NOT NULL
                THEN project."budgetMin"
              WHEN project."budgetMax" IS NOT NULL
                THEN project."budgetMax"
              ELSE NULL
            END
          )
        `,
        'averageBudget',
      )
      .addSelect('MIN(project."budgetMin")', 'minBudget')
      .addSelect('MAX(project."budgetMax")', 'maxBudget')
      .getRawOne<{
        averageBudget: string | null;
        minBudget: string | null;
        maxBudget: string | null;
      }>();

    return {
      averageBudget: Math.round(Number(row?.averageBudget ?? 0)),
      minBudget: Number(row?.minBudget ?? 0),
      maxBudget: Number(row?.maxBudget ?? 0),
    };
  }
}
