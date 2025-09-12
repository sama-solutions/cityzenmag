import { useState, useEffect, useMemo } from 'react'
import type { PhotoReport, PhotoReportFilters, PhotoReportStats, PhotoReportCategory } from '../types/photoReports'
import { mockPhotoReports } from '../data/mockPhotoReports'

export function usePhotoReports(filters?: PhotoReportFilters) {
  const [reports, setReports] = useState<PhotoReport[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Simulation du chargement des données
  useEffect(() => {
    const loadReports = async () => {
      try {
        setLoading(true)
        // Simulation d'un délai de chargement
        await new Promise(resolve => setTimeout(resolve, 600))
        setReports(mockPhotoReports)
        setError(null)
      } catch (err) {
        setError('Erreur lors du chargement des reportages')
        console.error('Error loading photo reports:', err)
      } finally {
        setLoading(false)
      }
    }

    loadReports()
  }, [])

  // Filtrage des reportages
  const filteredReports = useMemo(() => {
    if (!filters) return reports

    return reports.filter(report => {
      // Filtre par catégorie
      if (filters.category && report.category !== filters.category) {
        return false
      }

      // Filtre featured
      if (filters.featured !== undefined && report.featured !== filters.featured) {
        return false
      }

      // Filtre par recherche textuelle
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const matchesTitle = report.title.toLowerCase().includes(searchLower)
        const matchesDescription = report.description?.toLowerCase().includes(searchLower)
        const matchesPhotographer = report.photographer.name.toLowerCase().includes(searchLower)
        const matchesLocation = report.location.name.toLowerCase().includes(searchLower)
        const matchesTags = report.tags.some(tag => tag.toLowerCase().includes(searchLower))
        
        if (!matchesTitle && !matchesDescription && !matchesPhotographer && !matchesLocation && !matchesTags) {
          return false
        }
      }

      // Filtre par tags
      if (filters.tags && filters.tags.length > 0) {
        const hasMatchingTag = filters.tags.some(filterTag =>
          report.tags.some(reportTag => 
            reportTag.toLowerCase().includes(filterTag.toLowerCase())
          )
        )
        if (!hasMatchingTag) {
          return false
        }
      }

      // Filtre par localisation
      if (filters.location) {
        const locationLower = filters.location.toLowerCase()
        const matchesLocation = report.location.name.toLowerCase().includes(locationLower) ||
                               report.location.region?.toLowerCase().includes(locationLower)
        if (!matchesLocation) {
          return false
        }
      }

      // Filtre par photographe
      if (filters.photographer) {
        const photographerLower = filters.photographer.toLowerCase()
        if (!report.photographer.name.toLowerCase().includes(photographerLower)) {
          return false
        }
      }

      // Filtre par plage de dates
      if (filters.dateRange) {
        const reportDate = new Date(report.publishedAt)
        const startDate = new Date(filters.dateRange.start)
        const endDate = new Date(filters.dateRange.end)
        
        if (reportDate < startDate || reportDate > endDate) {
          return false
        }
      }

      return true
    })
  }, [reports, filters])

  // Statistiques
  const stats = useMemo((): PhotoReportStats => {
    const totalReports = reports.length
    const totalImages = reports.reduce((sum, report) => sum + report.images.length, 0)
    const featuredCount = reports.filter(report => report.featured).length
    const averageViewCount = reports.length > 0 
      ? Math.round(reports.reduce((sum, report) => sum + report.viewCount, 0) / reports.length)
      : 0

    // Comptage par catégorie
    const categoriesCount = reports.reduce((acc, report) => {
      acc[report.category] = (acc[report.category] || 0) + 1
      return acc
    }, {} as Record<PhotoReportCategory, number>)

    // Nombre de photographes uniques
    const uniquePhotographers = new Set(reports.map(report => report.photographer.id))
    const photographersCount = uniquePhotographers.size

    return {
      totalReports,
      totalImages,
      categoriesCount,
      averageViewCount,
      featuredCount,
      photographersCount
    }
  }, [reports])

  return {
    reports: filteredReports,
    allReports: reports,
    loading,
    error,
    stats
  }
}

// Hook pour un reportage spécifique
export function usePhotoReport(id: string) {
  const [report, setReport] = useState<PhotoReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadReport = async () => {
      try {
        setLoading(true)
        // Simulation du chargement
        await new Promise(resolve => setTimeout(resolve, 400))
        
        const foundReport = mockPhotoReports.find(r => r.id === id)
        if (foundReport) {
          setReport(foundReport)
          setError(null)
        } else {
          setError('Reportage non trouvé')
        }
      } catch (err) {
        setError('Erreur lors du chargement du reportage')
        console.error('Error loading photo report:', err)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      loadReport()
    }
  }, [id])

  return {
    report,
    loading,
    error
  }
}

// Hook pour les reportages recommandés
export function useRecommendedPhotoReports(currentReportId?: string, limit = 4) {
  const { reports } = usePhotoReports()

  const recommendedReports = useMemo(() => {
    let filtered = reports
    
    // Exclure le reportage actuel
    if (currentReportId) {
      filtered = filtered.filter(report => report.id !== currentReportId)
    }

    // Prioriser les reportages featured
    const featured = filtered.filter(report => report.featured)
    const nonFeatured = filtered.filter(report => !report.featured)

    // Trier par popularité (vues + likes)
    const sortByPopularity = (a: PhotoReport, b: PhotoReport) => {
      const aScore = a.viewCount + a.likeCount
      const bScore = b.viewCount + b.likeCount
      return bScore - aScore
    }

    featured.sort(sortByPopularity)
    nonFeatured.sort(sortByPopularity)

    // Combiner et limiter
    return [...featured, ...nonFeatured].slice(0, limit)
  }, [reports, currentReportId, limit])

  return recommendedReports
}

// Hook pour les reportages par localisation
export function usePhotoReportsByLocation() {
  const { reports } = usePhotoReports()

  const reportsByLocation = useMemo(() => {
    const locationMap = new Map<string, PhotoReport[]>()
    
    reports.forEach(report => {
      const locationKey = `${report.location.name}-${report.location.region}`
      if (!locationMap.has(locationKey)) {
        locationMap.set(locationKey, [])
      }
      locationMap.get(locationKey)!.push(report)
    })

    return Array.from(locationMap.entries()).map(([location, reports]) => ({
      location: reports[0].location,
      reports,
      count: reports.length
    }))
  }, [reports])

  return reportsByLocation
}