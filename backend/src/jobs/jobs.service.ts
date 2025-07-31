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
import { NotificationEventsService } from '../notifications/notification-events.service';


@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
    private readonly notificationEventsService: NotificationEventsService,
  ) {}

  async create(createJobDto: CreateJobDto, user: User) {
    const job = this.jobRepository.create({
      ...createJobDto,
      postedBy: user,
    });
    const savedJob = await this.jobRepository.save(job);
    
    try {
      const jobSeekers = await this.jobRepository.query(
        'SELECT id FROM users WHERE role = $1',
        ['job_seeker']
      );
      
      if (jobSeekers.length > 0) {
        const recipientIds = jobSeekers.map(seeker => seeker.id);
        await this.notificationEventsService.notifyNewJobPosted({
          id: savedJob.id,
          title: savedJob.title,
          company: savedJob.company,
          location: savedJob.location,
          recipientIds,
        });
      }
    } catch (error) {
      console.error('Failed to send job notification:', error);
    }
    
    return savedJob;
  }

  async findAll(filterDto: FilterJobsDto): Promise<{ jobs: Job[]; total: number; page: number; totalPages: number }> {
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
      skills,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      page = 1,
      limit = 10,
      remote,
      urgent,
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

    if (skills && skills.length > 0) {
      const skillConditions = skills.map((_, index) => 
        `job.skills ILIKE :skill${index}`
      ).join(' OR ');
      query.andWhere(`(${skillConditions})`);
      
      skills.forEach((skill, index) => {
        query.setParameter(`skill${index}`, `%${skill}%`);
      });
    }

    if (remote) {
      query.andWhere('(job.location ILIKE :remote OR job.location IS NULL)', { remote: '%remote%' });
    }

    if (urgent) {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      query.andWhere('job.createdAt >= :urgent', { urgent: sevenDaysAgo });
    }

    const total = await query.getCount();

    query.orderBy(`job.${sortBy}`, sortOrder as 'ASC' | 'DESC');

    const offset = (page - 1) * limit;
    query.skip(offset).take(limit);

    const jobs = await query.getMany();
    const totalPages = Math.ceil(total / limit);

    return {
      jobs,
      total,
      page,
      totalPages,
    };
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

    if (job.postedBy.id !== user.id && user.role !== 'admin') {
      throw new ForbiddenException('You can only update your own jobs');
    }

    Object.assign(job, updateJobDto);
    const updatedJob = await this.jobRepository.save(job);
    return updatedJob;
  }

  async remove(id: string, user: User): Promise<{ message: string }> {
    const job = await this.findOne(id);

    if (job.postedBy.id !== user.id && user.role !== 'admin') {
      throw new ForbiddenException('You can only delete your own jobs');
    }

    await this.jobRepository.remove(job);
    return { message: 'Job deleted successfully' };
  }
}
