import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum NotificationType {
  
  JOB_POSTED = 'job_posted',
  JOB_UPDATED = 'job_updated',
  JOB_DELETED = 'job_deleted',
  
  
  APPLICATION_SUBMITTED = 'application_submitted',
  APPLICATION_STATUS_UPDATED = 'application_status_updated',
  NEW_APPLICATION = 'new_application',
  APPLICATION_ACCEPTED = 'application_accepted',
  APPLICATION_REJECTED = 'application_rejected',
  APPLICATION_UNDER_REVIEW = 'application_under_review',
  
  
  REGISTRATION_CONFIRMED = 'registration_confirmed',
  PROFILE_UPDATED = 'profile_updated',
  RESUME_UPLOADED = 'resume_uploaded',
  
  
  WELCOME_MESSAGE = 'welcome_message',
  SYSTEM_UPDATE = 'system_update'
}

export enum NotificationStatus {
  UNREAD = 'unread',
  READ = 'read',
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  type: NotificationType;

  @Column()
  title: string;

  @Column('text')
  message: string;

  @Column('jsonb', { nullable: true })
  data: Record<string, any>;

  @Column({
    type: 'enum',
    enum: NotificationStatus,
    default: NotificationStatus.UNREAD,
  })
  status: NotificationStatus;

  @Column()
  recipient_id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'recipient_id' })
  recipient: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 