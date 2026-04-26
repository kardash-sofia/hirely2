import { IsOptional, IsString, MaxLength } from 'class-validator';

export class TransitionProjectDto {
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  comment?: string;
}
