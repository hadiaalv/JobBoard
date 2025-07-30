import { Controller, Post, Delete, Get, Param, UseGuards, Request } from '@nestjs/common';
import { JobFavoritesService } from './job-favorites.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('job-favorites')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.JOB_SEEKER)
export class JobFavoritesController {
  constructor(private readonly jobFavoritesService: JobFavoritesService) {}

  @Post(':jobId')
  async addToFavorites(@Param('jobId') jobId: string, @Request() req) {
    return this.jobFavoritesService.addToFavorites(req.user.id, jobId);
  }

  @Delete(':jobId')
  async removeFromFavorites(@Param('jobId') jobId: string, @Request() req) {
    await this.jobFavoritesService.removeFromFavorites(req.user.id, jobId);
    return { message: 'Job removed from favorites' };
  }

  @Get()
  async getUserFavorites(@Request() req) {
    return this.jobFavoritesService.getUserFavorites(req.user.id);
  }

  @Get(':jobId/check')
  async isJobFavorited(@Param('jobId') jobId: string, @Request() req) {
    const isFavorited = await this.jobFavoritesService.isJobFavorited(req.user.id, jobId);
    return { isFavorited };
  }

  @Get(':jobId/count')
  async getFavoriteCount(@Param('jobId') jobId: string) {
    const count = await this.jobFavoritesService.getFavoriteCount(jobId);
    return { count };
  }
} 