import { useState, useMemo } from 'react'
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  X, 
  Video, 
  Star,
  User,
  Clock,
  Eye,
  Play
} from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { useVideoAnalyses } from '../hooks/useVideoAnalyses'
import { VideoAnalysisCard } from '../components/videoAnalyses/VideoAnalysisCard'
import { LoadingSpinner } from '../components/LoadingSpinner'
import type { VideoAnalysisCategory, VideoAnalysisFilters } from '../types/videoAnalyses'

export function VideoAnalyses() {
  const { theme } = useTheme()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<VideoAnalysisCategory | ''>('')
  const [selectedSpeaker, setSelectedSpeaker] = useState('')
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false)
  const [durationFilter, setDurationFilter] = useState<'all' | 'short' | 'medium' | 'long'>('all')
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Construire les filtres
  const filters = useMemo((): VideoAnalysisFilters => {
    const result: VideoAnalysisFilters = {}
    
    if (searchTerm) result.search = searchTerm
    if (selectedCategory) result.category = selectedCategory
    if (selectedSpeaker) result.speaker = selectedSpeaker
    if (showFeaturedOnly) result.featured = true
    
    // Filtre de durée
    if (durationFilter !== 'all') {
      switch (durationFilter) {
        case 'short':
          result.duration = { min: 0, max: 20 }
          break
        case 'medium':
          result.duration = { min: 20, max: 45 }
          break
        case 'long':
          result.duration = { min: 45, max: 999 }
          break
      }
    }
    
    return result
  }, [searchTerm, selectedCategory, selectedSpeaker, showFeaturedOnly, durationFilter])

  const { videos, loading, error, stats } = useVideoAnalyses(filters)

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('')
    setSelectedSpeaker('')
    setShowFeaturedOnly(false)
    setDurationFilter('all')
  }

  const hasActiveFilters = searchTerm || selectedCategory || selectedSpeaker || showFeaturedOnly || durationFilter !== 'all'

  const categories: { value: VideoAnalysisCategory; label: string }[] = [
    { value: 'politique', label: 'Politique' },
    { value: 'economique', label: 'Économique' },
    { value: 'social', label: 'Social' },
    { value: 'juridique', label: 'Juridique' },
    { value: 'international', label: 'International' },
    { value: 'education', label: 'Éducation' },
    { value: 'sante', label: 'Santé' },
    { value: 'environnement', label: 'Environnement' },
    { value: 'technologie', label: 'Technologie' },
    { value: 'culture', label: 'Culture' }
  ]

  const formatTotalDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    return `${hours}h`
  }

  if (loading) return <LoadingSpinner />
  
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <Video className="w-12 h-12 mx-auto mb-3" />
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
          ? 'bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 border-4 border-indigo-400/20'
          : 'bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700'
      }`}>
        {/* Motif de fond */}
        {theme === 'senegalais' && (
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
              <polygon points="20,20 30,10 40,20 30,30" fill="currentColor" className="text-white"/>
              <polygon points="70,25 80,15 90,25 80,35" fill="currentColor" className="text-white"/>
              <polygon points="15,70 25,60 35,70 25,80" fill="currentColor" className="text-white"/>
              <polygon points="75,75 85,65 95,75 85,85" fill="currentColor" className="text-white"/>
            </svg>
          </div>
        )}
        
        <div className="relative text-center py-20 px-8">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl ${
            theme === 'senegalais'
              ? 'bg-gradient-to-br from-indigo-400 to-purple-600 border-4 border-white/20'
              : 'bg-white border-4 border-gray-300'
          }`}>
            <Video className={`w-12 h-12 ${theme === 'senegalais' ? 'text-white' : 'text-black'}`} />
          </div>
          
          <h1 className="text-6xl font-bold text-white mb-6 tracking-tight font-sans">
            Vidéos Analyses
          </h1>
          
          <div className={`h-2 w-32 mx-auto mb-8 rounded-full ${
            theme === 'senegalais'
              ? 'bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-600'
              : 'bg-white'
          }`}></div>
          
          <p className={`text-2xl mb-10 max-w-4xl mx-auto leading-relaxed font-sans ${
            theme === 'senegalais' ? 'text-indigo-100' : 'text-gray-300'
          }`}>
            Analyses approfondies et décryptages d'experts sur l'actualité sénégalaise
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-3xl mx-auto mt-16">
            <div className="text-center group">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform ${
                theme === 'senegalais' ? 'bg-indigo-400' : 'bg-white'
              }`}>
                <span className={`text-2xl font-bold ${
                  theme === 'senegalais' ? 'text-white' : 'text-black'
                }`}>{stats.totalVideos}</span>
              </div>
              <div className={`text-xs uppercase tracking-widest font-bold ${
                theme === 'senegalais' ? 'text-indigo-200' : 'text-gray-400'
              }`}>Vidéos</div>
            </div>
            
            <div className="text-center group">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform ${
                theme === 'senegalais' ? 'bg-purple-500' : 'bg-white'
              }`}>
                <span className={`text-2xl font-bold ${
                  theme === 'senegalais' ? 'text-white' : 'text-black'
                }`}>{formatTotalDuration(stats.totalDuration)}</span>
              </div>
              <div className={`text-xs uppercase tracking-widest font-bold ${
                theme === 'senegalais' ? 'text-indigo-200' : 'text-gray-400'
              }`}>Contenu</div>
            </div>
            
            <div className="text-center group">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform ${
                theme === 'senegalais' ? 'bg-pink-600' : 'bg-white'
              }`}>
                <span className={`text-2xl font-bold ${
                  theme === 'senegalais' ? 'text-white' : 'text-black'
                }`}>{stats.speakersCount}</span>
              </div>
              <div className={`text-xs uppercase tracking-widest font-bold ${
                theme === 'senegalais' ? 'text-indigo-200' : 'text-gray-400'
              }`}>Experts</div>
            </div>
            
            <div className="text-center group">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform ${
                theme === 'senegalais' ? 'bg-indigo-600' : 'bg-white'
              }`}>
                <span className={`text-2xl font-bold ${
                  theme === 'senegalais' ? 'text-white' : 'text-black'
                }`}>{Math.round(stats.totalViews / 1000)}k</span>
              </div>
              <div className={`text-xs uppercase tracking-widest font-bold ${
                theme === 'senegalais' ? 'text-indigo-200' : 'text-gray-400'
              }`}>Vues</div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Filtres */}
      <div className={`p-6 rounded-2xl border ${
        theme === 'minimaliste' 
          ? 'bg-white border-gray-200' 
          : 'bg-white border-indigo-200/50'
      }`}>
        {/* Header des filtres */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold theme-text">Recherche et Filtres</h2>
            {hasActiveFilters && (
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                theme === 'senegalais' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {videos.length} résultat(s)
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
                      ? 'bg-indigo-600 text-white'
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
                      ? 'bg-indigo-600 text-white'
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
                    ? 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200'
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
            placeholder="Rechercher une vidéo, expert, sujet..."
            className={`w-full pl-12 pr-4 py-4 border rounded-2xl outline-none transition-all text-lg ${
              theme === 'minimaliste'
                ? 'border-gray-300 focus:border-black focus:ring-2 focus:ring-black/10'
                : 'border-indigo-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
            }`}
          />
        </div>

        {/* Filtres avancés */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-in">
            {/* Catégories */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as VideoAnalysisCategory | '')}
              className={`px-4 py-3 border rounded-xl outline-none transition-all ${
                theme === 'minimaliste'
                  ? 'border-gray-300 focus:border-black'
                  : 'border-indigo-300 focus:border-indigo-500'
              }`}
            >
              <option value="">Toutes les catégories</option>
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>

            {/* Expert */}
            <input
              type="text"
              value={selectedSpeaker}
              onChange={(e) => setSelectedSpeaker(e.target.value)}
              placeholder="Expert / Intervenant"
              className={`px-4 py-3 border rounded-xl outline-none transition-all ${
                theme === 'minimaliste'
                  ? 'border-gray-300 focus:border-black'
                  : 'border-indigo-300 focus:border-indigo-500'
              }`}
            />

            {/* Durée */}
            <select
              value={durationFilter}
              onChange={(e) => setDurationFilter(e.target.value as 'all' | 'short' | 'medium' | 'long')}
              className={`px-4 py-3 border rounded-xl outline-none transition-all ${
                theme === 'minimaliste'
                  ? 'border-gray-300 focus:border-black'
                  : 'border-indigo-300 focus:border-indigo-500'
              }`}
            >
              <option value="all">Toutes durées</option>
              <option value="short">Court (&lt; 20min)</option>
              <option value="medium">Moyen (20-45min)</option>
              <option value="long">Long (&gt; 45min)</option>
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
          </div>
        )}
      </div>

      {/* Liste des vidéos */}
      {videos.length > 0 ? (
        <div className={`${viewMode === 'grid' 
          ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8' 
          : 'space-y-6'
        }`}>
          {videos.map((video) => (
            <VideoAnalysisCard 
              key={video.id} 
              video={video} 
              compact={viewMode === 'list'}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg ${
            theme === 'senegalais' ? 'bg-gradient-to-br from-indigo-500 to-purple-500' : 'bg-gray-900'
          }`}>
            <Video className="w-12 h-12 text-white" />
          </div>
          <p className="text-gray-500 text-xl font-sans mb-4">Aucune vidéo trouvée</p>
          <p className="text-gray-400 font-sans mb-6">Essayez de modifier vos critères de recherche.</p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                theme === 'senegalais'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white'
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