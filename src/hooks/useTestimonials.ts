import { useState, useEffect, useMemo } from 'react'
import type { 
  Testimonial, 
  TestimonialFilters, 
  TestimonialStats, 
  TestimonialCategory,
  ModerationStatus,
  TestimonialPriority
} from '../types/testimonials'
import { mockTestimonials } from '../data/mockTestimonials'

export function useTestimonials(filters?: TestimonialFilters) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Simulation du chargement des données
  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        setLoading(true)
        // Simulation d'un délai de chargement
        await new Promise(resolve => setTimeout(resolve, 800))
        setTestimonials(mockTestimonials)
        setError(null)
      } catch (err) {
        setError('Erreur lors du chargement des témoignages')
        console.error('Error loading testimonials:', err)
      } finally {
        setLoading(false)
      }
    }

    loadTestimonials()
  }, [])

  // Filtrage des témoignages
  const filteredTestimonials = useMemo(() => {
    if (!filters) return testimonials

    return testimonials.filter(testimonial => {
      // Filtre par catégorie
      if (filters.category && testimonial.category !== filters.category) {
        return false
      }

      // Filtre verified
      if (filters.verified !== undefined && testimonial.verified !== filters.verified) {
        return false
      }

      // Filtre featured
      if (filters.featured !== undefined && testimonial.featured !== filters.featured) {
        return false
      }

      // Filtre par statut de modération
      if (filters.moderationStatus && testimonial.moderationStatus !== filters.moderationStatus) {
        return false
      }

      // Filtre par priorité
      if (filters.priority && testimonial.priority !== filters.priority) {
        return false
      }

      // Filtre par recherche textuelle
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const matchesTitle = testimonial.title.toLowerCase().includes(searchLower)
        const matchesContent = testimonial.content.toLowerCase().includes(searchLower)
        const matchesAuthor = !testimonial.author.anonymous && 
                             testimonial.author.name.toLowerCase().includes(searchLower)
        const matchesTags = testimonial.tags.some(tag => tag.toLowerCase().includes(searchLower))
        
        if (!matchesTitle && !matchesContent && !matchesAuthor && !matchesTags) {
          return false
        }
      }

      // Filtre par tags
      if (filters.tags && filters.tags.length > 0) {
        const hasMatchingTag = filters.tags.some(filterTag =>
          testimonial.tags.some(testimonialTag => 
            testimonialTag.toLowerCase().includes(filterTag.toLowerCase())
          )
        )
        if (!hasMatchingTag) {
          return false
        }
      }

      // Filtre par localisation
      if (filters.location) {
        const locationLower = filters.location.toLowerCase()
        const matchesLocation = testimonial.author.location.toLowerCase().includes(locationLower) ||
                               testimonial.location?.name.toLowerCase().includes(locationLower)
        if (!matchesLocation) {
          return false
        }
      }

      // Filtre par auteur
      if (filters.author) {
        const authorLower = filters.author.toLowerCase()
        if (testimonial.author.anonymous || 
            !testimonial.author.name.toLowerCase().includes(authorLower)) {
          return false
        }
      }

      // Filtre par plage de dates
      if (filters.dateRange) {
        const testimonialDate = new Date(testimonial.createdAt)
        const startDate = new Date(filters.dateRange.start)
        const endDate = new Date(filters.dateRange.end)
        
        if (testimonialDate < startDate || testimonialDate > endDate) {
          return false
        }
      }

      return true
    })
  }, [testimonials, filters])

  // Statistiques
  const stats = useMemo((): TestimonialStats => {
    const totalTestimonials = testimonials.length
    const pendingModeration = testimonials.filter(t => t.moderationStatus === 'pending').length
    const verified = testimonials.filter(t => t.verified).length
    const featuredCount = testimonials.filter(t => t.featured).length

    // Comptage par catégorie
    const categoriesCount = testimonials.reduce((acc, testimonial) => {
      acc[testimonial.category] = (acc[testimonial.category] || 0) + 1
      return acc
    }, {} as Record<TestimonialCategory, number>)

    // Calcul du temps de réponse moyen (simulation)
    const averageResponseTime = 24 // heures

    // Nombre de lieux uniques
    const uniqueLocations = new Set(testimonials.map(t => t.author.location))
    const locationsCount = uniqueLocations.size

    return {
      totalTestimonials,
      pendingModeration,
      verified,
      categoriesCount,
      averageResponseTime,
      featuredCount,
      locationsCount
    }
  }, [testimonials])

  return {
    testimonials: filteredTestimonials,
    allTestimonials: testimonials,
    loading,
    error,
    stats
  }
}

