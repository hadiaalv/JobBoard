import { Injectable, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      console.error('User not found for email:', email);
      return null;
    }
    if (!user.password) {
      console.error('User found but password is missing:', user);
      return null;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.error('Password mismatch for user:', email);
      return null;
    }
    return user;
  }

  async validateUserById(id: string): Promise<User | null> {
    return this.usersService.findById(id);
  }

  async login(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);
    return {
      token,
      access_token: token,
      user,
    };
  }

  async register(registerDto: RegisterDto) {
    try {
      const hashedPassword = await bcrypt.hash(registerDto.password, 10);
      const user = await this.usersService.create({
        ...registerDto,
        password: hashedPassword,
      });
      
      this.mailService.sendRegistrationEmail(user.email, user.firstName)
        .catch(error => {
          console.log('Email sending failed (non-critical):', error.message);
        });
      
      return this.login(user);
    } catch (error) {
      if (error.code === '23505' && error.constraint?.includes('email')) {
        throw new ConflictException('Email already exists. Please use a different email address.');
      }
      throw error;
    }
  }
}
