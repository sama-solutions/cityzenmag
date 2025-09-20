import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X, Clock, TrendingUp, Filter } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { searchService } from '../../services/searchService'

interface AdvancedSearchBarProps {
  initialQuery?: string
  onSearch?: (query: string) => void
  showFilters?: boolean
  placeholder?: string
  size?: 'sm' | 'md' | 'lg'
}

export function AdvancedSearchBar({ 
  initialQuery = '', 
  onSearch, 
  showFilters = false,
  placeholder = 'Rechercher articles, interviews, reportages...',
  size = 'md'
}: AdvancedSearchBarProps) {
  const [query, setQuery] = useState(initialQuery)
  const [isOpen, setIsOpen] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [popularSearches, setPopularSearches] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  
  const { theme } = useTheme()
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Charger l'historique et les recherches populaires
  useEffect(() => {
    setSearchHistory(searchService.getSearchHistory())
    setPopularSearches(searchService.getPopularSearches())
  }, [])

  // Gérer les clics en dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Générer des suggestions en temps réel
  useEffect(() => {
    if (query.length > 2) {
      setIsLoading(true)
      const timer = setTimeout(async () => {
        try {
          const response = await searchService.search({ 
            query, 
            limit: 5 
          })
          setSuggestions(response.suggestions)
        } catch (error) {
          console.error('Erreur suggestions:', error)
        } finally {
          setIsLoading(false)
        }
      }, 300)

      return () => clearTimeout(timer)
    } else {
      setSuggestions([])
      setIsLoading(false)
    }
  }, [query])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      performSearch(query.trim())
    }
  }

  const performSearch = (searchQuery: string) => {
    setQuery(searchQuery)
    setIsOpen(false)
    
    if (onSearch) {
      onSearch(searchQuery)
    } else {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
    }

    // Mettre à jour l'historique
    setSearchHistory(searchService.getSearchHistory())
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    setIsOpen(value.length > 0 || searchHistory.length > 0)
  }

  const handleInputFocus = () => {
    setIsOpen(true)
  }

  const clearQuery = () => {
    setQuery('')
    setIsOpen(false)
    inputRef.current?.focus()
  }

  const selectSuggestion = (suggestion: string) => {
    performSearch(suggestion)
  }

  // Styles selon la taille
  const sizeClasses = {
    sm: 'h-10 text-sm',
    md: 'h-12 text-base',
    lg: 'h-14 text-lg'
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  return (
    <div className="relative w-full max-w-2xl" ref={dropdownRef}>
      {/* Barre de recherche */}
      <form onSubmit={handleSubmit} className="relative">
        <div className={`relative flex items-center ${sizeClasses[size]} ${
          theme === 'senegalais'
            ? 'bg-white border-2 border-orange-300 focus-within:border-yellow-400'
            : 'theme-surface border theme-border focus-within:border-blue-500'
        } rounded-xl shadow-lg transition-all duration-200`}>
          
          {/* Icône de recherche */}
          <div className="flex items-center justify-center pl-4">
            <Search className={`${iconSizes[size]} ${
              theme === 'senegalais' ? 'text-orange-600' : 'theme-text-muted'
            }`} />
          </div>

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setIsOpen(false)
              }
            }}
            placeholder={placeholder}
            className={`flex-1 px-4 py-0 bg-transparent border-none outline-none ${sizeClasses[size]} theme-text placeholder-gray-500`}
          />

          {/* Bouton clear */}
          {query && (
            <button
              type="button"
              onClick={clearQuery}
              className="flex items-center justify-center pr-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className={iconSizes[size]} />
            </button>
          )}

          {/* Bouton filtres */}
          {showFilters && (
            <button
              type="button"
              className={`flex items-center justify-center px-3 border-l ${
                theme === 'senegalais'
                  ? 'border-orange-200 text-orange-600 hover:bg-orange-50'
                  : 'border theme-border theme-text-muted hover:bg-gray-50'
              } transition-colors`}
            >
              <Filter className={iconSizes[size]} />
            </button>
          )}

          {/* Bouton submit */}
          <button
            type="submit"
            disabled={!query.trim()}
            className={`flex items-center justify-center px-4 rounded-r-xl transition-all ${
              query.trim()
                ? theme === 'senegalais'
                  ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white hover:from-orange-600 hover:to-yellow-600'
                  : 'theme-primary-bg'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Search className={iconSizes[size]} />
          </button>
        </div>
      </form>

      {/* Dropdown avec suggestions */}
      {isOpen && (
        <div className={`absolute top-full left-0 right-0 mt-2 theme-surface rounded-xl shadow-xl border z-50 max-h-96 overflow-y-auto ${
          theme === 'senegalais' ? 'border-orange-200' : 'theme-border'
        }`}>
          
          {/* Loading */}
          {isLoading && (
            <div className="p-4 text-center theme-text-muted">
              <div className="animate-spin w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full mx-auto"></div>
              <p className="mt-2 text-sm">Recherche en cours...</p>
            </div>
          )}

          {/* Suggestions de recherche */}
          {!isLoading && suggestions.length > 0 && (
            <div className="p-2">
              <div className="px-3 py-2 text-xs font-semibold theme-text-muted uppercase tracking-wide">
                Suggestions
              </div>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => selectSuggestion(suggestion)}
                  className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors theme-text"
                >
                  <Search className="w-4 h-4 theme-text-muted" />
                  <span className="theme-text">{suggestion}</span>
                </button>
              ))}
            </div>
          )}

          {/* Historique des recherches */}
          {!isLoading && query.length === 0 && searchHistory.length > 0 && (
            <div className="p-2 border-t theme-border">
              <div className="px-3 py-2 text-xs font-semibold theme-text-muted uppercase tracking-wide flex items-center space-x-2">
                <Clock className="w-3 h-3" />
                <span>Recherches récentes</span>
              </div>
              {searchHistory.slice(0, 5).map((historyItem, index) => (
                <button
                  key={index}
                  onClick={() => selectSuggestion(historyItem)}
                  className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors theme-text"
                >
                  <Clock className="w-4 h-4 theme-text-muted" />
                  <span className="theme-text">{historyItem}</span>
                </button>
              ))}
            </div>
          )}

          {/* Recherches populaires */}
          {!isLoading && query.length === 0 && popularSearches.length > 0 && (
            <div className="p-2 border-t theme-border">
              <div className="px-3 py-2 text-xs font-semibold theme-text-muted uppercase tracking-wide flex items-center space-x-2">
                <TrendingUp className="w-3 h-3" />
                <span>Recherches populaires</span>
              </div>
              {popularSearches.slice(0, 5).map((popularItem, index) => (
                <button
                  key={index}
                  onClick={() => selectSuggestion(popularItem)}
                  className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors theme-text"
                >
                  <TrendingUp className="w-4 h-4 theme-text-muted" />
                  <span className="theme-text">{popularItem}</span>
                </button>
              ))}
            </div>
          )}

          {/* Message si aucun résultat */}
          {!isLoading && query.length > 2 && suggestions.length === 0 && (
            <div className="p-4 text-center theme-text-muted">
              <Search className="w-8 h-8 mx-auto mb-2 theme-text-muted" />
              <p className="text-sm theme-text">Aucune suggestion trouvée</p>
              <p className="text-xs theme-text-muted mt-1">Essayez des mots-clés différents</p>
            </div>
          )}

          {/* Raccourcis clavier */}
          <div className="p-3 border-t theme-border bg-gray-50">
            <div className="flex items-center justify-between text-xs theme-text-muted">
              <span>Appuyez sur Entrée pour rechercher</span>
              <span>Échap pour fermer</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}