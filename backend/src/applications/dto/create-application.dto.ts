import { IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateApplicationDto {
  @IsString()
  @MaxLength(255)
  @IsOptional()
  coverLetter?: string;

  // Add other properties as needed
} 