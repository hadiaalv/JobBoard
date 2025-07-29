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
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        select: [
          'id', 'email', 'firstName', 'lastName', 'role', 'company', 'bio', 
          'skills', 'experience', 'avatar', 'resume', 'location', 'phone', 
          'website', 'education', 'interests', 'languages', 'certifications', 
          'projects', 'linkedin', 'github', 'portfolio', 'yearsOfExperience', 
          'preferredWorkType', 'salaryExpectation', 'availability', 'createdAt'
        ],
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return user;
    } catch (error) {
      console.warn('Failed to fetch user with extended fields, trying basic fields:', error.message);
      
      const user = await this.userRepository.findOne({
        where: { id },
        select: ['id', 'email', 'firstName', 'lastName', 'role', 'company', 'bio', 'skills', 'experience', 'createdAt'],
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return user;
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.findOne(id);
      
      if (updateUserDto.firstName !== undefined) user.firstName = updateUserDto.firstName;
      if (updateUserDto.lastName !== undefined) user.lastName = updateUserDto.lastName;
      if (updateUserDto.bio !== undefined) user.bio = updateUserDto.bio;
      if (updateUserDto.skills !== undefined) user.skills = updateUserDto.skills;
      if (updateUserDto.experience !== undefined) user.experience = updateUserDto.experience;
      if (updateUserDto.location !== undefined) user.location = updateUserDto.location;
      if (updateUserDto.phone !== undefined) user.phone = updateUserDto.phone;
      if (updateUserDto.website !== undefined) user.website = updateUserDto.website;
      if (updateUserDto.education !== undefined) user.education = updateUserDto.education;
      if (updateUserDto.interests !== undefined) user.interests = updateUserDto.interests;
      if (updateUserDto.languages !== undefined) user.languages = updateUserDto.languages;
      if (updateUserDto.certifications !== undefined) user.certifications = updateUserDto.certifications;
      if (updateUserDto.projects !== undefined) user.projects = updateUserDto.projects;
      if (updateUserDto.linkedin !== undefined) user.linkedin = updateUserDto.linkedin;
      if (updateUserDto.github !== undefined) user.github = updateUserDto.github;
      if (updateUserDto.portfolio !== undefined) user.portfolio = updateUserDto.portfolio;
      if (updateUserDto.yearsOfExperience !== undefined) user.yearsOfExperience = updateUserDto.yearsOfExperience;
      if (updateUserDto.preferredWorkType !== undefined) user.preferredWorkType = updateUserDto.preferredWorkType;
      if (updateUserDto.salaryExpectation !== undefined) user.salaryExpectation = updateUserDto.salaryExpectation;
      if (updateUserDto.availability !== undefined) user.availability = updateUserDto.availability;
      
      const result = await this.userRepository.save(user);
      return result;
    } catch (error) {
      console.error('UsersService: update error:', error);
      throw error;
    }
  }

  async updateWithFiles(id: string, updateUserDto: UpdateUserDto, avatar?: Express.Multer.File, resume?: Express.Multer.File) {
    try {
      const user = await this.findOne(id);
      
      if (avatar) {
        const avatarUrl = await this.uploadService.uploadAvatar(avatar);
        user.avatar = avatarUrl;
      }
      
      if (resume) {
        const resumeUrl = await this.uploadService.uploadResume(resume);
        user.resume = resumeUrl;
      }
      
      if (updateUserDto.firstName !== undefined) user.firstName = updateUserDto.firstName;
      if (updateUserDto.lastName !== undefined) user.lastName = updateUserDto.lastName;
      if (updateUserDto.bio !== undefined) user.bio = updateUserDto.bio;
      if (updateUserDto.skills !== undefined) user.skills = updateUserDto.skills;
      if (updateUserDto.experience !== undefined) user.experience = updateUserDto.experience;
      if (updateUserDto.location !== undefined) user.location = updateUserDto.location;
      if (updateUserDto.phone !== undefined) user.phone = updateUserDto.phone;
      if (updateUserDto.website !== undefined) user.website = updateUserDto.website;
      if (updateUserDto.education !== undefined) user.education = updateUserDto.education;
      if (updateUserDto.interests !== undefined) user.interests = updateUserDto.interests;
      if (updateUserDto.languages !== undefined) user.languages = updateUserDto.languages;
      if (updateUserDto.certifications !== undefined) user.certifications = updateUserDto.certifications;
      if (updateUserDto.projects !== undefined) user.projects = updateUserDto.projects;
      if (updateUserDto.linkedin !== undefined) user.linkedin = updateUserDto.linkedin;
      if (updateUserDto.github !== undefined) user.github = updateUserDto.github;
      if (updateUserDto.portfolio !== undefined) user.portfolio = updateUserDto.portfolio;
      if (updateUserDto.yearsOfExperience !== undefined) user.yearsOfExperience = updateUserDto.yearsOfExperience;
      if (updateUserDto.preferredWorkType !== undefined) user.preferredWorkType = updateUserDto.preferredWorkType;
      if (updateUserDto.salaryExpectation !== undefined) user.salaryExpectation = updateUserDto.salaryExpectation;
      if (updateUserDto.availability !== undefined) user.availability = updateUserDto.availability;
      
      const result = await this.userRepository.save(user);
      return result;
    } catch (error) {
      console.error('UsersService: updateWithFiles error:', error);
      throw error;
    }
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async findById(id: string) {
    return this.userRepository.findOne({ where: { id } });
  }

  async create(userData: Partial<User>) {
    const user = this.userRepository.create(userData);
    const savedUser = await this.userRepository.save(user);
    return savedUser;
  }
}