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
import { User } from '../auth/entities/user.entity';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
  ) {}

  async create(
    createApplicationDto: CreateApplicationDto,
    user: User,
    file?: Express.Multer.File,
  ): Promise<Application> {
    const application = this.applicationRepository.create({
      ...createApplicationDto,
      applicant: user,
      resumeUrl: file?.path,
    });
    return this.applicationRepository.save(application);
  }

  async findUserApplications(userId: string): Promise<Application[]> {
    return this.applicationRepository.find({
      where: { applicant: { id: userId } },
      relations: ['job', 'job.employer'],
    });
  }

  async findJobApplications(jobId: string, user: User): Promise<Application[]> {
    return this.applicationRepository.find({
      where: { job: { id: jobId } },
      relations: ['applicant', 'job'],
    });
  }

  async updateStatus(
    id: string,
    updateStatusDto: UpdateApplicationStatusDto,
    user: User,
  ): Promise<Application> {
    const application = await this.applicationRepository.findOne({
      where: { id },
      relations: ['job', 'job.employer'],
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    if (application.job.employer.id !== user.id) {
      throw new ForbiddenException('You can only update applications for your jobs');
    }

    application.status = updateStatusDto.status;
    return this.applicationRepository.save(application);
  }

  async findOne(id: string): Promise<Application> {
    const application = await this.applicationRepository.findOne({
      where: { id },
      relations: ['applicant', 'job', 'job.employer'],
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    return application;
  }
}
