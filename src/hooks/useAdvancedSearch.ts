import { useState, useEffect, useCallback } from 'react'
import { searchService, type SearchOptions, type SearchResponse, type SearchFilters } from '../services/searchService'
import { useData } from './useData'
import { useInterviews } from './useInterviews'
import { usePhotoReports } from './usePhotoReports'
import { useVideoAnalyses } from './useVideoAnalyses'
import { useTestimonials } from './useTestimonials'

export function useAdvancedSearch() {
  const [searchResponse, setSearchResponse] = useState<SearchResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isIndexed, setIsIndexed] = useState(false)

  // Charger tous les contenus pour l'indexation
  const { threads = [] } = useData() || {}
  const { interviews = [] } = useInterviews() || {}
  const { reports: photoReports = [] } = usePhotoReports() || {}
  const { videos: videoAnalyses = [] } = useVideoAnalyses() || {}
  const { testimonials = [] } = useTestimonials() || {}

  // Indexer le contenu quand il est chargé
  useEffect(() => {
    // Vérifier que tous les hooks ont retourné des données (même vides)
    if (threads !== undefined && interviews !== undefined && photoReports !== undefined && 
        videoAnalyses !== undefined && testimonials !== undefined) {
      
      // Vérifier s'il y a du contenu à indexer
      if ((threads && threads.length > 0) || (interviews && interviews.length > 0) || 
          (photoReports && photoReports.length > 0) || (videoAnalyses && videoAnalyses.length > 0) || 
          (testimonials && testimonials.length > 0)) {
        try {
          searchService.indexContent(
            threads || [],
            interviews || [],
            photoReports || [],
            videoAnalyses || [],
            testimonials || []
          )
          setIsIndexed(true)
        } catch (err) {
          console.error('Erreur indexation:', err)
          setError('Erreur lors de l\'indexation du contenu')
        }
      } else {
        // Même s'il n'y a pas de contenu, marquer comme indexé pour éviter les erreurs
        setIsIndexed(true)
      }
    }
  }, [threads, interviews, photoReports, videoAnalyses, testimonials])

  // Fonction de recherche
  const search = useCallback(async (options: SearchOptions) => {
    if (!isIndexed) {
      setError('Index de recherche non prêt')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await searchService.search(options)
      setSearchResponse(response)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la recherche'
      setError(errorMessage)
      console.error('Erreur recherche:', err)
    } finally {
      setIsLoading(false)
    }
  }, [isIndexed])

  // Recherche rapide avec query simple
  const quickSearch = useCallback((query: string, filters?: SearchFilters) => {
    return search({ query, filters })
  }, [search])

  // Obtenir l'historique des recherches
  const getSearchHistory = useCallback(() => {
    return searchService.getSearchHistory()
  }, [])

  // Obtenir les recherches populaires
  const getPopularSearches = useCallback(() => {
    return searchService.getPopularSearches()
  }, [])

  // Nettoyer l'historique
  const clearSearchHistory = useCallback(() => {
    searchService.clearSearchHistory()
  }, [])

  return {
    // État
    searchResponse,
    isLoading,
    error,
    isIndexed,

    // Fonctions
    search,
    quickSearch,
    getSearchHistory,
    getPopularSearches,
    clearSearchHistory,

    // Données dérivées
    results: searchResponse?.results || [],
    total: searchResponse?.total || 0,
    suggestions: searchResponse?.suggestions || [],
    facets: searchResponse?.facets,
    query: searchResponse?.query || '',
    executionTime: searchResponse?.executionTime || 0
  }
}