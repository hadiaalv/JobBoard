import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Application } from './entities/application.entity';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { User } from '../users/entities/user.entity';
import { Job } from '../jobs/entities/job.entity';
import { MailService } from '../mail/mail.service';
import { UploadService } from '../upload/upload.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
    private readonly mailService: MailService,
    private readonly uploadService: UploadService,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  async create(
    createApplicationDto: CreateApplicationDto,
    user: User,
    file?: Express.Multer.File,
  ): Promise<Application> {
    const existingApplication = await this.applicationRepository.findOne({
      where: {
        applicant: { id: user.id },
        job: { id: createApplicationDto.jobId },
      },
    });

    if (existingApplication) {
      throw new ForbiddenException('You have already applied to this job');
    }

    const job = await this.jobRepository.findOne({
      where: { id: createApplicationDto.jobId },
      relations: ['postedBy'],
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    let resumeUrl = null;
    if (file) {
      const fileName = await this.uploadService.uploadResume(file);
      resumeUrl = `/uploads/resumes/${fileName}`;
    }

    const application = this.applicationRepository.create({
      job,
      applicant: user,
      coverLetter: createApplicationDto.coverLetter,
      resumeUrl: resumeUrl,
    });

    const savedApplication = await this.applicationRepository.save(application);

    try {
      await this.mailService.sendApplicationEmail(
        user.email,
        job.title,
        job.company
      );

      if (job.postedBy) {
        await this.mailService.sendNewApplicationNotificationEmail(
          job.postedBy.email,
          job.postedBy.firstName,
          job.title,
          `${user.firstName} ${user.lastName}`
        );
      }
    } catch (error) {
      console.error('Failed to send email notifications:', error);
    }

    // Send real-time notification to employer
    if (job.postedBy) {
      try {
        this.notificationsGateway.sendNewApplication(job.postedBy.id, {
          id: savedApplication.id,
          jobTitle: job.title,
          applicantName: `${user.firstName} ${user.lastName}`,
          applicantId: user.id,
          jobId: job.id,
          createdAt: savedApplication.createdAt,
        });
        console.log(`Real-time notification sent to employer ${job.postedBy.id} for new application`);
      } catch (error) {
        console.error('Failed to send real-time notification to employer:', error);
      }
    }

    return savedApplication;
  }

  async findByApplicant(applicantId: string): Promise<Application[]> {
    return this.applicationRepository.find({
      where: { applicant: { id: applicantId } },
      relations: ['job', 'job.postedBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByEmployer(employerId: string): Promise<Application[]> {
    return this.applicationRepository.find({
      where: { job: { postedBy: { id: employerId } } },
      relations: ['applicant', 'job'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByJob(jobId: string, employerId: string): Promise<Application[]> {
    const job = await this.jobRepository.findOne({
      where: { id: jobId, postedBy: { id: employerId } },
    });

    if (!job) {
      throw new ForbiddenException('You can only view applications for your jobs');
    }

    return this.applicationRepository.find({
      where: { job: { id: jobId } },
      relations: ['applicant', 'job'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateStatus(
    id: string,
    updateStatusDto: UpdateApplicationStatusDto,
    employerId: string,
  ): Promise<Application> {
    const application = await this.applicationRepository.findOne({
      where: { id },
      relations: ['job', 'job.postedBy', 'applicant'],
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    if (application.job.postedBy.id !== employerId) {
      throw new ForbiddenException('You can only update applications for your jobs');
    }

    application.status = updateStatusDto.status;
    application.notes = updateStatusDto.notes;

    const savedApplication = await this.applicationRepository.save(application);

    try {
      await this.mailService.sendApplicationStatusUpdateEmail(
        application.applicant.email,
        application.applicant.firstName,
        application.job.title,
        application.job.company,
        updateStatusDto.status
      );
    } catch (error) {
      console.error('Failed to send status update email:', error);
    }

    // Send real-time notification to applicant
    try {
      this.notificationsGateway.sendApplicationUpdate(application.applicant.id, {
        id: savedApplication.id,
        jobTitle: application.job.title,
        company: application.job.company,
        status: updateStatusDto.status,
        notes: updateStatusDto.notes,
        updatedAt: savedApplication.updatedAt,
      });
      console.log(`Real-time notification sent to applicant ${application.applicant.id} for status update`);
    } catch (error) {
      console.error('Failed to send real-time notification to applicant:', error);
    }

    return savedApplication;
  }

  async findOne(id: string): Promise<Application> {
    const application = await this.applicationRepository.findOne({
      where: { id },
      relations: ['applicant', 'job', 'job.postedBy'],
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    return application;
  }

  async findUserApplications(userId: string): Promise<Application[]> {
    return this.applicationRepository.find({
      where: { applicant: { id: userId } },
      relations: ['job', 'job.postedBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async findJobApplications(jobId: string, user: User): Promise<Application[]> {
    return this.applicationRepository.find({
      where: { job: { id: jobId } },
      relations: ['applicant', 'job'],
      order: { createdAt: 'DESC' },
    });
  }
}
