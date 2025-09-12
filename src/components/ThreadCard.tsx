import { Link } from 'react-router-dom'
import { Calendar, Hash, MessageCircle, Heart, Eye, CheckCircle, Clock, Sparkles, TrendingUp } from 'lucide-react'
import type { Thread, MediaFile } from '../types/database'
import { useTheme } from '../contexts/ThemeContext'

interface ThreadCardProps {
  thread: Thread & { featured_image?: MediaFile }
  viewMode?: 'grid' | 'list'
}

export function ThreadCard({ thread, viewMode = 'grid' }: ThreadCardProps) {
  const { theme } = useTheme()
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getThemeColor = (threadTheme?: string) => {
    if (!threadTheme) return theme === 'senegalais' ? 'bg-orange-100 text-orange-800 border border-orange-200' : 'bg-gray-100 text-gray-800 border border-gray-200'
    
    if (threadTheme.includes('transparence') || threadTheme.includes('Transparence')) {
      return theme === 'senegalais' ? 'bg-blue-100 text-blue-900 border border-blue-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
    }
    if (threadTheme.includes('modernisation') || threadTheme.includes('Modernisation')) {
      return theme === 'senegalais' ? 'bg-orange-100 text-orange-900 border border-orange-200' : 'bg-orange-50 text-orange-700 border border-orange-200'
    }
    if (threadTheme.includes('constructive') || threadTheme.includes('Constructive')) {
      return theme === 'senegalais' ? 'bg-yellow-100 text-yellow-900 border border-yellow-200' : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
    }
    return theme === 'senegalais' ? 'bg-orange-100 text-orange-800 border border-orange-200' : 'bg-gray-100 text-gray-800 border border-gray-200'
  }

  const getHashtagColor = (hashtag: string) => {
    if (theme === 'minimaliste') {
      return 'bg-gray-100 text-gray-800 border border-gray-200'
    }
    
    if (hashtag.includes('TransparenceSN')) {
      return 'bg-blue-900 text-yellow-400 border border-blue-700'
    }
    if (hashtag.includes('LaSuite')) {
      return 'bg-orange-600 text-white border border-orange-500'
    }
    if (hashtag.includes('LaQuestion')) {
      return 'bg-yellow-600 text-blue-900 border border-yellow-500'
    }
    return 'bg-gray-100 text-gray-700 border border-gray-200'
  }

  const getLocalMediaUrl = (mediaFile: MediaFile) => {
    const supabaseUrl = 'https://ghpptudzucrnygrozpht.supabase.co'
    return `${supabaseUrl}/storage/v1/object/public/twitter-media/${mediaFile.local_path}`
  }

  const baseClasses = `block overflow-hidden transition-all duration-500 group transform hover:-translate-y-2 ${
    theme === 'senegalais'
      ? 'bg-white rounded-2xl shadow-lg border-2 border-orange-200/50 hover:shadow-2xl hover:border-orange-300 backdrop-blur-sm'
      : 'bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-gray-300'
  }`

  if (viewMode === 'list') {
    return (
      <Link to={`/thread/${thread.thread_id}`} className={baseClasses}>
        <div className="flex items-start space-x-6 p-6">
          {/* Image miniature */}
          {thread.featured_image && (
            <div className="flex-shrink-0">
              <img 
                src={getLocalMediaUrl(thread.featured_image)}
                alt={thread.title}
                className="w-24 h-24 object-cover rounded-xl"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = thread.featured_image!.original_url
                }}
              />
            </div>
          )}
          
          {/* Contenu */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-3">
              <h3 className={`text-xl font-bold leading-tight line-clamp-2 font-sans ${
                theme === 'senegalais' ? 'text-gray-900 group-hover:text-orange-600' : 'text-gray-900 group-hover:text-black'
              }`}>
                {thread.title}
              </h3>
              <div className="flex items-center space-x-4 text-sm theme-text-muted ml-4 flex-shrink-0">
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>{thread.view_count || 0}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Heart className="w-4 h-4" />
                  <span>{thread.like_count || 0}</span>
                </div>
              </div>
            </div>
            
            {thread.description && (
              <p className="theme-text-muted text-base mb-4 line-clamp-2 font-sans leading-relaxed">
                {thread.description}
              </p>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {thread.complete ? (
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-bold ${
                    theme === 'senegalais' ? 'text-white bg-blue-900' : 'text-blue-700 bg-blue-100'
                  }`}>
                    <CheckCircle className="w-4 h-4" />
                    <span>Complet</span>
                  </div>
                ) : (
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-bold ${
                    theme === 'senegalais' ? 'text-white bg-orange-600' : 'text-orange-700 bg-orange-100'
                  }`}>
                    <Clock className="w-4 h-4" />
                    <span>En cours</span>
                  </div>
                )}
                
                <div className="flex items-center space-x-2 theme-text-muted text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(thread.date_created)}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-1 theme-text-muted text-sm">
                <MessageCircle className="w-4 h-4" />
                <span>{thread.total_tweets} analyses</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  // Mode grille (par défaut)
  return (
    <Link to={`/thread/${thread.thread_id}`} className={baseClasses}>
      {/* Featured Image */}
      {thread.featured_image && (
        <div className={`relative overflow-hidden ${
          theme === 'senegalais' ? 'bg-gradient-to-br from-orange-50 to-yellow-50' : 'bg-gray-50'
        }`}>
          <div className="p-4 pb-2">
            <img 
              src={getLocalMediaUrl(thread.featured_image)}
              alt={thread.title}
              className={`w-full h-48 object-contain rounded-xl shadow-md group-hover:scale-105 transition-transform duration-500 ${
                theme === 'senegalais' ? 'bg-white/80' : 'bg-white'
              }`}
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = thread.featured_image!.original_url
              }}
            />
          </div>
          
          {/* Overlay decoratif */}
          {theme === 'senegalais' && (
            <div className="absolute top-6 right-6">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>
          )}
          
          {/* Thread info overlay */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {thread.complete ? (
                  <div className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-bold ${
                    theme === 'senegalais' 
                      ? 'text-white bg-blue-900/95 border-2 border-yellow-400/50'
                      : 'text-white bg-green-600/95 border border-green-500'
                  }`}>
                    <CheckCircle className="w-4 h-4" />
                    <span>Dossier Complet</span>
                  </div>
                ) : (
                  <div className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-bold ${
                    theme === 'senegalais'
                      ? 'text-white bg-orange-600/95 border-2 border-yellow-400/50'
                      : 'text-white bg-yellow-600/95 border border-yellow-500'
                  }`}>
                    <Clock className="w-4 h-4" />
                    <span>En Cours</span>
                  </div>
                )}
                <div className={`px-3 py-2 rounded-full text-sm font-bold ${
                  theme === 'senegalais'
                    ? 'text-blue-900 bg-yellow-400/95 border-2 border-orange-500/50'
                    : 'text-white bg-black/80 border border-gray-600'
                }`}>
                  {thread.total_tweets} analyses
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={`p-6 space-y-6 ${
        theme === 'senegalais' ? 'bg-gradient-to-br from-white to-orange-50/30' : 'bg-white'
      }`}>
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className={`text-xl font-bold mb-3 transition-colors font-sans leading-tight ${
              theme === 'senegalais' ? 'text-gray-900 group-hover:text-orange-600' : 'text-gray-900 group-hover:text-black'
            }`}>
              {thread.title}
            </h3>
            {thread.theme && (
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${getThemeColor(thread.theme)}`}>
                {thread.theme}
              </span>
            )}
          </div>
          {/* Motif décoratif pour thème sénégalais */}
          {theme === 'senegalais' && (
            <div className="w-6 h-6 border-2 border-orange-400 rounded-full opacity-30"></div>
          )}
        </div>

        {/* Description */}
        {thread.description && (
          <p className={`text-sm leading-relaxed font-sans line-clamp-3 p-3 rounded-lg ${
            theme === 'senegalais' 
              ? 'text-gray-700 bg-white/50 border border-orange-100'
              : 'text-gray-600 bg-gray-50 border border-gray-100'
          }`}>
            {thread.description}
          </p>
        )}

        {/* Hashtags */}
        {thread.hashtags && thread.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {thread.hashtags.slice(0, 3).map((hashtag, index) => (
              <span 
                key={index} 
                className={`inline-flex items-center space-x-2 px-4 py-2 text-sm font-bold rounded-full transition-all duration-300 hover:scale-105 ${getHashtagColor(hashtag)}`}
              >
                <Hash className="w-3 h-3" />
                <span>{hashtag.replace('#', '')}</span>
              </span>
            ))}
            {thread.hashtags.length > 3 && (
              <span className={`text-sm px-3 py-2 rounded-full font-bold ${
                theme === 'senegalais' 
                  ? 'text-orange-600 bg-orange-100 border border-orange-200'
                  : 'text-gray-600 bg-gray-100 border border-gray-200'
              }`}>
                +{thread.hashtags.length - 3} autres
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className={`flex items-center justify-between pt-4 ${
          theme === 'senegalais' ? 'border-t-2 border-gradient-to-r from-orange-200 to-yellow-200' : 'border-t border-gray-200'
        }`}>
          <div className="flex items-center space-x-4 text-sm theme-text-muted">
            <div className={`flex items-center space-x-2 px-3 py-2 rounded-full ${
              theme === 'senegalais' ? 'bg-white/80 border border-orange-200' : 'bg-gray-50 border border-gray-200'
            }`}>
              <Calendar className={`w-4 h-4 ${
                theme === 'senegalais' ? 'text-orange-600' : 'text-gray-600'
              }`} />
              <span className="font-medium">{formatDate(thread.date_created)}</span>
            </div>
          </div>
          
          <div className={`flex items-center space-x-2 font-bold transition-colors px-4 py-2 rounded-full ${
            theme === 'senegalais'
              ? 'text-orange-600 group-hover:text-orange-700 bg-gradient-to-r from-orange-100 to-yellow-100 border border-orange-200'
              : 'text-black group-hover:text-gray-700 bg-gray-100 border border-gray-200'
          }`}>
            <span className="font-sans">Lire l'analyse</span>
            <TrendingUp className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  )
}
