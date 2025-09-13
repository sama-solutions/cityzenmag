import type { 
  UserProfile, 
  Recommendation, 
  ContentItem, 
  FeedFilters,
  InteractionItem,
  RecommendationReason,
  BehaviorAnalytics
} from '../types/recommendations'
import { mockTestimonials } from '../data/mockTestimonials'
import { mockVideoAnalyses } from '../data/mockVideoAnalyses'
import { mockPhotoReports } from '../data/mockPhotoReports'
import { mockInterviews } from '../data/mockInterviews'

export class RecommendationEngine {
  private userProfiles: Map<string, UserProfile> = new Map()
  private contentItems: ContentItem[] = []

  constructor() {
    this.initializeContentItems()
  }

  private initializeContentItems() {
    // Convertir tous les types de contenu en ContentItem uniforme
    this.contentItems = [
      // Témoignages
      ...mockTestimonials.map(t => ({
        id: t.id,
        type: 'testimonials',
        title: t.title,
        description: t.content.substring(0, 200) + '...',
        publishedAt: t.createdAt,
        author: t.author.anonymous ? 'Anonyme' : t.author.name,
        category: t.category,
        tags: t.tags,
        metrics: {
          views: t.viewCount,
          likes: t.likes,
          shares: 0,
          comments: t.responses?.length || 0,
          rating: 4.2,
          engagement: (t.likes + t.viewCount) / 100
        }
      })),
      // Vidéos
      ...mockVideoAnalyses.map(v => ({
        id: v.id,
        type: 'videoAnalyses',
        title: v.title,
        description: v.description,
        thumbnail: v.thumbnail,
        publishedAt: v.publishedAt,
        author: v.speaker.name,
        category: v.category,
        tags: v.tags,
        metrics: {
          views: v.viewCount,
          likes: v.likeCount,
          shares: Math.floor(v.likeCount * 0.3),
          comments: 0,
          rating: 4.5,
          engagement: (v.likeCount + v.viewCount) / 100
        }
      })),
      // Reportages photo
      ...mockPhotoReports.map(r => ({
        id: r.id,
        type: 'photoReports',
        title: r.title,
        description: r.description,
        thumbnail: r.coverImage,
        publishedAt: r.publishedAt,
        author: r.photographer.name,
        category: r.category,
        tags: r.tags,
        metrics: {
          views: r.viewCount,
          likes: r.likeCount,
          shares: Math.floor(r.likeCount * 0.4),
          comments: 0,
          rating: 4.3,
          engagement: (r.likeCount + r.viewCount) / 100
        }
      })),
      // Interviews
      ...mockInterviews.map(i => ({
        id: i.id,
        type: 'interviews',
        title: i.title,
        description: i.description || '',
        publishedAt: i.publishedAt,
        author: i.interviewee.name,
        category: i.category,
        tags: i.tags,
        metrics: {
          views: i.viewCount,
          likes: i.likeCount,
          shares: Math.floor(i.likeCount * 0.2),
          comments: 0,
          rating: 4.4,
          engagement: (i.likeCount + i.viewCount) / 100
        }
      }))
    ]
  }

  async generateRecommendations(userId: string, limit = 10): Promise<Recommendation[]> {
    const userProfile = this.getUserProfile(userId)
    const recommendations: Recommendation[] = []

    // 1. Recommandations basées sur le comportement utilisateur
    const behaviorRecommendations = this.getBehaviorBasedRecommendations(userProfile, limit * 0.4)
    recommendations.push(...behaviorRecommendations)

    // 2. Recommandations basées sur la similarité de contenu
    const contentRecommendations = this.getContentBasedRecommendations(userProfile, limit * 0.3)
    recommendations.push(...contentRecommendations)

    // 3. Recommandations trending
    const trendingRecommendations = this.getTrendingRecommendations(limit * 0.2)
    recommendations.push(...trendingRecommendations)

    // 4. Recommandations de diversité
    const diversityRecommendations = this.getDiversityRecommendations(userProfile, limit * 0.1)
    recommendations.push(...diversityRecommendations)

    // Trier par score et limiter
    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(rec => ({
        ...rec,
        metadata: {
          generatedAt: new Date().toISOString(),
          algorithm: 'hybrid',
          version: '1.0',
          confidence: rec.score,
          freshness: this.calculateFreshness(rec.contentId)
        }
      }))
  }

