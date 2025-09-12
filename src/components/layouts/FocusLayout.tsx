import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { 
  Clock, 
  Twitter, 
  Eye, 
  ArrowRight, 
  Hash, 
  TrendingUp, 
  Users, 
  Calendar,
  Star,
  Bookmark,
  Share2
} from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { ThreadCard } from '../ThreadCard'
import type { Thread, MediaFile } from '../../types/database'

interface FocusLayoutProps {
  threads: Thread[]
  viewMode?: 'grid' | 'list'
}

export function FocusLayout({ threads, viewMode = 'grid' }: FocusLayoutProps) {
  const { theme } = useTheme()

  // Article principal (le plus récent ou le plus populaire)
  const focusThread = useMemo(() => {
    if (!threads || threads.length === 0) return null
    // Prendre le premier thread (le plus récent)
    return threads[0]
  }, [threads])

  // Articles liés et recommandations
  const relatedThreads = useMemo(() => {
    if (!threads || !focusThread) return []
    
    // Exclure l'article principal et prendre les suivants
    const remaining = threads.slice(1)
    
    // Trier par pertinence (même catégorie, puis par popularité)
    const sorted = remaining.sort((a, b) => {
      // Priorité aux articles de même catégorie
      const aHasSameCategory = a.hashtags.some(tag => 
        focusThread.hashtags.some(focusTag => 
          tag.toLowerCase() === focusTag.toLowerCase()
        )
      )
      const bHasSameCategory = b.hashtags.some(tag => 
        focusThread.hashtags.some(focusTag => 
          tag.toLowerCase() === focusTag.toLowerCase()
        )
      )
      
      if (aHasSameCategory && !bHasSameCategory) return -1
      if (!aHasSameCategory && bHasSameCategory) return 1
      
      // Puis par popularité
      const aPopularity = (a.like_count || 0) + (a.view_count || 0)
      const bPopularity = (b.like_count || 0) + (b.view_count || 0)
      return bPopularity - aPopularity
    })
    
    return sorted.slice(0, 6) // Limiter à 6 articles liés
  }, [threads, focusThread])

  // Statistiques pour la sidebar
  const stats = useMemo(() => {
    const totalThreads = threads.length
    const totalTweets = threads.reduce((sum, t) => sum + t.total_tweets, 0)
    const completeThreads = threads.filter(t => t.complete).length
    const categories = [...new Set(threads.flatMap(t => t.hashtags))].length
    
    return {
      totalThreads,
      totalTweets,
      completeThreads,
      categories
    }
  }, [threads])

  if (!focusThread) {
    return (
      <div className="text-center py-16">
        <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg ${
          theme === 'senegalais' ? 'bg-gradient-to-br from-orange-500 to-yellow-500' : 'bg-gray-900'
        }`}>
          <Eye className="w-12 h-12 text-white" />
        </div>
        <p className="text-gray-500 text-xl font-sans mb-4">Aucun article à mettre en focus</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Article Principal (Focus) */}
      <div className="lg:col-span-3 space-y-8">
        {/* Header Focus */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold theme-text mb-4">Article en Focus</h2>
          <div className={`h-1 w-24 mx-auto rounded-full ${
            theme === 'senegalais'
              ? 'bg-gradient-to-r from-orange-600 to-yellow-500'
              : 'bg-black'
          }`}></div>
        </div>

        {/* Article Focus Card */}
        <article className={`relative overflow-hidden rounded-3xl shadow-2xl border-2 ${
          theme === 'senegalais'
            ? 'bg-gradient-to-br from-white via-orange-50 to-yellow-50 border-orange-200'
            : 'bg-gradient-to-br from-gray-50 to-white border-gray-200'
        }`}>
          {/* Image Hero */}
          {(focusThread as Thread & { featured_image?: MediaFile }).featured_image && (
            <div className="relative h-80 overflow-hidden">
              <img
                src={(focusThread as Thread & { featured_image?: MediaFile }).featured_image!.local_path || 
                     (focusThread as Thread & { featured_image?: MediaFile }).featured_image!.original_url}
                alt={focusThread.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = (focusThread as Thread & { featured_image?: MediaFile }).featured_image?.original_url || ''
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              
              {/* Overlay Info */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center space-x-3 mb-4">
                  <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                    theme === 'senegalais' 
                      ? 'bg-orange-600 text-white' 
                      : 'bg-black text-white'
                  }`}>
                    ⭐ Article Focus
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    focusThread.complete
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {focusThread.complete ? '✓ Complet' : '🔄 En cours'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Contenu Principal */}
          <div className="p-8 space-y-6">
            <div className="flex items-start justify-between">
              <h1 className="text-3xl lg:text-4xl font-bold leading-tight theme-text flex-1 pr-4">
                {focusThread.title}
              </h1>
              
              {/* Actions */}
              <div className="flex items-center space-x-2 flex-shrink-0">
                <button className={`p-2 rounded-full transition-all ${
                  theme === 'senegalais'
                    ? 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>
                  <Bookmark className="w-5 h-5" />
                </button>
                <button className={`p-2 rounded-full transition-all ${
                  theme === 'senegalais'
                    ? 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Description */}
            {focusThread.description && (
              <div className={`p-4 rounded-xl ${
                theme === 'senegalais'
                  ? 'bg-white/80 border border-orange-100'
                  : 'bg-gray-50 border border-gray-100'
              }`}>
                <p className="text-lg leading-relaxed theme-text-muted">
                  {focusThread.description}
                </p>
              </div>
            )}

            {/* Métadonnées */}
            <div className="flex flex-wrap items-center gap-6 text-sm theme-text-muted">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>
                  {new Date(focusThread.date_created).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Twitter className="w-4 h-4" />
                <span>{focusThread.total_tweets} tweets</span>
              </div>
              {focusThread.view_count && (
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4" />
                  <span>{focusThread.view_count} vues</span>
                </div>
              )}
            </div>

            {/* Hashtags */}
            <div className="flex flex-wrap gap-3">
              {focusThread.hashtags.map((tag, index) => (
                <span key={index} className={`inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-full transition-all ${
                  theme === 'senegalais'
                    ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}>
                  <Hash className="w-3 h-3" />
                  <span>{tag.replace('#', '')}</span>
                </span>
              ))}
            </div>

            {/* CTA Principal */}
            <div className="pt-6">
              <Link
                to={`/thread/${focusThread.thread_id}`}
                className={`inline-flex items-center space-x-3 px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 ${
                  theme === 'senegalais'
                    ? 'bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white'
                    : 'bg-black hover:bg-gray-800 text-white'
                }`}
              >
                <span>Lire l'article complet</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </article>

        {/* Articles Liés */}
        {relatedThreads.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold theme-text">Articles Liés</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedThreads.slice(0, 4).map((thread) => (
                <ThreadCard 
                  key={thread.id} 
                  thread={thread} 
                  viewMode="grid"
                  compact={true}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div className="lg:col-span-1 space-y-6">
        {/* Navigation Rapide */}
        <div className={`p-6 rounded-2xl border ${
          theme === 'senegalais'
            ? 'bg-white border-orange-200'
            : 'bg-white border-gray-200'
        }`}>
          <h3 className="text-lg font-bold theme-text mb-4">Navigation</h3>
          <div className="space-y-3">
            <button className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
              theme === 'senegalais'
                ? 'bg-orange-50 text-orange-800 hover:bg-orange-100'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}>
              <div className="flex items-center space-x-3">
                <Hash className="w-4 h-4" />
                <span className="font-medium">Transparence</span>
              </div>
            </button>
            <button className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
              theme === 'senegalais'
                ? 'bg-orange-50 text-orange-800 hover:bg-orange-100'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}>
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-4 h-4" />
                <span className="font-medium">Modernisation</span>
              </div>
            </button>
            <button className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
              theme === 'senegalais'
                ? 'bg-orange-50 text-orange-800 hover:bg-orange-100'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}>
              <div className="flex items-center space-x-3">
                <Calendar className="w-4 h-4" />
                <span className="font-medium">Démocratie</span>
              </div>
            </button>
          </div>
        </div>

        {/* Statistiques */}
        <div className={`p-6 rounded-2xl border ${
          theme === 'senegalais'
            ? 'bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200'
            : 'bg-gray-50 border-gray-200'
        }`}>
          <h3 className="text-lg font-bold theme-text mb-4">Statistiques</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 theme-text-muted" />
                <span className="text-sm theme-text-muted">Articles</span>
              </div>
              <span className="font-bold theme-text">{stats.totalThreads}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Twitter className="w-4 h-4 theme-text-muted" />
                <span className="text-sm theme-text-muted">Analyses</span>
              </div>
              <span className="font-bold theme-text">{stats.totalTweets}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 theme-text-muted" />
                <span className="text-sm theme-text-muted">Complets</span>
              </div>
              <span className="font-bold theme-text">{stats.completeThreads}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Hash className="w-4 h-4 theme-text-muted" />
                <span className="text-sm theme-text-muted">Catégories</span>
              </div>
              <span className="font-bold theme-text">{stats.categories}</span>
            </div>
          </div>
        </div>

        {/* Articles Recommandés */}
        {relatedThreads.length > 4 && (
          <div className={`p-6 rounded-2xl border ${
            theme === 'senegalais'
              ? 'bg-white border-orange-200'
              : 'bg-white border-gray-200'
          }`}>
            <h3 className="text-lg font-bold theme-text mb-4">Recommandés</h3>
            <div className="space-y-4">
              {relatedThreads.slice(4, 6).map((thread) => (
                <Link
                  key={thread.id}
                  to={`/thread/${thread.thread_id}`}
                  className="block group"
                >
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium theme-text group-hover:text-orange-600 transition-colors line-clamp-2">
                      {thread.title}
                    </h4>
                    <div className="flex items-center space-x-3 text-xs theme-text-muted">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>
                          {new Date(thread.date_created).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short'
                          })}
                        </span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Twitter className="w-3 h-3" />
                        <span>{thread.total_tweets}</span>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}