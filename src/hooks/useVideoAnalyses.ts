import { useState, useEffect, useMemo } from 'react'
import type { VideoAnalysis, VideoAnalysisFilters, VideoAnalysisStats, VideoAnalysisCategory } from '../types/videoAnalyses'
import { mockVideoAnalyses } from '../data/mockVideoAnalyses'

export function useVideoAnalyses(filters?: VideoAnalysisFilters) {
  const [videos, setVideos] = useState<VideoAnalysis[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Simulation du chargement des données
  useEffect(() => {
    const loadVideos = async () => {
      try {
        setLoading(true)
        // Simulation d'un délai de chargement
        await new Promise(resolve => setTimeout(resolve, 700))
        setVideos(mockVideoAnalyses)
        setError(null)
      } catch (err) {
        setError('Erreur lors du chargement des vidéos')
        console.error('Error loading video analyses:', err)
      } finally {
        setLoading(false)
      }
    }

    loadVideos()
  }, [])

  // Filtrage des vidéos
  const filteredVideos = useMemo(() => {
    if (!filters) return videos

    return videos.filter(video => {
      // Filtre par catégorie
      if (filters.category && video.category !== filters.category) {
        return false
      }

      // Filtre featured
      if (filters.featured !== undefined && video.featured !== filters.featured) {
        return false
      }

      // Filtre par recherche textuelle
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const matchesTitle = video.title.toLowerCase().includes(searchLower)
        const matchesDescription = video.description?.toLowerCase().includes(searchLower)
        const matchesSpeaker = video.speaker.name.toLowerCase().includes(searchLower)
        const matchesTranscript = video.transcript.toLowerCase().includes(searchLower)
        const matchesTags = video.tags.some(tag => tag.toLowerCase().includes(searchLower))
        
        if (!matchesTitle && !matchesDescription && !matchesSpeaker && !matchesTranscript && !matchesTags) {
          return false
        }
      }

      // Filtre par tags
      if (filters.tags && filters.tags.length > 0) {
        const hasMatchingTag = filters.tags.some(filterTag =>
          video.tags.some(videoTag => 
            videoTag.toLowerCase().includes(filterTag.toLowerCase())
          )
        )
        if (!hasMatchingTag) {
          return false
        }
      }

      // Filtre par speaker
      if (filters.speaker) {
        const speakerLower = filters.speaker.toLowerCase()
        if (!video.speaker.name.toLowerCase().includes(speakerLower)) {
          return false
        }
      }

      // Filtre par durée
      if (filters.duration) {
        const durationMinutes = video.duration / 60
        if (durationMinutes < filters.duration.min || durationMinutes > filters.duration.max) {
          return false
        }
      }

      // Filtre par plage de dates
      if (filters.dateRange) {
        const videoDate = new Date(video.publishedAt)
        const startDate = new Date(filters.dateRange.start)
        const endDate = new Date(filters.dateRange.end)
        
        if (videoDate < startDate || videoDate > endDate) {
          return false
        }
      }

      return true
    })
  }, [videos, filters])

  // Statistiques
  const stats = useMemo((): VideoAnalysisStats => {
    const totalVideos = videos.length
    const totalDuration = videos.reduce((sum, video) => sum + video.duration, 0)
    const totalViews = videos.reduce((sum, video) => sum + video.viewCount, 0)
    const featuredCount = videos.filter(video => video.featured).length
    const averageViewCount = videos.length > 0 
      ? Math.round(videos.reduce((sum, video) => sum + video.viewCount, 0) / videos.length)
      : 0

    // Comptage par catégorie
    const categoriesCount = videos.reduce((acc, video) => {
      acc[video.category] = (acc[video.category] || 0) + 1
      return acc
    }, {} as Record<VideoAnalysisCategory, number>)

    // Nombre de speakers uniques
    const uniqueSpeakers = new Set(videos.map(video => video.speaker.id))
    const speakersCount = uniqueSpeakers.size

    return {
      totalVideos,
      totalDuration,
      totalViews,
      categoriesCount,
      averageViewCount,
      featuredCount,
      speakersCount
    }
  }, [videos])

  return {
    videos: filteredVideos,
    allVideos: videos,
    loading,
    error,
    stats
  }
}

