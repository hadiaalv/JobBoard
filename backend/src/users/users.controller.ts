import { Controller, Get, Body, Patch, Param, Delete, UseGuards, Request, UseInterceptors, UploadedFiles, BadRequestException } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('health')
  health() {
    return { 
      message: 'Users controller is working', 
      timestamp: new Date().toISOString(),
      status: 'ok',
      test: 'This endpoint should work without authentication'
    };
  }

  @Get('test')
  test() {
    return { 
      message: 'Test endpoint working', 
      timestamp: new Date().toISOString(),
      status: 'ok'
    };
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(req.user.id, updateUserDto);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'avatar', maxCount: 1 },
    { name: 'resume', maxCount: 1 },
  ]))
  async updateMe(
    @Request() req, 
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFiles() files: { avatar?: Express.Multer.File[], resume?: Express.Multer.File[] }
  ) {
    try {
      const avatar = files?.avatar?.[0];
      const resume = files?.resume?.[0];
      
      const result = await this.usersService.updateWithFiles(req.user.id, updateUserDto, avatar, resume);
      return result;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      
      throw new BadRequestException({
        message: 'Failed to update user profile',
        error: error.message,
        details: error.stack
      });
    }
  }

  @Delete('me')
  @UseGuards(JwtAuthGuard)
  async deleteMe(@Request() req) {
    try {
      await this.usersService.remove(req.user.id);
      return { message: 'Profile deleted successfully' };
    } catch (error) {
      throw new BadRequestException({
        message: 'Failed to delete user profile',
        error: error.message
      });
    }
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    return this.usersService.findOne(req.user.id);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@Request() req) {
    return this.usersService.findOne(req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string, @Request() req) {
    if (req.user.id === id) {
      return this.usersService.findOne(id);
    }
    
    const targetUser = await this.usersService.findOne(id);
    
    if (req.user.role === 'employer' && targetUser.role === 'job_seeker') {
      return targetUser;
    }
    
    if (req.user.role === 'job_seeker' && targetUser.role === 'employer') {
      return targetUser;
    }
    
    if (req.user.role === 'admin') {
      return targetUser;
    }
    
    const { password, ...sanitizedUser } = targetUser;
    return sanitizedUser;
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.usersService.findAll();
  }
}