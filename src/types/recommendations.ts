export interface UserProfile {
  id: string
  preferences: UserPreferences
  behavior: UserBehavior
  demographics?: UserDemographics
  interests: string[]
  createdAt: string
  updatedAt: string
}

export interface UserPreferences {
  contentTypes: ContentTypePreference[]
  categories: CategoryPreference[]
  languages: string[]
  notificationSettings: NotificationSettings
  displaySettings: DisplaySettings
}

export interface ContentTypePreference {
  type: 'articles' | 'interviews' | 'photoReports' | 'videoAnalyses' | 'testimonials'
  weight: number // 0-1
  enabled: boolean
}

export interface CategoryPreference {
  category: string
  weight: number // 0-1
  enabled: boolean
}

export interface UserBehavior {
  viewHistory: ViewHistoryItem[]
  searchHistory: SearchHistoryItem[]
  interactions: InteractionItem[]
  sessionData: SessionData
}

export interface ViewHistoryItem {
  contentId: string
  contentType: string
  viewedAt: string
  duration: number // en secondes
  completed: boolean
  rating?: number // 1-5
}

export interface SearchHistoryItem {
  query: string
  searchedAt: string
  resultsClicked: string[]
  filters: Record<string, any>
}

export interface InteractionItem {
  type: 'like' | 'share' | 'comment' | 'bookmark' | 'download'
  contentId: string
  contentType: string
  timestamp: string
  metadata?: Record<string, any>
}

export interface SessionData {
  totalSessions: number
  averageSessionDuration: number
  lastVisit: string
  deviceInfo: DeviceInfo
  locationInfo?: LocationInfo
}

export interface DeviceInfo {
  type: 'desktop' | 'mobile' | 'tablet'
  os: string
  browser: string
  screenSize: string
}

export interface LocationInfo {
  country: string
  region?: string
  city?: string
  timezone: string
}

export interface UserDemographics {
  ageRange?: string
  occupation?: string
  education?: string
  interests?: string[]
}

export interface NotificationSettings {
  email: boolean
  push: boolean
  inApp: boolean
  frequency: 'immediate' | 'daily' | 'weekly' | 'never'
  types: NotificationType[]
}

export interface NotificationType {
  type: string
  enabled: boolean
}

export interface DisplaySettings {
  theme: 'senegalais' | 'minimaliste' | 'auto'
  layout: 'grid' | 'list' | 'auto'
  itemsPerPage: number
  showImages: boolean
  autoplay: boolean
}

// Types pour les recommandations
export interface RecommendationEngine {
  generateRecommendations: (userId: string, limit?: number) => Promise<Recommendation[]>
  updateUserProfile: (userId: string, interaction: InteractionItem) => Promise<void>
  getPersonalizedFeed: (userId: string, filters?: FeedFilters) => Promise<ContentItem[]>
}

export interface Recommendation {
  contentId: string
  contentType: string
  score: number // 0-1
  reasons: RecommendationReason[]
  metadata: RecommendationMetadata
}

export interface RecommendationReason {
  type: 'similar_content' | 'user_behavior' | 'trending' | 'category_match' | 'collaborative_filtering'
  explanation: string
  weight: number
}

export interface RecommendationMetadata {
  generatedAt: string
  algorithm: string
  version: string
  confidence: number
  freshness: number
}

export interface ContentItem {
  id: string
  type: string
  title: string
  description?: string
  thumbnail?: string
  publishedAt: string
  author?: string
  category?: string
  tags: string[]
  metrics: ContentMetrics
}

export interface ContentMetrics {
  views: number
  likes: number
  shares: number
  comments: number
  rating: number
  engagement: number
}

export interface FeedFilters {
  contentTypes?: string[]
  categories?: string[]
  dateRange?: {
    start: string
    end: string
  }
  minRating?: number
  excludeViewed?: boolean
}

// Types pour l'analyse comportementale
export interface BehaviorAnalytics {
  userId: string
  patterns: BehaviorPattern[]
  insights: BehaviorInsight[]
  predictions: BehaviorPrediction[]
  generatedAt: string
}

export interface BehaviorPattern {
  type: 'reading_time' | 'content_preference' | 'session_pattern' | 'search_pattern'
  description: string
  frequency: number
  confidence: number
  trend: 'increasing' | 'decreasing' | 'stable'
}

export interface BehaviorInsight {
  type: string
  title: string
  description: string
  actionable: boolean
  priority: 'low' | 'medium' | 'high'
}

export interface BehaviorPrediction {
  type: string
  prediction: string
  probability: number
  timeframe: string
  factors: string[]
}

// Types pour la personnalisation
export interface PersonalizationConfig {
  algorithms: AlgorithmConfig[]
  weights: PersonalizationWeights
  thresholds: PersonalizationThresholds
  features: FeatureFlags
}

export interface AlgorithmConfig {
  name: string
  enabled: boolean
  weight: number
  parameters: Record<string, any>
}

export interface PersonalizationWeights {
  contentSimilarity: number
  userBehavior: number
  trending: number
  recency: number
  diversity: number
}

export interface PersonalizationThresholds {
  minScore: number
  maxRecommendations: number
  diversityThreshold: number
  freshnessThreshold: number
}

export interface FeatureFlags {
  collaborativeFiltering: boolean
  contentBasedFiltering: boolean
  trendingBoost: boolean
  diversityOptimization: boolean
  realTimeUpdates: boolean
}

// Types pour les métriques de recommandation
export interface RecommendationMetrics {
  userId: string
  period: string
  metrics: {
    clickThroughRate: number
    conversionRate: number
    diversityScore: number
    noveltyScore: number
    userSatisfaction: number
  }
  comparisons: MetricComparison[]
}

export interface MetricComparison {
  metric: string
  current: number
  previous: number
  change: number
  trend: 'up' | 'down' | 'stable'
}

// Types pour l'A/B testing
export interface ABTest {
  id: string
  name: string
  description: string
  variants: ABTestVariant[]
  status: 'draft' | 'running' | 'completed' | 'paused'
  startDate: string
  endDate?: string
  targetAudience: AudienceSegment
  metrics: ABTestMetrics
}

export interface ABTestVariant {
  id: string
  name: string
  description: string
  config: PersonalizationConfig
  allocation: number // pourcentage
  performance: VariantPerformance
}

export interface AudienceSegment {
  criteria: SegmentCriteria[]
  size: number
  description: string
}

export interface SegmentCriteria {
  field: string
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'in'
  value: any
}

export interface ABTestMetrics {
  primaryMetric: string
  secondaryMetrics: string[]
  results: TestResults
}

export interface TestResults {
  winner?: string
  confidence: number
  significance: number
  results: Record<string, VariantPerformance>
}

export interface VariantPerformance {
  users: number
  conversions: number
  conversionRate: number
  engagement: number
  satisfaction: number
}