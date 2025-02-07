import { useState, useCallback } from 'react';
import { UploadedFile } from '../types';
import { generateFileId, createFilePreview, validateFile, sortFilesByTimestamp } from '../utils/fileHelpers';

export const useFileUpload = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    setError(null);
    const fileArray = sortFilesByTimestamp(Array.from(files));
    
    const newFiles: UploadedFile[] = [];
    
    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      
      if (!validateFile(file)) {
        setError('Invalid file type or size');
        continue;
      }

      const preview = await createFilePreview(file);
      newFiles.push({
        id: generateFileId(),
        file,
        preview,
        order: i
      });
    }

    setUploadedFiles(prev => [...prev, ...newFiles]);
  }, []);

  const removeFile = useCallback((id: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== id));
  }, []);

  const reorderFiles = useCallback((startIndex: number, endIndex: number) => {
    setUploadedFiles(prev => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result.map((file, index) => ({ ...file, order: index }));
    });
  }, []);

  return {
    uploadedFiles,
    error,
    handleFiles,
    removeFile,
    reorderFiles
  };
};
