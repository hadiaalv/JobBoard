import { Controller, Get, Res, Param, NotFoundException } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { join } from 'path';
import { existsSync, readFileSync } from 'fs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development'
    };
  }

  @Get('test-file')
  testFile() {
    return {
      message: 'File serving test',
      testUrl: '/uploads/resumes/test.pdf',
      note: 'This endpoint tests if static file serving is configured correctly'
    };
  }

  @Get('download/:folder/:filename')
  async downloadFile(@Param('folder') folder: string, @Param('filename') filename: string, @Res() res: Response) {
    const filePath = join(process.cwd(), 'uploads', folder, filename);
    
    if (!existsSync(filePath)) {
      throw new NotFoundException('File not found');
    }

    try {
      const fileBuffer = readFileSync(filePath);
      
      if (filename.endsWith('.pdf')) {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
      } else if (filename.match(/\.(jpg|jpeg|png|gif)$/)) {
        const ext = filename.split('.').pop();
        res.setHeader('Content-Type', `image/${ext}`);
      } else {
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      }
      
      res.setHeader('Content-Length', fileBuffer.length);
      res.send(fileBuffer);
    } catch (error) {
      console.error('Error serving file:', error);
      throw new NotFoundException('Error reading file');
    }
  }
}
