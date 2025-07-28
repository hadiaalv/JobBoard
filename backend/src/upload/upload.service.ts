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

    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = join(uploadDir, fileName);
    
    await writeFile(filePath, file.buffer);
    
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
