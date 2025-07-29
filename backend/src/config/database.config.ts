import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { Job } from '../jobs/entities/job.entity';
import { Application } from '../applications/entities/application.entity';
import { Contact } from '../contact/entities/contact.entity';

const configService = new ConfigService();

// Determine database type from DATABASE_URL
const databaseUrl = configService.get<string>('DATABASE_URL');
const isSqlite = databaseUrl?.startsWith('sqlite://');

const config = isSqlite 
  ? {
      type: 'sqlite' as const,
      database: databaseUrl?.replace('sqlite://', ''),
      entities: [User, Job, Application, Contact],
      migrations: ['src/migrations/*.ts'],
      synchronize: true, // Only for SQLite development
      logging: configService.get<string>('NODE_ENV') === 'development',
    }
  : {
      type: 'postgres' as const,
      url: databaseUrl,
      entities: [User, Job, Application, Contact],
      migrations: ['src/migrations/*.ts'],
      synchronize: false, // Disabled for PostgreSQL - use migrations
      logging: configService.get<string>('NODE_ENV') === 'development',
      ssl: configService.get<string>('NODE_ENV') === 'production'
        ? { rejectUnauthorized: false }
        : false,
    };

export default new DataSource(config); 