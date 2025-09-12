import { useState, useEffect, useCallback } from 'react'
import { RecommendationEngine } from '../services/recommendationEngine'
import type { 
  Recommendation, 
  ContentItem, 
  UserProfile, 
  InteractionItem,
  FeedFilters,
  BehaviorAnalytics
} from '../types/recommendations'

export function useRecommendations(userId: string) {
  const [engine] = useState(() => new RecommendationEngine())
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [personalizedFeed, setPersonalizedFeed] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateRecommendations = useCallback(async (limit = 10) => {
    try {
      setLoading(true)
      setError(null)
      const recs = await engine.generateRecommendations(userId, limit)
      setRecommendations(recs)
      return recs
    } catch (err) {
      setError('Erreur lors de la génération des recommandations')
      console.error('Error generating recommendations:', err)
      return []
    } finally {
      setLoading(false)
    }
  }, [engine, userId])

  const getPersonalizedFeed = useCallback(async (filters?: FeedFilters) => {
    try {
      setLoading(true)
      setError(null)
      const feed = await engine.getPersonalizedFeed(userId, filters)
      setPersonalizedFeed(feed)
      return feed
    } catch (err) {
      setError('Erreur lors du chargement du feed personnalisé')
      console.error('Error loading personalized feed:', err)
      return []
    } finally {
      setLoading(false)
    }
  }, [engine, userId])

  const trackInteraction = useCallback(async (interaction: InteractionItem) => {
    try {
      await engine.updateUserProfile(userId, interaction)
      // Régénérer les recommandations après une interaction importante
      if (['like', 'share', 'bookmark'].includes(interaction.type)) {
        await generateRecommendations()
      }
    } catch (err) {
      console.error('Error tracking interaction:', err)
    }
  }, [engine, userId, generateRecommendations])

  const analyzeBehavior = useCallback(async (): Promise<BehaviorAnalytics | null> => {
    try {
      return await engine.analyzeBehavior(userId)
    } catch (err) {
      console.error('Error analyzing behavior:', err)
      return null
    }
  }, [engine, userId])

  // Charger les recommandations initiales
  useEffect(() => {
    if (userId) {
      generateRecommendations()
      getPersonalizedFeed()
    }
  }, [userId, generateRecommendations, getPersonalizedFeed])

  return {
    recommendations,
    personalizedFeed,
    loading,
    error,
    generateRecommendations,
    getPersonalizedFeed,
    trackInteraction,
    analyzeBehavior
  }
}

// Hook pour simuler un utilisateur et ses interactions
export function useUserSimulation() {
  const [currentUserId, setCurrentUserId] = useState('user-demo')
  const { trackInteraction } = useRecommendations(currentUserId)

  const simulateView = useCallback(async (contentId: string, contentType: string, duration = 120) => {
    await trackInteraction({
      type: 'like',
      contentId,
      contentType,
      timestamp: new Date().toISOString(),
      metadata: { duration, completed: duration > 60 }
    })
  }, [trackInteraction])

  const simulateLike = useCallback(async (contentId: string, contentType: string) => {
    await trackInteraction({
      type: 'like',
      contentId,
      contentType,
      timestamp: new Date().toISOString()
    })
  }, [trackInteraction])

  const simulateShare = useCallback(async (contentId: string, contentType: string, platform = 'twitter') => {
    await trackInteraction({
      type: 'share',
      contentId,
      contentType,
      timestamp: new Date().toISOString(),
      metadata: { platform }
    })
  }, [trackInteraction])

  const simulateBookmark = useCallback(async (contentId: string, contentType: string) => {
    await trackInteraction({
      type: 'bookmark',
      contentId,
      contentType,
      timestamp: new Date().toISOString()
    })
  }, [trackInteraction])

  const switchUser = useCallback((userId: string) => {
    setCurrentUserId(userId)
  }, [])

  return {
    currentUserId,
    simulateView,
    simulateLike,
    simulateShare,
    simulateBookmark,
    switchUser
  }
}

// Hook pour les métriques de recommandation
export function useRecommendationMetrics(userId: string) {
  const [metrics, setMetrics] = useState({
    clickThroughRate: 0,
    conversionRate: 0,
    diversityScore: 0,
    noveltyScore: 0,
    userSatisfaction: 0
  })
  const [loading, setLoading] = useState(false)

  const calculateMetrics = useCallback(async () => {
    setLoading(true)
    try {
      // Simulation du calcul des métriques
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setMetrics({
        clickThroughRate: Math.random() * 0.3 + 0.1, // 10-40%
        conversionRate: Math.random() * 0.15 + 0.05, // 5-20%
        diversityScore: Math.random() * 0.4 + 0.6, // 60-100%
        noveltyScore: Math.random() * 0.3 + 0.4, // 40-70%
        userSatisfaction: Math.random() * 2 + 3 // 3-5 sur 5
      })
    } catch (err) {
      console.error('Error calculating metrics:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (userId) {
      calculateMetrics()
    }
  }, [userId, calculateMetrics])

  return {
    metrics,
    loading,
    refresh: calculateMetrics
  }
}

// Hook pour l'A/B testing des recommandations
export function useRecommendationABTest() {
  const [variant, setVariant] = useState<'control' | 'test'>('control')
  const [testResults, setTestResults] = useState({
    control: { users: 0, conversions: 0, conversionRate: 0 },
    test: { users: 0, conversions: 0, conversionRate: 0 }
  })

  const assignVariant = useCallback((userId: string) => {
    // Simple hash pour assigner de manière déterministe
    const hash = userId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0)
      return a & a
    }, 0)
    
    const assignedVariant = Math.abs(hash) % 2 === 0 ? 'control' : 'test'
    setVariant(assignedVariant)
    return assignedVariant
  }, [])

  const trackConversion = useCallback((userId: string, converted: boolean) => {
    const userVariant = assignVariant(userId)
    
    setTestResults(prev => ({
      ...prev,
      [userVariant]: {
        users: prev[userVariant].users + 1,
        conversions: prev[userVariant].conversions + (converted ? 1 : 0),
        conversionRate: (prev[userVariant].conversions + (converted ? 1 : 0)) / (prev[userVariant].users + 1)
      }
    }))
  }, [assignVariant])

  const getWinner = useCallback(() => {
    const { control, test } = testResults
    if (control.users < 30 || test.users < 30) {
      return { winner: null, confidence: 0, message: 'Échantillon insuffisant' }
    }

    const diff = test.conversionRate - control.conversionRate
    const pooledRate = (control.conversions + test.conversions) / (control.users + test.users)
    const se = Math.sqrt(pooledRate * (1 - pooledRate) * (1/control.users + 1/test.users))
    const zScore = Math.abs(diff / se)
    const confidence = 1 - 2 * (1 - normalCDF(zScore))

    return {
      winner: diff > 0 ? 'test' : 'control',
      confidence,
      message: confidence > 0.95 ? 'Résultat significatif' : 'Résultat non significatif'
    }
  }, [testResults])

  return {
    variant,
    testResults,
    assignVariant,
    trackConversion,
    getWinner
  }
}

// Fonction utilitaire pour la distribution normale
function normalCDF(x: number): number {
  return 0.5 * (1 + erf(x / Math.sqrt(2)))
}

function erf(x: number): number {
  // Approximation de la fonction d'erreur
  const a1 =  0.254829592
  const a2 = -0.284496736
  const a3 =  1.421413741
  const a4 = -1.453152027
  const a5 =  1.061405429
  const p  =  0.3275911

  const sign = x >= 0 ? 1 : -1
  x = Math.abs(x)

  const t = 1.0 / (1.0 + p * x)
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x)

  return sign * y
}