// Hook pour un témoignage spécifique
export function useTestimonial(id: string) {
  const [testimonial, setTestimonial] = useState<Testimonial | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadTestimonial = async () => {
      try {
        setLoading(true)
        // Simulation du chargement
        await new Promise(resolve => setTimeout(resolve, 400))
        
        const foundTestimonial = mockTestimonials.find(t => t.id === id)
        if (foundTestimonial) {
          setTestimonial(foundTestimonial)
          setError(null)
        } else {
          setError('Témoignage non trouvé')
        }
      } catch (err) {
        setError('Erreur lors du chargement du témoignage')
        console.error('Error loading testimonial:', err)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      loadTestimonial()
    }
  }, [id])

  return {
    testimonial,
    loading,
    error
  }
}

// Hook pour les témoignages recommandés
export function useRecommendedTestimonials(currentTestimonialId?: string, limit = 4) {
  const { testimonials } = useTestimonials({ moderationStatus: 'approved' })

  const recommendedTestimonials = useMemo(() => {
    let filtered = testimonials
    
    // Exclure le témoignage actuel
    if (currentTestimonialId) {
      filtered = filtered.filter(testimonial => testimonial.id !== currentTestimonialId)
    }

    // Prioriser les témoignages featured
    const featured = filtered.filter(testimonial => testimonial.featured)
    const nonFeatured = filtered.filter(testimonial => !testimonial.featured)

    // Trier par popularité (likes + vues)
    const sortByPopularity = (a: Testimonial, b: Testimonial) => {
      const aScore = a.likes + a.viewCount
      const bScore = b.likes + b.viewCount
      return bScore - aScore
    }

    featured.sort(sortByPopularity)
    nonFeatured.sort(sortByPopularity)

    // Combiner et limiter
    return [...featured, ...nonFeatured].slice(0, limit)
  }, [testimonials, currentTestimonialId, limit])

  return recommendedTestimonials
}

// Hook pour les témoignages par localisation
export function useTestimonialsByLocation() {
  const { testimonials } = useTestimonials({ moderationStatus: 'approved' })

  const testimonialsByLocation = useMemo(() => {
    const locationMap = new Map<string, Testimonial[]>()
    
    testimonials.forEach(testimonial => {
      const location = testimonial.author.location
      if (!locationMap.has(location)) {
        locationMap.set(location, [])
      }
      locationMap.get(location)!.push(testimonial)
    })

    return Array.from(locationMap.entries()).map(([location, testimonials]) => ({
      location,
      testimonials,
      count: testimonials.length
    })).sort((a, b) => b.count - a.count)
  }, [testimonials])

  return testimonialsByLocation
}

// Hook pour les témoignages en attente de modération
export function useModerationQueue() {
  const { testimonials } = useTestimonials()

  const moderationQueue = useMemo(() => {
    const pending = testimonials.filter(t => t.moderationStatus === 'pending')
    const flagged = testimonials.filter(t => t.moderationStatus === 'flagged')
    const needsReview = testimonials.filter(t => t.moderationStatus === 'needs_review')
    const escalated = testimonials.filter(t => t.priority === 'urgent')

    return {
      pending,
      flagged,
      needsReview,
      escalated
    }
  }, [testimonials])

  return moderationQueue
}

// Hook pour les statistiques de modération
export function useModerationStats() {
  const { testimonials } = useTestimonials()

  const moderationStats = useMemo(() => {
    const total = testimonials.length
    const approved = testimonials.filter(t => t.moderationStatus === 'approved').length
    const rejected = testimonials.filter(t => t.moderationStatus === 'rejected').length
    const pending = testimonials.filter(t => t.moderationStatus === 'pending').length

    const approvalRate = total > 0 ? (approved / total) * 100 : 0
    const rejectionRate = total > 0 ? (rejected / total) * 100 : 0

    return {
      total,
      approved,
      rejected,
      pending,
      approvalRate,
      rejectionRate,
      averageResponseTime: 24 // heures (simulation)
    }
  }, [testimonials])

  return moderationStats
}