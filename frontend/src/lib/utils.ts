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

export function getDownloadUrl(filePath: string): string {
  if (!filePath) {
    console.log('getDownloadUrl: filePath is empty or null');
    return '';
  }
  
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3002';
  
  console.log('getDownloadUrl input:', filePath);
  
  // Normalize the path - replace backslashes with forward slashes
  let normalizedPath = filePath.replace(/\\/g, '/');
  console.log('getDownloadUrl normalizedPath:', normalizedPath);
  
  // Handle paths that start with /uploads/
  if (normalizedPath.startsWith('/uploads/')) {
    normalizedPath = normalizedPath.substring(8); // Remove '/uploads/'
  } else if (normalizedPath.startsWith('./uploads/')) {
    normalizedPath = normalizedPath.substring(10); // Remove './uploads/'
  }
  
  console.log('getDownloadUrl after prefix removal:', normalizedPath);
  
  // Check if the path is empty or just slashes
  if (!normalizedPath || normalizedPath === '/' || normalizedPath === '') {
    console.log('getDownloadUrl: path is empty after normalization');
    return '';
  }
  
  // Split into folder and filename
  const parts = normalizedPath.split('/').filter(part => part.length > 0);
  console.log('getDownloadUrl parts:', parts);
  
  if (parts.length >= 2) {
    const folder = parts[0];
    const filename = parts[1];
    const result = `${baseUrl}/download/${folder}/${filename}`;
    console.log('getDownloadUrl result (folder/filename):', result);
    return result;
  } else if (parts.length === 1 && parts[0]) {
    // Handle case where it's just a filename - assume it's a resume
    const filename = parts[0];
    const result = `${baseUrl}/download/resumes/${filename}`;
    console.log('getDownloadUrl result (filename only):', result);
    return result;
  }
  
  // Fallback to regular file URL
  console.log('getDownloadUrl fallback to getFileUrl');
  return getFileUrl(filePath);
}
