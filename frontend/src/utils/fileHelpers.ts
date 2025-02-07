import { UploadedFile } from '../types';

export const generateFileId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const createFilePreview = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.readAsDataURL(file);
  });
};

export const sortFilesByTimestamp = (files: File[]): File[] => {
  return [...files].sort((a, b) => a.lastModified - b.lastModified);
};

export const validateFile = (file: File): boolean => {
  const validTypes = ['image/jpeg', 'image/png'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  return validTypes.includes(file.type) && file.size <= maxSize;
};
