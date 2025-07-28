import { Controller, Post, UseInterceptors, UploadedFile, UseGuards, Request, BadRequestException } from '@nestjs/common';
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
      throw new BadRequestException('No file uploaded');
    }

    // Expecting just the filename from service
    const fileName = await this.uploadService.uploadAvatar(file);

    // If service returns path, extract filename
    const cleanFileName = fileName.includes('/') ? fileName.split('/').pop() : fileName;

    return { fileName: cleanFileName, url: `/uploads/avatars/${cleanFileName}` };
  }

  @Post('resume')
  @UseInterceptors(FileInterceptor('resume'))
  async uploadResume(@UploadedFile() file: Express.Multer.File, @Request() req) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Expecting just the filename from service
    const fileName = await this.uploadService.uploadResume(file);

    // Clean up if full path accidentally returned
    const cleanFileName = fileName.includes('/') ? fileName.split('/').pop() : fileName;

    return { fileName: cleanFileName, url: `/uploads/resumes/${cleanFileName}` };
  }
}
