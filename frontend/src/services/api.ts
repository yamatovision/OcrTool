import axios from 'axios';
import { OCRResult, AuthResponse, LoginFormData } from '../types';

const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

// リクエストインターセプター
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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

export const login = async (credentials: LoginFormData): Promise<AuthResponse> => {
  try {
    const response = await axios.post<AuthResponse>(
      `${import.meta.env.VITE_API_URL}/auth/login`,
      credentials,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (response.data.success && response.data.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message: error.response?.data?.message || 'ログインに失敗しました',
      };
    }
    return {
      success: false,
      message: 'エラーが発生しました',
    };
  }
};

export const getCurrentUser = async (): Promise<AuthResponse> => {
  try {
    const response = await api.get<AuthResponse>('/auth/me');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message: error.response?.data?.message || 'ユーザー情報の取得に失敗しました',
      };
    }
    return {
      success: false,
      message: 'エラーが発生しました',
    };
  }
};

export const logout = (): void => {
  localStorage.removeItem('authToken');
};