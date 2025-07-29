import { IsOptional, IsString, MaxLength, IsEmail, IsUrl, IsNumber, Min, Max, IsArray } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  firstName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsUrl()
  avatarUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  bio?: string;

  @IsOptional()
  @IsString()
  skills?: string; // Will be parsed as JSON string from FormData

  @IsOptional()
  @IsString()
  @MaxLength(500)
  experience?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  location?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  education?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  interests?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  languages?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  certifications?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  projects?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  linkedin?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  github?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  portfolio?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(50)
  yearsOfExperience?: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  preferredWorkType?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  salaryExpectation?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  availability?: string;
} 