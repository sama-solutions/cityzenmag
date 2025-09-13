import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { ArrowLeft, SlidersHorizontal, RotateCcw } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { useAdvancedSearch } from '../hooks/useAdvancedSearch'
import { AdvancedSearchBar } from '../components/search/AdvancedSearchBar'
import { SearchFilters } from '../components/search/SearchFilters'
import { SearchResults } from '../components/search/SearchResults'
import type { SearchFilters as SearchFiltersType } from '../services/searchService'

export function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const [query, setQuery] = useState(initialQuery)
  const [filters, setFilters] = useState<SearchFiltersType>({})
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'popularity'>('relevance')
  
  const { theme } = useTheme()
  const {
    search,
    results,
    total,
    suggestions,
    facets,
    executionTime,
    isLoading,
    error,
    isIndexed
  } = useAdvancedSearch()

  // Effectuer la recherche quand les paramètres changent
  useEffect(() => {
    if (query.trim() && isIndexed) {
      search({
        query: query.trim(),
        filters,
        sortBy,
        limit: 20
      })
    }
  }, [query, filters, sortBy, search, isIndexed])

  // Synchroniser avec l'URL
  useEffect(() => {
    if (initialQuery && initialQuery !== query) {
      setQuery(initialQuery)
    }
  }, [initialQuery])

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery)
    setSearchParams({ q: newQuery })
  }

  const handleFiltersChange = (newFilters: SearchFiltersType) => {
    setFilters(newFilters)
  }

  const clearAllFilters = () => {
    setFilters({})
    setQuery('')
    setSearchParams({})
  }

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && (Array.isArray(value) ? value.length > 0 : true)
  )

  const hasQuery = query.trim().length > 0

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/" 
            className={`inline-flex items-center space-x-2 font-medium transition-colors mb-6 ${
              theme === 'senegalais'
                ? 'text-orange-600 hover:text-orange-800'
                : 'text-blue-600 hover:text-blue-800'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à l'accueil</span>
          </Link>

          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Recherche Avancée
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Recherchez dans tous les contenus : articles Twitter, interviews, reportages photo, vidéos analyses et témoignages citoyens
            </p>
          </div>

          {/* Barre de recherche principale */}
          <div className="max-w-4xl mx-auto">
            <AdvancedSearchBar
              initialQuery={query}
              onSearch={handleSearch}
              size="lg"
              placeholder="Rechercher dans tous les contenus..."
            />
          </div>
        </div>

        {/* Contenu principal */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar avec filtres */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Bouton filtres mobile */}
              <div className="lg:hidden">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl border transition-all ${
                    hasActiveFilters
                      ? theme === 'senegalais'
                        ? 'bg-orange-100 border-orange-300 text-orange-800'
                        : 'bg-blue-100 border-blue-300 text-blue-800'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <SlidersHorizontal className="w-5 h-5" />
                  <span>Filtres</span>
                  {hasActiveFilters && (
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      theme === 'senegalais' ? 'bg-orange-500 text-white' : 'bg-blue-500 text-white'
                    }`}>
                      {Object.values(filters).filter(v => v !== undefined).length}
                    </span>
                  )}
                </button>
              </div>

              {/* Filtres */}
              <div className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
                <SearchFilters
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  facets={facets}
                  isOpen={true}
                />
              </div>

              {/* Options de tri */}
              {hasQuery && (
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Trier par</h3>
                  <div className="space-y-2">
                    {[
                      { value: 'relevance', label: 'Pertinence' },
                      { value: 'date', label: 'Date' },
                      { value: 'popularity', label: 'Popularité' }
                    ].map(option => (
                      <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="sortBy"
                          value={option.value}
                          checked={sortBy === option.value}
                          onChange={(e) => setSortBy(e.target.value as any)}
                          className={`${
                            theme === 'senegalais'
                              ? 'text-orange-600 focus:ring-orange-500'
                              : 'text-blue-600 focus:ring-blue-500'
                          }`}
                        />
                        <span className="text-gray-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Bouton reset */}
              {(hasQuery || hasActiveFilters) && (
                <button
                  onClick={clearAllFilters}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Réinitialiser</span>
                </button>
              )}
            </div>
          </div>

          {/* Résultats */}
          <div className="lg:col-span-3">
            {!isIndexed && (
              <div className="text-center py-12">
                <div className="animate-spin w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600">Indexation du contenu en cours...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <p className="text-red-800 font-semibold mb-2">Erreur de recherche</p>
                <p className="text-red-600">{error}</p>
              </div>
            )}

            {isIndexed && !error && (
              <>
                {hasQuery ? (
                  <SearchResults
                    results={results}
                    query={query}
                    total={total}
                    executionTime={executionTime}
                    isLoading={isLoading}
                  />
                ) : (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-4xl">🔍</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Commencez votre recherche
                    </h3>
                    <p className="text-gray-600 mb-8">
                      Utilisez la barre de recherche pour explorer tous nos contenus
                    </p>
                    
                    {/* Suggestions de recherche */}
                    <div className="space-y-6">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-3">Recherches populaires :</p>
                        <div className="flex flex-wrap justify-center gap-3">
                          {[
                            'transparence gouvernementale',
                            'corruption Sénégal',
                            'modernisation administration',
                            'accès information publique',
                            'gouvernance locale'
                          ].map((suggestion) => (
                            <button
                              key={suggestion}
                              onClick={() => handleSearch(suggestion)}
                              className={`px-4 py-2 rounded-full font-medium transition-all ${
                                theme === 'senegalais'
                                  ? 'bg-orange-100 text-orange-800 hover:bg-orange-200'
                                  : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                              }`}
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-3">Explorer par type :</p>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                          {[
                            { type: 'thread', label: 'Articles Twitter', icon: '📰' },
                            { type: 'interview', label: 'Interviews', icon: '🎤' },
                            { type: 'reportage', label: 'Reportages', icon: '📸' },
                            { type: 'video', label: 'Vidéos', icon: '🎥' },
                            { type: 'testimonial', label: 'Témoignages', icon: '💬' }
                          ].map(({ type, label, icon }) => (
                            <button
                              key={type}
                              onClick={() => {
                                setFilters({ types: [type] })
                                handleSearch('*')
                              }}
                              className="p-4 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-all text-center"
                            >
                              <div className="text-2xl mb-2">{icon}</div>
                              <div className="text-sm font-medium text-gray-900">{label}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}