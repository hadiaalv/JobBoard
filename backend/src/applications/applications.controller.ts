import { Controller, Post, Get, UseGuards, UseInterceptors, UploadedFile, Body, Request, Param, Patch } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { UserRole } from '../users/entities/user.entity';

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
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
    
    // Validate jobId format
    if (!createApplicationDto.jobId) {
      throw new Error('jobId is required');
    }
    
    return this.applicationsService.create(createApplicationDto, req.user, file);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.JOB_SEEKER)
  async findMyApplications(@Request() req) {
    return this.applicationsService.findByApplicant(req.user.id);
  }

  @Get('employer')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.EMPLOYER)
  async findEmployerApplications(@Request() req) {
    return this.applicationsService.findByEmployer(req.user.id);
  }

  @Get('job/:jobId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.EMPLOYER)
  async findApplicationsByJob(@Param('jobId') jobId: string, @Request() req) {
    return this.applicationsService.findByJob(jobId, req.user.id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.EMPLOYER)
  async updateApplicationStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateApplicationStatusDto,
    @Request() req,
  ) {
    return this.applicationsService.updateStatus(id, updateStatusDto, req.user.id);
  }

  // Test endpoint for debugging
  @Post('test')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.JOB_SEEKER)
  async testCreate(@Body() body: any, @Request() req) {
    console.log('Test endpoint received:', { body, user: req.user?.id });
    return { message: 'Test successful', received: body };
  }

  // Debug endpoint to check resume URLs
  @Get('debug/resume-urls')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.EMPLOYER)
  async debugResumeUrls(@Request() req) {
    const applications = await this.applicationsService.findByEmployer(req.user.id);
    return applications.map(app => ({
      id: app.id,
      resumeUrl: app.resumeUrl,
      filename: app.resumeFilename
    }));
  }
}