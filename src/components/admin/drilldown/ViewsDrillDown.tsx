import { useState, useMemo } from 'react'
import { 
  Eye, 
  TrendingUp, 
  Calendar, 
  Search,
  BarChart3,
  Clock,
  Hash
} from 'lucide-react'
import { useThreads } from '../../../hooks/useData'
import { useTheme } from '../../../contexts/ThemeContext'

export function ViewsDrillDown() {
  const { threads } = useThreads()
  const { theme } = useTheme()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'views' | 'date' | 'title'>('views')
  const [timeFilter, setTimeFilter] = useState<'all' | 'week' | 'month' | 'year'>('all')

  // Filtrer par période
  const filteredByTime = useMemo(() => {
    if (!threads) return []

    const now = new Date()
    const cutoffDate = new Date()

    switch (timeFilter) {
      case 'week':
        cutoffDate.setDate(now.getDate() - 7)
        break
      case 'month':
        cutoffDate.setMonth(now.getMonth() - 1)
        break
      case 'year':
        cutoffDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        return threads
    }

    return threads.filter(thread => new Date(thread.created_at) >= cutoffDate)
  }, [threads, timeFilter])

  // Filtrer et trier
  const filteredThreads = useMemo(() => {
    let filtered = filteredByTime.filter(thread => {
      if (searchTerm && !thread.title.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false
      }
      return true
    })

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title)
        case 'date':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case 'views':
        default:
          return (b.view_count || 0) - (a.view_count || 0)
      }
    })

    return filtered
  }, [filteredByTime, searchTerm, sortBy])

  // Statistiques
  const stats = useMemo(() => {
    const totalViews = filteredThreads.reduce((sum, t) => sum + (t.view_count || 0), 0)
    const avgViews = filteredThreads.length > 0 ? Math.round(totalViews / filteredThreads.length) : 0
    const topThread = filteredThreads[0]
    const viewsToday = filteredThreads
      .filter(t => {
        const today = new Date()
        const threadDate = new Date(t.created_at)
        return threadDate.toDateString() === today.toDateString()
      })
      .reduce((sum, t) => sum + (t.view_count || 0), 0)

    return { totalViews, avgViews, topThread, viewsToday, totalThreads: filteredThreads.length }
  }, [filteredThreads])

  // Données pour le graphique simple
  const chartData = useMemo(() => {
    const last7Days = []
    const now = new Date()
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      const dayThreads = filteredThreads.filter(t => {
        const threadDate = new Date(t.created_at)
        return threadDate.toDateString() === date.toDateString()
      })
      const dayViews = dayThreads.reduce((sum, t) => sum + (t.view_count || 0), 0)
      
      last7Days.push({
        date: date.toLocaleDateString('fr-FR', { weekday: 'short' }),
        views: dayViews,
        threads: dayThreads.length
      })
    }
    
    return last7Days
  }, [filteredThreads])

  const getViewsCategory = (views: number) => {
    if (views >= 10000) return { label: 'Viral', color: 'bg-red-100 text-red-800' }
    if (views >= 5000) return { label: 'Populaire', color: 'bg-orange-100 text-orange-800' }
    if (views >= 1000) return { label: 'Tendance', color: 'bg-yellow-100 text-yellow-800' }
    if (views >= 100) return { label: 'Modéré', color: 'bg-blue-100 text-blue-800' }
    return { label: 'Faible', color: 'bg-gray-100 text-gray-800' }
  }

  return (
    <div className="space-y-6">
      {/* Statistiques rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`p-4 rounded-xl ${
          theme === 'dark' ? 'bg-slate-700' : 'bg-blue-50'
        }`}>
          <div className="flex items-center space-x-2">
            <Eye className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium theme-text-muted">Total Vues</span>
          </div>
          <div className="text-2xl font-bold theme-text">{stats.totalViews.toLocaleString()}</div>
        </div>
        
        <div className={`p-4 rounded-xl ${
          theme === 'dark' ? 'bg-slate-700' : 'bg-green-50'
        }`}>
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium theme-text-muted">Moyenne</span>
          </div>
          <div className="text-2xl font-bold theme-text">{stats.avgViews.toLocaleString()}</div>
        </div>
        
        <div className={`p-4 rounded-xl ${
          theme === 'dark' ? 'bg-slate-700' : 'bg-purple-50'
        }`}>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium theme-text-muted">Threads</span>
          </div>
          <div className="text-2xl font-bold theme-text">{stats.totalThreads}</div>
        </div>
        
        <div className={`p-4 rounded-xl ${
          theme === 'dark' ? 'bg-slate-700' : 'bg-orange-50'
        }`}>
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-orange-600" />
            <span className="text-sm font-medium theme-text-muted">Aujourd'hui</span>
          </div>
          <div className="text-2xl font-bold theme-text">{stats.viewsToday.toLocaleString()}</div>
        </div>
      </div>

      {/* Graphique simple des 7 derniers jours */}
      <div className={`p-6 rounded-xl ${
        theme === 'dark' ? 'bg-slate-700' : 'bg-white border border-gray-200'
      }`}>
        <h3 className="text-lg font-bold theme-text mb-4">Vues des 7 derniers jours</h3>
        <div className="flex items-end space-x-2 h-32">
          {chartData.map((day, index) => {
            const maxViews = Math.max(...chartData.map(d => d.views))
            const height = maxViews > 0 ? (day.views / maxViews) * 100 : 0
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className={`w-full rounded-t transition-all hover:opacity-80 ${
                    theme === 'senegalais' ? 'bg-orange-500' :
                    theme === 'ocean' ? 'bg-cyan-500' :
                    theme === 'enterprise' ? 'bg-gray-600' :
                    'bg-blue-500'
                  }`}
                  style={{ height: `${height}%`, minHeight: '4px' }}
                  title={`${day.views} vues`}
                />
                <div className="text-xs theme-text-muted mt-2 text-center">
                  <div>{day.date}</div>
                  <div className="font-medium">{day.views}</div>
                </div>
              </div>
            )
          })}
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
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value as any)}
          className={`px-4 py-3 border rounded-xl outline-none transition-all ${
            theme === 'dark'
              ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500'
              : 'border-gray-300 focus:border-blue-500'
          }`}
        >
          <option value="all">Toute période</option>
          <option value="week">7 derniers jours</option>
          <option value="month">30 derniers jours</option>
          <option value="year">Dernière année</option>
        </select>
        
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className={`px-4 py-3 border rounded-xl outline-none transition-all ${
            theme === 'dark'
              ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500'
              : 'border-gray-300 focus:border-blue-500'
          }`}
        >
          <option value="views">Trier par vues</option>
          <option value="date">Trier par date</option>
          <option value="title">Trier par titre</option>
        </select>
      </div>

      {/* Liste des threads */}
      <div className="space-y-4">
        {filteredThreads.map((thread, index) => {
          const viewsCategory = getViewsCategory(thread.view_count || 0)
          
          return (
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
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                      index === 0 ? 'bg-yellow-100 text-yellow-800' :
                      index === 1 ? 'bg-gray-100 text-gray-800' :
                      index === 2 ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      #{index + 1}
                    </span>
                    
                    <h3 className="text-lg font-semibold theme-text">{thread.title}</h3>
                    
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${viewsCategory.color}`}>
                      {viewsCategory.label}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-6 text-sm theme-text-muted">
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span className="font-medium">{(thread.view_count || 0).toLocaleString()} vues</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(thread.created_at).toLocaleDateString('fr-FR')}</span>
                    </div>
                    
                    {thread.category && (
                      <div className="flex items-center space-x-1">
                        <Hash className="w-4 h-4" />
                        <span>{thread.category.name}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-4 h-4" />
                      <span>{thread.total_tweets || 0} tweets</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold theme-text">
                    {(thread.view_count || 0).toLocaleString()}
                  </div>
                  <div className="text-sm theme-text-muted">vues</div>
                </div>
              </div>
            </div>
          )
        })}
        
        {filteredThreads.length === 0 && (
          <div className="text-center py-12 theme-text-muted">
            <Eye className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">Aucun thread trouvé</p>
            <p className="text-sm">Essayez de modifier vos filtres de recherche</p>
          </div>
        )}
      </div>
    </div>
  )
}