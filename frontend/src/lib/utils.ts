import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getFileUrl(filePath: string): string {
  if (!filePath) return '';
  
  // If it's already a full URL, return as is
  if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
    return filePath;
  }
  
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3002';
  
  // If it starts with /uploads/, construct the full URL
  if (filePath.startsWith('/uploads/')) {
    return `${baseUrl}${filePath}`;
  }
  
  // If it's just a filename, assume it's in uploads/resumes
  if (!filePath.includes('/')) {
    return `${baseUrl}/uploads/resumes/${filePath}`;
  }
  
  // For any other case, just append to base URL
  return `${baseUrl}${filePath.startsWith('/') ? '' : '/'}${filePath}`;
}
