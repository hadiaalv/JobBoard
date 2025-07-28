import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getFileUrl(filePath: string): string {
  if (!filePath) return '';
  
  console.log('getFileUrl input:', filePath);
  
  if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
    return filePath;
  }
  
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3002';
  console.log('getFileUrl baseUrl:', baseUrl);

  // Normalize the path - replace backslashes with forward slashes
  let normalizedPath = filePath.replace(/\\/g, '/');
  console.log('getFileUrl normalizedPath:', normalizedPath);

  // Handle paths that start with /uploads/
  if (normalizedPath.startsWith('/uploads/')) {
    const result = `${baseUrl}${normalizedPath}`;
    console.log('getFileUrl result (uploads):', result);
    return result;
  }
  
  // Handle relative paths like ./uploads/resumes/filename.pdf
  if (normalizedPath.startsWith('./uploads/')) {
    const cleanPath = normalizedPath.replace('./', '/');
    const result = `${baseUrl}${cleanPath}`;
    console.log('getFileUrl result (relative):', result);
    return result;
  }
  
  // Handle paths that contain uploads/resumes (double path issue)
  if (normalizedPath.includes('uploads/resumes/')) {
    // Extract just the filename from the path
    const filename = normalizedPath.split('/').pop();
    const result = `${baseUrl}/uploads/resumes/${filename}`;
    console.log('getFileUrl result (double path fix):', result);
    return result;
  }
  
  // Handle just filenames
  if (!normalizedPath.includes('/')) {
    const result = `${baseUrl}/uploads/resumes/${normalizedPath}`;
    console.log('getFileUrl result (filename):', result);
    return result;
  }
  
  // Handle other path formats
  const result = `${baseUrl}${normalizedPath.startsWith('/') ? '' : '/'}${normalizedPath}`;
  console.log('getFileUrl result (other):', result);
  return result;
}
