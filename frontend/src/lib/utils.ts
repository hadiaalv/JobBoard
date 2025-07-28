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

  // Handle paths that start with /uploads/
  if (filePath.startsWith('/uploads/')) {
    const result = `${baseUrl}${filePath}`;
    console.log('getFileUrl result (uploads):', result);
    return result;
  }
  
  // Handle relative paths like ./uploads/resumes/filename.pdf
  if (filePath.startsWith('./uploads/')) {
    const cleanPath = filePath.replace('./', '/');
    const result = `${baseUrl}${cleanPath}`;
    console.log('getFileUrl result (relative):', result);
    return result;
  }
  
  // Handle just filenames
  if (!filePath.includes('/')) {
    const result = `${baseUrl}/uploads/resumes/${filePath}`;
    console.log('getFileUrl result (filename):', result);
    return result;
  }
  
  // Handle other path formats
  const result = `${baseUrl}${filePath.startsWith('/') ? '' : '/'}${filePath}`;
  console.log('getFileUrl result (other):', result);
  return result;
}
