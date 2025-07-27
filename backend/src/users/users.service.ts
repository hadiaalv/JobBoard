import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private uploadService: UploadService,
  ) {}

  async findAll() {
    return this.userRepository.find({
      select: ['id', 'email', 'firstName', 'lastName', 'role', 'createdAt'],
    });
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'email', 'firstName', 'lastName', 'role', 'company', 'bio', 'skills', 'experience', 'createdAt'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async updateWithFiles(id: string, updateUserDto: UpdateUserDto, avatar?: Express.Multer.File, resume?: Express.Multer.File) {
    const user = await this.findOne(id);
    
    // Handle avatar upload
    if (avatar) {
      const avatarUrl = await this.uploadService.uploadAvatar(avatar);
      user.avatar = avatarUrl;
    }
    
    // Handle resume upload
    if (resume) {
      const resumeUrl = await this.uploadService.uploadResume(resume);
      user.resume = resumeUrl;
    }
    
    // Update other fields
    Object.assign(user, updateUserDto);
    
    return this.userRepository.save(user);
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async findById(id: string) {
    return this.userRepository.findOne({ where: { id } });
  }

  async create(userData: Partial<User>) {
    console.log('UsersService: Creating user with data:', { ...userData, password: '[HIDDEN]' });
    const user = this.userRepository.create(userData);
    console.log('UsersService: User entity created:', { id: user.id, email: user.email });
    const savedUser = await this.userRepository.save(user);
    console.log('UsersService: User saved to database with ID:', savedUser.id);
    return savedUser;
  }
}