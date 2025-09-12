import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Search as SearchIcon, X, AlertCircle } from 'lucide-react'
import { useSearch } from '../hooks/useData'
import { ThreadCard } from '../components/ThreadCard'
import { LoadingSpinner } from '../components/LoadingSpinner'

export function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const [query, setQuery] = useState(initialQuery)
  const { results, loading, error } = useSearch(query)

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery)
    }
  }, [initialQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      setSearchParams({ q: query.trim() })
    } else {
      setSearchParams({})
    }
  }

  const clearSearch = () => {
    setQuery('')
    setSearchParams({})
  }

  const hasResults = results.length > 0
  const hasQuery = query.trim().length > 0

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Link */}
      <Link 
        to="/" 
        className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium"
      >
        ← Retour à l'accueil
      </Link>

      {/* Search Header */}
      <div className="text-center py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Recherche dans les threads
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Recherchez dans les titres, thèmes et descriptions des threads de @loi200812
        </p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher par mots-clés (transparence, modernisation, Sénégal...)"
            className="w-full pl-12 pr-12 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none shadow-sm"
          />
          <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        
        <button
          type="submit"
          className="mt-4 w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
        >
          Rechercher
        </button>
      </form>

      {/* Search Results */}
      <div className="mt-8">
        {loading && (
          <div className="text-center py-8">
            <LoadingSpinner />
            <p className="text-gray-600 mt-4">Recherche en cours...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 mx-auto text-red-500 mb-4" />
            <p className="text-red-600 font-semibold mb-2">Erreur de recherche</p>
            <p className="text-gray-600">{error}</p>
          </div>
        )}

        {!loading && !error && hasQuery && (
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Résultats pour "{query}"
              </h2>
              <span className="text-sm text-gray-500">
                {results.length} thread{results.length !== 1 ? 's' : ''} trouvé{results.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        )}

        {!loading && !error && hasQuery && hasResults && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {results.map((thread) => (
              <ThreadCard key={thread.id} thread={thread} />
            ))}
          </div>
        )}

        {!loading && !error && hasQuery && !hasResults && (
          <div className="text-center py-12">
            <SearchIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucun résultat trouvé
            </h3>
            <p className="text-gray-600 mb-6">
              Essayez des mots-clés différents ou vérifiez l'orthographe.
            </p>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Suggestions :</p>
              <div className="flex flex-wrap justify-center gap-2">
                {['transparence', 'modernisation', 'Sénégal', 'institution', 'réforme'].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      setQuery(suggestion)
                      setSearchParams({ q: suggestion })
                    }}
                    className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {!hasQuery && (
          <div className="text-center py-12">
            <SearchIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Commencez votre recherche
            </h3>
            <p className="text-gray-600 mb-6">
              Tapez des mots-clés pour rechercher dans les threads.
            </p>
            <div className="space-y-4">
              <p className="text-sm text-gray-500 font-medium">Thèmes populaires :</p>
              <div className="flex flex-wrap justify-center gap-3">
                {[
                  { term: 'transparence', color: 'bg-blue-50 text-blue-700 hover:bg-blue-100' },
                  { term: 'modernisation', color: 'bg-green-50 text-green-700 hover:bg-green-100' },
                  { term: 'Sénégal', color: 'bg-purple-50 text-purple-700 hover:bg-purple-100' },
                  { term: 'institution', color: 'bg-orange-50 text-orange-700 hover:bg-orange-100' },
                  { term: 'réforme', color: 'bg-pink-50 text-pink-700 hover:bg-pink-100' }
                ].map(({ term, color }) => (
                  <button
                    key={term}
                    onClick={() => {
                      setQuery(term)
                      setSearchParams({ q: term })
                    }}
                    className={`px-4 py-2 rounded-full font-medium transition-colors ${color}`}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}