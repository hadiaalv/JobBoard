# JobBoard - Fullstack Job Board Application

A modern job board platform built with NestJS (backend) and Next.js (frontend) supporting both employers and job seekers.

##  Features

### For Job Seekers
- Browse and search job listings
- Apply to jobs with resume upload
- Track application status
- Profile management with skills and experience
- Real-time notifications

### For Employers
- Post and manage job listings
- Review applications
- Update application status
- Company profile management
- Analytics dashboard

### Technical Features
- JWT-based authentication
- Role-based access control
- File upload (resumes, avatars)
- Email notifications
- Real-time updates
- Responsive design
- TypeScript support

##  Tech Stack

### Backend
- **Framework**: NestJS
- **Database**: PostgreSQL with Prisma
- **Authentication**: JWT with Passport.js
- **File Upload**: Multer
- **Email**: Nodemailer
- **Validation**: class-validator
- **Documentation**: Swagger/OpenAPI

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Forms**: React Hook Form
- **UI Components**: Shadcn/ui
- **Notifications**: React Hot Toast

##  Prerequisites

- Node.js 18+ 
- PostgreSQL 12+
- npm or yarn

##  Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd job-board
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Start development server
npm run start:dev
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. Access the Application

- Frontend: http://localhost:3001
- Backend API: http://localhost:3001/api


##  Environment Variables

### Backend (.env)

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/job_board_db"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="7d"

# Server Configuration
PORT=3001
NODE_ENV="development"
FRONTEND_URL="http://localhost:3000"

# File Upload Configuration
UPLOAD_DEST="./uploads"
MAX_FILE_SIZE=5242880

# Email Configuration (Optional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM="noreply@jobboard.com"

# CORS Configuration
CORS_ORIGIN="http://localhost:3000"
```

### Frontend (.env.local)

```env
# API Configuration
NEXT_PUBLIC_API_URL="http://localhost:3001/api"

# Next.js Configuration
NEXT_PUBLIC_APP_NAME="JobBoard"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

##  API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users/me` - Get current user profile
- `PATCH /api/users/me` - Update user profile
- `GET /api/users/:id` - Get user by ID (admin only)

### Jobs
- `GET /api/jobs` - Get all jobs (with filters)
- `POST /api/jobs` - Create new job (employers only)
- `GET /api/jobs/:id` - Get job details
- `PATCH /api/jobs/:id` - Update job (employer only)
- `DELETE /api/jobs/:id` - Delete job (employer only)
- `GET /api/jobs/my-jobs` - Get employer's jobs

### Applications
- `POST /api/applications` - Apply to job (job seekers only)
- `GET /api/applications/me` - Get user's applications
- `GET /api/applications/employer` - Get employer's applications
- `GET /api/applications/job/:id` - Get applications for specific job
- `PATCH /api/applications/:id/status` - Update application status

### File Upload
- `POST /api/upload/avatar` - Upload user avatar
- `POST /api/upload/resume` - Upload resume

## 🗄️ Database Schema

### Users Table
```sql
- id (UUID, Primary Key)
- email (VARCHAR, Unique)
- password (VARCHAR, Hashed)
- firstName (VARCHAR)
- lastName (VARCHAR)
- role (ENUM: job_seeker, employer, admin)
- company (VARCHAR, Optional)
- bio (TEXT, Optional)
- skills (TEXT[], Optional)
- experience (VARCHAR, Optional)
- avatar (VARCHAR, Optional)
- resume (VARCHAR, Optional)
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)
```

### Jobs Table
```sql
- id (UUID, Primary Key)
- title (VARCHAR)
- description (TEXT)
- company (VARCHAR)
- location (VARCHAR, Optional)
- salaryMin (INTEGER, Optional)
- salaryMax (INTEGER, Optional)
- type (ENUM: full_time, part_time, contract, internship, freelance)
- experienceLevel (ENUM: entry, mid, senior, lead, executive)
- skills (TEXT[], Optional)
- benefits (TEXT[], Optional)
- applicationDeadline (TIMESTAMP, Optional)
- isActive (BOOLEAN, Default: true)
- postedBy (UUID, Foreign Key to Users)
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)
```

### Applications Table
```sql
- id (UUID, Primary Key)
- jobId (UUID, Foreign Key to Jobs)
- applicantId (UUID, Foreign Key to Users)
- coverLetter (TEXT, Optional)
- resumeFilename (VARCHAR, Optional)
- resumeUrl (VARCHAR, Optional)
- status (ENUM: pending, reviewed, shortlisted, rejected, hired)
- notes (TEXT, Optional)
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)
```




##  Project Structure

```
job-board/
├── backend/
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── users/          # User management
│   │   ├── jobs/           # Job management
│   │   ├── applications/   # Application management
│   │   ├── mail/           # Email service
│   │   ├── upload/         # File upload service
│   │   └── common/         # Shared utilities
│   ├── prisma/             # Database schema
│   └── uploads/            # File storage
├── frontend/
│   ├── src/
│   │   ├── app/            # Next.js app router pages
│   │   ├── components/     # React components
│   │   ├── lib/            # Utilities and API client
│   │   ├── stores/         # State management
│   │   └── types/          # TypeScript types
│   └── public/             # Static assets
└── README.md
