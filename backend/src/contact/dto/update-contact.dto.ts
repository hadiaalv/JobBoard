import { IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';
import { ContactStatus } from '../entities/contact.entity';

export class UpdateContactDto {
  @IsOptional()
  @IsEnum(ContactStatus)
  status?: ContactStatus;

  @IsOptional()
  @IsString()
  adminNotes?: string;

  @IsOptional()
  @IsDateString()
  repliedAt?: string;

  @IsOptional()
  @IsString()
  repliedBy?: string;
} 