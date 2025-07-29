import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getFileUrl(filePath: string, fileType?: 'avatar' | 'resume'): string {
  if (!filePath) return '';
  
  if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
    return filePath;
  }
  
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3002';

  let normalizedPath = filePath.replace(/\\/g, '/');

  if (fileType === 'avatar') {
    if (normalizedPath.startsWith('/uploads/')) {
      return `${baseUrl}${normalizedPath}`;
    }
    
    if (normalizedPath.startsWith('./uploads/')) {
      const cleanPath = normalizedPath.replace('./', '/');
      return `${baseUrl}${cleanPath}`;
    }
    
    if (!normalizedPath.includes('/')) {
      return `${baseUrl}/uploads/avatars/${normalizedPath}`;
    }
  }

  if (fileType === 'resume') {
    if (normalizedPath.startsWith('/uploads/')) {
      return `${baseUrl}${normalizedPath}`;
    }
    
    if (normalizedPath.startsWith('./uploads/')) {
      const cleanPath = normalizedPath.replace('./', '/');
      return `${baseUrl}${cleanPath}`;
    }
    
    if (!normalizedPath.includes('/')) {
      return `${baseUrl}/uploads/resumes/${normalizedPath}`;
    }
  }

  if (normalizedPath.includes('avatars/') || normalizedPath.includes('avatar')) {
    if (normalizedPath.startsWith('/uploads/')) {
      return `${baseUrl}${normalizedPath}`;
    }
    
    if (normalizedPath.startsWith('./uploads/')) {
      const cleanPath = normalizedPath.replace('./', '/');
      return `${baseUrl}${cleanPath}`;
    }
    
    if (!normalizedPath.includes('/')) {
      return `${baseUrl}/uploads/avatars/${normalizedPath}`;
    }
  }

  if (normalizedPath.includes('resumes/') || normalizedPath.includes('resume')) {
    if (normalizedPath.startsWith('/uploads/')) {
      return `${baseUrl}${normalizedPath}`;
    }
    
    if (normalizedPath.startsWith('./uploads/')) {
      const cleanPath = normalizedPath.replace('./', '/');
      return `${baseUrl}${cleanPath}`;
    }
    
    if (!normalizedPath.includes('/')) {
      return `${baseUrl}/uploads/resumes/${normalizedPath}`;
    }
  }

  if (normalizedPath.startsWith('/uploads/')) {
    return `${baseUrl}${normalizedPath}`;
  }
  
  if (normalizedPath.startsWith('./uploads/')) {
    const cleanPath = normalizedPath.replace('./', '/');
    return `${baseUrl}${cleanPath}`;
  }
  
  if (!normalizedPath.includes('/')) {
    return `${baseUrl}/uploads/resumes/${normalizedPath}`;
  }
  
  return `${baseUrl}${normalizedPath.startsWith('/') ? '' : '/'}${normalizedPath}`;
}

export function getAvatarUrl(filePath: string): string {
  return getFileUrl(filePath, 'avatar');
}

export function getResumeUrl(filePath: string): string {
  return getFileUrl(filePath, 'resume');
}

export function getDownloadUrl(filePath: string): string {
  if (!filePath) {
    return '';
  }
  
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3002';
  
  let normalizedPath = filePath.replace(/\\/g, '/');
  
  if (normalizedPath.startsWith('/uploads/')) {
    return `${baseUrl}${normalizedPath}`;
  }
  
  if (normalizedPath.startsWith('./uploads/')) {
    const cleanPath = normalizedPath.replace('./', '/');
    return `${baseUrl}${cleanPath}`;
  }
  
  if (!normalizedPath.includes('/')) {
    return `${baseUrl}/uploads/resumes/${normalizedPath}`;
  }
  
  return `${baseUrl}${normalizedPath.startsWith('/') ? '' : '/'}${normalizedPath}`;
}
