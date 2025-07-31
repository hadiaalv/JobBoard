import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/jobs/create',
  '/jobs/edit',
  '/dashboard/applications',
  '/dashboard/jobs'
]

const employerRoutes = [
  '/jobs/create',
  '/jobs/edit',
  '/dashboard/jobs'
]

const jobSeekerRoutes = [
  '/dashboard/applications'
]

// Simple JWT decode function (for client-side middleware)
function decodeJWT(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('auth-token')
  
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )
  
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Role-based route protection
  if (token) {
    const decoded = decodeJWT(token.value);
    if (decoded && decoded.user) {
      const userRole = decoded.user.role;
      
      // Check employer routes
      const isEmployerRoute = employerRoutes.some(route => 
        pathname.startsWith(route)
      );
      if (isEmployerRoute && userRole !== 'employer') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
      
      // Check job seeker routes
      const isJobSeekerRoute = jobSeekerRoutes.some(route => 
        pathname.startsWith(route)
      );
      if (isJobSeekerRoute && userRole !== 'job_seeker') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
  }

  if (token && (pathname.startsWith('/auth/login') || pathname.startsWith('/auth/register'))) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|uploads).*)',
  ],
} 