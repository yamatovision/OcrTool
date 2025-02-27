export interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  order: number;
}

export interface OCRResult {
  filename: string;
  text: string;
}

export interface ProcessingStatus {
  isProcessing: boolean;
  progress: number;
  currentFile?: string;
  error?: string;
}

// 認証関連の型定義
export type UserRank = '管理者' | '皆伝' | '奥伝' | '中伝' | '初伝' | 'お試し' | '退会者';

export interface User {
  id: string;
  email: string;
  name: string;
  userRank: UserRank;
  profileImageUrl?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: User;
}

export interface LoginFormData {
  email: string;
  password: string;
}