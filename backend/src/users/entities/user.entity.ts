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
import { JobFavorite } from '../../job-favorites/entities/job-favorite.entity';

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
  @Exclude()
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

  @Column({ type: 'text', nullable: true })
  skills?: string;

  @Column({ type: 'text', nullable: true })
  experience?: string;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ nullable: true })
  resume?: string;

  @Column({ nullable: true })
  location?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  website?: string;

  @Column({ type: 'text', nullable: true })
  education?: string;

  @Column({ type: 'text', nullable: true })
  interests?: string;

  @Column({ type: 'text', nullable: true })
  languages?: string;

  @Column({ type: 'text', nullable: true })
  certifications?: string;

  @Column({ type: 'text', nullable: true })
  projects?: string;

  @Column({ nullable: true })
  linkedin?: string;

  @Column({ nullable: true })
  github?: string;

  @Column({ nullable: true })
  portfolio?: string;

  @Column({ type: 'int', nullable: true })
  yearsOfExperience?: number;

  @Column({ nullable: true })
  preferredWorkType?: string;

  @Column({ nullable: true })
  salaryExpectation?: string;

  @Column({ nullable: true })
  availability?: string;

  @OneToMany(() => Job, (job) => job.postedBy)
  jobsPosted: Job[];

  @OneToMany(() => Application, (application) => application.applicant)
  applications: Application[];

  @OneToMany(() => JobFavorite, (favorite) => favorite.user)
  jobFavorites: JobFavorite[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}