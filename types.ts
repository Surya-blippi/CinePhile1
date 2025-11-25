export interface MoviePoster {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  thumbnailUrl?: string;
  prompts: string;
  description?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt?: string;
}

export enum AppStep {
  SELECT_TEMPLATE = 'SELECT_TEMPLATE',
  UPLOAD_PHOTO = 'UPLOAD_PHOTO',
  PAYMENT = 'PAYMENT',
  PROCESSING = 'PROCESSING',
  RESULT = 'RESULT',
  ERROR = 'ERROR'
}

export interface GenerationResult {
  imageUrl: string;
  promptUsed: string;
}

export interface ProcessingStatus {
  step: string;
  details?: string;
}