import { Link } from 'react-router-dom'
import { Calendar, MapPin, User, Eye, Clock, ArrowRight } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import type { SearchResult } from '../../services/searchService'

interface SearchResultsProps {
  results: SearchResult[]
  query: string
  total: number
  executionTime: number
  isLoading?: boolean
}

export function SearchResults({ 
  results, 
  query, 
  total, 
  executionTime, 
  isLoading = false 
}: SearchResultsProps) {
  const { theme } = useTheme()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const getTypeIcon = (type: string) => {
    const icons = {
      thread: '📰',
      interview: '🎤',
      reportage: '📸',
      video: '🎥',
      testimonial: '💬'
    }
    return icons[type as keyof typeof icons] || '📄'
  }

  const getTypeLabel = (type: string) => {
    const labels = {
      thread: 'Article Twitter',
      interview: 'Interview',
      reportage: 'Reportage Photo',
      video: 'Vidéo Analyse',
      testimonial: 'Témoignage'
    }
    return labels[type as keyof typeof labels] || type
  }

  const getTypeColor = (type: string) => {
    const colors = {
      thread: theme === 'senegalais' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800',
      interview: 'bg-blue-100 text-blue-800',
      reportage: 'bg-green-100 text-green-800',
      video: 'bg-purple-100 text-purple-800',
      testimonial: 'bg-emerald-100 text-emerald-800'
    }
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
          <span className="text-4xl">🔍</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Aucun résultat trouvé
        </h3>
        <p className="text-gray-600 mb-6">
          Aucun contenu ne correspond à votre recherche "{query}"
        </p>
        <div className="space-y-2 text-sm text-gray-500">
          <p>Suggestions :</p>
          <ul className="space-y-1">
            <li>• Vérifiez l'orthographe de vos mots-clés</li>
            <li>• Essayez des termes plus généraux</li>
            <li>• Utilisez moins de mots-clés</li>
            <li>• Explorez les filtres pour élargir votre recherche</li>
          </ul>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Informations sur la recherche */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div>
          <span className="font-medium text-gray-900">{total.toLocaleString()}</span> résultat{total > 1 ? 's' : ''} 
          {query && (
            <>
              {' '}pour <span className="font-medium text-gray-900">"{query}"</span>
            </>
          )}
        </div>
        <div className="flex items-center space-x-1">
          <Clock className="w-4 h-4" />
          <span>{executionTime}ms</span>
        </div>
      </div>

      {/* Résultats */}
      <div className="space-y-4">
        {results.map((result) => (
          <div
            key={`${result.type}-${result.id}`}
            className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-md"
          >
            <Link to={result.url} className="block p-6">
              <div className="flex items-start space-x-4">
                {/* Image ou icône */}
                <div className="flex-shrink-0">
                  {result.image ? (
                    <img
                      src={result.image}
                      alt={result.title}
                      className="w-16 h-16 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  ) : (
                    <div className={`w-16 h-16 rounded-lg flex items-center justify-center text-2xl ${
                      theme === 'senegalais' ? 'bg-orange-100' : 'bg-gray-100'
                    }`}>
                      {getTypeIcon(result.type)}
                    </div>
                  )}
                </div>

                {/* Contenu */}
                <div className="flex-1 min-w-0">
                  {/* Header avec type et date */}
                  <div className="flex items-center space-x-3 mb-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(result.type)}`}>
                      {getTypeIcon(result.type)} {getTypeLabel(result.type)}
                    </span>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(result.date)}
                    </div>
                  </div>

                  {/* Titre */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {result.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 mb-3 line-clamp-2">
                    {result.description}
                  </p>

                  {/* Highlights */}
                  {result.highlights.length > 0 && (
                    <div className="mb-3">
                      {result.highlights.map((highlight, index) => (
                        <p
                          key={index}
                          className="text-sm text-gray-700 mb-1"
                          dangerouslySetInnerHTML={{ __html: highlight }}
                        />
                      ))}
                    </div>
                  )}

                  {/* Métadonnées */}
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    {result.author && (
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {result.author}
                      </div>
                    )}
                    {result.location && (
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {result.location}
                      </div>
                    )}
                    {result.theme && (
                      <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                        {result.theme}
                      </span>
                    )}
                  </div>
                </div>

                {/* Flèche */}
                <div className="flex-shrink-0 self-center">
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Message si plus de résultats */}
      {results.length < total && (
        <div className="text-center py-6">
          <p className="text-gray-600 mb-4">
            Affichage de {results.length} résultats sur {total.toLocaleString()}
          </p>
          <button className={`px-6 py-3 rounded-xl font-medium transition-all ${
            theme === 'senegalais'
              ? 'bg-orange-100 text-orange-800 hover:bg-orange-200'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}>
            Charger plus de résultats
          </button>
        </div>
      )}
    </div>
  )
}