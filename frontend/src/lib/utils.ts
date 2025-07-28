import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getFileUrl(filePath: string): string {
  if (!filePath) return '';
  
  
  if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
    return filePath;
  }
  
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3002';

  if (filePath.startsWith('/uploads/')) {
    return `${baseUrl}${filePath}`;
  }
  
  if (!filePath.includes('/')) {
    return `${baseUrl}/uploads/resumes/${filePath}`;
  }
  
  return `${baseUrl}${filePath.startsWith('/') ? '' : '/'}${filePath}`;
}
