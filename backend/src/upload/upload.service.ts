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

    // Use consistent file naming with timestamp and original name
    const timestamp = Date.now();
    const originalName = file.originalname || 'file';
    const extension = originalName.includes('.') ? originalName.split('.').pop() : '';
    const baseName = originalName.includes('.') ? originalName.substring(0, originalName.lastIndexOf('.')) : originalName;
    
    // Clean the base name to remove special characters
    const cleanBaseName = baseName.replace(/[^a-zA-Z0-9]/g, '_');
    const fileName = `${timestamp}-${cleanBaseName}${extension ? '.' + extension : ''}`;
    
    const filePath = join(uploadDir, fileName);
    
    // Use file.buffer if available, otherwise use the file directly
    if (file.buffer) {
      await writeFile(filePath, file.buffer);
    } else {
      // If using disk storage, the file is already saved
      // Just return the filename
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
