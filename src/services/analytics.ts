export interface AnalyticsEvent {
  type: string
  category: string
  action: string
  label?: string
  value?: number
  userId?: string
  sessionId: string
  timestamp: string
  metadata?: Record<string, any>
}

export interface PageView {
  page: string
  title: string
  userId?: string
  sessionId: string
  timestamp: string
  referrer?: string
  userAgent?: string
  duration?: number
}

export interface UserSession {
  sessionId: string
  userId?: string
  startTime: string
  endTime?: string
  pageViews: PageView[]
  events: AnalyticsEvent[]
  deviceInfo: {
    type: 'desktop' | 'mobile' | 'tablet'
    os: string
    browser: string
    screenSize: string
  }
  location?: {
    country: string
    region: string
    city: string
  }
}

export interface AnalyticsMetrics {
  totalUsers: number
  activeUsers: number
  newUsers: number
  sessions: number
  pageViews: number
  averageSessionDuration: number
  bounceRate: number
  topPages: Array<{ page: string; views: number }>
  topEvents: Array<{ event: string; count: number }>
  userFlow: Array<{ from: string; to: string; count: number }>
}

export interface ContentMetrics {
  contentId: string
  contentType: string
  views: number
  uniqueViews: number
  averageTimeOnPage: number
  interactions: {
    likes: number
    shares: number
    comments: number
    bookmarks: number
  }
  conversionRate: number
  exitRate: number
  sources: Array<{ source: string; views: number }>
}

export interface RecommendationMetrics {
  totalRecommendations: number
  clickThroughRate: number
  conversionRate: number
  diversityScore: number
  noveltyScore: number
  userSatisfaction: number
  algorithmPerformance: Array<{
    algorithm: string
    ctr: number
    conversion: number
    satisfaction: number
  }>
}

class AnalyticsService {
  private events: AnalyticsEvent[] = []
  private pageViews: PageView[] = []
  private sessions: Map<string, UserSession> = new Map()
  private currentSessionId: string = this.generateSessionId()

