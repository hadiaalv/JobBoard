import { Injectable } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationType } from './entities/notification.entity';

@Injectable()
export class NotificationEventsService {
  constructor(private readonly notificationsService: NotificationsService) {}

  

  async notifyNewJobPosted(jobData: {
    id: string;
    title: string;
    company: string;
    location: string;
    recipientIds: string[];
  }) {
    for (const recipientId of jobData.recipientIds) {
      await this.notificationsService.create({
        type: NotificationType.JOB_POSTED,
        title: 'New Job Opportunity',
        message: `A new ${jobData.title} position has been posted at ${jobData.company} in ${jobData.location}`,
        recipient_id: recipientId,
        data: {
          jobId: jobData.id,
          company: jobData.company,
          title: jobData.title,
          location: jobData.location,
        },
      });
    }
  }

  async notifyJobUpdated(jobData: {
    id: string;
    title: string;
    company: string;
    location: string;
    recipientIds: string[];
  }) {
    for (const recipientId of jobData.recipientIds) {
      await this.notificationsService.create({
        type: NotificationType.JOB_UPDATED,
        title: 'Job Updated',
        message: `The ${jobData.title} position at ${jobData.company} has been updated`,
        recipient_id: recipientId,
        data: {
          jobId: jobData.id,
          company: jobData.company,
          title: jobData.title,
          location: jobData.location,
        },
      });
    }
  }

  async notifyJobDeleted(jobData: {
    id: string;
    title: string;
    company: string;
    applicantIds: string[];
  }) {
    for (const applicantId of jobData.applicantIds) {
      await this.notificationsService.create({
        type: NotificationType.JOB_DELETED,
        title: 'Job Position Removed',
        message: `The ${jobData.title} position at ${jobData.company} has been removed`,
        recipient_id: applicantId,
        data: {
          jobId: jobData.id,
          company: jobData.company,
          title: jobData.title,
        },
      });
    }
  }

  

  async notifyApplicationSubmitted(applicationData: {
    id: string;
    jobTitle: string;
    company: string;
    applicantId: string;
  }) {
    await this.notificationsService.create({
      type: NotificationType.APPLICATION_SUBMITTED,
      title: 'Application Submitted',
      message: `Your application for ${applicationData.jobTitle} at ${applicationData.company} has been submitted successfully`,
      recipient_id: applicationData.applicantId,
      data: {
        applicationId: applicationData.id,
        jobTitle: applicationData.jobTitle,
        company: applicationData.company,
      },
    });
  }

  async notifyNewApplication(applicationData: {
    id: string;
    jobTitle: string;
    applicantName: string;
    employerId: string;
  }) {
    await this.notificationsService.create({
      type: NotificationType.NEW_APPLICATION,
      title: 'New Application Received',
      message: `${applicationData.applicantName} has applied to your ${applicationData.jobTitle} position`,
      recipient_id: applicationData.employerId,
      data: {
        applicationId: applicationData.id,
        applicantName: applicationData.applicantName,
        jobTitle: applicationData.jobTitle,
      },
    });
  }

  async notifyApplicationAccepted(applicationData: {
    id: string;
    jobTitle: string;
    company: string;
    applicantId: string;
  }) {
    await this.notificationsService.create({
      type: NotificationType.APPLICATION_ACCEPTED,
      title: 'Application Accepted!',
      message: `Congratulations! Your application for ${applicationData.jobTitle} at ${applicationData.company} has been accepted`,
      recipient_id: applicationData.applicantId,
      data: {
        applicationId: applicationData.id,
        jobTitle: applicationData.jobTitle,
        company: applicationData.company,
        status: 'accepted',
      },
    });
  }

  async notifyApplicationRejected(applicationData: {
    id: string;
    jobTitle: string;
    company: string;
    applicantId: string;
    reason?: string;
  }) {
    await this.notificationsService.create({
      type: NotificationType.APPLICATION_REJECTED,
      title: 'Application Update',
      message: `Your application for ${applicationData.jobTitle} at ${applicationData.company} was not selected${applicationData.reason ? `: ${applicationData.reason}` : ''}`,
      recipient_id: applicationData.applicantId,
      data: {
        applicationId: applicationData.id,
        jobTitle: applicationData.jobTitle,
        company: applicationData.company,
        status: 'rejected',
        reason: applicationData.reason,
      },
    });
  }

  async notifyApplicationUnderReview(applicationData: {
    id: string;
    jobTitle: string;
    company: string;
    applicantId: string;
  }) {
    await this.notificationsService.create({
      type: NotificationType.APPLICATION_UNDER_REVIEW,
      title: 'Application Under Review',
      message: `Your application for ${applicationData.jobTitle} at ${applicationData.company} is currently under review`,
      recipient_id: applicationData.applicantId,
      data: {
        applicationId: applicationData.id,
        jobTitle: applicationData.jobTitle,
        company: applicationData.company,
        status: 'under_review',
      },
    });
  }

  async notifyApplicationStatusUpdate(applicationData: {
    id: string;
    jobTitle: string;
    status: string;
    applicantId: string;
  }) {
    await this.notificationsService.create({
      type: NotificationType.APPLICATION_STATUS_UPDATED,
      title: 'Application Status Updated',
      message: `Your application for "${applicationData.jobTitle}" has been ${applicationData.status}`,
      recipient_id: applicationData.applicantId,
      data: {
        applicationId: applicationData.id,
        status: applicationData.status,
        jobTitle: applicationData.jobTitle,
      },
    });
  }

  

  async notifyRegistrationConfirmed(userData: {
    id: string;
    name: string;
    email: string;
    role: string;
  }) {
    await this.notificationsService.create({
      type: NotificationType.REGISTRATION_CONFIRMED,
      title: 'Welcome to JobBoard!',
      message: `Welcome ${userData.name}! Your account has been successfully created as a ${userData.role}`,
      recipient_id: userData.id,
      data: {
        userId: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
      },
    });
  }

  async notifyProfileUpdated(userData: {
    id: string;
    name: string;
  }) {
    await this.notificationsService.create({
      type: NotificationType.PROFILE_UPDATED,
      title: 'Profile Updated',
      message: `Your profile has been successfully updated`,
      recipient_id: userData.id,
      data: {
        userId: userData.id,
        name: userData.name,
      },
    });
  }

  async notifyResumeUploaded(userData: {
    id: string;
    name: string;
    resumeUrl: string;
  }) {
    await this.notificationsService.create({
      type: NotificationType.RESUME_UPLOADED,
      title: 'Resume Uploaded',
      message: `Your resume has been successfully uploaded and is ready for job applications`,
      recipient_id: userData.id,
      data: {
        userId: userData.id,
        name: userData.name,
        resumeUrl: userData.resumeUrl,
      },
    });
  }

  

  async notifyWelcomeMessage(userData: {
    id: string;
    name: string;
    role: string;
  }) {
    await this.notificationsService.create({
      type: NotificationType.WELCOME_MESSAGE,
      title: 'Getting Started',
      message: `Welcome to JobBoard! ${userData.role === 'employer' ? 'Start posting jobs to find great candidates.' : 'Browse jobs and start applying to find your next opportunity.'}`,
      recipient_id: userData.id,
      data: {
        userId: userData.id,
        name: userData.name,
        role: userData.role,
      },
    });
  }

  async notifySystemUpdate(userData: {
    id: string;
    message: string;
  }) {
    await this.notificationsService.create({
      type: NotificationType.SYSTEM_UPDATE,
      title: 'System Update',
      message: userData.message,
      recipient_id: userData.id,
      data: {
        userId: userData.id,
        type: 'system_update',
      },
    });
  }
} 