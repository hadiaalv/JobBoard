import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationsController } from './applications.controller';
import { ApplicationsService } from './applications.service';
import { Application } from './entities/application.entity';
import { Job } from '../jobs/entities/job.entity';
import { MailModule } from '../mail/mail.module';
import { UploadModule } from '../upload/upload.module';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Application, Job]),
    MailModule,
    UploadModule,
    JwtModule,
  ],
  controllers: [ApplicationsController],
  providers: [ApplicationsService, NotificationsGateway],
  exports: [ApplicationsService],
})
export class ApplicationsModule {}