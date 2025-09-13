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
  const { allInterviews: interviews = [] } = useInterviews() || {}
  const { allReports: photoReports = [] } = usePhotoReports() || {}
  const { allVideos: videoAnalyses = [] } = useVideoAnalyses() || {}
  const { allTestimonials: testimonials = [] } = useTestimonials() || {}

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
          console.log('Début indexation:', {
            threads: threads?.length || 0,
            interviews: interviews?.length || 0,
            photoReports: photoReports?.length || 0,
            videoAnalyses: videoAnalyses?.length || 0,
            testimonials: testimonials?.length || 0
          })
          
          searchService.indexContent(
            threads || [],
            interviews || [],
            photoReports || [],
            videoAnalyses || [],
            testimonials || []
          )
          
          console.log('Indexation réussie')
          setIsIndexed(true)
          setError(null)
        } catch (err) {
          console.error('Erreur indexation détaillée:', err)
          const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue lors de l\'indexation'
          setError(`Erreur lors de l'indexation du contenu: ${errorMessage}`)
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