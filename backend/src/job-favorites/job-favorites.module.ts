import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobFavoritesController } from './job-favorites.controller';
import { JobFavoritesService } from './job-favorites.service';
import { JobFavorite } from './entities/job-favorite.entity';
import { Job } from '../jobs/entities/job.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([JobFavorite, Job, User])],
  controllers: [JobFavoritesController],
  providers: [JobFavoritesService],
  exports: [JobFavoritesService],
})
export class JobFavoritesModule {} 