import { IsArray, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

export class AssistProjectDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @IsString({ each: true })
  technologies: string[];

  @IsOptional()
  @IsString()
  category?: string;

  @IsInt()
  @Min(1)
  @Max(5)
  complexity: number;
}

export class AssistProjectResponseDto {
  category: {
    predicted_category: string;
    model_version: string;
    note: string;
  };

  budget: {
    estimated_budget: number;
    recommended_min: number;
    recommended_max: number;
    model_version: string;
    note: string;
  };

  description: {
    expanded_description: string;
    requirements: string[];
    deliverables: string[];
    recommended_skills: string[];
  };
}
