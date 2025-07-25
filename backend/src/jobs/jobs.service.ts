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
import { User } from '../auth/entities/user.entity';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
  ) {}

  async create(createJobDto: CreateJobDto, user: User) {
    const job = this.jobRepository.create({
      ...createJobDto,
      employer: user,
    });
    return this.jobRepository.save(job);
  }

  async findAll(filterDto: FilterJobsDto): Promise<Job[]> {
    const query = this.jobRepository
      .createQueryBuilder('job')
      .leftJoinAndSelect('job.employer', 'employer');

    const {
      title,
      location,
      type,
      minSalary,
      maxSalary,
      skills,
    } = filterDto;

    if (title) {
      query.andWhere('job.title ILIKE :title', { title: `%${title}%` });
    }

    if (location) {
      query.andWhere('job.location ILIKE :location', { location: `%${location}%` });
    }

    if (type) {
      query.andWhere('job.type = :type', { type });
    }

    if (minSalary) {
      query.andWhere('job.salary >= :minSalary', { minSalary });
    }

    if (maxSalary) {
      query.andWhere('job.salary <= :maxSalary', { maxSalary });
    }

    if (skills && skills.length > 0) {
      // PostgreSQL array overlap operator (&&) requires casting to text[]
      query.andWhere('job.requiredSkills && :skills::text[]', { skills });
    }

    return query.getMany();
  }

  async findByEmployer(employerId: string): Promise<Job[]> {
    return this.jobRepository.find({
      where: { employer: { id: employerId } },
      relations: ['applications'],
    });
  }

  async findOne(id: string): Promise<Job> {
    const job = await this.jobRepository.findOne({
      where: { id },
      relations: ['employer'],
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    return job;
  }

  async update(id: string, updateJobDto: UpdateJobDto, user: User): Promise<Job> {
    const job = await this.findOne(id);

    if (job.employer.id !== user.id) {
      throw new ForbiddenException('You can only update your own jobs');
    }

    Object.assign(job, updateJobDto);
    return this.jobRepository.save(job);
  }

  async remove(id: string, user: User): Promise<{ message: string }> {
    const job = await this.findOne(id);

    if (job.employer.id !== user.id) {
      throw new ForbiddenException('You can only delete your own jobs');
    }

    await this.jobRepository.remove(job);
    return { message: 'Job deleted successfully' };
  }
}
