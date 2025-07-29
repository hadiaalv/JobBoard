import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getFileUrl(filePath: string, fileType?: 'avatar' | 'resume'): string {
  if (!filePath) return '';
  
  console.log('getFileUrl input:', filePath, 'fileType:', fileType);
  
  if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
    return filePath;
  }
  
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3002';
  console.log('getFileUrl baseUrl:', baseUrl);

  let normalizedPath = filePath.replace(/\\/g, '/');
  console.log('getFileUrl normalizedPath:', normalizedPath);

  // If fileType is specified, use it to determine the correct path
  if (fileType === 'avatar') {
    if (normalizedPath.startsWith('/uploads/')) {
      const result = `${baseUrl}${normalizedPath}`;
      console.log('getFileUrl result (avatar with /uploads/):', result);
      return result;
    }
    
    if (normalizedPath.startsWith('./uploads/')) {
      const cleanPath = normalizedPath.replace('./', '/');
      const result = `${baseUrl}${cleanPath}`;
      console.log('getFileUrl result (avatar with ./uploads/):', result);
      return result;
    }
    
    // If it's just a filename, assume it's an avatar
    if (!normalizedPath.includes('/')) {
      const result = `${baseUrl}/uploads/avatars/${normalizedPath}`;
      console.log('getFileUrl result (avatar filename):', result);
      return result;
    }
  }

  if (fileType === 'resume') {
    if (normalizedPath.startsWith('/uploads/')) {
      const result = `${baseUrl}${normalizedPath}`;
      console.log('getFileUrl result (resume with /uploads/):', result);
      return result;
    }
    
    if (normalizedPath.startsWith('./uploads/')) {
      const cleanPath = normalizedPath.replace('./', '/');
      const result = `${baseUrl}${cleanPath}`;
      console.log('getFileUrl result (resume with ./uploads/):', result);
      return result;
    }
    
    // If it's just a filename, assume it's a resume
    if (!normalizedPath.includes('/')) {
      const result = `${baseUrl}/uploads/resumes/${normalizedPath}`;
      console.log('getFileUrl result (resume filename):', result);
      return result;
    }
  }

  // Legacy logic for backward compatibility
  if (normalizedPath.includes('avatars/') || normalizedPath.includes('avatar')) {
    if (normalizedPath.startsWith('/uploads/')) {
      const result = `${baseUrl}${normalizedPath}`;
      console.log('getFileUrl result (avatar with /uploads/):', result);
      return result;
    }
    
    if (normalizedPath.startsWith('./uploads/')) {
      const cleanPath = normalizedPath.replace('./', '/');
      const result = `${baseUrl}${cleanPath}`;
      console.log('getFileUrl result (avatar with ./uploads/):', result);
      return result;
    }
    
    if (!normalizedPath.includes('/')) {
      const result = `${baseUrl}/uploads/avatars/${normalizedPath}`;
      console.log('getFileUrl result (avatar filename):', result);
      return result;
    }
  }

  if (normalizedPath.includes('resumes/') || normalizedPath.includes('resume')) {
    if (normalizedPath.startsWith('/uploads/')) {
      const result = `${baseUrl}${normalizedPath}`;
      console.log('getFileUrl result (resume with /uploads/):', result);
      return result;
    }
    
    if (normalizedPath.startsWith('./uploads/')) {
      const cleanPath = normalizedPath.replace('./', '/');
      const result = `${baseUrl}${cleanPath}`;
      console.log('getFileUrl result (resume with ./uploads/):', result);
      return result;
    }
    
    if (!normalizedPath.includes('/')) {
      const result = `${baseUrl}/uploads/resumes/${normalizedPath}`;
      console.log('getFileUrl result (resume filename):', result);
      return result;
    }
  }

  if (normalizedPath.startsWith('/uploads/')) {
    const result = `${baseUrl}${normalizedPath}`;
    console.log('getFileUrl result (uploads):', result);
    return result;
  }
  
  if (normalizedPath.startsWith('./uploads/')) {
    const cleanPath = normalizedPath.replace('./', '/');
    const result = `${baseUrl}${cleanPath}`;
    console.log('getFileUrl result (relative):', result);
    return result;
  }
  
  // If it's just a filename without path, default to resumes
  if (!normalizedPath.includes('/')) {
    const result = `${baseUrl}/uploads/resumes/${normalizedPath}`;
    console.log('getFileUrl result (filename default):', result);
    return result;
  }
  
  const result = `${baseUrl}${normalizedPath.startsWith('/') ? '' : '/'}${normalizedPath}`;
  console.log('getFileUrl result (other):', result);
  return result;
}

// Convenience functions for specific file types
export function getAvatarUrl(filePath: string): string {
  return getFileUrl(filePath, 'avatar');
}

export function getResumeUrl(filePath: string): string {
  return getFileUrl(filePath, 'resume');
}

export function getDownloadUrl(filePath: string): string {
  if (!filePath) {
    console.log('getDownloadUrl: filePath is empty or null');
    return '';
  }
  
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3002';
  
  console.log('getDownloadUrl input:', filePath);
  
  let normalizedPath = filePath.replace(/\\/g, '/');
  console.log('getDownloadUrl normalizedPath:', normalizedPath);
  
  if (normalizedPath.startsWith('/uploads/')) {
    const result = `${baseUrl}${normalizedPath}`;
    console.log('getDownloadUrl result (uploads):', result);
    return result;
  }
  
  if (normalizedPath.startsWith('./uploads/')) {
    const cleanPath = normalizedPath.replace('./', '/');
    const result = `${baseUrl}${cleanPath}`;
    console.log('getDownloadUrl result (relative):', result);
    return result;
  }
  
  if (!normalizedPath.includes('/')) {
    const result = `${baseUrl}/uploads/resumes/${normalizedPath}`;
    console.log('getDownloadUrl result (filename):', result);
    return result;
  }
  
  const result = `${baseUrl}${normalizedPath.startsWith('/') ? '' : '/'}${normalizedPath}`;
  console.log('getDownloadUrl result (other):', result);
  return result;
}
