import { useState, useMemo } from 'react'
import { 
  Edit3, 
  Eye, 
  Calendar, 
  Tag,
  Search,
  Clock,
  CheckCircle,
  Star,
  User,
  FileText
} from 'lucide-react'
import { useArticles } from '../../../hooks/useArticles'
import { useTheme } from '../../../contexts/ThemeContext'

interface ArticlesDrillDownProps {
  filterType?: 'all' | 'published' | 'draft' | 'featured'
}

export function ArticlesDrillDown({ filterType = 'all' }: ArticlesDrillDownProps) {
  const { articles } = useArticles()
  const { theme } = useTheme()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'status'>('date')

  // Filtrer et trier les articles
  const filteredArticles = useMemo(() => {
    if (!articles) return []

    let filtered = articles.filter(article => {
      // Filtre par type
      if (filterType === 'published' && article.status !== 'published') return false
      if (filterType === 'draft' && article.status !== 'draft') return false
      if (filterType === 'featured' && !article.featured) return false

      // Filtre par recherche
      if (searchTerm && !article.title.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false
      }

      return true
    })

    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title)
        case 'status':
          return a.status.localeCompare(b.status)
        case 'date':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

    return filtered
  }, [articles, filterType, searchTerm, sortBy])

  // Statistiques
  const stats = useMemo(() => {
    if (!filteredArticles.length) return { published: 0, draft: 0, featured: 0, totalWords: 0 }

    const published = filteredArticles.filter(a => a.status === 'published').length
    const draft = filteredArticles.filter(a => a.status === 'draft').length
    const featured = filteredArticles.filter(a => a.featured).length
    const totalWords = filteredArticles.reduce((sum, a) => {
      // Estimation du nombre de mots basée sur le contenu
      const wordCount = a.content ? a.content.split(' ').length : 0
      return sum + wordCount
    }, 0)

    return { published, draft, featured, totalWords }
  }, [filteredArticles])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800'
      case 'draft':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published':
        return <CheckCircle className="w-3 h-3 mr-1" />
      case 'draft':
        return <Clock className="w-3 h-3 mr-1" />
      default:
        return <FileText className="w-3 h-3 mr-1" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Statistiques rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`p-4 rounded-xl ${
          theme === 'dark' ? 'bg-slate-700' : 'bg-blue-50'
        }`}>
          <div className="flex items-center space-x-2">
            <Edit3 className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium theme-text-muted">Total</span>
          </div>
          <div className="text-2xl font-bold theme-text">{filteredArticles.length}</div>
        </div>
        
        <div className={`p-4 rounded-xl ${
          theme === 'dark' ? 'bg-slate-700' : 'bg-green-50'
        }`}>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium theme-text-muted">Publiés</span>
          </div>
          <div className="text-2xl font-bold theme-text">{stats.published}</div>
        </div>
        
        <div className={`p-4 rounded-xl ${
          theme === 'dark' ? 'bg-slate-700' : 'bg-yellow-50'
        }`}>
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-yellow-600" />
            <span className="text-sm font-medium theme-text-muted">Brouillons</span>
          </div>
          <div className="text-2xl font-bold theme-text">{stats.draft}</div>
        </div>
        
        <div className={`p-4 rounded-xl ${
          theme === 'dark' ? 'bg-slate-700' : 'bg-purple-50'
        }`}>
          <div className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium theme-text-muted">En vedette</span>
          </div>
          <div className="text-2xl font-bold theme-text">{stats.featured}</div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 theme-text-muted" />
          <input
            type="text"
            placeholder="Rechercher un article..."
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
          <option value="title">Trier par titre</option>
          <option value="status">Trier par statut</option>
        </select>
      </div>

      {/* Liste des articles */}
      <div className="space-y-4">
        {filteredArticles.map((article) => (
          <div 
            key={article.id}
            className={`p-6 border rounded-xl transition-all hover:shadow-md ${
              theme === 'dark'
                ? 'border-slate-600 hover:border-slate-500 bg-slate-700/50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <h3 className="text-lg font-semibold theme-text">{article.title}</h3>
                  
                  {article.featured && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      <Star className="w-3 h-3 mr-1" />
                      En vedette
                    </span>
                  )}
                  
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(article.status)}`}>
                    {getStatusIcon(article.status)}
                    {article.status === 'published' ? 'Publié' : 
                     article.status === 'draft' ? 'Brouillon' : article.status}
                  </span>
                </div>
                
                <p className="theme-text-muted text-sm mb-4 line-clamp-2">
                  {article.excerpt || 'Aucun extrait disponible'}
                </p>
                
                <div className="flex items-center space-x-6 text-sm theme-text-muted">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(article.createdAt).toLocaleDateString('fr-FR')}</span>
                  </div>
                  
                  {article.author && (
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{article.author}</span>
                    </div>
                  )}
                  
                  {article.category && (
                    <div className="flex items-center space-x-1">
                      <Tag className="w-4 h-4" />
                      <span>{article.category}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-1">
                    <FileText className="w-4 h-4" />
                    <span>{article.content ? Math.round(article.content.split(' ').length / 100) * 100 : 0} mots</span>
                  </div>
                  
                  {article.readTime && (
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{article.readTime} min de lecture</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {filteredArticles.length === 0 && (
          <div className="text-center py-12 theme-text-muted">
            <Edit3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">Aucun article trouvé</p>
            <p className="text-sm">Essayez de modifier vos filtres de recherche</p>
          </div>
        )}
      </div>
    </div>
  )
}