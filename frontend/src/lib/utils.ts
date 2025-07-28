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
  
  // If it contains uploads in the path (like ./uploads/resumes/filename.pdf)
  if (filePath.includes('uploads/')) {
    // Extract the part after 'uploads/'
    const uploadsIndex = filePath.indexOf('uploads/');
    const relativePath = filePath.substring(uploadsIndex);
    return `${baseUrl}/${relativePath}`;
  }
  
  // If it's just a filename, assume it's in uploads
  return `${baseUrl}/uploads/${filePath}`;
}
