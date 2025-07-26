import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

// Feature modules
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { JobsModule } from './jobs/jobs.module';
import { ApplicationsModule } from './applications/applications.module';
import { MailModule } from './mail/mail.module';
import { UploadModule } from './upload/upload.module';
import { ContactModule } from './contact/contact.module';

// Entities
import { User } from './users/entities/user.entity';
import { Job } from './jobs/entities/job.entity';
import { Application } from './applications/entities/application.entity';
import { Contact } from './contact/entities/contact.entity';

@Module({
  imports: [
    // Load .env variables globally
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // PostgreSQL configuration using DATABASE_URL
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        entities: [User, Job, Application, Contact],
        synchronize: configService.get<string>('NODE_ENV') !== 'production',
        logging: configService.get<string>('NODE_ENV') === 'development',
        ssl: configService.get<string>('NODE_ENV') === 'production'
          ? { rejectUnauthorized: false }
          : false,
      }),
      inject: [ConfigService],
    }),

    // Rate-limiting (10 requests per minute)
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),

    // Multer config for file uploads (PDF only, 5MB max)
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        storage: diskStorage({
          destination: configService.get<string>('UPLOAD_DEST') || './uploads',
          filename: (req, file, cb) => {
            const randomName = Array(32)
              .fill(null)
              .map(() => Math.floor(Math.random() * 16).toString(16))
              .join('');
            cb(null, `${randomName}${extname(file.originalname)}`);
          },
        }),
        fileFilter: (req, file, cb) => {
          if (file.mimetype === 'application/pdf') {
            cb(null, true);
          } else {
            cb(new Error('Only PDF files are allowed'), false);
          }
        },
        limits: {
          fileSize: 5 * 1024 * 1024, // 5MB
        },
      }),
      inject: [ConfigService],
    }),

    // App feature modules
    AuthModule,
    UsersModule,
    JobsModule,
    ApplicationsModule,
    MailModule,
    UploadModule,
    ContactModule,
  ],
})
export class AppModule {}
