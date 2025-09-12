export interface VideoAnalysis {
  id: string
  title: string
  description: string
  videoUrl: string
  thumbnail: string
  duration: number // en secondes
  transcript: string
  chapters: Chapter[]
  category: VideoAnalysisCategory
  speaker: Speaker
  publishedAt: string
  createdAt: string
  updatedAt: string
  viewCount: number
  likeCount: number
  featured: boolean
  tags: string[]
  language: string
  quality: VideoQuality[]
}

export interface Speaker {
  id: string
  name: string
  role: string
  bio: string
  photo?: string
  organization?: string
  expertise: string[]
  social?: {
    twitter?: string
    linkedin?: string
    website?: string
  }
}

export interface Chapter {
  id: string
  title: string
  startTime: number // en secondes
  endTime: number
  description: string
  thumbnail?: string
  keyPoints?: string[]
  resources?: ChapterResource[]
}

export interface ChapterResource {
  id: string
  title: string
  type: 'link' | 'document' | 'image' | 'reference'
  url: string
  description?: string
}

export interface VideoQuality {
  resolution: string // '720p', '1080p', '4K'
  url: string
  fileSize: number
  bitrate: number
}

export type VideoAnalysisCategory = 
  | 'politique' 
  | 'economique'
  | 'social'
  | 'juridique'
  | 'international'
  | 'education'
  | 'sante'
  | 'environnement'
  | 'technologie'
  | 'culture'

export interface VideoAnalysisFilters {
  category?: VideoAnalysisCategory
  featured?: boolean
  search?: string
  tags?: string[]
  speaker?: string
  duration?: {
    min: number
    max: number
  }
  dateRange?: {
    start: string
    end: string
  }
}

export interface VideoAnalysisStats {
  totalVideos: number
  totalDuration: number // en secondes
  totalViews: number
  categoriesCount: Record<VideoAnalysisCategory, number>
  averageViewCount: number
  featuredCount: number
  speakersCount: number
}

// Types pour le player vidéo
export interface VideoPlayerState {
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  playbackRate: number
  quality: string
  isFullscreen: boolean
  showControls: boolean
  currentChapter?: Chapter
  showTranscript: boolean
  showChapters: boolean
}

export interface VideoPlayerControls {
  play: () => void
  pause: () => void
  seek: (time: number) => void
  setVolume: (volume: number) => void
  setPlaybackRate: (rate: number) => void
  setQuality: (quality: string) => void
  toggleFullscreen: () => void
  goToChapter: (chapterId: string) => void
  toggleTranscript: () => void
  toggleChapters: () => void
}

// Types pour les commentaires temporels
export interface TimestampComment {
  id: string
  videoId: string
  timestamp: number
  author: string
  content: string
  createdAt: string
  replies?: TimestampComment[]
  likes: number
}

// Types pour l'administration
export interface CreateVideoAnalysisData {
  title: string
  description: string
  videoUrl: string
  thumbnail: string
  transcript: string
  chapters: Omit<Chapter, 'id'>[]
  category: VideoAnalysisCategory
  speakerId: string
  featured: boolean
  tags: string[]
  language: string
}

export interface UpdateVideoAnalysisData extends Partial<CreateVideoAnalysisData> {
  id: string
}

// Types pour les analytics
export interface VideoAnalytics {
  videoId: string
  totalViews: number
  uniqueViews: number
  averageWatchTime: number
  completionRate: number
  dropOffPoints: number[]
  chapterEngagement: ChapterEngagement[]
  viewsByDay: DailyViews[]
}

export interface ChapterEngagement {
  chapterId: string
  views: number
  averageWatchTime: number
  skipRate: number
}

export interface DailyViews {
  date: string
  views: number
  uniqueViews: number
}

// Types pour la recherche dans les transcripts
export interface TranscriptSearchResult {
  videoId: string
  timestamp: number
  text: string
  context: string
  relevanceScore: number
}

// Types pour les playlists
export interface VideoPlaylist {
  id: string
  title: string
  description: string
  videos: string[] // IDs des vidéos
  createdBy: string
  isPublic: boolean
  createdAt: string
  updatedAt: string
  thumbnail?: string
}

// Types pour les recommandations
export interface VideoRecommendation {
  videoId: string
  score: number
  reason: 'similar_topic' | 'same_speaker' | 'same_category' | 'popular' | 'recent'
  explanation: string
}