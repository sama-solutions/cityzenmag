import { Link } from 'react-router-dom'
import { Calendar, User, Tag, Eye, Heart, Clock, CheckCircle, Star } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

interface Article {
  id: string
  title: string
  content: string
  description?: string
  theme?: string
  hashtags: string[]
  category_id?: string
  status: 'draft' | 'published' | 'archived'
  is_featured: boolean
  featured_image?: string
  author: string
  published_date?: string
  created_at: string
  updated_at: string
}

interface ArticleCardProps {
  article: Article
  viewMode?: 'grid' | 'list'
  compact?: boolean
  index?: number
}

export function ArticleCard({ article, viewMode = 'grid', compact = false, index }: ArticleCardProps) {
  const { theme } = useTheme()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength).trim() + '...'
  }

  const stripHtml = (html: string) => {
    const tmp = document.createElement('div')
    tmp.innerHTML = html
    return tmp.textContent || tmp.innerText || ''
  }

  const getExcerpt = (content: string, maxLength: number = 150) => {
    const textContent = stripHtml(content)
    return truncateText(textContent, maxLength)
  }

  const baseClasses = `group relative bg-white rounded-2xl shadow-lg border transition-all duration-300 hover:shadow-xl overflow-hidden ${
    theme === 'senegalais'
      ? 'border-orange-200/50 hover:border-orange-300'
      : 'border-gray-200 hover:border-gray-300'
  }`

  // Mode compact pour les colonnes
  if (compact) {
    return (
      <Link to={`/article/${article.id}`} className={`relative ${baseClasses} hover:-translate-y-1`}>
        {/* Badge de numérotation pour mode compact */}
        {index && (
          <div className="absolute top-2 right-2 z-10">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-lg ${
              theme === 'senegalais'
                ? 'bg-gradient-to-br from-orange-600 to-yellow-500 text-white border border-white/20'
                : 'bg-black text-white border border-gray-300'
            }`}>
              {index}
            </div>
          </div>
        )}
        
        {/* Badge featured */}
        {article.is_featured && (
          <div className="absolute top-2 left-2 z-10">
            <div className={`px-2 py-1 rounded-full text-xs font-bold ${
              theme === 'senegalais'
                ? 'bg-yellow-400 text-orange-900'
                : 'bg-yellow-400 text-black'
            }`}>
              <Star className="w-3 h-3 inline mr-1" />
              Vedette
            </div>
          </div>
        )}
        
        {/* Image compacte si disponible */}
        {article.featured_image && (
          <div className="relative">
            <img 
              src={article.featured_image}
              alt={article.title}
              className="w-full h-32 object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
          </div>
        )}
        
        <div className="p-4 space-y-3">
          {/* Header compact */}
          <div className="flex items-start justify-between">
            <h3 className={`text-base font-bold leading-tight line-clamp-2 flex-1 pr-2 ${
              theme === 'senegalais' ? 'text-gray-900 group-hover:text-orange-600' : 'text-gray-900 group-hover:text-black'
            }`}>
              {article.title}
            </h3>
            <div className={`flex-shrink-0 px-2 py-1 rounded-full text-xs font-medium ${
              article.status === 'published'
                ? theme === 'senegalais'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-green-100 text-green-800'
                : theme === 'senegalais'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-yellow-100 text-yellow-800'
            }`}>
              {article.status === 'published' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
            </div>
          </div>

          {/* Description compacte */}
          {article.description && (
            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
              {truncateText(article.description, 80)}
            </p>
          )}

          {/* Métadonnées compactes */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-2">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(article.published_date || article.created_at)}</span>
            </div>
            {article.theme && (
              <span className={`px-2 py-1 rounded-full ${
                theme === 'senegalais'
                  ? 'bg-orange-100 text-orange-700'
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {article.theme}
              </span>
            )}
          </div>
        </div>
      </Link>
    )
  }

  // Mode liste
  if (viewMode === 'list') {
    return (
      <Link to={`/article/${article.id}`} className={`${baseClasses} hover:-translate-y-1`}>
        {/* Badge de numérotation */}
        {index && (
          <div className="absolute top-4 right-4 z-10">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-lg ${
              theme === 'senegalais'
                ? 'bg-gradient-to-br from-orange-600 to-yellow-500 text-white border border-white/20'
                : 'bg-black text-white border border-gray-300'
            }`}>
              {index}
            </div>
          </div>
        )}

        <div className="flex items-center space-x-6 p-6">
          {/* Image miniature */}
          {article.featured_image && (
            <div className="flex-shrink-0">
              <img
                src={article.featured_image}
                alt={article.title}
                className="w-24 h-24 object-cover rounded-xl"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                }}
              />
            </div>
          )}

          {/* Contenu */}
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between">
              <h3 className={`text-xl font-bold leading-tight group-hover:${
                theme === 'senegalais' ? 'text-orange-600' : 'text-black'
              } transition-colors`}>
                {article.title}
              </h3>
              
              <div className="flex items-center space-x-2 ml-4">
                {article.is_featured && (
                  <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                    theme === 'senegalais'
                      ? 'bg-yellow-400 text-orange-900'
                      : 'bg-yellow-400 text-black'
                  }`}>
                    <Star className="w-3 h-3 inline mr-1" />
                    Vedette
                  </div>
                )}
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  article.status === 'published'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {article.status === 'published' ? (
                    <>
                      <CheckCircle className="w-3 h-3 inline mr-1" />
                      Publié
                    </>
                  ) : (
                    <>
                      <Clock className="w-3 h-3 inline mr-1" />
                      Brouillon
                    </>
                  )}
                </div>
              </div>
            </div>

            {article.description && (
              <p className="text-gray-600 leading-relaxed">
                {truncateText(article.description, 200)}
              </p>
            )}

            {/* Métadonnées */}
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(article.published_date || article.created_at)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <User className="w-4 h-4" />
                <span>Par {article.author.split('@')[0]}</span>
              </div>
              {article.theme && (
                <div className="flex items-center space-x-1">
                  <Tag className="w-4 h-4" />
                  <span>{article.theme}</span>
                </div>
              )}
            </div>

            {/* Hashtags */}
            {article.hashtags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {article.hashtags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      theme === 'senegalais'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
                {article.hashtags.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{article.hashtags.length - 3} autres
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>
    )
  }

  // Mode grille (par défaut)
  return (
    <Link to={`/article/${article.id}`} className={`${baseClasses} hover:-translate-y-2`}>
      {/* Badge de numérotation */}
      {index && (
        <div className="absolute top-4 right-4 z-10">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-lg ${
            theme === 'senegalais'
              ? 'bg-gradient-to-br from-orange-600 to-yellow-500 text-white border border-white/20'
              : 'bg-black text-white border border-gray-300'
          }`}>
            {index}
          </div>
        </div>
      )}

      {/* Badge featured */}
      {article.is_featured && (
        <div className="absolute top-4 left-4 z-10">
          <div className={`px-3 py-1 rounded-full text-xs font-bold ${
            theme === 'senegalais'
              ? 'bg-yellow-400 text-orange-900'
              : 'bg-yellow-400 text-black'
          }`}>
            <Star className="w-3 h-3 inline mr-1" />
            Vedette
          </div>
        </div>
      )}

      {/* Image */}
      {article.featured_image && (
        <div className="relative">
          <img
            src={article.featured_image}
            alt={article.title}
            className="w-full h-48 object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
      )}

      {/* Contenu */}
      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="space-y-2">
          <h3 className={`text-xl font-bold leading-tight group-hover:${
            theme === 'senegalais' ? 'text-orange-600' : 'text-black'
          } transition-colors`}>
            {article.title}
          </h3>
          
          {article.description && (
            <p className="text-gray-600 leading-relaxed line-clamp-3">
              {article.description}
            </p>
          )}
        </div>

        {/* Métadonnées */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(article.published_date || article.created_at)}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            {article.theme && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                theme === 'senegalais'
                  ? 'bg-orange-100 text-orange-700'
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {article.theme}
              </span>
            )}
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
              article.status === 'published'
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {article.status === 'published' ? (
                <CheckCircle className="w-3 h-3 inline" />
              ) : (
                <Clock className="w-3 h-3 inline" />
              )}
            </div>
          </div>
        </div>

        {/* Hashtags */}
        {article.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {article.hashtags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  theme === 'senegalais'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {tag}
              </span>
            ))}
            {article.hashtags.length > 3 && (
              <span className="text-xs text-gray-500">
                +{article.hashtags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <User className="w-3 h-3" />
              <span>Par {article.author.split('@')[0]}</span>
            </div>
            <span>Article éditorial</span>
          </div>
        </div>
      </div>
    </Link>
  )
}