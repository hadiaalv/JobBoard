import { Controller, Get, Patch, Param, Query, UseGuards, Request } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async getNotifications(@Request() req, @Query('limit') limit?: string) {
    const userId = req.user.id;
    const limitNum = limit ? parseInt(limit) : 50;
    return this.notificationsService.findByUser(userId, limitNum);
  }

  @Get('unread')
  async getUnreadNotifications(@Request() req) {
    const userId = req.user.id;
    return this.notificationsService.findUnreadByUser(userId);
  }

  @Get('unread-count')
  async getUnreadCount(@Request() req) {
    const userId = req.user.id;
    const count = await this.notificationsService.getUnreadCount(userId);
    return { count };
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string, @Request() req) {
    const userId = req.user.id;
    const notification = await this.notificationsService.markAsRead(parseInt(id), userId);
    return { message: 'Notification marked as read', notification };
  }

  @Patch('mark-all-read')
  async markAllAsRead(@Request() req) {
    const userId = req.user.id;
    await this.notificationsService.markAllAsRead(userId);
    return { message: 'All notifications marked as read' };
  }

  @Get(':id')
  async getNotification(@Param('id') id: string, @Request() req) {
    const userId = req.user.id;
    return this.notificationsService.findById(parseInt(id), userId);
  }
} 