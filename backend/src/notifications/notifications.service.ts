import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType, NotificationStatus } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async create(notificationData: {
    type: NotificationType;
    title: string;
    message: string;
    recipient_id: string;
    data?: Record<string, any>;
  }): Promise<Notification> {
    const notification = this.notificationRepository.create({
      ...notificationData,
      status: NotificationStatus.UNREAD,
    });
    return this.notificationRepository.save(notification);
  }

  async findByUser(userId: string, limit: number = 50): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: { recipient_id: userId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async findUnreadByUser(userId: string): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: { 
        recipient_id: userId,
        status: NotificationStatus.UNREAD 
      },
      order: { createdAt: 'DESC' },
    });
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.notificationRepository.count({
      where: { 
        recipient_id: userId,
        status: NotificationStatus.UNREAD 
      },
    });
  }

  async markAsRead(id: number, userId: string): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id, recipient_id: userId },
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    notification.status = NotificationStatus.READ;
    return this.notificationRepository.save(notification);
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationRepository.update(
      { 
        recipient_id: userId,
        status: NotificationStatus.UNREAD 
      },
      { status: NotificationStatus.READ }
    );
  }

  async delete(id: number, userId: string): Promise<void> {
    await this.notificationRepository.delete({ id, recipient_id: userId });
  }

  async deleteOldNotifications(daysOld: number = 30): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    await this.notificationRepository
      .createQueryBuilder()
      .delete()
      .where('createdAt < :cutoffDate', { cutoffDate })
      .andWhere('status = :status', { status: NotificationStatus.READ })
      .execute();
  }

  async findById(id: number, userId: string): Promise<Notification> {
    return this.notificationRepository.findOne({
      where: { id, recipient_id: userId },
    });
  }
} 