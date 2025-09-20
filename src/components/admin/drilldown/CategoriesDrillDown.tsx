import { useState, useMemo } from 'react'
import { 
  FolderOpen, 
  Hash, 
  Search,
  Tag,
  Calendar,
  FileText,
  Eye,
  TrendingUp
} from 'lucide-react'
import { useAdminCategories } from '../../../hooks/useAdmin'
import { useThreads } from '../../../hooks/useData'
import { useTheme } from '../../../contexts/ThemeContext'

export function CategoriesDrillDown() {
  const { categories } = useAdminCategories()
  const { threads } = useThreads()
  const { theme } = useTheme()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'usage' | 'date'>('usage')

  // Calculer l'utilisation des catégories
  const categoriesWithStats = useMemo(() => {
    if (!categories || !threads) return []

    return categories.map(category => {
      const threadsInCategory = threads.filter(thread => thread.category?.id === category.id)
      const totalViews = threadsInCategory.reduce((sum, thread) => sum + (thread.view_count || 0), 0)
      const totalLikes = threadsInCategory.reduce((sum, thread) => sum + (thread.like_count || 0), 0)
      
      return {
        ...category,
        threadCount: threadsInCategory.length,
        totalViews,
        totalLikes,
        lastUsed: threadsInCategory.length > 0 
          ? Math.max(...threadsInCategory.map(t => new Date(t.created_at).getTime()))
          : 0
      }
    })
  }, [categories, threads])

  // Filtrer et trier
  const filteredCategories = useMemo(() => {
    let filtered = categoriesWithStats.filter(category => {
      if (searchTerm && !category.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false
      }
      return true
    })

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'date':
          return b.lastUsed - a.lastUsed
        case 'usage':
        default:
          return b.threadCount - a.threadCount
      }
    })

    return filtered
  }, [categoriesWithStats, searchTerm, sortBy])

  // Statistiques globales
  const stats = useMemo(() => {
    const totalCategories = filteredCategories.length
    const activeCategories = filteredCategories.filter(c => c.threadCount > 0).length
    const totalThreads = filteredCategories.reduce((sum, c) => sum + c.threadCount, 0)
    const avgThreadsPerCategory = totalCategories > 0 ? Math.round(totalThreads / totalCategories) : 0

    return { totalCategories, activeCategories, totalThreads, avgThreadsPerCategory }
  }, [filteredCategories])

  const getCategoryColor = (category: any) => {
    return category.color || '#6b7280'
  }

  return (
    <div className="space-y-6">
      {/* Statistiques rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`p-4 rounded-xl ${
          theme === 'dark' ? 'bg-slate-700' : 'bg-blue-50'
        }`}>
          <div className="flex items-center space-x-2">
            <FolderOpen className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium theme-text-muted">Total</span>
          </div>
          <div className="text-2xl font-bold theme-text">{stats.totalCategories}</div>
        </div>
        
        <div className={`p-4 rounded-xl ${
          theme === 'dark' ? 'bg-slate-700' : 'bg-green-50'
        }`}>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium theme-text-muted">Actives</span>
          </div>
          <div className="text-2xl font-bold theme-text">{stats.activeCategories}</div>
        </div>
        
        <div className={`p-4 rounded-xl ${
          theme === 'dark' ? 'bg-slate-700' : 'bg-purple-50'
        }`}>
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium theme-text-muted">Threads</span>
          </div>
          <div className="text-2xl font-bold theme-text">{stats.totalThreads}</div>
        </div>
        
        <div className={`p-4 rounded-xl ${
          theme === 'dark' ? 'bg-slate-700' : 'bg-orange-50'
        }`}>
          <div className="flex items-center space-x-2">
            <Hash className="w-5 h-5 text-orange-600" />
            <span className="text-sm font-medium theme-text-muted">Moyenne</span>
          </div>
          <div className="text-2xl font-bold theme-text">{stats.avgThreadsPerCategory}</div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 theme-text-muted" />
          <input
            type="text"
            placeholder="Rechercher une catégorie..."
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
          <option value="usage">Trier par utilisation</option>
          <option value="name">Trier par nom</option>
          <option value="date">Trier par dernière utilisation</option>
        </select>
      </div>

      {/* Liste des catégories */}
      <div className="space-y-4">
        {filteredCategories.map((category) => (
          <div 
            key={category.id}
            className={`p-6 border rounded-xl transition-all hover:shadow-md ${
              theme === 'dark'
                ? 'border-slate-600 hover:border-slate-500 bg-slate-700/50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: getCategoryColor(category) }}
                  />
                  <h3 className="text-lg font-semibold theme-text">{category.name}</h3>
                  
                  {category.hashtag && (
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      theme === 'dark' ? 'bg-slate-600 text-slate-200' : 'bg-gray-100 text-gray-800'
                    }`}>
                      <Hash className="w-3 h-3 mr-1" />
                      {category.hashtag}
                    </span>
                  )}
                  
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    category.threadCount > 0
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {category.threadCount} thread{category.threadCount !== 1 ? 's' : ''}
                  </span>
                </div>
                
                {category.description && (
                  <p className="theme-text-muted text-sm mb-4 line-clamp-2">
                    {category.description}
                  </p>
                )}
                
                <div className="flex items-center space-x-6 text-sm theme-text-muted">
                  <div className="flex items-center space-x-1">
                    <Tag className="w-4 h-4" />
                    <span>Catégorie {category.enabled ? 'active' : 'inactive'}</span>
                  </div>
                  
                  {category.threadCount > 0 && (
                    <>
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{category.totalViews.toLocaleString()} vues</span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Dernière utilisation: {new Date(category.lastUsed).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {filteredCategories.length === 0 && (
          <div className="text-center py-12 theme-text-muted">
            <FolderOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">Aucune catégorie trouvée</p>
            <p className="text-sm">Essayez de modifier vos filtres de recherche</p>
          </div>
        )}
      </div>
    </div>
  )
}