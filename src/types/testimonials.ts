export interface Testimonial {
  id: string
  title: string
  content: string
  author: TestimonialAuthor
  category: TestimonialCategory
  media?: MediaFile[]
  location?: Location
  verified: boolean
  moderated: boolean
  moderationStatus: ModerationStatus
  moderationNotes?: string
  publishedAt?: string
  createdAt: string
  updatedAt: string
  likes: number
  responses?: TestimonialResponse[]
  tags: string[]
  priority: TestimonialPriority
  featured: boolean
  viewCount: number
}

export interface TestimonialAuthor {
  id: string
  name: string
  age?: number
  location: string
  occupation?: string
  photo?: string
  email?: string
  phone?: string
  anonymous: boolean
  verified: boolean
  consent: {
    publication: boolean
    contact: boolean
    followUp: boolean
  }
}

export interface Location {
  id: string
  name: string
  region?: string
  coordinates?: [number, number]
  type: 'ville' | 'quartier' | 'region' | 'pays'
}

export interface MediaFile {
  id: string
  type: 'image' | 'audio' | 'video' | 'document'
  url: string
  filename: string
  size: number
  mimeType: string
  caption?: string
  verified: boolean
}

export type TestimonialCategory = 
  | 'experience' 
  | 'proposition'
  | 'temoignage'
  | 'question'
  | 'plainte'
  | 'suggestion'
  | 'denonciation'
  | 'felicitation'

export type ModerationStatus = 
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'needs_review'
  | 'flagged'

export type TestimonialPriority = 
  | 'low'
  | 'medium'
  | 'high'
  | 'urgent'

export interface TestimonialResponse {
  id: string
  content: string
  author: string
  authorRole: 'admin' | 'moderator' | 'expert' | 'citizen'
  publishedAt: string
  verified: boolean
  likes: number
}

export interface TestimonialFilters {
  category?: TestimonialCategory
  verified?: boolean
  featured?: boolean
  search?: string
  tags?: string[]
  location?: string
  author?: string
  moderationStatus?: ModerationStatus
  priority?: TestimonialPriority
  dateRange?: {
    start: string
    end: string
  }
}

export interface TestimonialStats {
  totalTestimonials: number
  pendingModeration: number
  verified: number
  categoriesCount: Record<TestimonialCategory, number>
  averageResponseTime: number // en heures
  featuredCount: number
  locationsCount: number
}

// Types pour la modération
export interface ModerationAction {
  id: string
  testimonialId: string
  moderatorId: string
  action: 'approve' | 'reject' | 'flag' | 'request_info' | 'escalate'
  reason?: string
  notes?: string
  timestamp: string
}

export interface ModerationQueue {
  pending: Testimonial[]
  flagged: Testimonial[]
  needsReview: Testimonial[]
  escalated: Testimonial[]
}

// Types pour la soumission
export interface SubmitTestimonialData {
  title: string
  content: string
  author: Omit<TestimonialAuthor, 'id' | 'verified'>
  category: TestimonialCategory
  media?: File[]
  location?: string
  tags?: string[]
  priority?: TestimonialPriority
}

export interface TestimonialFormData {
  title: string
  content: string
  authorName: string
  authorAge?: number
  authorLocation: string
  authorOccupation?: string
  authorEmail?: string
  authorPhone?: string
  anonymous: boolean
  category: TestimonialCategory
  tags: string[]
  consentPublication: boolean
  consentContact: boolean
  consentFollowUp: boolean
}

// Types pour les notifications
export interface TestimonialNotification {
  id: string
  type: 'new_testimonial' | 'response_added' | 'status_changed' | 'featured'
  testimonialId: string
  message: string
  read: boolean
  createdAt: string
}

// Types pour les analytics
export interface TestimonialAnalytics {
  submissionsPerDay: DailySubmissions[]
  categoriesDistribution: CategoryDistribution[]
  locationDistribution: LocationDistribution[]
  moderationMetrics: ModerationMetrics
  engagementMetrics: EngagementMetrics
}

export interface DailySubmissions {
  date: string
  count: number
  verified: number
  pending: number
}

export interface CategoryDistribution {
  category: TestimonialCategory
  count: number
  percentage: number
}

export interface LocationDistribution {
  location: string
  count: number
  percentage: number
}

export interface ModerationMetrics {
  averageResponseTime: number // en heures
  approvalRate: number // pourcentage
  rejectionRate: number // pourcentage
  pendingCount: number
  moderatorsActive: number
}

export interface EngagementMetrics {
  averageLikes: number
  averageResponses: number
  averageViews: number
  shareRate: number
}

// Types pour la recherche et recommandations
export interface TestimonialSearchResult {
  testimonial: Testimonial
  relevanceScore: number
  matchedFields: string[]
  highlights: string[]
}

export interface TestimonialRecommendation {
  testimonialId: string
  score: number
  reason: 'similar_category' | 'same_location' | 'similar_tags' | 'trending' | 'recent'
  explanation: string
}

// Types pour l'export et reporting
export interface TestimonialReport {
  id: string
  title: string
  description: string
  filters: TestimonialFilters
  testimonials: Testimonial[]
  analytics: TestimonialAnalytics
  generatedAt: string
  generatedBy: string
}

export interface ExportOptions {
  format: 'pdf' | 'excel' | 'csv' | 'json'
  includeMedia: boolean
  includeResponses: boolean
  anonymize: boolean
  dateRange?: {
    start: string
    end: string
  }
}