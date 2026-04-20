import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class GenerateDescriptionDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  short_description: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsArray()
  @IsString({ each: true })
  technologies: string[];

  @IsInt()
  @Min(1)
  @Max(5)
  complexity: number;

  @IsOptional()
  @IsNumber()
  predicted_budget?: number;
}

export class GenerateDescriptionResponseDto {
  expanded_description: string;
  requirements: string[];
  deliverables: string[];
  recommended_skills: string[];
}
