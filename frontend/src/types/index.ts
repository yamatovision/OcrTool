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
