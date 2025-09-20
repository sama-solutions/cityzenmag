import { Link } from 'react-router-dom'
import { Twitter, FileText, Calendar, Eye, Heart, ArrowRight, Clock, CheckCircle } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import type { TabType } from './TabSystem'

interface Article {
  id: string
  title: string
  description?: string
  created_at: string
  featured_image?: string
  status: 'draft' | 'published' | 'archived'
  is_featured: boolean
  theme?: string
}

interface Thread {
  id: string
  thread_id: string
  title: string
  description?: string
  date_created: string
  total_tweets: number
  complete: boolean
  view_count?: number
  like_count?: number
  theme?: string
  featured_image?: any
}

interface ContentSidebarProps {
  currentTab: TabType
  articles: Article[]
  threads: Thread[]
}

export function ContentSidebar({ currentTab, articles, threads }: ContentSidebarProps) {
  const { theme } = useTheme()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength).trim() + '...'
  }

  // Obtenir les 2 derniers articles publiés
  const latestArticles = articles
    .filter(article => article.status === 'published')
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 2)

  // Obtenir les 2 derniers threads
  const latestThreads = threads
    .sort((a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime())
    .slice(0, 2)

  const getTweetImageUrl = (thread: Thread) => {
    if (thread.featured_image) {
      return thread.featured_image.original_url || 
             thread.featured_image.local_path || 
             thread.featured_image.url
    }
    return null
  }

  return (
    <div className="space-y-6">
      {/* Section Articles (visible dans l'onglet Tweets) */}
      {currentTab === 'tweets' && latestArticles.length > 0 && (
        <div className={`p-6 rounded-2xl border ${
          theme === 'senegalais'
            ? 'bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200/50'
            : 'bg-gray-50 border-gray-200'
        }`}>
          <div className="flex items-center space-x-3 mb-4">
            <div className={`p-2 rounded-lg ${
              theme === 'senegalais' ? 'bg-orange-100' : 'bg-gray-100'
            }`}>
              <FileText className={`w-5 h-5 ${
                theme === 'senegalais' ? 'text-orange-600' : 'text-gray-600'
              }`} />
            </div>
            <div>
              <h3 className={`font-bold text-lg ${
                theme === 'senegalais' ? 'text-orange-900' : 'text-gray-900'
              }`}>
                Articles Récents
              </h3>
              <p className={`text-sm ${
                theme === 'senegalais' ? 'text-orange-700' : 'text-gray-600'
              }`}>
                Nos derniers contenus éditoriaux
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {latestArticles.map((article) => (
              <div
                key={article.id}
                className={`group p-4 rounded-xl border transition-all hover:shadow-lg ${
                  theme === 'senegalais'
                    ? 'bg-white border-orange-200/50 hover:border-orange-300'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                {/* Image si disponible */}
                {article.featured_image && (
                  <div className="mb-3">
                    <img
                      src={article.featured_image}
                      alt={article.title}
                      className="w-full h-32 object-cover rounded-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                      }}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <h4 className={`font-bold text-sm leading-tight group-hover:${
                    theme === 'senegalais' ? 'text-orange-600' : 'text-black'
                  } transition-colors`}>
                    {truncateText(article.title, 60)}
                  </h4>
                  
                  {article.description && (
                    <p className={`text-xs leading-relaxed ${
                      theme === 'senegalais' ? 'text-orange-700' : 'text-gray-600'
                    }`}>
                      {truncateText(article.description, 80)}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(article.created_at)}</span>
                      {article.theme && (
                        <>
                          <span>•</span>
                          <span className={`px-2 py-1 rounded-full ${
                            theme === 'senegalais'
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {article.theme}
                          </span>
                        </>
                      )}
                    </div>
                    
                    <ArrowRight className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ${
                      theme === 'senegalais' ? 'text-orange-600' : 'text-gray-600'
                    }`} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <Link
              to="/admin/articles"
              className={`flex items-center justify-center space-x-2 w-full py-2 rounded-lg font-medium transition-all ${
                theme === 'senegalais'
                  ? 'text-orange-600 hover:bg-orange-100'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>Voir tous les articles</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Section Threads (visible dans l'onglet Articles) */}
      {currentTab === 'articles' && latestThreads.length > 0 && (
        <div className={`p-6 rounded-2xl border ${
          theme === 'senegalais'
            ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200/50'
            : 'bg-gray-50 border-gray-200'
        }`}>
          <div className="flex items-center space-x-3 mb-4">
            <div className={`p-2 rounded-lg ${
              theme === 'senegalais' ? 'bg-blue-100' : 'bg-gray-100'
            }`}>
              <Twitter className={`w-5 h-5 ${
                theme === 'senegalais' ? 'text-blue-600' : 'text-gray-600'
              }`} />
            </div>
            <div>
              <h3 className={`font-bold text-lg ${
                theme === 'senegalais' ? 'text-blue-900' : 'text-gray-900'
              }`}>
                Threads Récents
              </h3>
              <p className={`text-sm ${
                theme === 'senegalais' ? 'text-blue-700' : 'text-gray-600'
              }`}>
                Nos dernières analyses Twitter
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {latestThreads.map((thread) => (
              <Link
                key={thread.id}
                to={`/thread/${thread.thread_id}`}
                className={`group block p-4 rounded-xl border transition-all hover:shadow-lg ${
                  theme === 'senegalais'
                    ? 'bg-white border-blue-200/50 hover:border-blue-300'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                {/* Image si disponible */}
                {getTweetImageUrl(thread) && (
                  <div className="mb-3 relative">
                    <img
                      src={getTweetImageUrl(thread)}
                      alt={thread.title}
                      className="w-full h-32 object-cover rounded-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.parentElement?.remove()
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
                  </div>
                )}

                <div className="space-y-2">
                  <h4 className={`font-bold text-sm leading-tight group-hover:${
                    theme === 'senegalais' ? 'text-blue-600' : 'text-black'
                  } transition-colors`}>
                    {truncateText(thread.title, 60)}
                  </h4>
                  
                  {thread.description && (
                    <p className={`text-xs leading-relaxed ${
                      theme === 'senegalais' ? 'text-blue-700' : 'text-gray-600'
                    }`}>
                      {truncateText(thread.description, 80)}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(thread.date_created)}</span>
                      <span>•</span>
                      <span>{thread.total_tweets} tweets</span>
                      {thread.complete ? (
                        <CheckCircle className="w-3 h-3 text-green-500" />
                      ) : (
                        <Clock className="w-3 h-3 text-yellow-500" />
                      )}
                    </div>
                    
                    <ArrowRight className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ${
                      theme === 'senegalais' ? 'text-blue-600' : 'text-gray-600'
                    }`} />
                  </div>

                  {/* Stats si disponibles */}
                  {(thread.view_count || thread.like_count) && (
                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                      {thread.view_count && (
                        <div className="flex items-center space-x-1">
                          <Eye className="w-3 h-3" />
                          <span>{thread.view_count}</span>
                        </div>
                      )}
                      {thread.like_count && (
                        <div className="flex items-center space-x-1">
                          <Heart className="w-3 h-3" />
                          <span>{thread.like_count}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <Link
              to="/?tab=tweets"
              className={`flex items-center justify-center space-x-2 w-full py-2 rounded-lg font-medium transition-all ${
                theme === 'senegalais'
                  ? 'text-blue-600 hover:bg-blue-100'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>Voir tous les threads</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Section Statistiques */}
      <div className={`p-6 rounded-2xl border ${
        theme === 'senegalais'
          ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200/50'
          : 'bg-gray-50 border-gray-200'
      }`}>
        <h3 className={`font-bold text-lg mb-4 ${
          theme === 'senegalais' ? 'text-green-900' : 'text-gray-900'
        }`}>
          Statistiques
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className={`text-sm ${
              theme === 'senegalais' ? 'text-green-700' : 'text-gray-600'
            }`}>
              Articles publiés
            </span>
            <span className={`font-bold ${
              theme === 'senegalais' ? 'text-green-900' : 'text-gray-900'
            }`}>
              {articles.filter(a => a.status === 'published').length}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className={`text-sm ${
              theme === 'senegalais' ? 'text-green-700' : 'text-gray-600'
            }`}>
              Threads Twitter
            </span>
            <span className={`font-bold ${
              theme === 'senegalais' ? 'text-green-900' : 'text-gray-900'
            }`}>
              {threads.length}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className={`text-sm ${
              theme === 'senegalais' ? 'text-green-700' : 'text-gray-600'
            }`}>
              Dossiers complets
            </span>
            <span className={`font-bold ${
              theme === 'senegalais' ? 'text-green-900' : 'text-gray-900'
            }`}>
              {threads.filter(t => t.complete).length}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}