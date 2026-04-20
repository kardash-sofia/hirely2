import { IsNotEmpty, IsString } from 'class-validator';

export class PredictCategoryDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}

export class PredictCategoryResponseDto {
  predicted_category: string;
  model_version: string;
  note: string;
}
