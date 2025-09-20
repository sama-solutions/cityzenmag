import { useState, useMemo } from 'react'
import { 
  Twitter, 
  Eye, 
  Heart, 
  MessageCircle, 
  Calendar, 
  Tag,
  Search,
  Filter,
  TrendingUp,
  Clock,
  CheckCircle
} from 'lucide-react'
import { useThreads } from '../../../hooks/useData'
import { useTheme } from '../../../contexts/ThemeContext'

interface ThreadsDrillDownProps {
  filterType?: 'all' | 'complete' | 'draft' | 'published'
}

export function ThreadsDrillDown({ filterType = 'all' }: ThreadsDrillDownProps) {
  const { threads } = useThreads()
  const { theme } = useTheme()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'views' | 'likes' | 'tweets'>('date')
  const [filterCategory, setFilterCategory] = useState<string>('all')

  // Filtrer et trier les threads
  const filteredThreads = useMemo(() => {
    if (!threads) return []

    let filtered = threads.filter(thread => {
      // Filtre par type
      if (filterType === 'complete' && !thread.complete) return false
      if (filterType === 'draft' && thread.status?.slug !== 'draft') return false
      if (filterType === 'published' && thread.status?.slug !== 'published') return false

      // Filtre par recherche
      if (searchTerm && !thread.title.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false
      }

      // Filtre par catégorie
      if (filterCategory !== 'all' && thread.category?.slug !== filterCategory) {
        return false
      }

      return true
    })

    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'views':
          return (b.view_count || 0) - (a.view_count || 0)
        case 'likes':
          return (b.like_count || 0) - (a.like_count || 0)
        case 'tweets':
          return (b.total_tweets || 0) - (a.total_tweets || 0)
        case 'date':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })

    return filtered
  }, [threads, filterType, searchTerm, sortBy, filterCategory])

  // Statistiques
  const stats = useMemo(() => {
    if (!filteredThreads.length) return { totalViews: 0, totalLikes: 0, totalTweets: 0, avgTweets: 0 }

    const totalViews = filteredThreads.reduce((sum, t) => sum + (t.view_count || 0), 0)
    const totalLikes = filteredThreads.reduce((sum, t) => sum + (t.like_count || 0), 0)
    const totalTweets = filteredThreads.reduce((sum, t) => sum + (t.total_tweets || 0), 0)
    const avgTweets = Math.round(totalTweets / filteredThreads.length)

    return { totalViews, totalLikes, totalTweets, avgTweets }
  }, [filteredThreads])

  // Catégories uniques
  const categories = useMemo(() => {
    if (!threads) return []
    const uniqueCategories = Array.from(new Set(threads.map(t => t.category).filter(Boolean)))
    return uniqueCategories
  }, [threads])

  return (
    <div className="space-y-6">
      {/* Statistiques rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`p-4 rounded-xl ${
          theme === 'dark' ? 'bg-slate-700' : 'bg-blue-50'
        }`}>
          <div className="flex items-center space-x-2">
            <Twitter className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium theme-text-muted">Total</span>
          </div>
          <div className="text-2xl font-bold theme-text">{filteredThreads.length}</div>
        </div>
        
        <div className={`p-4 rounded-xl ${
          theme === 'dark' ? 'bg-slate-700' : 'bg-green-50'
        }`}>
          <div className="flex items-center space-x-2">
            <Eye className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium theme-text-muted">Vues</span>
          </div>
          <div className="text-2xl font-bold theme-text">{stats.totalViews.toLocaleString()}</div>
        </div>
        
        <div className={`p-4 rounded-xl ${
          theme === 'dark' ? 'bg-slate-700' : 'bg-red-50'
        }`}>
          <div className="flex items-center space-x-2">
            <Heart className="w-5 h-5 text-red-600" />
            <span className="text-sm font-medium theme-text-muted">Likes</span>
          </div>
          <div className="text-2xl font-bold theme-text">{stats.totalLikes.toLocaleString()}</div>
        </div>
        
        <div className={`p-4 rounded-xl ${
          theme === 'dark' ? 'bg-slate-700' : 'bg-purple-50'
        }`}>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium theme-text-muted">Moy. Tweets</span>
          </div>
          <div className="text-2xl font-bold theme-text">{stats.avgTweets}</div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 theme-text-muted" />
          <input
            type="text"
            placeholder="Rechercher un thread..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-3 border rounded-xl outline-none transition-all ${
              theme === 'dark'
                ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500'
                : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
            }`}
          />
        </div>
        
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className={`px-4 py-3 border rounded-xl outline-none transition-all ${
            theme === 'dark'
              ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500'
              : 'border-gray-300 focus:border-blue-500'
          }`}
        >
          <option value="date">Trier par date</option>
          <option value="views">Trier par vues</option>
          <option value="likes">Trier par likes</option>
          <option value="tweets">Trier par tweets</option>
        </select>
        
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className={`px-4 py-3 border rounded-xl outline-none transition-all ${
            theme === 'dark'
              ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500'
              : 'border-gray-300 focus:border-blue-500'
          }`}
        >
          <option value="all">Toutes catégories</option>
          {categories.map((category) => (
            <option key={category?.id} value={category?.slug}>
              {category?.name}
            </option>
          ))}
        </select>
      </div>

      {/* Liste des threads */}
      <div className="space-y-4">
        {filteredThreads.map((thread) => (
          <div 
            key={thread.id}
            className={`p-6 border rounded-xl transition-all hover:shadow-md ${
              theme === 'dark'
                ? 'border-slate-600 hover:border-slate-500 bg-slate-700/50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <h3 className="text-lg font-semibold theme-text">{thread.title}</h3>
                  {thread.complete && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Complet
                    </span>
                  )}
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    thread.status?.slug === 'published' 
                      ? 'bg-blue-100 text-blue-800'
                      : thread.status?.slug === 'draft'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {thread.status?.name || 'Non défini'}
                  </span>
                </div>
                
                <p className="theme-text-muted text-sm mb-4 line-clamp-2">
                  {thread.description || 'Aucune description disponible'}
                </p>
                
                <div className="flex items-center space-x-6 text-sm theme-text-muted">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(thread.created_at).toLocaleDateString('fr-FR')}</span>
                  </div>
                  
                  {thread.category && (
                    <div className="flex items-center space-x-1">
                      <Tag className="w-4 h-4" />
                      <span>{thread.category.name}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-1">
                    <Twitter className="w-4 h-4" />
                    <span>{thread.total_tweets || 0} tweets</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>{(thread.view_count || 0).toLocaleString()} vues</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Heart className="w-4 h-4" />
                    <span>{(thread.like_count || 0).toLocaleString()} likes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {filteredThreads.length === 0 && (
          <div className="text-center py-12 theme-text-muted">
            <Twitter className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">Aucun thread trouvé</p>
            <p className="text-sm">Essayez de modifier vos filtres de recherche</p>
          </div>
        )}
      </div>
    </div>
  )
}