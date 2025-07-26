import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Job } from '../../jobs/entities/job.entity';
import { Application } from '../../applications/entities/application.entity';

export enum UserRole {
  JOB_SEEKER = 'job_seeker',
  EMPLOYER = 'employer',
  ADMIN = 'admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude() // Prevents password from being returned in responses
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.JOB_SEEKER,
  })
  role: UserRole;

  @Column({ nullable: true })
  company?: string;

  @Column({ type: 'text', nullable: true })
  bio?: string;

  @Column({ type: 'simple-array', nullable: true })
  skills?: string[];

  @Column({ nullable: true })
  experience?: string;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ nullable: true })
  resume?: string;

  @OneToMany(() => Job, (job) => job.postedBy, { cascade: true })
  jobs: Job[];

  @OneToMany(() => Application, (application) => application.applicant, { cascade: true })
  applications: Application[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}