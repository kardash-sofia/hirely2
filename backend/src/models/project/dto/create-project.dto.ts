import { IsString, IsOptional, IsDate, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateTaskDto } from '../../task/dto/create-task.dto';

export class CreateProjectDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dueDate?: Date;

  @IsOptional()
  budgetMin: number;

  @IsOptional()
  budgetMax: number;

  @IsArray()
  @IsString({ each: true })
  categoryIds: string[];

  @IsArray()
  @IsString({ each: true })
  technologyIds: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTaskDto)
  tasks: CreateTaskDto[];
}
