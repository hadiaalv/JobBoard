import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from './entities/job.entity';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { FilterJobsDto } from './dto/filter-jobs.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
  ) {}

  async create(createJobDto: CreateJobDto, user: User) {
    const job = this.jobRepository.create({
      ...createJobDto,
      postedBy: user,
    });
    return this.jobRepository.save(job);
  }

  async findAll(filterDto: FilterJobsDto): Promise<Job[]> {
    const query = this.jobRepository
      .createQueryBuilder('job')
      .leftJoinAndSelect('job.postedBy', 'postedBy')
      .where('job.isActive = :isActive', { isActive: true });

    const {
      search,
      location,
      type,
      experienceLevel,
      salaryMin,
      salaryMax,
      company,
    } = filterDto;

    if (search) {
      query.andWhere(
        '(job.title ILIKE :search OR job.description ILIKE :search OR job.company ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (location) {
      query.andWhere('job.location ILIKE :location', { location: `%${location}%` });
    }

    if (type) {
      query.andWhere('job.type = :type', { type });
    }

    if (experienceLevel) {
      query.andWhere('job.experienceLevel = :experienceLevel', { experienceLevel });
    }

    if (salaryMin) {
      query.andWhere('job.salaryMin >= :salaryMin', { salaryMin });
    }

    if (salaryMax) {
      query.andWhere('job.salaryMax <= :salaryMax', { salaryMax });
    }

    if (company) {
      query.andWhere('job.company ILIKE :company', { company: `%${company}%` });
    }

    return query.orderBy('job.createdAt', 'DESC').getMany();
  }

  async findByEmployer(employerId: string): Promise<Job[]> {
    return this.jobRepository.find({
      where: { postedBy: { id: employerId } },
      relations: ['applications', 'applications.applicant'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Job> {
    const job = await this.jobRepository.findOne({
      where: { id },
      relations: ['postedBy', 'applications', 'applications.applicant'],
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    return job;
  }

  async update(id: string, updateJobDto: UpdateJobDto, user: User): Promise<Job> {
    const job = await this.findOne(id);

    if (job.postedBy.id !== user.id) {
      throw new ForbiddenException('You can only update your own jobs');
    }

    Object.assign(job, updateJobDto);
    return this.jobRepository.save(job);
  }

  async remove(id: string, user: User): Promise<{ message: string }> {
    const job = await this.findOne(id);

    if (job.postedBy.id !== user.id) {
      throw new ForbiddenException('You can only delete your own jobs');
    }

    await this.jobRepository.remove(job);
    return { message: 'Job deleted successfully' };
  }
}
