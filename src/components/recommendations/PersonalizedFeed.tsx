import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Sparkles, 
  TrendingUp, 
  Eye, 
  Heart, 
  Clock, 
  User,
  Tag,
  RefreshCw,
  Settings,
  ChevronRight
} from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { RecommendationEngine } from '../../services/recommendationEngine'
import type { ContentItem, Recommendation } from '../../types/recommendations'

interface PersonalizedFeedProps {
  userId: string
  limit?: number
  showHeader?: boolean
}

export function PersonalizedFeed({ userId, limit = 8, showHeader = true }: PersonalizedFeedProps) {
  const { theme } = useTheme()
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [contentItems, setContentItems] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [engine] = useState(() => new RecommendationEngine())

  useEffect(() => {
    loadRecommendations()
  }, [userId, limit])

  const loadRecommendations = async () => {
    try {
      setLoading(true)
      const recs = await engine.generateRecommendations(userId, limit)
      setRecommendations(recs)
      
      // Charger les détails des contenus
      const feed = await engine.getPersonalizedFeed(userId, { excludeViewed: false })
      setContentItems(feed.slice(0, limit))
    } catch (error) {
      console.error('Error loading recommendations:', error)
    } finally {
      setLoading(false)
    }
  }

  const refreshRecommendations = async () => {
    setRefreshing(true)
    await loadRecommendations()
    setRefreshing(false)
  }

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'interviews': return '🎤'
      case 'photoReports': return '📸'
      case 'videoAnalyses': return '🎥'
      case 'testimonials': return '💬'
      default: return '📄'
    }
  }

  const getContentTypeLabel = (type: string) => {
    switch (type) {
      case 'interviews': return 'Interview'
      case 'photoReports': return 'Reportage Photo'
      case 'videoAnalyses': return 'Vidéo Analyse'
      case 'testimonials': return 'Témoignage'
      default: return 'Article'
    }
  }

  const getContentUrl = (item: ContentItem) => {
    switch (item.type) {
      case 'interviews': return `/interview/${item.id}`
      case 'photoReports': return `/reportage/${item.id}`
      case 'videoAnalyses': return `/video/${item.id}`
      case 'testimonials': return `/temoignage/${item.id}`
      default: return `/article/${item.id}`
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short'
    })
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {showHeader && (
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: limit }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="h-48 bg-gray-200 rounded-xl"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {showHeader && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-xl ${
              theme === 'senegalais' 
                ? 'bg-gradient-to-br from-purple-500 to-pink-600' 
                : 'bg-black'
            }`}>
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold theme-text">Recommandé pour vous</h2>
              <p className="text-gray-600">Contenu personnalisé basé sur vos intérêts</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={refreshRecommendations}
              disabled={refreshing}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                theme === 'senegalais'
                  ? 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              } ${refreshing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Actualiser</span>
            </button>
            
            <button className={`p-2 rounded-xl transition-all ${
              theme === 'senegalais'
                ? 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}>
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {contentItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contentItems.map((item, index) => {
            const recommendation = recommendations.find(r => r.contentId === item.id)
            
            return (
              <Link
                key={item.id}
                to={getContentUrl(item)}
                className={`group block overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                  theme === 'senegalais'
                    ? 'bg-white border-purple-200 hover:border-purple-300'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                {/* Image/Thumbnail */}
                <div className="relative h-48 overflow-hidden">
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center text-6xl ${
                      theme === 'senegalais'
                        ? 'bg-gradient-to-br from-purple-100 to-pink-100'
                        : 'bg-gradient-to-br from-gray-100 to-gray-200'
                    }`}>
                      {getContentTypeIcon(item.type)}
                    </div>
                  )}
                  
                  {/* Overlay avec badges */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
                    <div className="absolute top-3 left-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        theme === 'senegalais'
                          ? 'bg-purple-600 text-white'
                          : 'bg-black text-white'
                      }`}>
                        {getContentTypeLabel(item.type)}
                      </span>
                    </div>
                    
                    {recommendation && recommendation.score > 0.7 && (
                      <div className="absolute top-3 right-3">
                        <div className="p-1 bg-yellow-400 rounded-full">
                          <TrendingUp className="w-3 h-3 text-yellow-900" />
                        </div>
                      </div>
                    )}
                    
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="flex items-center justify-between text-white text-xs">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatDate(item.publishedAt)}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Eye className="w-3 h-3" />
                          <span>{item.metrics.views}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contenu */}
                <div className="p-4 space-y-3">
                  <h3 className="font-bold text-gray-900 line-clamp-2 group-hover:text-purple-600 transition-colors">
                    {item.title}
                  </h3>
                  
                  {item.description && (
                    <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <User className="w-3 h-3" />
                    <span>{item.author}</span>
                    {item.category && (
                      <>
                        <span>•</span>
                        <span className="capitalize">{item.category}</span>
                      </>
                    )}
                  </div>
                  
                  {/* Tags */}
                  {item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {item.tags.slice(0, 2).map((tag, tagIndex) => (
                        <span key={tagIndex} className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
                          theme === 'senegalais'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          <Tag className="w-2 h-2" />
                          <span>{tag}</span>
                        </span>
                      ))}
                      {item.tags.length > 2 && (
                        <span className="text-xs text-gray-500">+{item.tags.length - 2}</span>
                      )}
                    </div>
                  )}
                  
                  {/* Métriques */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                      <span className="flex items-center space-x-1">
                        <Heart className="w-3 h-3" />
                        <span>{item.metrics.likes}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Eye className="w-3 h-3" />
                        <span>{item.metrics.views}</span>
                      </span>
                    </div>
                    
                    <ChevronRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${
                      theme === 'senegalais' ? 'text-purple-600' : 'text-gray-400'
                    }`} />
                  </div>
                  
                  {/* Raison de la recommandation */}
                  {recommendation && recommendation.reasons.length > 0 && (
                    <div className={`text-xs p-2 rounded-lg ${
                      theme === 'senegalais'
                        ? 'bg-purple-50 text-purple-700'
                        : 'bg-gray-50 text-gray-600'
                    }`}>
                      <div className="flex items-center space-x-1">
                        <Sparkles className="w-3 h-3" />
                        <span>{recommendation.reasons[0].explanation}</span>
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
            theme === 'senegalais'
              ? 'bg-gradient-to-br from-purple-500 to-pink-500'
              : 'bg-gray-900'
          }`}>
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-500 text-lg mb-2">Aucune recommandation disponible</p>
          <p className="text-gray-400 text-sm">Consultez plus de contenu pour recevoir des recommandations personnalisées.</p>
        </div>
      )}
    </div>
  )
}