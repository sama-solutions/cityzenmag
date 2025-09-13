import { useState, useEffect, useCallback } from 'react'
import { socialService, type SocialStats, type SocialInteraction } from '../services/socialService'

export function useSocial(contentId: string, contentType: SocialInteraction['contentType']) {
  const [stats, setStats] = useState<SocialStats>({ likes: 0, bookmarks: 0, shares: 0, views: 0, engagement: 0 })
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Charger l'état initial
  useEffect(() => {
    const currentStats = socialService.getContentStats(contentId)
    setStats(currentStats)
    setIsLiked(socialService.isLiked(contentId))
    setIsBookmarked(socialService.isBookmarked(contentId))

    // Enregistrer une vue automatiquement
    socialService.viewContent(contentId, contentType)
  }, [contentId, contentType])

  // Fonction pour liker/unliker
  const toggleLike = useCallback(async () => {
    setIsLoading(true)
    try {
      const newLikedState = await socialService.likeContent(contentId, contentType)
      setIsLiked(newLikedState)
      
      // Mettre à jour les stats
      const updatedStats = socialService.getContentStats(contentId)
      setStats(updatedStats)
    } catch (error) {
      console.error('Erreur lors du like:', error)
    } finally {
      setIsLoading(false)
    }
  }, [contentId, contentType])

  // Fonction pour sauvegarder/retirer des favoris
  const toggleBookmark = useCallback(async () => {
    setIsLoading(true)
    try {
      const newBookmarkedState = await socialService.bookmarkContent(contentId, contentType)
      setIsBookmarked(newBookmarkedState)
      
      // Mettre à jour les stats
      const updatedStats = socialService.getContentStats(contentId)
      setStats(updatedStats)
    } catch (error) {
      console.error('Erreur lors du bookmark:', error)
    } finally {
      setIsLoading(false)
    }
  }, [contentId, contentType])

  // Fonction pour partager
  const share = useCallback(async (platform: string, url: string, text: string) => {
    setIsLoading(true)
    try {
      await socialService.shareContent(contentId, contentType, platform, url, text)
      
      // Mettre à jour les stats
      const updatedStats = socialService.getContentStats(contentId)
      setStats(updatedStats)
    } catch (error) {
      console.error('Erreur lors du partage:', error)
    } finally {
      setIsLoading(false)
    }
  }, [contentId, contentType])

  return {
    stats,
    isLiked,
    isBookmarked,
    isLoading,
    toggleLike,
    toggleBookmark,
    share
  }
}

// Hook pour obtenir les contenus favoris de l'utilisateur
export function useUserFavorites() {
  const [likedContent, setLikedContent] = useState<string[]>([])
  const [bookmarkedContent, setBookmarkedContent] = useState<string[]>([])

  useEffect(() => {
    setLikedContent(socialService.getLikedContent())
    setBookmarkedContent(socialService.getBookmarkedContent())
  }, [])

  const refreshFavorites = useCallback(() => {
    setLikedContent(socialService.getLikedContent())
    setBookmarkedContent(socialService.getBookmarkedContent())
  }, [])

  return {
    likedContent,
    bookmarkedContent,
    refreshFavorites
  }
}

// Hook pour obtenir les contenus tendance
export function useTrending(limit = 10) {
  const [trendingContent, setTrendingContent] = useState<Array<{ contentId: string; stats: SocialStats }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadTrending = async () => {
      try {
        setLoading(true)
        const trending = socialService.getTrendingContent(limit)
        setTrendingContent(trending)
      } catch (error) {
        console.error('Erreur chargement trending:', error)
      } finally {
        setLoading(false)
      }
    }

    loadTrending()
  }, [limit])

  return {
    trendingContent,
    loading
  }
}