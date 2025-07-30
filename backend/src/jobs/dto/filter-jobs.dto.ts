import { IsOptional, IsString, IsNumber, IsArray, IsEnum, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class FilterJobsDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsEnum(['full_time', 'part_time', 'contract', 'internship', 'freelance'])
  type?: string;

  @IsOptional()
  @IsEnum(['entry', 'mid', 'senior', 'lead', 'executive'])
  experienceLevel?: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(0)
  salaryMin?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(0)
  salaryMax?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map(s => s.trim());
    }
    return value;
  })
  skills?: string[];

  @IsOptional()
  @IsString()
  sortBy?: 'createdAt' | 'title' | 'company' | 'salaryMin' | 'salaryMax';

  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC';

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  @Max(50)
  limit?: number = 10;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  remote?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  urgent?: boolean;
}