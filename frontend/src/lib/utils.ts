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

  let normalizedPath = filePath.replace(/\\/g, '/');
  console.log('getFileUrl normalizedPath:', normalizedPath);

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
  
  if (normalizedPath.includes('uploads/resumes/')) {
    const filename = normalizedPath.split('/').pop();
    const result = `${baseUrl}/uploads/resumes/${filename}`;
    console.log('getFileUrl result (double path fix):', result);
    return result;
  }
  
  if (!normalizedPath.includes('/')) {
    const result = `${baseUrl}/uploads/resumes/${normalizedPath}`;
    console.log('getFileUrl result (filename):', result);
    return result;
  }
  
  const result = `${baseUrl}${normalizedPath.startsWith('/') ? '' : '/'}${normalizedPath}`;
  console.log('getFileUrl result (other):', result);
  return result;
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
