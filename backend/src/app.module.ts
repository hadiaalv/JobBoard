import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JobsModule } from './jobs/jobs.module';
import { ApplicationsModule } from './applications/applications.module';
import { ContactModule } from './contact/contact.module';
import { UploadModule } from './upload/upload.module';
import { MailModule } from './mail/mail.module';
import { JobFavoritesModule } from './job-favorites/job-favorites.module';
import { NotificationsModule } from './notifications/notifications.module';
import { User } from './users/entities/user.entity';
import { Job } from './jobs/entities/job.entity';
import { Application } from './applications/entities/application.entity';
import { Contact } from './contact/entities/contact.entity';
import { JobFavorite } from './job-favorites/entities/job-favorite.entity';
import { Notification } from './notifications/entities/notification.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/jobboard',
      entities: [User, Job, Application, Contact, JobFavorite, Notification],
      synchronize: true,
      logging: process.env.NODE_ENV === 'development',
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    }),
    ThrottlerModule.forRoot({
      ttl: 60,      
      limit: 100,   
    }),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '7d' },
    }),
    UsersModule,
    AuthModule,
    JobsModule,
    ApplicationsModule,
    ContactModule,
    UploadModule,
    MailModule,
    JobFavoritesModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {

}
