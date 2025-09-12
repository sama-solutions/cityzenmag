export interface PhotoReport {
  id: string
  title: string
  description: string
  photographer: Photographer
  location: Location
  images: ReportImage[]
  category: PhotoReportCategory
  publishedAt: string
  createdAt: string
  updatedAt: string
  featured: boolean
  tags: string[]
  viewCount: number
  likeCount: number
  coverImage?: string
}

export interface Photographer {
  id: string
  name: string
  bio: string
  avatar?: string
  portfolio?: string
  social?: {
    instagram?: string
    website?: string
    twitter?: string
  }
  specialties?: string[]
}

export interface Location {
  id: string
  name: string
  address?: string
  coordinates: [number, number] // [longitude, latitude]
  region?: string
  country: string
}

export interface ReportImage {
  id: string
  url: string
  caption: string
  order: number
  metadata: ImageMetadata
  alt: string
  width: number
  height: number
}

export interface ImageMetadata {
  camera?: string
  lens?: string
  settings?: CameraSettings
  timestamp: string
  location?: [number, number]
  fileSize: number
  format: string
}

export interface CameraSettings {
  aperture?: string
  shutterSpeed?: string
  iso?: number
  focalLength?: string
  flash?: boolean
}

export type PhotoReportCategory = 
  | 'investigation' 
  | 'social' 
  | 'culture'
  | 'politique'
  | 'economique'
  | 'environnement'
  | 'portrait'
  | 'evenement'

export interface PhotoReportFilters {
  category?: PhotoReportCategory
  featured?: boolean
  search?: string
  tags?: string[]
  location?: string
  photographer?: string
  dateRange?: {
    start: string
    end: string
  }
}

export interface PhotoReportStats {
  totalReports: number
  totalImages: number
  categoriesCount: Record<PhotoReportCategory, number>
  averageViewCount: number
  featuredCount: number
  photographersCount: number
}

// Types pour la galerie
export interface GalleryState {
  currentIndex: number
  isFullscreen: boolean
  isPlaying: boolean
  showInfo: boolean
  showThumbnails: boolean
}

export interface GalleryControls {
  next: () => void
  previous: () => void
  goTo: (index: number) => void
  toggleFullscreen: () => void
  toggleSlideshow: () => void
  toggleInfo: () => void
  toggleThumbnails: () => void
}

// Types pour l'administration
export interface CreatePhotoReportData {
  title: string
  description: string
  photographerId: string
  locationId: string
  images: Omit<ReportImage, 'id'>[]
  category: PhotoReportCategory
  featured: boolean
  tags: string[]
  coverImage?: string
}

export interface UpdatePhotoReportData extends Partial<CreatePhotoReportData> {
  id: string
}

// Types pour la géolocalisation
export interface MapMarker {
  id: string
  position: [number, number]
  title: string
  description?: string
  reportId: string
  category: PhotoReportCategory
}

export interface MapFilters {
  categories?: PhotoReportCategory[]
  dateRange?: {
    start: string
    end: string
  }
  bounds?: {
    north: number
    south: number
    east: number
    west: number
  }
}