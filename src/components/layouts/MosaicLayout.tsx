import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { 
  Clock, 
  Twitter, 
  Eye, 
  ArrowRight, 
  Hash, 
  Calendar,
  TrendingUp,
  Sparkles
} from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import type { Thread, MediaFile } from '../../types/database'

interface MosaicLayoutProps {
  threads: Thread[]
  viewMode?: 'grid' | 'list'
}

interface MosaicItem {
  thread: Thread & { featured_image?: MediaFile }
  size: 'large' | 'medium' | 'small'
  position: number
}

export function MosaicLayout({ threads, viewMode = 'grid' }: MosaicLayoutProps) {
  const { theme } = useTheme()

  // Organiser les threads en mosaïque avec tailles variables
  const mosaicItems = useMemo(() => {
    if (!threads || threads.length === 0) return []

    const items: MosaicItem[] = []
    
    // Algorithme de placement intelligent
    threads.forEach((thread, index) => {
      let size: 'large' | 'medium' | 'small'
      
      // Logique de taille basée sur l'importance
      const popularity = (thread.like_count || 0) + (thread.view_count || 0)
      const isComplete = thread.complete
      const hasImage = !!(thread as Thread & { featured_image?: MediaFile }).featured_image
      
      // Score d'importance
      let importance = 0
      if (isComplete) importance += 3
      if (hasImage) importance += 2
      if (popularity > 100) importance += 2
      if (index === 0) importance += 4 // Premier article
      
      // Attribution des tailles
      if (importance >= 6) {
        size = 'large'
      } else if (importance >= 3) {
        size = 'medium'
      } else {
        size = 'small'
      }
      
      // Équilibrage pour éviter trop de grandes cartes
      const largeCount = items.filter(item => item.size === 'large').length
      if (size === 'large' && largeCount >= 2) {
        size = 'medium'
      }
      
      items.push({
        thread: thread as Thread & { featured_image?: MediaFile },
        size,
        position: index
      })
    })

    return items
  }, [threads])

  const getSizeClasses = (size: 'large' | 'medium' | 'small') => {
    switch (size) {
      case 'large':
        return 'col-span-2 row-span-2'
      case 'medium':
        return 'col-span-2 row-span-1'
      case 'small':
        return 'col-span-1 row-span-1'
      default:
        return 'col-span-1 row-span-1'
    }
  }

  const getCardHeight = (size: 'large' | 'medium' | 'small') => {
    switch (size) {
      case 'large':
        return 'h-96'
      case 'medium':
        return 'h-48'
      case 'small':
        return 'h-32'
      default:
        return 'h-32'
    }
  }

  if (mosaicItems.length === 0) {
    return (
      <div className="text-center py-16">
        <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg ${
          theme === 'senegalais' ? 'bg-gradient-to-br from-orange-500 to-yellow-500' : 'bg-gray-900'
        }`}>
          <Sparkles className="w-12 h-12 text-white" />
        </div>
        <p className="text-gray-500 text-xl font-sans mb-4">Aucun article pour la mosaïque</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header Mosaïque */}
      <div className="text-center">
        <h2 className="text-3xl font-bold theme-text mb-4">Mosaïque Dynamique</h2>
        <div className={`h-1 w-32 mx-auto rounded-full mb-6 ${
          theme === 'senegalais'
            ? 'bg-gradient-to-r from-orange-600 via-yellow-500 to-blue-900'
            : 'bg-black'
        }`}></div>
        <p className="theme-text-muted max-w-2xl mx-auto">
          Articles organisés par importance avec tailles variables pour une expérience visuelle dynamique
        </p>
      </div>

      {/* Grille Mosaïque */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 auto-rows-fr">
        {mosaicItems.map((item) => {
          const { thread, size } = item
          
          return (
            <Link
              key={thread.id}
              to={`/thread/${thread.thread_id}`}
              className={`${getSizeClasses(size)} ${getCardHeight(size)} group relative overflow-hidden rounded-2xl transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl ${
                theme === 'senegalais'
                  ? 'bg-gradient-to-br from-white to-orange-50 border-2 border-orange-200/50 hover:border-orange-300'
                  : 'bg-white border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-lg'
              }`}
            >
              {/* Image de fond */}
              {thread.featured_image ? (
                <div className="absolute inset-0">
                  <img
                    src={thread.featured_image.local_path || thread.featured_image.original_url}
                    alt={thread.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = thread.featured_image?.original_url || ''
                    }}
                  />
                  <div className={`absolute inset-0 ${
                    size === 'large' 
                      ? 'bg-gradient-to-t from-black/80 via-black/40 to-transparent'
                      : 'bg-gradient-to-t from-black/70 via-black/30 to-transparent'
                  }`}></div>
                </div>
              ) : (
                <div className={`absolute inset-0 ${
                  theme === 'senegalais'
                    ? 'bg-gradient-to-br from-orange-200 to-yellow-200'
                    : 'bg-gradient-to-br from-gray-200 to-gray-300'
                }`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Twitter className={`${
                      size === 'large' ? 'w-16 h-16' : size === 'medium' ? 'w-12 h-12' : 'w-8 h-8'
                    } ${theme === 'senegalais' ? 'text-orange-600' : 'text-gray-600'} opacity-50`} />
                  </div>
                </div>
              )}

              {/* Badge de taille */}
              <div className="absolute top-3 right-3">
                <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                  size === 'large'
                    ? theme === 'senegalais'
                      ? 'bg-orange-600 text-white'
                      : 'bg-black text-white'
                    : size === 'medium'
                      ? theme === 'senegalais'
                        ? 'bg-yellow-500 text-black'
                        : 'bg-gray-600 text-white'
                      : theme === 'senegalais'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-400 text-white'
                }`}>
                  {size === 'large' ? '★' : size === 'medium' ? '●' : '○'}
                </div>
              </div>

              {/* Statut */}
              <div className="absolute top-3 left-3">
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  thread.complete
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {thread.complete ? '✓' : '⏳'}
                </div>
              </div>

              {/* Contenu */}
              <div className="absolute inset-0 p-4 flex flex-col justify-end">
                <div className="space-y-2">
                  {/* Titre */}
                  <h3 className={`font-bold text-white leading-tight ${
                    size === 'large' 
                      ? 'text-xl lg:text-2xl' 
                      : size === 'medium' 
                        ? 'text-lg' 
                        : 'text-sm'
                  } ${size === 'small' ? 'line-clamp-2' : 'line-clamp-3'}`}>
                    {thread.title}
                  </h3>

                  {/* Description (seulement pour large) */}
                  {size === 'large' && thread.description && (
                    <p className="text-white/90 text-sm line-clamp-2 leading-relaxed">
                      {thread.description.length > 100 
                        ? `${thread.description.substring(0, 100)}...` 
                        : thread.description}
                    </p>
                  )}

                  {/* Métadonnées */}
                  <div className={`flex items-center text-white/80 text-xs ${
                    size === 'large' ? 'space-x-4' : 'space-x-2'
                  }`}>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>
                        {new Date(thread.date_created).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Twitter className="w-3 h-3" />
                      <span>{thread.total_tweets}</span>
                    </div>
                    {size === 'large' && thread.view_count && (
                      <div className="flex items-center space-x-1">
                        <Eye className="w-3 h-3" />
                        <span>{thread.view_count}</span>
                      </div>
                    )}
                  </div>

                  {/* Hashtags (seulement pour large et medium) */}
                  {(size === 'large' || size === 'medium') && thread.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {thread.hashtags.slice(0, size === 'large' ? 3 : 2).map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-white/20 text-white text-xs rounded-full">
                          {tag.replace('#', '')}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Hover Effect */}
                <div className={`absolute inset-0 bg-gradient-to-t from-orange-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                  theme === 'senegalais' ? 'from-orange-600/20' : 'from-black/20'
                }`}></div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Légende */}
      <div className={`text-center py-6 rounded-2xl ${
        theme === 'senegalais'
          ? 'bg-gradient-to-r from-orange-50 to-yellow-50'
          : 'bg-gray-50'
      }`}>
        <h3 className="text-lg font-bold theme-text mb-3">Légende des Tailles</h3>
        <div className="flex justify-center items-center space-x-8">
          <div className="flex items-center space-x-2">
            <div className={`w-4 h-4 rounded-full ${
              theme === 'senegalais' ? 'bg-orange-600' : 'bg-black'
            }`}></div>
            <span className="text-sm theme-text-muted">★ Articles majeurs</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-4 h-4 rounded-full ${
              theme === 'senegalais' ? 'bg-yellow-500' : 'bg-gray-600'
            }`}></div>
            <span className="text-sm theme-text-muted">● Articles importants</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-4 h-4 rounded-full ${
              theme === 'senegalais' ? 'bg-blue-500' : 'bg-gray-400'
            }`}></div>
            <span className="text-sm theme-text-muted">○ Articles standards</span>
          </div>
        </div>
      </div>
    </div>
  )
}