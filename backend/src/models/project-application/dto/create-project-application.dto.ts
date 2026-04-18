import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateProjectApplicationDto {
  @IsUUID()
  projectId: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  coverLetter?: string;
}
