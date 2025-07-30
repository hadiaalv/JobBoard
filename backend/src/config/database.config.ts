import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Job } from '../jobs/entities/job.entity';
import { Application } from '../applications/entities/application.entity';
import { Contact } from '../contact/entities/contact.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [User, Job, Application, Contact],
  synchronize: true, // Enable for development
  logging: process.env.NODE_ENV === 'development',
}); 