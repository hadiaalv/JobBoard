import { 
  IsString, 
  IsOptional, 
  MaxLength, 
  IsNumber, 
  IsPositive, 
  IsArray, 
  IsEnum, 
  IsDateString 
} from 'class-validator';

export class CreateJobDto {
  @IsString()
  @MaxLength(255)
  title: string;

  @IsString()
  @MaxLength(5000)
  description: string;

  @IsString()
  @MaxLength(255)
  company: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  location?: string;

  @IsNumber()
  @IsOptional()
  @IsPositive()
  salaryMin?: number;

  @IsNumber()
  @IsOptional()
  @IsPositive()
  salaryMax?: number;

  @IsEnum(['full_time', 'part_time', 'contract', 'internship', 'freelance'])
  @IsOptional()
  type?: string;

  @IsEnum(['entry', 'mid', 'senior', 'lead', 'executive'])
  @IsOptional()
  experienceLevel?: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  skills?: string[];

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  benefits?: string[];

  @IsDateString()
  @IsOptional()
  applicationDeadline?: string;
}
