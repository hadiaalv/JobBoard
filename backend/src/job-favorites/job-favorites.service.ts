import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobFavorite } from './entities/job-favorite.entity';
import { Job } from '../jobs/entities/job.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class JobFavoritesService {
  constructor(
    @InjectRepository(JobFavorite)
    private jobFavoriteRepository: Repository<JobFavorite>,
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async addToFavorites(userId: string, jobId: string): Promise<JobFavorite> {
    const job = await this.jobRepository.findOne({ where: { id: jobId } });
    if (!job) {
      throw new NotFoundException('Job not found');
    }

    const existingFavorite = await this.jobFavoriteRepository.findOne({
      where: { user: { id: userId }, job: { id: jobId } },
    });

    if (existingFavorite) {
      throw new ConflictException('Job is already in favorites');
    }

    const favorite = this.jobFavoriteRepository.create({
      user: { id: userId },
      job: { id: jobId },
    });

    return this.jobFavoriteRepository.save(favorite);
  }

  async removeFromFavorites(userId: string, jobId: string): Promise<void> {
    const favorite = await this.jobFavoriteRepository.findOne({
      where: { user: { id: userId }, job: { id: jobId } },
    });

    if (!favorite) {
      throw new NotFoundException('Job is not in favorites');
    }

    await this.jobFavoriteRepository.remove(favorite);
  }

  async getUserFavorites(userId: string): Promise<Job[]> {
    const favorites = await this.jobFavoriteRepository.find({
      where: { user: { id: userId } },
      relations: ['job', 'job.postedBy'],
    });

    return favorites.map(favorite => favorite.job);
  }

  async isJobFavorited(userId: string, jobId: string): Promise<boolean> {
    const favorite = await this.jobFavoriteRepository.findOne({
      where: { user: { id: userId }, job: { id: jobId } },
    });

    return !!favorite;
  }

  async getFavoriteCount(jobId: string): Promise<number> {
    return this.jobFavoriteRepository.count({
      where: { job: { id: jobId } },
    });
  }
} 