  constructor() {
    this.initializeSession()
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private initializeSession() {
    const session: UserSession = {
      sessionId: this.currentSessionId,
      startTime: new Date().toISOString(),
      pageViews: [],
      events: [],
      deviceInfo: this.getDeviceInfo()
    }
    this.sessions.set(this.currentSessionId, session)
  }

  private getDeviceInfo() {
    const userAgent = navigator.userAgent
    const screenSize = `${screen.width}x${screen.height}`
    
    let deviceType: 'desktop' | 'mobile' | 'tablet' = 'desktop'
    if (/Mobile|Android|iPhone|iPad/.test(userAgent)) {
      deviceType = /iPad/.test(userAgent) ? 'tablet' : 'mobile'
    }

    let os = 'Unknown'
    if (/Windows/.test(userAgent)) os = 'Windows'
    else if (/Mac/.test(userAgent)) os = 'macOS'
    else if (/Linux/.test(userAgent)) os = 'Linux'
    else if (/Android/.test(userAgent)) os = 'Android'
    else if (/iOS/.test(userAgent)) os = 'iOS'

    let browser = 'Unknown'
    if (/Chrome/.test(userAgent)) browser = 'Chrome'
    else if (/Firefox/.test(userAgent)) browser = 'Firefox'
    else if (/Safari/.test(userAgent)) browser = 'Safari'
    else if (/Edge/.test(userAgent)) browser = 'Edge'

    return { type: deviceType, os, browser, screenSize }
  }

  // Tracking des pages vues
  trackPageView(page: string, title: string, userId?: string) {
    const pageView: PageView = {
      page,
      title,
      userId,
      sessionId: this.currentSessionId,
      timestamp: new Date().toISOString(),
      referrer: document.referrer,
      userAgent: navigator.userAgent
    }

    this.pageViews.push(pageView)
    
    const session = this.sessions.get(this.currentSessionId)
    if (session) {
      session.pageViews.push(pageView)
      session.userId = userId || session.userId
    }

    console.log('📊 Page View:', pageView)
  }

  // Tracking des événements
  trackEvent(
    category: string, 
    action: string, 
    label?: string, 
    value?: number, 
    userId?: string,
    metadata?: Record<string, any>
  ) {
    const event: AnalyticsEvent = {
      type: 'event',
      category,
      action,
      label,
      value,
      userId,
      sessionId: this.currentSessionId,
      timestamp: new Date().toISOString(),
      metadata
    }

    this.events.push(event)
    
    const session = this.sessions.get(this.currentSessionId)
    if (session) {
      session.events.push(event)
      session.userId = userId || session.userId
    }

    console.log('📊 Event:', event)
  }

  // Événements spécifiques pour les recommandations
  trackRecommendationView(recommendationId: string, contentId: string, algorithm: string, userId?: string) {
    this.trackEvent(
      'recommendation',
      'view',
      contentId,
      undefined,
      userId,
      { recommendationId, algorithm }
    )
  }

  trackRecommendationClick(recommendationId: string, contentId: string, algorithm: string, userId?: string) {
    this.trackEvent(
      'recommendation',
      'click',
      contentId,
      undefined,
      userId,
      { recommendationId, algorithm }
    )
  }

  trackContentInteraction(contentId: string, contentType: string, action: string, userId?: string) {
    this.trackEvent(
      'content',
      action,
      contentId,
      undefined,
      userId,
      { contentType }
    )
  }

  // Événements de recherche
  trackSearch(query: string, resultsCount: number, userId?: string) {
    this.trackEvent(
      'search',
      'query',
      query,
      resultsCount,
      userId
    )
  }

  trackSearchResultClick(query: string, resultId: string, position: number, userId?: string) {
    this.trackEvent(
      'search',
      'result_click',
      resultId,
      position,
      userId,
      { query }
    )
  }

  // Événements de navigation
  trackMenuClick(menuItem: string, userId?: string) {
    this.trackEvent(
      'navigation',
      'menu_click',
      menuItem,
      undefined,
      userId
    )
  }

  trackFilterUse(filterType: string, filterValue: string, userId?: string) {
    this.trackEvent(
      'filter',
      'apply',
      filterType,
      undefined,
      userId,
      { value: filterValue }
    )
  }

  // Calcul des métriques
  getAnalyticsMetrics(): AnalyticsMetrics {
    const uniqueUsers = new Set(this.pageViews.map(pv => pv.userId).filter(Boolean)).size
    const totalSessions = this.sessions.size
    const totalPageViews = this.pageViews.length

    // Calcul de la durée moyenne des sessions
    const sessionDurations = Array.from(this.sessions.values())
      .map(session => {
        if (session.pageViews.length < 2) return 0
        const start = new Date(session.startTime).getTime()
        const lastView = new Date(session.pageViews[session.pageViews.length - 1].timestamp).getTime()
        return lastView - start
      })
      .filter(duration => duration > 0)

    const averageSessionDuration = sessionDurations.length > 0
      ? sessionDurations.reduce((sum, duration) => sum + duration, 0) / sessionDurations.length / 1000
      : 0

    // Calcul du taux de rebond (sessions avec une seule page vue)
    const singlePageSessions = Array.from(this.sessions.values())
      .filter(session => session.pageViews.length === 1).length
    const bounceRate = totalSessions > 0 ? singlePageSessions / totalSessions : 0

    // Top pages
    const pageViewCounts = this.pageViews.reduce((acc, pv) => {
      acc[pv.page] = (acc[pv.page] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const topPages = Object.entries(pageViewCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([page, views]) => ({ page, views }))

    // Top événements
    const eventCounts = this.events.reduce((acc, event) => {
      const key = `${event.category}:${event.action}`
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const topEvents = Object.entries(eventCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([event, count]) => ({ event, count }))

    // Flux utilisateur (transitions entre pages)
    const userFlow: Array<{ from: string; to: string; count: number }> = []
    Array.from(this.sessions.values()).forEach(session => {
      for (let i = 0; i < session.pageViews.length - 1; i++) {
        const from = session.pageViews[i].page
        const to = session.pageViews[i + 1].page
        const existing = userFlow.find(flow => flow.from === from && flow.to === to)
        if (existing) {
          existing.count++
        } else {
          userFlow.push({ from, to, count: 1 })
        }
      }
    })

    return {
      totalUsers: uniqueUsers,
      activeUsers: uniqueUsers, // Simplification
      newUsers: uniqueUsers, // Simplification
      sessions: totalSessions,
      pageViews: totalPageViews,
      averageSessionDuration,
      bounceRate,
      topPages,
      topEvents,
      userFlow: userFlow.sort((a, b) => b.count - a.count).slice(0, 10)
    }
  }

  getContentMetrics(contentId: string): ContentMetrics {
    const contentViews = this.pageViews.filter(pv => pv.page.includes(contentId))
    const contentEvents = this.events.filter(e => 
      e.label === contentId || e.metadata?.contentId === contentId
    )

    const interactions = {
      likes: contentEvents.filter(e => e.action === 'like').length,
      shares: contentEvents.filter(e => e.action === 'share').length,
      comments: contentEvents.filter(e => e.action === 'comment').length,
      bookmarks: contentEvents.filter(e => e.action === 'bookmark').length
    }

    return {
      contentId,
      contentType: 'unknown', // À déterminer selon le contexte
      views: contentViews.length,
      uniqueViews: new Set(contentViews.map(cv => cv.userId).filter(Boolean)).size,
      averageTimeOnPage: 0, // À calculer avec les durées
      interactions,
      conversionRate: 0, // À définir selon les objectifs
      exitRate: 0, // À calculer
      sources: [] // À analyser selon les referrers
    }
  }

  getRecommendationMetrics(): RecommendationMetrics {
    const recEvents = this.events.filter(e => e.category === 'recommendation')
    const views = recEvents.filter(e => e.action === 'view').length
    const clicks = recEvents.filter(e => e.action === 'click').length

    return {
      totalRecommendations: views,
      clickThroughRate: views > 0 ? clicks / views : 0,
      conversionRate: 0, // À définir
      diversityScore: 0.75, // Simulation
      noveltyScore: 0.65, // Simulation
      userSatisfaction: 4.2, // Simulation
      algorithmPerformance: [
        { algorithm: 'hybrid', ctr: 0.15, conversion: 0.08, satisfaction: 4.2 },
        { algorithm: 'collaborative', ctr: 0.12, conversion: 0.06, satisfaction: 3.9 },
        { algorithm: 'content_based', ctr: 0.18, conversion: 0.10, satisfaction: 4.0 }
      ]
    }
  }

  // Export des données pour analyse
  exportData() {
    return {
      events: this.events,
      pageViews: this.pageViews,
      sessions: Array.from(this.sessions.values()),
      metrics: this.getAnalyticsMetrics()
    }
  }

  // Nettoyage des données anciennes
  cleanup(olderThanDays = 30) {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays)
    const cutoffTime = cutoffDate.toISOString()

    this.events = this.events.filter(event => event.timestamp > cutoffTime)
    this.pageViews = this.pageViews.filter(pv => pv.timestamp > cutoffTime)
    
    // Nettoyer les sessions anciennes
    for (const [sessionId, session] of this.sessions.entries()) {
      if (session.startTime < cutoffTime) {
        this.sessions.delete(sessionId)
      }
    }
  }
}

// Instance singleton
export const analytics = new AnalyticsService()

// Hook React pour utiliser les analytics
export function useAnalytics() {
  return {
    trackPageView: analytics.trackPageView.bind(analytics),
    trackEvent: analytics.trackEvent.bind(analytics),
    trackRecommendationView: analytics.trackRecommendationView.bind(analytics),
    trackRecommendationClick: analytics.trackRecommendationClick.bind(analytics),
    trackContentInteraction: analytics.trackContentInteraction.bind(analytics),
    trackSearch: analytics.trackSearch.bind(analytics),
    trackSearchResultClick: analytics.trackSearchResultClick.bind(analytics),
    trackMenuClick: analytics.trackMenuClick.bind(analytics),
    trackFilterUse: analytics.trackFilterUse.bind(analytics),
    getMetrics: analytics.getAnalyticsMetrics.bind(analytics),
    getContentMetrics: analytics.getContentMetrics.bind(analytics),
    getRecommendationMetrics: analytics.getRecommendationMetrics.bind(analytics)
  }
}