import {
  Controller,
  Post,
  Get,
  Param,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Request,
  BadRequestException,
  NotFoundException,
  Res
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Response } from 'express';
import { join } from 'path';
import { existsSync } from 'fs';

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

    const fileName = await this.uploadService.uploadAvatar(file);
    const cleanFileName = fileName.includes('/') ? fileName.split('/').pop() : fileName;

    return { fileName: cleanFileName, url: `/uploads/avatars/${cleanFileName}` };
  }

  @Post('resume')
  @UseInterceptors(FileInterceptor('resume'))
  async uploadResume(@UploadedFile() file: Express.Multer.File, @Request() req) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const fileName = await this.uploadService.uploadResume(file);
    const cleanFileName = fileName.includes('/') ? fileName.split('/').pop() : fileName;

    return { fileName: cleanFileName, url: `/uploads/resumes/${cleanFileName}` };
  }

 
  @Get('download/resumes/:filename')
  async downloadResume(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = join(process.cwd(), 'uploads', 'resumes', filename);

    if (!existsSync(filePath)) {
      throw new NotFoundException('File not found');
    }

    return res.download(filePath);
  }
}
