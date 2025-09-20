import { useState } from 'react'
import { Calendar, MapPin, User, Tag, Filter, X, ChevronDown } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import type { SearchFilters as SearchFiltersType } from '../../services/searchService'

interface SearchFiltersProps {
  filters: SearchFiltersType
  onFiltersChange: (filters: SearchFiltersType) => void
  facets?: {
    types: { [key: string]: number }
    themes: { [key: string]: number }
    locations: { [key: string]: number }
    authors: { [key: string]: number }
  }
  isOpen?: boolean
  onToggle?: () => void
}

export function SearchFilters({ 
  filters, 
  onFiltersChange, 
  facets,
  isOpen = false,
  onToggle 
}: SearchFiltersProps) {
  const { theme } = useTheme()
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['types']))

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(section)) {
      newExpanded.delete(section)
    } else {
      newExpanded.add(section)
    }
    setExpandedSections(newExpanded)
  }

  const updateFilters = (key: keyof SearchFiltersType, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  const toggleArrayFilter = (key: 'types' | 'themes' | 'locations' | 'authors', value: string) => {
    const currentArray = filters[key] || []
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value]
    
    updateFilters(key, newArray.length > 0 ? newArray : undefined)
  }

  const clearAllFilters = () => {
    onFiltersChange({})
  }

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && (Array.isArray(value) ? value.length > 0 : true)
  )

  const typeLabels = {
    thread: 'Articles Twitter',
    interview: 'Interviews',
    reportage: 'Reportages Photo',
    video: 'Vidéos Analyses',
    testimonial: 'Témoignages'
  }

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all ${
          hasActiveFilters
            ? theme === 'senegalais'
              ? 'bg-orange-100 border-orange-300 text-orange-800'
              : 'theme-primary-bg'
            : 'theme-surface theme-text theme-border hover:bg-gray-50'
        }`}
      >
        <Filter className="w-4 h-4" />
        <span>Filtres</span>
        {hasActiveFilters && (
          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
            theme === 'senegalais' ? 'bg-orange-500 text-white' : 'bg-blue-500 text-white'
          }`}>
            {Object.values(filters).filter(v => v !== undefined).length}
          </span>
        )}
      </button>
    )
  }

  return (
    <div className={`theme-surface rounded-xl border shadow-lg p-6 ${
      theme === 'senegalais' ? 'border-orange-200' : 'theme-border'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Filter className={`w-5 h-5 ${
            theme === 'senegalais' ? 'text-orange-600' : 'theme-text-muted'
          }`} />
          <h3 className="text-lg font-semibold theme-text">Filtres de recherche</h3>
        </div>
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-sm theme-text-muted hover:opacity-80 transition-colors"
            >
              Effacer tout
            </button>
          )}
          <button
            onClick={onToggle}
            className="p-1 theme-text-muted hover:opacity-80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Types de contenu */}
        <div>
          <button
            onClick={() => toggleSection('types')}
            className="flex items-center justify-between w-full text-left"
          >
            <div className="flex items-center space-x-2">
              <Tag className="w-4 h-4 theme-text-muted" />
              <span className="font-medium theme-text">Types de contenu</span>
            </div>
            <ChevronDown className={`w-4 h-4 theme-text-muted transition-transform ${
              expandedSections.has('types') ? 'rotate-180' : ''
            }`} />
          </button>
          
          {expandedSections.has('types') && (
            <div className="mt-3 space-y-2">
              {Object.entries(facets?.types || {}).map(([type, count]) => (
                <label key={type} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.types?.includes(type) || false}
                    onChange={() => toggleArrayFilter('types', type)}
                    className={`rounded border-gray-300 ${
                      theme === 'senegalais'
                        ? 'text-orange-600 focus:ring-orange-500'
                        : 'text-blue-600 focus:ring-blue-500'
                    }`}
                  />
                  <span className="theme-text">{typeLabels[type as keyof typeof typeLabels] || type}</span>
                  <span className="text-sm theme-text-muted">({count})</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Thèmes */}
        {facets?.themes && Object.keys(facets.themes).length > 0 && (
          <div>
            <button
              onClick={() => toggleSection('themes')}
              className="flex items-center justify-between w-full text-left"
            >
              <div className="flex items-center space-x-2">
                <Tag className="w-4 h-4 theme-text-muted" />
                <span className="font-medium theme-text">Thèmes</span>
              </div>
              <ChevronDown className={`w-4 h-4 theme-text-muted transition-transform ${
                expandedSections.has('themes') ? 'rotate-180' : ''
              }`} />
            </button>
            
            {expandedSections.has('themes') && (
              <div className="mt-3 space-y-2 max-h-40 overflow-y-auto">
                {Object.entries(facets.themes).map(([theme, count]) => (
                  <label key={theme} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.themes?.includes(theme) || false}
                      onChange={() => toggleArrayFilter('themes', theme)}
                      className={`rounded border-gray-300 ${
                        theme === 'senegalais'
                          ? 'text-orange-600 focus:ring-orange-500'
                          : 'text-blue-600 focus:ring-blue-500'
                      }`}
                    />
                    <span className="theme-text">{theme}</span>
                    <span className="text-sm theme-text-muted">({count})</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Lieux */}
        {facets?.locations && Object.keys(facets.locations).length > 0 && (
          <div>
            <button
              onClick={() => toggleSection('locations')}
              className="flex items-center justify-between w-full text-left"
            >
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 theme-text-muted" />
                <span className="font-medium theme-text">Lieux</span>
              </div>
              <ChevronDown className={`w-4 h-4 theme-text-muted transition-transform ${
                expandedSections.has('locations') ? 'rotate-180' : ''
              }`} />
            </button>
            
            {expandedSections.has('locations') && (
              <div className="mt-3 space-y-2 max-h-40 overflow-y-auto">
                {Object.entries(facets.locations).map(([location, count]) => (
                  <label key={location} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.locations?.includes(location) || false}
                      onChange={() => toggleArrayFilter('locations', location)}
                      className={`rounded border-gray-300 ${
                        theme === 'senegalais'
                          ? 'text-orange-600 focus:ring-orange-500'
                          : 'text-blue-600 focus:ring-blue-500'
                      }`}
                    />
                    <span className="theme-text">{location}</span>
                    <span className="text-sm theme-text-muted">({count})</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Auteurs */}
        {facets?.authors && Object.keys(facets.authors).length > 0 && (
          <div>
            <button
              onClick={() => toggleSection('authors')}
              className="flex items-center justify-between w-full text-left"
            >
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 theme-text-muted" />
                <span className="font-medium theme-text">Auteurs</span>
              </div>
              <ChevronDown className={`w-4 h-4 theme-text-muted transition-transform ${
                expandedSections.has('authors') ? 'rotate-180' : ''
              }`} />
            </button>
            
            {expandedSections.has('authors') && (
              <div className="mt-3 space-y-2 max-h-40 overflow-y-auto">
                {Object.entries(facets.authors).map(([author, count]) => (
                  <label key={author} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.authors?.includes(author) || false}
                      onChange={() => toggleArrayFilter('authors', author)}
                      className={`rounded border-gray-300 ${
                        theme === 'senegalais'
                          ? 'text-orange-600 focus:ring-orange-500'
                          : 'text-blue-600 focus:ring-blue-500'
                      }`}
                    />
                    <span className="theme-text">{author}</span>
                    <span className="text-sm theme-text-muted">({count})</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Plage de dates */}
        <div>
          <button
            onClick={() => toggleSection('dates')}
            className="flex items-center justify-between w-full text-left"
          >
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 theme-text-muted" />
              <span className="font-medium theme-text">Période</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${
              expandedSections.has('dates') ? 'rotate-180' : ''
            }`} />
          </button>
          
          {expandedSections.has('dates') && (
            <div className="mt-3 space-y-3">
              <div>
                <label className="block text-sm font-medium theme-text mb-1">
                  Date de début
                </label>
                <input
                  type="date"
                  value={filters.dateRange?.start || ''}
                  onChange={(e) => updateFilters('dateRange', {
                    ...filters.dateRange,
                    start: e.target.value || undefined
                  })}
                  className="w-full px-3 py-2 border theme-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium theme-text mb-1">
                  Date de fin
                </label>
                <input
                  type="date"
                  value={filters.dateRange?.end || ''}
                  onChange={(e) => updateFilters('dateRange', {
                    ...filters.dateRange,
                    end: e.target.value || undefined
                  })}
                  className="w-full px-3 py-2 border theme-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}