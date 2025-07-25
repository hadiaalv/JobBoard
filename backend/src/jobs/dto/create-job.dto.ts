import { IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateJobDto {
  @IsString()
  @MaxLength(255)
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  // Add other properties as needed
} 