// Hook pour une vidéo spécifique
export function useVideoAnalysis(id: string) {
  const [video, setVideo] = useState<VideoAnalysis | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadVideo = async () => {
      try {
        setLoading(true)
        // Simulation du chargement
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const foundVideo = mockVideoAnalyses.find(v => v.id === id)
        if (foundVideo) {
          setVideo(foundVideo)
          setError(null)
        } else {
          setError('Vidéo non trouvée')
        }
      } catch (err) {
        setError('Erreur lors du chargement de la vidéo')
        console.error('Error loading video analysis:', err)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      loadVideo()
    }
  }, [id])

  return {
    video,
    loading,
    error
  }
}

// Hook pour les vidéos recommandées
export function useRecommendedVideoAnalyses(currentVideoId?: string, limit = 4) {
  const { videos } = useVideoAnalyses()

  const recommendedVideos = useMemo(() => {
    let filtered = videos
    
    // Exclure la vidéo actuelle
    if (currentVideoId) {
      filtered = filtered.filter(video => video.id !== currentVideoId)
    }

    // Prioriser les vidéos featured
    const featured = filtered.filter(video => video.featured)
    const nonFeatured = filtered.filter(video => !video.featured)

    // Trier par popularité (vues + likes)
    const sortByPopularity = (a: VideoAnalysis, b: VideoAnalysis) => {
      const aScore = a.viewCount + a.likeCount
      const bScore = b.viewCount + b.likeCount
      return bScore - aScore
    }

    featured.sort(sortByPopularity)
    nonFeatured.sort(sortByPopularity)

    // Combiner et limiter
    return [...featured, ...nonFeatured].slice(0, limit)
  }, [videos, currentVideoId, limit])

  return recommendedVideos
}

// Hook pour les vidéos par speaker
export function useVideoAnalysesBySpeaker() {
  const { videos } = useVideoAnalyses()

  const videosBySpeaker = useMemo(() => {
    const speakerMap = new Map<string, VideoAnalysis[]>()
    
    videos.forEach(video => {
      const speakerId = video.speaker.id
      if (!speakerMap.has(speakerId)) {
        speakerMap.set(speakerId, [])
      }
      speakerMap.get(speakerId)!.push(video)
    })

    return Array.from(speakerMap.entries()).map(([speakerId, videos]) => ({
      speaker: videos[0].speaker,
      videos,
      count: videos.length,
      totalViews: videos.reduce((sum, video) => sum + video.viewCount, 0)
    }))
  }, [videos])

  return videosBySpeaker
}

// Hook pour la recherche dans les transcripts
export function useTranscriptSearch(query: string) {
  const { videos } = useVideoAnalyses()
  const [results, setResults] = useState<Array<{
    video: VideoAnalysis
    matches: Array<{
      timestamp: number
      text: string
      context: string
    }>
  }>>([])

  useEffect(() => {
    if (!query || query.length < 3) {
      setResults([])
      return
    }

    const searchResults = videos.map(video => {
      const transcript = video.transcript.toLowerCase()
      const searchTerm = query.toLowerCase()
      const matches: Array<{
        timestamp: number
        text: string
        context: string
      }> = []

      // Recherche simple dans le transcript
      let index = transcript.indexOf(searchTerm)
      while (index !== -1) {
        const start = Math.max(0, index - 50)
        const end = Math.min(transcript.length, index + searchTerm.length + 50)
        const context = video.transcript.substring(start, end)
        
        matches.push({
          timestamp: 0, // Simplification - dans un vrai système, on calculerait le timestamp
          text: video.transcript.substring(index, index + searchTerm.length),
          context
        })

        index = transcript.indexOf(searchTerm, index + 1)
      }

      return { video, matches }
    }).filter(result => result.matches.length > 0)

    setResults(searchResults)
  }, [query, videos])

  return results
}