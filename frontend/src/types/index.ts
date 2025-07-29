export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'employer' | 'job_seeker' | 'admin';
  bio?: string;
  avatar?: string;
  resume?: string;
  company?: string;
  location?: string;
  phone?: string;
  website?: string;
  skills?: string[];
  experience?: string;
  education?: string;
  interests?: string;
  languages?: string;
  certifications?: string;
  projects?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  yearsOfExperience?: number;
  preferredWorkType?: string;
  salaryExpectation?: string;
  availability?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  company: string;
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
  type?: 'full_time' | 'part_time' | 'contract' | 'internship' | 'freelance';
  experienceLevel?: 'entry' | 'mid' | 'senior' | 'lead' | 'executive';
  skills?: string[];
  benefits?: string[];
  applicationDeadline?: string;
  isActive?: boolean;
  postedBy?: User;
  applications?: Application[];
  createdAt: string;
  updatedAt: string;
}

export interface Application {
  id: string;
  jobId: string;
  job: Job;
  applicantId: string;
  applicant: User;
  coverLetter?: string;
  resumeFilename?: string;
  resumeUrl?: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'hired';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  access_token?: string;
}

export interface JobFilters {
  location?: string;
  type?: string;
  experienceLevel?: string;
  salaryMin?: number;
  salaryMax?: number;
  skills?: string[];
  search?: string;
  page?: number;
  limit?: number;
}

export interface JobsResponse {
  jobs: Job[];
  total: number;
  page: number;
  totalPages: number;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'employer' | 'job_seeker';
  company?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface CreateJobData {
  title: string;
  description: string;
  company: string;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  type: 'full_time' | 'part_time' | 'contract' | 'internship' | 'freelance';
  experienceLevel: 'entry' | 'mid' | 'senior' | 'lead' | 'executive';
  skills?: string[];
  benefits?: string[];
  applicationDeadline?: string;
}

export interface ApplyJobData {
  coverLetter?: string;
  resume: File;
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  bio?: string;
  company?: string;
  location?: string;
  phone?: string;
  website?: string;
  skills?: string[];
  experience?: string;
  education?: string;
  interests?: string;
  languages?: string;
  certifications?: string;
  projects?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  yearsOfExperience?: number;
  preferredWorkType?: string;
  salaryExpectation?: string;
  availability?: string;
}

export interface UpdateJobData {
  title?: string;
  description?: string;
  company?: string;
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
  type?: 'full_time' | 'part_time' | 'contract' | 'internship' | 'freelance';
  experienceLevel?: 'entry' | 'mid' | 'senior' | 'lead' | 'executive';
  skills?: string[];
  benefits?: string[];
  applicationDeadline?: string;
  isActive?: boolean;
}

export interface CreateApplicationData {
  jobId: string;
  coverLetter?: string;
}

export interface UpdateApplicationStatusData {
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'hired';
  notes?: string;
}

export interface FilterJobsData {
  search?: string;
  location?: string;
  type?: string;
  experienceLevel?: string;
  salaryMin?: number;
  salaryMax?: number;
  company?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  message: string;
  subject?: string;
  phone?: string;
  status: 'pending' | 'read' | 'replied' | 'archived';
  adminNotes?: string;
  repliedAt?: string;
  repliedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContactData {
  name: string;
  email: string;
  message: string;
  subject?: string;
  phone?: string;
}