  private getBehaviorBasedRecommendations(userProfile: UserProfile, limit: number): Recommendation[] {
    const recommendations: Recommendation[] = []
    
    // Analyser l'historique de vues pour trouver des patterns
    const viewedCategories = this.extractCategoriesFromHistory(userProfile)
    const preferredTypes = this.extractContentTypesFromHistory(userProfile)

    this.contentItems
      .filter(item => !this.hasUserViewed(userProfile, item.id))
      .forEach(item => {
        let score = 0
        const reasons: RecommendationReason[] = []

        // Score basé sur les catégories préférées
        if (viewedCategories.includes(item.category || '')) {
          score += 0.4
          reasons.push({
            type: 'category_match',
            explanation: `Vous avez montré de l'intérêt pour la catégorie "${item.category}"`,
            weight: 0.4
          })
        }

        // Score basé sur les types de contenu préférés
        if (preferredTypes.includes(item.type)) {
          score += 0.3
          reasons.push({
            type: 'user_behavior',
            explanation: `Vous consultez souvent ce type de contenu`,
            weight: 0.3
          })
        }

        // Score basé sur l'engagement
        score += Math.min(item.metrics.engagement / 100, 0.3)

        if (score > 0.3) {
          recommendations.push({
            contentId: item.id,
            contentType: item.type,
            score,
            reasons,
            metadata: {
              generatedAt: '',
              algorithm: 'behavior_based',
              version: '1.0',
              confidence: score,
              freshness: 0
            }
          })
        }
      })

    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, Math.floor(limit))
  }

  private getContentBasedRecommendations(userProfile: UserProfile, limit: number): Recommendation[] {
    const recommendations: Recommendation[] = []
    const viewedItems = this.getViewedItems(userProfile)

    this.contentItems
      .filter(item => !this.hasUserViewed(userProfile, item.id))
      .forEach(item => {
        let maxSimilarity = 0
        let bestMatch: ContentItem | null = null

        // Calculer la similarité avec les contenus vus
        viewedItems.forEach(viewedItem => {
          const similarity = this.calculateContentSimilarity(item, viewedItem)
          if (similarity > maxSimilarity) {
            maxSimilarity = similarity
            bestMatch = viewedItem
          }
        })

        if (maxSimilarity > 0.3 && bestMatch) {
          recommendations.push({
            contentId: item.id,
            contentType: item.type,
            score: maxSimilarity,
            reasons: [{
              type: 'similar_content',
              explanation: `Similaire à "${bestMatch.title}" que vous avez consulté`,
              weight: maxSimilarity
            }],
            metadata: {
              generatedAt: '',
              algorithm: 'content_based',
              version: '1.0',
              confidence: maxSimilarity,
              freshness: 0
            }
          })
        }
      })

    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, Math.floor(limit))
  }

  private getTrendingRecommendations(limit: number): Recommendation[] {
    return this.contentItems
      .sort((a, b) => {
        const aScore = a.metrics.views + a.metrics.likes + a.metrics.shares
        const bScore = b.metrics.views + b.metrics.likes + b.metrics.shares
        return bScore - aScore
      })
      .slice(0, Math.floor(limit))
      .map(item => ({
        contentId: item.id,
        contentType: item.type,
        score: 0.7,
        reasons: [{
          type: 'trending',
          explanation: 'Contenu populaire en ce moment',
          weight: 0.7
        }],
        metadata: {
          generatedAt: '',
          algorithm: 'trending',
          version: '1.0',
          confidence: 0.7,
          freshness: 0
        }
      }))
  }

  private getDiversityRecommendations(userProfile: UserProfile, limit: number): Recommendation[] {
    const viewedTypes = this.extractContentTypesFromHistory(userProfile)
    const underrepresentedTypes = ['interviews', 'photoReports', 'videoAnalyses', 'testimonials']
      .filter(type => !viewedTypes.includes(type) || viewedTypes.filter(t => t === type).length < 2)

    const recommendations: Recommendation[] = []

    underrepresentedTypes.forEach(type => {
      const typeItems = this.contentItems.filter(item => item.type === type)
      if (typeItems.length > 0) {
        const bestItem = typeItems.sort((a, b) => b.metrics.rating - a.metrics.rating)[0]
        recommendations.push({
          contentId: bestItem.id,
          contentType: bestItem.type,
          score: 0.5,
          reasons: [{
            type: 'collaborative_filtering',
            explanation: 'Découvrez un nouveau type de contenu',
            weight: 0.5
          }],
          metadata: {
            generatedAt: '',
            algorithm: 'diversity',
            version: '1.0',
            confidence: 0.5,
            freshness: 0
          }
        })
      }
    })

    return recommendations.slice(0, Math.floor(limit))
  }

  private getUserProfile(userId: string): UserProfile {
    if (!this.userProfiles.has(userId)) {
      // Créer un profil par défaut
      this.userProfiles.set(userId, {
        id: userId,
        preferences: {
          contentTypes: [
            { type: 'articles', weight: 0.8, enabled: true },
            { type: 'interviews', weight: 0.6, enabled: true },
            { type: 'photoReports', weight: 0.7, enabled: true },
            { type: 'videoAnalyses', weight: 0.5, enabled: true },
            { type: 'testimonials', weight: 0.4, enabled: true }
          ],
          categories: [],
          languages: ['fr'],
          notificationSettings: {
            email: true,
            push: false,
            inApp: true,
            frequency: 'daily',
            types: []
          },
          displaySettings: {
            theme: 'senegalais',
            layout: 'grid',
            itemsPerPage: 12,
            showImages: true,
            autoplay: false
          }
        },
        behavior: {
          viewHistory: [],
          searchHistory: [],
          interactions: [],
          sessionData: {
            totalSessions: 1,
            averageSessionDuration: 300,
            lastVisit: new Date().toISOString(),
            deviceInfo: {
              type: 'desktop',
              os: 'Unknown',
              browser: 'Unknown',
              screenSize: '1920x1080'
            }
          }
        },
        interests: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
    }
    return this.userProfiles.get(userId)!
  }

  private extractCategoriesFromHistory(userProfile: UserProfile): string[] {
    const categories = new Set<string>()
    userProfile.behavior.viewHistory.forEach(view => {
      const item = this.contentItems.find(c => c.id === view.contentId)
      if (item?.category) {
        categories.add(item.category)
      }
    })
    return Array.from(categories)
  }

  private extractContentTypesFromHistory(userProfile: UserProfile): string[] {
    return userProfile.behavior.viewHistory.map(view => view.contentType)
  }

  private hasUserViewed(userProfile: UserProfile, contentId: string): boolean {
    return userProfile.behavior.viewHistory.some(view => view.contentId === contentId)
  }

  private getViewedItems(userProfile: UserProfile): ContentItem[] {
    return userProfile.behavior.viewHistory
      .map(view => this.contentItems.find(item => item.id === view.contentId))
      .filter(item => item !== undefined) as ContentItem[]
  }

  private calculateContentSimilarity(item1: ContentItem, item2: ContentItem): number {
    let similarity = 0

    // Similarité de catégorie
    if (item1.category === item2.category) {
      similarity += 0.4
    }

    // Similarité de tags
    const commonTags = item1.tags.filter(tag => item2.tags.includes(tag))
    similarity += (commonTags.length / Math.max(item1.tags.length, item2.tags.length)) * 0.3

    // Similarité d'auteur
    if (item1.author === item2.author) {
      similarity += 0.2
    }

    // Similarité de type
    if (item1.type === item2.type) {
      similarity += 0.1
    }

    return Math.min(similarity, 1)
  }

  private calculateFreshness(contentId: string): number {
    const item = this.contentItems.find(c => c.id === contentId)
    if (!item) return 0

    const publishedDate = new Date(item.publishedAt)
    const now = new Date()
    const daysDiff = (now.getTime() - publishedDate.getTime()) / (1000 * 60 * 60 * 24)

    // Plus c'est récent, plus le score est élevé
    return Math.max(0, 1 - (daysDiff / 30)) // Décroît sur 30 jours
  }

  async updateUserProfile(userId: string, interaction: InteractionItem): Promise<void> {
    const profile = this.getUserProfile(userId)
    profile.behavior.interactions.push(interaction)
    
    // Mettre à jour l'historique de vues si c'est une vue
    if (interaction.type === 'like' || interaction.type === 'share') {
      const existingView = profile.behavior.viewHistory.find(v => v.contentId === interaction.contentId)
      if (existingView) {
        existingView.rating = (existingView.rating || 3) + 1
      }
    }

    profile.updatedAt = new Date().toISOString()
    this.userProfiles.set(userId, profile)
  }

  async getPersonalizedFeed(userId: string, filters?: FeedFilters): Promise<ContentItem[]> {
    const recommendations = await this.generateRecommendations(userId, 20)
    let feed = recommendations.map(rec => 
      this.contentItems.find(item => item.id === rec.contentId)!
    ).filter(item => item !== undefined)

    // Appliquer les filtres
    if (filters) {
      if (filters.contentTypes) {
        feed = feed.filter(item => filters.contentTypes!.includes(item.type))
      }
      if (filters.categories) {
        feed = feed.filter(item => item.category && filters.categories!.includes(item.category))
      }
      if (filters.minRating) {
        feed = feed.filter(item => item.metrics.rating >= filters.minRating!)
      }
      if (filters.dateRange) {
        const start = new Date(filters.dateRange.start)
        const end = new Date(filters.dateRange.end)
        feed = feed.filter(item => {
          const publishedDate = new Date(item.publishedAt)
          return publishedDate >= start && publishedDate <= end
        })
      }
    }

    return feed
  }

  // Méthodes pour l'analyse comportementale
  async analyzeBehavior(userId: string): Promise<BehaviorAnalytics> {
    const profile = this.getUserProfile(userId)
    
    return {
      userId,
      patterns: this.extractBehaviorPatterns(profile),
      insights: this.generateBehaviorInsights(profile),
      predictions: this.generateBehaviorPredictions(profile),
      generatedAt: new Date().toISOString()
    }
  }

  private extractBehaviorPatterns(profile: UserProfile) {
    const patterns = []
    
    // Pattern de temps de lecture
    const avgDuration = profile.behavior.viewHistory.reduce((sum, view) => sum + view.duration, 0) / 
                       Math.max(profile.behavior.viewHistory.length, 1)
    
    patterns.push({
      type: 'reading_time' as const,
      description: `Temps de lecture moyen: ${Math.round(avgDuration / 60)} minutes`,
      frequency: profile.behavior.viewHistory.length,
      confidence: 0.8,
      trend: 'stable' as const
    })

    return patterns
  }

  private generateBehaviorInsights(profile: UserProfile) {
    return [
      {
        type: 'content_preference',
        title: 'Préférence pour le contenu visuel',
        description: 'Vous consultez souvent des reportages photo et vidéos',
        actionable: true,
        priority: 'medium' as const
      }
    ]
  }

  private generateBehaviorPredictions(profile: UserProfile) {
    return [
      {
        type: 'engagement',
        prediction: 'Forte probabilité d\'engagement avec du contenu politique',
        probability: 0.75,
        timeframe: '7 jours',
        factors: ['Historique de vues', 'Interactions passées']
      }
    ]
  }
}