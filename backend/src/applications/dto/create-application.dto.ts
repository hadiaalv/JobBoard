import { IsString, IsOptional, MaxLength, IsUUID, IsNotEmpty } from 'class-validator';

export class CreateApplicationDto {
  @IsNotEmpty()
  @IsString()
  jobId: string;

  @IsString()
  @MaxLength(2000)
  @IsOptional()
  coverLetter?: string;
} 