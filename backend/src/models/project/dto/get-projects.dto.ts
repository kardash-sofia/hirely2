import { IsEnum, IsInt, IsOptional, IsUUID, Min } from 'class-validator';
import { Expose, Type } from 'class-transformer';

import { ProjectStatus } from '../constants';

export class GetProjectsQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number = 0;

  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @IsOptional()
  @IsUUID('4', { each: true })
  categories?: string[];
}

export class ProjectListItemDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  description?: string;

  @Expose()
  owner: {
    id: string;
    username: string;
    email: string;
  };

  @Expose()
  budgetMin?: number;

  @Expose()
  budgetMax?: number;

  @Expose()
  categories: string[];
}

export type ProjectWithCategories = {
  id: string;
  title: string;
  description?: string;
  owner: {
    id: string;
    username: string;
    email: string;
  };
  budgetMin?: number;
  budgetMax?: number;
  categories: string[];
};
