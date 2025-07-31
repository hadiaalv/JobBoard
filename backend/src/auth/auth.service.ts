import { Injectable, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import { NotificationEventsService } from '../notifications/notification-events.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
    private notificationEventsService: NotificationEventsService
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return null;
    }
    if (!user.password) {
      return null;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
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
        .catch(() => {
          // Handle email sending failure silently
        });

      // Send welcome notifications
      try {
        await this.notificationEventsService.notifyRegistrationConfirmed({
          id: user.id,
          name: user.firstName,
          email: user.email,
          role: user.role,
        });

        await this.notificationEventsService.notifyWelcomeMessage({
          id: user.id,
          name: user.firstName,
          role: user.role,
        });
      } catch (error) {
        console.error('Failed to send welcome notifications:', error);
      }
      
      return this.login(user);
    } catch (error) {
      if (error.code === '23505' && error.constraint?.includes('email')) {
        throw new ConflictException('Email already exists. Please use a different email address.');
      }
      throw error;
    }
  }
}
