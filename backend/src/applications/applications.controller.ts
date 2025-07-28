import { Controller, Get, Post, Body, Param, Patch, UseGuards, Request, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { UploadService } from '../upload/upload.service';

@Controller('applications')
@UseGuards(JwtAuthGuard)
export class ApplicationsController {
  constructor(
    private readonly applicationsService: ApplicationsService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.JOB_SEEKER)
  @UseInterceptors(FileInterceptor('resume'))
  async create(
    @Body() createApplicationDto: CreateApplicationDto,
    @Request() req,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    console.log('Received application data:', {
      dto: createApplicationDto,
      user: req.user?.id,
      file: file?.originalname,
      body: req.body,
      headers: req.headers
    });
    
    if (!createApplicationDto.jobId) {
      throw new BadRequestException('jobId is required');
    }

    // Validate file if provided
    if (file) {
      if (file.mimetype !== 'application/pdf') {
        throw new BadRequestException('Only PDF files are allowed for resumes');
      }
      if (file.size > 5 * 1024 * 1024) {
        throw new BadRequestException('File size must be less than 5MB');
      }
    }
    
    return this.applicationsService.create(createApplicationDto, req.user, file);
  }

  @Get('me')
  @UseGuards(RolesGuard)
  @Roles(UserRole.JOB_SEEKER)
  findMyApplications(@Request() req) {
    return this.applicationsService.findByApplicant(req.user.id);
  }

  @Get('employer')
  @UseGuards(RolesGuard)
  @Roles(UserRole.EMPLOYER)
  findEmployerApplications(@Request() req) {
    return this.applicationsService.findByEmployer(req.user.id);
  }

  @Get('job/:id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.EMPLOYER)
  findJobApplications(@Param('id') id: string, @Request() req) {
    return this.applicationsService.findByJob(id, req.user.id);
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles(UserRole.EMPLOYER)
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateApplicationStatusDto,
    @Request() req,
  ) {
    return this.applicationsService.updateStatus(id, updateStatusDto, req.user.id);
  }
}