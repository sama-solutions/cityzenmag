import { useState, useMemo } from 'react'
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  X, 
  Camera, 
  Star,
  MapPin,
  User,
  Image as ImageIcon,
  Eye
} from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { usePhotoReports } from '../hooks/usePhotoReports'
import { PhotoReportCard } from '../components/photoReports/PhotoReportCard'
import { LoadingSpinner } from '../components/LoadingSpinner'
import type { PhotoReportCategory, PhotoReportFilters } from '../types/photoReports'

export function PhotoReports() {
  const { theme } = useTheme()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<PhotoReportCategory | ''>('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [selectedPhotographer, setSelectedPhotographer] = useState('')
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Construire les filtres
  const filters = useMemo((): PhotoReportFilters => {
    const result: PhotoReportFilters = {}
    
    if (searchTerm) result.search = searchTerm
    if (selectedCategory) result.category = selectedCategory
    if (selectedLocation) result.location = selectedLocation
    if (selectedPhotographer) result.photographer = selectedPhotographer
    if (showFeaturedOnly) result.featured = true
    
    return result
  }, [searchTerm, selectedCategory, selectedLocation, selectedPhotographer, showFeaturedOnly])

  const { reports, loading, error, stats } = usePhotoReports(filters)

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('')
    setSelectedLocation('')
    setSelectedPhotographer('')
    setShowFeaturedOnly(false)
  }

  const hasActiveFilters = searchTerm || selectedCategory || selectedLocation || selectedPhotographer || showFeaturedOnly

  const categories: { value: PhotoReportCategory; label: string }[] = [
    { value: 'investigation', label: 'Investigation' },
    { value: 'social', label: 'Social' },
    { value: 'culture', label: 'Culture' },
    { value: 'politique', label: 'Politique' },
    { value: 'economique', label: 'Économique' },
    { value: 'environnement', label: 'Environnement' },
    { value: 'portrait', label: 'Portrait' },
    { value: 'evenement', label: 'Événement' }
  ]

  if (loading) return <LoadingSpinner />
  
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <Camera className="w-12 h-12 mx-auto mb-3" />
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
          ? 'bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 border-4 border-emerald-400/20'
          : 'bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700'
      }`}>
        {/* Motif de fond */}
        {theme === 'senegalais' && (
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
              <rect x="10" y="10" width="15" height="10" fill="currentColor" className="text-white" rx="2"/>
              <rect x="70" y="20" width="12" height="8" fill="currentColor" className="text-white" rx="1"/>
              <rect x="30" y="70" width="18" height="12" fill="currentColor" className="text-white" rx="2"/>
              <rect x="80" y="75" width="10" height="7" fill="currentColor" className="text-white" rx="1"/>
            </svg>
          </div>
        )}
        
        <div className="relative text-center py-20 px-8">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl ${
            theme === 'senegalais'
              ? 'bg-gradient-to-br from-emerald-400 to-teal-600 border-4 border-white/20'
              : 'bg-white border-4 border-gray-300'
          }`}>
            <Camera className={`w-12 h-12 ${theme === 'senegalais' ? 'text-white' : 'text-black'}`} />
          </div>
          
          <h1 className="text-6xl font-bold text-white mb-6 tracking-tight font-sans">
            Reportages Photo
          </h1>
          
          <div className={`h-2 w-32 mx-auto mb-8 rounded-full ${
            theme === 'senegalais'
              ? 'bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-600'
              : 'bg-white'
          }`}></div>
          
          <p className={`text-2xl mb-10 max-w-4xl mx-auto leading-relaxed font-sans ${
            theme === 'senegalais' ? 'text-emerald-100' : 'text-gray-300'
          }`}>
            Découvrez le Sénégal à travers l'objectif de nos photographes
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-3xl mx-auto mt-16">
            <div className="text-center group">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform ${
                theme === 'senegalais' ? 'bg-emerald-400' : 'bg-white'
              }`}>
                <span className={`text-2xl font-bold ${
                  theme === 'senegalais' ? 'text-white' : 'text-black'
                }`}>{stats.totalReports}</span>
              </div>
              <div className={`text-xs uppercase tracking-widest font-bold ${
                theme === 'senegalais' ? 'text-emerald-200' : 'text-gray-400'
              }`}>Reportages</div>
            </div>
            
            <div className="text-center group">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform ${
                theme === 'senegalais' ? 'bg-teal-500' : 'bg-white'
              }`}>
                <span className={`text-2xl font-bold ${
                  theme === 'senegalais' ? 'text-white' : 'text-black'
                }`}>{stats.totalImages}</span>
              </div>
              <div className={`text-xs uppercase tracking-widest font-bold ${
                theme === 'senegalais' ? 'text-emerald-200' : 'text-gray-400'
              }`}>Photos</div>
            </div>
            
            <div className="text-center group">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform ${
                theme === 'senegalais' ? 'bg-cyan-600' : 'bg-white'
              }`}>
                <span className={`text-2xl font-bold ${
                  theme === 'senegalais' ? 'text-white' : 'text-black'
                }`}>{stats.photographersCount}</span>
              </div>
              <div className={`text-xs uppercase tracking-widest font-bold ${
                theme === 'senegalais' ? 'text-emerald-200' : 'text-gray-400'
              }`}>Photographes</div>
            </div>
            
            <div className="text-center group">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform ${
                theme === 'senegalais' ? 'bg-emerald-600' : 'bg-white'
              }`}>
                <span className={`text-2xl font-bold ${
                  theme === 'senegalais' ? 'text-white' : 'text-black'
                }`}>{Math.round(stats.averageViewCount / 100)}k</span>
              </div>
              <div className={`text-xs uppercase tracking-widest font-bold ${
                theme === 'senegalais' ? 'text-emerald-200' : 'text-gray-400'
              }`}>Vues Moy.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Filtres */}
      <div className={`p-6 rounded-2xl border ${
        theme === 'minimaliste' 
          ? 'bg-white border-gray-200' 
          : 'bg-white border-emerald-200/50'
      }`}>
        {/* Header des filtres */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold theme-text">Recherche et Filtres</h2>
            {hasActiveFilters && (
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                theme === 'senegalais' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {reports.length} résultat(s)
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
                      ? 'bg-emerald-600 text-white'
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
                      ? 'bg-emerald-600 text-white'
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
                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
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
            placeholder="Rechercher un reportage, photographe, lieu..."
            className={`w-full pl-12 pr-4 py-4 border rounded-2xl outline-none transition-all text-lg ${
              theme === 'minimaliste'
                ? 'border-gray-300 focus:border-black focus:ring-2 focus:ring-black/10'
                : 'border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
            }`}
          />
        </div>

        {/* Filtres avancés */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-in">
            {/* Catégories */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as PhotoReportCategory | '')}
              className={`px-4 py-3 border rounded-xl outline-none transition-all ${
                theme === 'minimaliste'
                  ? 'border-gray-300 focus:border-black'
                  : 'border-emerald-300 focus:border-emerald-500'
              }`}
            >
              <option value="">Toutes les catégories</option>
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>

            {/* Localisation */}
            <input
              type="text"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              placeholder="Lieu (ex: Dakar, Gorée...)"
              className={`px-4 py-3 border rounded-xl outline-none transition-all ${
                theme === 'minimaliste'
                  ? 'border-gray-300 focus:border-black'
                  : 'border-emerald-300 focus:border-emerald-500'
              }`}
            />

            {/* Photographe */}
            <input
              type="text"
              value={selectedPhotographer}
              onChange={(e) => setSelectedPhotographer(e.target.value)}
              placeholder="Photographe"
              className={`px-4 py-3 border rounded-xl outline-none transition-all ${
                theme === 'minimaliste'
                  ? 'border-gray-300 focus:border-black'
                  : 'border-emerald-300 focus:border-emerald-500'
              }`}
            />

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

      {/* Liste des reportages */}
      {reports.length > 0 ? (
        <div className={`${viewMode === 'grid' 
          ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8' 
          : 'space-y-6'
        }`}>
          {reports.map((report) => (
            <PhotoReportCard 
              key={report.id} 
              report={report} 
              compact={viewMode === 'list'}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg ${
            theme === 'senegalais' ? 'bg-gradient-to-br from-emerald-500 to-teal-500' : 'bg-gray-900'
          }`}>
            <Camera className="w-12 h-12 text-white" />
          </div>
          <p className="text-gray-500 text-xl font-sans mb-4">Aucun reportage trouvé</p>
          <p className="text-gray-400 font-sans mb-6">Essayez de modifier vos critères de recherche.</p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                theme === 'senegalais'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white'
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