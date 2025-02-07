import axios from 'axios';
import { OCRResult } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

export const uploadFiles = async (files: File[]): Promise<OCRResult[]> => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });

  try {
    const response = await api.post<{ results: OCRResult[] }>('/upload', formData);
    return response.data.results;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail || 'Upload failed');
    }
    throw error;
  }
};
