// Course and Video Management Types

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  createdAt: Date;
  updatedAt: Date;
  isPublished: boolean;
  order: number;
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  description?: string;
  type: 'video' | 'quiz' | 'resource';
  order: number;
  duration?: number; // in seconds
  createdAt: Date;
  updatedAt: Date;
  
  // Video specific fields
  videoUrl?: string;
  vimeoId?: string;
  youtubeId?: string;
  videoProvider?: 'vimeo' | 'youtube' | 'custom';
  
  // Resource specific fields
  resourceUrl?: string;
  resourceType?: 'pdf' | 'doc' | 'link';
  
  // Quiz specific fields
  quizId?: string;
}

export interface UserProgress {
  userId: string;
  lessonId: string;
  completed: boolean;
  completedAt?: Date;
  watchTime?: number; // in seconds
  lastWatchedAt?: Date;
}

export interface VideoUpload {
  id: string;
  filename: string;
  originalName: string;
  size: number;
  mimeType: string;
  url: string;
  provider: 'local' | 'vimeo' | 'youtube' | 's3';
  providerId?: string; // Vimeo/YouTube ID
  uploadedAt: Date;
  uploadedBy: string;
  status: 'pending' | 'processing' | 'ready' | 'failed';
  metadata?: {
    duration?: number;
    resolution?: string;
    thumbnail?: string;
  };
}
