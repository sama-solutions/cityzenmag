export interface Interview {
  id: string
  title: string
  description?: string
  interviewee: Interviewee
  interviewer: string
  questions: Question[]
  category: InterviewCategory
  duration: number // en minutes
  audioUrl?: string
  videoUrl?: string
  transcript?: string
  publishedAt: string
  createdAt: string
  updatedAt: string
  featured: boolean
  tags: string[]
  viewCount: number
  likeCount: number
  thumbnail?: string
}

export interface Interviewee {
  id: string
  name: string
  role: string
  bio: string
  photo?: string
  organization?: string
  social?: {
    twitter?: string
    linkedin?: string
    website?: string
  }
}

export interface Question {
  id: string
  question: string
  answer: string
  timestamp?: number // pour audio/vidéo en secondes
  media?: MediaFile[]
  highlights?: string[] // phrases importantes
  order: number
}

export interface MediaFile {
  id: string
  type: 'image' | 'audio' | 'video' | 'document'
  url: string
  filename: string
  size: number
  mimeType: string
  caption?: string
}

export type InterviewCategory = 
  | 'politique' 
  | 'social' 
  | 'economique' 
  | 'culturel'
  | 'education'
  | 'sante'
  | 'environnement'
  | 'justice'

export interface InterviewFilters {
  category?: InterviewCategory
  featured?: boolean
  search?: string
  tags?: string[]
  dateRange?: {
    start: string
    end: string
  }
}

export interface InterviewStats {
  totalInterviews: number
  totalDuration: number // en minutes
  categoriesCount: Record<InterviewCategory, number>
  averageViewCount: number
  featuredCount: number
}

// Types pour le player audio/vidéo
export interface PlayerState {
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  playbackRate: number
  currentQuestion?: string
}

export interface PlayerControls {
  play: () => void
  pause: () => void
  seek: (time: number) => void
  setVolume: (volume: number) => void
  setPlaybackRate: (rate: number) => void
  goToQuestion: (questionId: string) => void
}

// Types pour l'administration
export interface CreateInterviewData {
  title: string
  description?: string
  intervieweeId: string
  interviewer: string
  questions: Omit<Question, 'id'>[]
  category: InterviewCategory
  audioUrl?: string
  videoUrl?: string
  transcript?: string
  featured: boolean
  tags: string[]
  thumbnail?: string
}

export interface UpdateInterviewData extends Partial<CreateInterviewData> {
  id: string
}