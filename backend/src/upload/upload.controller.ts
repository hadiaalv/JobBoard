import { Controller, Post, UseInterceptors, UploadedFile, UseGuards, Request } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  async uploadAvatar(@UploadedFile() file: Express.Multer.File, @Request() req) {
    if (!file) {
      throw new Error('No file uploaded');
    }
    
    const fileName = await this.uploadService.uploadAvatar(file);
    return { fileName, url: `/uploads/avatars/${fileName}` };
  }

  @Post('resume')
  @UseInterceptors(FileInterceptor('resume'))
  async uploadResume(@UploadedFile() file: Express.Multer.File, @Request() req) {
    if (!file) {
      throw new Error('No file uploaded');
    }
    
    const fileName = await this.uploadService.uploadResume(file);
    return { fileName, url: `/uploads/resumes/${fileName}` };
  }
} 