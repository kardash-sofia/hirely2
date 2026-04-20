import { IsArray, IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class PredictBudgetDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @IsString({ each: true })
  technologies: string[];

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsInt()
  @Min(1)
  @Max(5)
  complexity: number;
}

export class PredictBudgetResponseDto {
  estimated_budget: number;
  recommended_min: number;
  recommended_max: number;
  model_version: string;
  note: string;
}
