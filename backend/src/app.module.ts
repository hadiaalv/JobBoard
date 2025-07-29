import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { JobsModule } from './jobs/jobs.module';
import { ApplicationsModule } from './applications/applications.module';
import { MailModule } from './mail/mail.module';
import { UploadModule } from './upload/upload.module';
import { ContactModule } from './contact/contact.module';

import { User } from './users/entities/user.entity';
import { Job } from './jobs/entities/job.entity';
import { Application } from './applications/entities/application.entity';
import { Contact } from './contact/entities/contact.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');
        const isSqlite = databaseUrl?.startsWith('sqlite://');
        
        if (isSqlite) {
          return {
            type: 'sqlite' as const,
            database: databaseUrl?.replace('sqlite://', ''),
            entities: [User, Job, Application, Contact],
            synchronize: true, // Only for SQLite development
            logging: configService.get<string>('NODE_ENV') === 'development',
          };
        } else {
          return {
            type: 'postgres' as const,
            url: databaseUrl,
            entities: [User, Job, Application, Contact],
            synchronize: true, // Temporarily enable for development
            logging: configService.get<string>('NODE_ENV') === 'development',
            ssl: configService.get<string>('NODE_ENV') === 'production'
              ? { rejectUnauthorized: false }
              : false,
          };
        }
      },
      inject: [ConfigService],
    }),

    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),

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
