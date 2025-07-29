import { Injectable } from '@nestjs/common';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

@Injectable()
export class UploadService {
  async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
    const uploadDir = join(process.cwd(), 'uploads', folder);
    
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const timestamp = Date.now();
    const originalName = file.originalname || 'file';
    const extension = originalName.includes('.') ? originalName.split('.').pop() : '';
    const baseName = originalName.includes('.') ? originalName.substring(0, originalName.lastIndexOf('.')) : originalName;
    
    
    const cleanBaseName = baseName.replace(/[^a-zA-Z0-9]/g, '_');
    const fileName = `${timestamp}-${cleanBaseName}${extension ? '.' + extension : ''}`;
    
    const filePath = join(uploadDir, fileName);
    
   
    if (file.buffer) {
      await writeFile(filePath, file.buffer);
    } else {
     
    }
    
    return fileName;
  }

  async uploadAvatar(file: Express.Multer.File): Promise<string> {
    const fileName = await this.uploadFile(file, 'avatars');
    return fileName;
  }

  async uploadResume(file: Express.Multer.File): Promise<string> {
    const fileName = await this.uploadFile(file, 'resumes');
    return fileName;
  }
}
