import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getFileUrl(filePath: string): string {
  if (!filePath) return '';
  
  console.log('getFileUrl input:', filePath);
  
  // If it's already a full URL, return as is
  if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
    return filePath;
  }
  
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3002';
  
  // If it starts with /uploads/, construct the full URL
  if (filePath.startsWith('/uploads/')) {
    const result = `${baseUrl}${filePath}`;
    console.log('getFileUrl result:', result);
    return result;
  }
  
  // If it's just a filename, assume it's in uploads/resumes
  if (!filePath.includes('/')) {
    const result = `${baseUrl}/uploads/resumes/${filePath}`;
    console.log('getFileUrl result (filename):', result);
    return result;
  }
  
  // For any other case, just append to base URL
  const result = `${baseUrl}${filePath.startsWith('/') ? '' : '/'}${filePath}`;
  console.log('getFileUrl result (fallback):', result);
  return result;
}
