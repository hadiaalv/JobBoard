import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Application } from '../../applications/entities/application.entity';
import { JobFavorite } from '../../job-favorites/entities/job-favorite.entity';

@Entity('jobs')
export class Job {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  company: string;

  @Column({ nullable: true })
  location?: string;

  @Column('int', { nullable: true })
  salaryMin?: number;

  @Column('int', { nullable: true })
  salaryMax?: number;

  @Column({ 
    type: 'varchar',
    default: 'full_time'
  })
  type: string;

  @Column({ 
    type: 'varchar',
    default: 'mid'
  })
  experienceLevel: string;

  @Column('simple-array', { nullable: true })
  skills?: string[];

  @Column('simple-array', { nullable: true })
  benefits?: string[];

  @Column({ nullable: true })
  applicationDeadline?: Date;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => User, (user) => user.jobsPosted, { eager: true })
  @JoinColumn({ name: 'postedBy' })
  postedBy: User;

  @OneToMany(() => Application, (application) => application.job)
  applications: Application[];

  @OneToMany(() => JobFavorite, (favorite) => favorite.job)
  jobFavorites: JobFavorite[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
