import { useState, useEffect, useMemo } from 'react'
import type { Interview, InterviewFilters, InterviewStats, InterviewCategory } from '../types/interviews'
import { mockInterviews } from '../data/mockInterviews'

export function useInterviews(filters?: InterviewFilters) {
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Simulation du chargement des données
  useEffect(() => {
    const loadInterviews = async () => {
      try {
        setLoading(true)
        // Simulation d'un délai de chargement
        await new Promise(resolve => setTimeout(resolve, 500))
        setInterviews(mockInterviews)
        setError(null)
      } catch (err) {
        setError('Erreur lors du chargement des interviews')
        console.error('Error loading interviews:', err)
      } finally {
        setLoading(false)
      }
    }

    loadInterviews()
  }, [])

  // Filtrage des interviews
  const filteredInterviews = useMemo(() => {
    if (!filters) return interviews

    return interviews.filter(interview => {
      // Filtre par catégorie
      if (filters.category && interview.category !== filters.category) {
        return false
      }

      // Filtre featured
      if (filters.featured !== undefined && interview.featured !== filters.featured) {
        return false
      }

      // Filtre par recherche textuelle
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const matchesTitle = interview.title.toLowerCase().includes(searchLower)
        const matchesDescription = interview.description?.toLowerCase().includes(searchLower)
        const matchesInterviewee = interview.interviewee.name.toLowerCase().includes(searchLower)
        const matchesTags = interview.tags.some(tag => tag.toLowerCase().includes(searchLower))
        
        if (!matchesTitle && !matchesDescription && !matchesInterviewee && !matchesTags) {
          return false
        }
      }

      // Filtre par tags
      if (filters.tags && filters.tags.length > 0) {
        const hasMatchingTag = filters.tags.some(filterTag =>
          interview.tags.some(interviewTag => 
            interviewTag.toLowerCase().includes(filterTag.toLowerCase())
          )
        )
        if (!hasMatchingTag) {
          return false
        }
      }

      // Filtre par plage de dates
      if (filters.dateRange) {
        const interviewDate = new Date(interview.publishedAt)
        const startDate = new Date(filters.dateRange.start)
        const endDate = new Date(filters.dateRange.end)
        
        if (interviewDate < startDate || interviewDate > endDate) {
          return false
        }
      }

      return true
    })
  }, [interviews, filters])

  // Statistiques
  const stats = useMemo((): InterviewStats => {
    const totalInterviews = interviews.length
    const totalDuration = interviews.reduce((sum, interview) => sum + interview.duration, 0)
    const featuredCount = interviews.filter(interview => interview.featured).length
    const averageViewCount = interviews.length > 0 
      ? Math.round(interviews.reduce((sum, interview) => sum + interview.viewCount, 0) / interviews.length)
      : 0

    // Comptage par catégorie
    const categoriesCount = interviews.reduce((acc, interview) => {
      acc[interview.category] = (acc[interview.category] || 0) + 1
      return acc
    }, {} as Record<InterviewCategory, number>)

    return {
      totalInterviews,
      totalDuration,
      categoriesCount,
      averageViewCount,
      featuredCount
    }
  }, [interviews])

  return {
    interviews: filteredInterviews,
    allInterviews: interviews,
    loading,
    error,
    stats
  }
}

// Hook pour une interview spécifique
export function useInterview(id: string) {
  const [interview, setInterview] = useState<Interview | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadInterview = async () => {
      try {
        setLoading(true)
        // Simulation du chargement
        await new Promise(resolve => setTimeout(resolve, 300))
        
        const foundInterview = mockInterviews.find(i => i.id === id)
        if (foundInterview) {
          setInterview(foundInterview)
          setError(null)
        } else {
          setError('Interview non trouvée')
        }
      } catch (err) {
        setError('Erreur lors du chargement de l\'interview')
        console.error('Error loading interview:', err)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      loadInterview()
    }
  }, [id])

  return {
    interview,
    loading,
    error
  }
}

// Hook pour les interviews recommandées
export function useRecommendedInterviews(currentInterviewId?: string, limit = 4) {
  const { interviews } = useInterviews()

  const recommendedInterviews = useMemo(() => {
    let filtered = interviews
    
    // Exclure l'interview actuelle
    if (currentInterviewId) {
      filtered = filtered.filter(interview => interview.id !== currentInterviewId)
    }

    // Prioriser les interviews featured
    const featured = filtered.filter(interview => interview.featured)
    const nonFeatured = filtered.filter(interview => !interview.featured)

    // Trier par popularité (vues + likes)
    const sortByPopularity = (a: Interview, b: Interview) => {
      const aScore = a.viewCount + a.likeCount
      const bScore = b.viewCount + b.likeCount
      return bScore - aScore
    }

    featured.sort(sortByPopularity)
    nonFeatured.sort(sortByPopularity)

    // Combiner et limiter
    return [...featured, ...nonFeatured].slice(0, limit)
  }, [interviews, currentInterviewId, limit])

  return recommendedInterviews
}