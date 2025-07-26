# JobBoard Integration Guide

This guide explains how the frontend and backend are integrated and how to troubleshoot common issues.

## 🔗 Integration Overview

The JobBoard application consists of two main parts:
- **Backend**: NestJS API server running on port 3001
- **Frontend**: Next.js application running on port 3000

## 🌐 API Communication

### Base Configuration
- **Backend URL**: `http://localhost:3001/api`
- **Frontend API Client**: `src/lib/api.ts`
- **Authentication**: JWT tokens stored in cookies

### Key Integration Points

#### 1. Authentication Flow
```typescript
// Frontend auth store (src/stores/auth.ts)
const response = await api.post<AuthResponse>('/auth/login', data);
const { user, token, access_token } = response.data;
Cookies.set('auth-token', token || access_token, { expires: 7, path: '/' });
```

#### 2. API Interceptors
```typescript
// Frontend API client (src/lib/api.ts)
api.interceptors.request.use((config) => {
  const token = Cookies.get('auth-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

#### 3. CORS Configuration
```typescript
// Backend main.ts
app.enableCors({
  origin: frontendUrl, // http://localhost:3000
  credentials: true,
});
```

## 📋 API Endpoints Mapping

### Authentication
| Frontend Route | Backend Endpoint | Method | Description |
|----------------|------------------|--------|-------------|
| `/auth/login` | `/api/auth/login` | POST | User login |
| `/auth/register` | `/api/auth/register` | POST | User registration |

### User Management
| Frontend Route | Backend Endpoint | Method | Description |
|----------------|------------------|--------|-------------|
| `/profile` | `/api/users/me` | GET/PATCH | User profile management |

### Jobs
| Frontend Route | Backend Endpoint | Method | Description |
|----------------|------------------|--------|-------------|
| `/jobs` | `/api/jobs` | GET | List all jobs |
| `/jobs/[id]` | `/api/jobs/:id` | GET | Job details |
| `/jobs/create` | `/api/jobs` | POST | Create job (employers) |
| `/jobs/edit/[id]` | `/api/jobs/:id` | PATCH | Update job (employers) |

### Applications
| Frontend Route | Backend Endpoint | Method | Description |
|----------------|------------------|--------|-------------|
| `/dashboard/applications` | `/api/applications/me` | GET | User applications |
| `/dashboard/applications` | `/api/applications/employer` | GET | Employer applications |

## 🔧 Environment Configuration

### Backend (.env)
```env
DATABASE_URL="postgresql://username:password@localhost:5432/job_board_db"
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="7d"
PORT=3001
NODE_ENV="development"
FRONTEND_URL="http://localhost:3000"
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL="http://localhost:3001/api"
NEXT_PUBLIC_APP_NAME="JobBoard"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## 🚀 Quick Start Commands

### Development
```bash
# Terminal 1 - Backend
cd backend
npm install
cp env.example .env
# Edit .env with your database configuration
npx prisma generate
npx prisma migrate dev
npm run start:dev

# Terminal 2 - Frontend
cd frontend
npm install
cp env.example .env.local
# Edit .env.local with your API URL
npm run dev
```

### Production
```bash
# Backend
cd backend
npm run build
npm run start:prod

# Frontend
cd frontend
npm run build
npm run start
```

## 🔍 Troubleshooting

### Common Issues

#### 1. CORS Errors
**Symptoms**: Browser console shows CORS errors
**Solution**: 
- Ensure `FRONTEND_URL` is set correctly in backend `.env`
- Check that frontend is running on the expected port
- Verify CORS configuration in `backend/src/main.ts`

#### 2. Authentication Issues
**Symptoms**: Users can't login or stay logged in
**Solution**:
- Check JWT secret is set in backend `.env`
- Verify token is being stored in cookies
- Check API interceptor is adding Authorization header

#### 3. Database Connection Issues
**Symptoms**: Backend fails to start or API calls fail
**Solution**:
- Verify PostgreSQL is running
- Check `DATABASE_URL` in backend `.env`
- Run `npx prisma migrate dev` to ensure database is up to date

#### 4. File Upload Issues
**Symptoms**: Resume/avatar uploads fail
**Solution**:
- Check `UPLOAD_DEST` directory exists and is writable
- Verify file size limits in backend configuration
- Check file type validation

#### 5. API Endpoint Not Found
**Symptoms**: 404 errors for API calls
**Solution**:
- Ensure backend is running on port 3001
- Check `NEXT_PUBLIC_API_URL` in frontend `.env.local`
- Verify API routes are correctly defined

### Debug Steps

#### 1. Check Backend Logs
```bash
cd backend
npm run start:dev
# Look for error messages in console
```

#### 2. Check Frontend Network Tab
- Open browser developer tools
- Go to Network tab
- Make an API call and check the request/response

#### 3. Verify Environment Variables
```bash
# Backend
cd backend
node -e "console.log(require('dotenv').config())"

# Frontend
cd frontend
node -e "console.log(process.env.NEXT_PUBLIC_API_URL)"
```

#### 4. Test API Directly
```bash
# Test backend health
curl http://localhost:3001/api

# Test authentication
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

## 📊 Data Flow Examples

### User Registration Flow
1. User fills registration form on `/auth/register`
2. Frontend sends POST to `/api/auth/register`
3. Backend creates user and returns JWT token
4. Frontend stores token in cookies
5. User is redirected to dashboard

### Job Application Flow
1. Job seeker clicks "Apply" on job listing
2. Frontend shows application form
3. User uploads resume and submits
4. Frontend sends POST to `/api/applications`
5. Backend creates application record
6. User sees confirmation and can track status

### Dashboard Data Flow
1. User visits `/dashboard`
2. Frontend checks authentication status
3. Based on user role, fetches relevant data:
   - Employers: `/api/jobs/my-jobs` and `/api/applications/employer`
   - Job Seekers: `/api/applications/me`
4. Displays data in role-specific dashboard

## 🔐 Security Considerations

### Authentication
- JWT tokens expire after 7 days
- Passwords are hashed using bcrypt
- Tokens are stored in HTTP-only cookies
- API routes are protected with guards

### Authorization
- Role-based access control (RBEC)
- Employers can only manage their own jobs
- Job seekers can only apply to jobs
- Admin role for system management

### Data Validation
- Frontend: Zod schemas for form validation
- Backend: class-validator decorators
- File upload validation (type and size)
- SQL injection protection via TypeORM

## 📈 Performance Optimization

### Frontend
- React Query for data caching
- Lazy loading of components
- Image optimization with Next.js
- Code splitting and bundling

### Backend
- Database query optimization
- File upload streaming
- Rate limiting with ThrottlerModule
- CORS preflight caching

## 🧪 Testing Integration

### Backend Tests
```bash
cd backend
npm run test          # Unit tests
npm run test:e2e      # Integration tests
npm run test:cov      # Coverage report
```

### Frontend Tests
```bash
cd frontend
npm run test          # Unit tests
npm run test:coverage # Coverage report
```

### API Testing
```bash
# Test all endpoints
curl -X GET http://localhost:3001/api/jobs
curl -X POST http://localhost:3001/api/auth/login
curl -X GET http://localhost:3001/api/users/me -H "Authorization: Bearer YOUR_TOKEN"
```

## 📚 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## 🆘 Getting Help

If you encounter issues:

1. Check this integration guide
2. Review the main README.md
3. Check browser console and backend logs
4. Verify environment variables
5. Test API endpoints directly
6. Create an issue with detailed error information

---

**Happy coding! 🚀** 