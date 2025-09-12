import { useState, useMemo } from 'react'
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  X, 
  Mic, 
  Video, 
  Star,
  Clock,
  Users,
  TrendingUp,
  Eye
} from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { useInterviews } from '../hooks/useInterviews'
import { InterviewCard } from '../components/interviews/InterviewCard'
import { LoadingSpinner } from '../components/LoadingSpinner'
import type { InterviewCategory, InterviewFilters } from '../types/interviews'

export function Interviews() {
  const { theme } = useTheme()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<InterviewCategory | ''>('')
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Construire les filtres
  const filters = useMemo((): InterviewFilters => {
    const result: InterviewFilters = {}
    
    if (searchTerm) result.search = searchTerm
    if (selectedCategory) result.category = selectedCategory
    if (showFeaturedOnly) result.featured = true
    
    return result
  }, [searchTerm, selectedCategory, showFeaturedOnly])

  const { interviews, loading, error, stats } = useInterviews(filters)

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('')
    setShowFeaturedOnly(false)
  }

  const hasActiveFilters = searchTerm || selectedCategory || showFeaturedOnly

  const categories: { value: InterviewCategory; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { value: 'politique', label: 'Politique', icon: Users },
    { value: 'economique', label: 'Économique', icon: TrendingUp },
    { value: 'social', label: 'Social', icon: Users },
    { value: 'culturel', label: 'Culturel', icon: Star },
    { value: 'education', label: 'Éducation', icon: Users },
    { value: 'sante', label: 'Santé', icon: Users },
    { value: 'environnement', label: 'Environnement', icon: Users },
    { value: 'justice', label: 'Justice', icon: Users }
  ]

  if (loading) return <LoadingSpinner />
  
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <Mic className="w-12 h-12 mx-auto mb-3" />
          <p className="text-lg font-semibold">Erreur de chargement</p>
          <p className="text-sm text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className={`relative overflow-hidden rounded-3xl shadow-2xl ${
        theme === 'senegalais' 
          ? 'bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 border-4 border-blue-400/20'
          : 'bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700'
      }`}>
        {/* Motif de fond */}
        {theme === 'senegalais' && (
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
              <circle cx="20" cy="20" r="2" fill="currentColor" className="text-white"/>
              <circle cx="80" cy="30" r="1.5" fill="currentColor" className="text-white"/>
              <circle cx="60" cy="70" r="2.5" fill="currentColor" className="text-white"/>
              <circle cx="30" cy="80" r="1" fill="currentColor" className="text-white"/>
            </svg>
          </div>
        )}
        
        <div className="relative text-center py-20 px-8">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl ${
            theme === 'senegalais'
              ? 'bg-gradient-to-br from-purple-400 to-blue-600 border-4 border-white/20'
              : 'bg-white border-4 border-gray-300'
          }`}>
            <Mic className={`w-12 h-12 ${theme === 'senegalais' ? 'text-white' : 'text-black'}`} />
          </div>
          
          <h1 className="text-6xl font-bold text-white mb-6 tracking-tight font-sans">
            Interviews
          </h1>
          
          <div className={`h-2 w-32 mx-auto mb-8 rounded-full ${
            theme === 'senegalais'
              ? 'bg-gradient-to-r from-purple-400 via-blue-500 to-indigo-600'
              : 'bg-white'
          }`}></div>
          
          <p className={`text-2xl mb-10 max-w-4xl mx-auto leading-relaxed font-sans ${
            theme === 'senegalais' ? 'text-blue-100' : 'text-gray-300'
          }`}>
            Découvrez les témoignages et analyses d'experts sur la transparence et la gouvernance
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-3xl mx-auto mt-16">
            <div className="text-center group">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform ${
                theme === 'senegalais' ? 'bg-purple-400' : 'bg-white'
              }`}>
                <span className={`text-2xl font-bold ${
                  theme === 'senegalais' ? 'text-white' : 'text-black'
                }`}>{stats.totalInterviews}</span>
              </div>
              <div className={`text-xs uppercase tracking-widest font-bold ${
                theme === 'senegalais' ? 'text-blue-200' : 'text-gray-400'
              }`}>Interviews</div>
            </div>
            
            <div className="text-center group">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform ${
                theme === 'senegalais' ? 'bg-blue-500' : 'bg-white'
              }`}>
                <span className={`text-2xl font-bold ${
                  theme === 'senegalais' ? 'text-white' : 'text-black'
                }`}>{Math.round(stats.totalDuration / 60)}h</span>
              </div>
              <div className={`text-xs uppercase tracking-widest font-bold ${
                theme === 'senegalais' ? 'text-blue-200' : 'text-gray-400'
              }`}>Contenu</div>
            </div>
            
            <div className="text-center group">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform ${
                theme === 'senegalais' ? 'bg-indigo-600' : 'bg-white'
              }`}>
                <span className={`text-2xl font-bold ${
                  theme === 'senegalais' ? 'text-white' : 'text-black'
                }`}>{stats.featuredCount}</span>
              </div>
              <div className={`text-xs uppercase tracking-widest font-bold ${
                theme === 'senegalais' ? 'text-blue-200' : 'text-gray-400'
              }`}>À la Une</div>
            </div>
            
            <div className="text-center group">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform ${
                theme === 'senegalais' ? 'bg-purple-600' : 'bg-white'
              }`}>
                <span className={`text-2xl font-bold ${
                  theme === 'senegalais' ? 'text-white' : 'text-black'
                }`}>{Math.round(stats.averageViewCount / 100)}k</span>
              </div>
              <div className={`text-xs uppercase tracking-widest font-bold ${
                theme === 'senegalais' ? 'text-blue-200' : 'text-gray-400'
              }`}>Vues Moy.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Filtres */}
      <div className={`p-6 rounded-2xl border ${
        theme === 'minimaliste' 
          ? 'bg-white border-gray-200' 
          : 'bg-white border-purple-200/50'
      }`}>
        {/* Header des filtres */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold theme-text">Recherche et Filtres</h2>
            {hasActiveFilters && (
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                theme === 'senegalais' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {interviews.length} résultat(s)
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Mode d'affichage */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all ${
                  viewMode === 'grid'
                    ? theme === 'senegalais'
                      ? 'bg-purple-600 text-white'
                      : 'bg-black text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                </div>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all ${
                  viewMode === 'list'
                    ? theme === 'senegalais'
                      ? 'bg-purple-600 text-white'
                      : 'bg-black text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <div className="space-y-1 w-4 h-4">
                  <div className="bg-current h-0.5 rounded"></div>
                  <div className="bg-current h-0.5 rounded"></div>
                  <div className="bg-current h-0.5 rounded"></div>
                </div>
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                  theme === 'senegalais'
                    ? 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filtres</span>
              </button>
              
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-all"
                >
                  <X className="w-4 h-4" />
                  <span>Effacer</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Barre de recherche */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 theme-text-muted" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher une interview, un interviewé, un sujet..."
            className={`w-full pl-12 pr-4 py-4 border rounded-2xl outline-none transition-all text-lg ${
              theme === 'minimaliste'
                ? 'border-gray-300 focus:border-black focus:ring-2 focus:ring-black/10'
                : 'border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20'
            }`}
          />
        </div>

        {/* Filtres avancés */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
            {/* Catégories */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as InterviewCategory | '')}
              className={`px-4 py-3 border rounded-xl outline-none transition-all ${
                theme === 'minimaliste'
                  ? 'border-gray-300 focus:border-black'
                  : 'border-purple-300 focus:border-purple-500'
              }`}
            >
              <option value="">Toutes les catégories</option>
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>

            {/* Featured */}
            <label className="flex items-center space-x-3 px-4 py-3 border rounded-xl cursor-pointer transition-all hover:bg-gray-50">
              <input
                type="checkbox"
                checked={showFeaturedOnly}
                onChange={(e) => setShowFeaturedOnly(e.target.checked)}
                className="rounded"
              />
              <span className="flex items-center space-x-2">
                <Star className="w-4 h-4" />
                <span>À la une uniquement</span>
              </span>
            </label>

            {/* Type de média */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium theme-text-muted">Type:</span>
              <button className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                theme === 'senegalais'
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-gray-100 text-gray-700'
              }`}>
                <Mic className="w-4 h-4" />
                <span>Audio</span>
              </button>
              <button className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                theme === 'senegalais'
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-gray-100 text-gray-700'
              }`}>
                <Video className="w-4 h-4" />
                <span>Vidéo</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Liste des interviews */}
      {interviews.length > 0 ? (
        <div className={`${viewMode === 'grid' 
          ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8' 
          : 'space-y-6'
        }`}>
          {interviews.map((interview) => (
            <InterviewCard 
              key={interview.id} 
              interview={interview} 
              compact={viewMode === 'list'}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg ${
            theme === 'senegalais' ? 'bg-gradient-to-br from-purple-500 to-blue-500' : 'bg-gray-900'
          }`}>
            <Mic className="w-12 h-12 text-white" />
          </div>
          <p className="text-gray-500 text-xl font-sans mb-4">Aucune interview trouvée</p>
          <p className="text-gray-400 font-sans mb-6">Essayez de modifier vos critères de recherche.</p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                theme === 'senegalais'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
                  : 'bg-black hover:bg-gray-800 text-white'
              }`}
            >
              Effacer tous les filtres
            </button>
          )}
        </div>
      )}
    </div>
  )
}