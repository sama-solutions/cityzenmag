import { useState, useMemo, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  Filter,
  SortAsc,
  SortDesc,
  Calendar,
  Hash,
  CheckCircle,
  Clock,
  Search,
  X,
  Grid,
  List,
  Video,
  Heart,
  ArrowRight,
  AlertCircle,
  SlidersHorizontal,
  TrendingUp,
  Eye,
  Twitter
} from 'lucide-react'
import { useThreads } from '../hooks/useData'
import { ThreadCard } from '../components/ThreadCard'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ThemeSelector } from '../components/ThemeSelector'
import { LayoutSelector, type LayoutType } from '../components/LayoutSelector'
import { ColumnLayout } from '../components/layouts/ColumnLayout'
import { useTheme } from '../contexts/ThemeContext'

type SortOption = 'date' | 'popularity' | 'title'
type ViewMode = 'grid' | 'list'

export function Home() {
  const { threads, loading, error } = useThreads()
  const { theme } = useTheme()
  const [searchParams, setSearchParams] = useSearchParams()
  
  // États des filtres
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [completionFilter, setCompletionFilter] = useState<'all' | 'complete' | 'partial'>(searchParams.get('completion') as any || 'all')
  const [sortBy, setSortBy] = useState<SortOption>(searchParams.get('sort') as SortOption || 'date')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [layoutType, setLayoutType] = useState<LayoutType>('grid')
  const [showFilters, setShowFilters] = useState(false)

  // Synchroniser avec l'URL
  useEffect(() => {
    const params = new URLSearchParams()
    if (searchTerm) params.set('search', searchTerm)
    if (selectedCategory) params.set('category', selectedCategory)
    if (completionFilter !== 'all') params.set('completion', completionFilter)
    if (sortBy !== 'date') params.set('sort', sortBy)
    
    setSearchParams(params)
  }, [searchTerm, selectedCategory, completionFilter, sortBy, setSearchParams])

  // Vérification des filtres actifs
  const hasActiveFilters = searchTerm || selectedCategory || completionFilter !== 'all' || sortBy !== 'date'

  // Article le plus récent pour la section Hero
  const latestThread = useMemo(() => {
    if (!threads || threads.length === 0) return null
    // Les threads sont déjà triés par date de publication Twitter (décroissant)
    return threads[0]
  }, [threads])

  // Filtres et tri en temps réel
  const filteredAndSortedThreads = useMemo(() => {
    if (!threads) return []
    
    let filtered = threads.filter(thread => {
      // Recherche textuelle
      const matchesSearch = !searchTerm || 
        thread.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        thread.description?.toLowerCase().includes(searchTerm.toLowerCase())
      
      // Filtrage par catégorie
      const matchesCategory = !selectedCategory || 
        thread.hashtags.some(tag => tag.toLowerCase().replace('#', '') === selectedCategory.toLowerCase())
      
      // Filtrage par complétion
      const matchesCompletion = 
        completionFilter === 'all' ||
        (completionFilter === 'complete' && thread.complete) ||
        (completionFilter === 'partial' && !thread.complete)
      
      return matchesSearch && matchesCategory && matchesCompletion
    })

    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date_created).getTime() - new Date(a.date_created).getTime()
        case 'popularity':
          const aPopularity = (a.like_count || 0) + (a.view_count || 0)
          const bPopularity = (b.like_count || 0) + (b.view_count || 0)
          return bPopularity - aPopularity
        case 'title':
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

    return filtered
  }, [threads, searchTerm, selectedCategory, completionFilter, sortBy])

  // Articles à afficher dans la grille (exclut l'article Hero si pas de filtres)
  const gridThreads = useMemo(() => {
    if (hasActiveFilters || !latestThread) {
      return filteredAndSortedThreads
    }
    // Si pas de filtres, exclure l'article Hero de la grille
    return filteredAndSortedThreads.slice(1)
  }, [filteredAndSortedThreads, hasActiveFilters, latestThread])

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('')
    setCompletionFilter('all')
    setSortBy('date')
  }

  if (loading) return <LoadingSpinner />
  if (error) return (
    <div className="text-center py-12">
      <div className="text-red-600 mb-4">
        <AlertCircle className="w-12 h-12 mx-auto mb-3" />
        <p className="text-lg font-semibold">Erreur de chargement</p>
        <p className="text-sm text-gray-600">{error}</p>
      </div>
    </div>
  )

  const completeThreads = threads?.filter(t => t.complete).length || 0
  const partialThreads = threads?.filter(t => !t.complete).length || 0
  const totalTweets = threads?.reduce((sum, t) => sum + t.total_tweets, 0) || 0

  return (
    <div className="space-y-8">
      {/* Hero Section - Magazine Style avec Article le Plus Récent */}
      <div className={`relative overflow-hidden rounded-3xl shadow-2xl ${
        theme === 'senegalais' 
          ? 'bg-gradient-to-br from-orange-800 via-blue-900 to-yellow-600 border-4 border-yellow-400/20'
          : 'bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700'
      }`}>
        {/* Sélecteur de thème en haut à droite */}
        <div className="absolute top-6 right-6 z-20">
          <ThemeSelector showLabel={false} variant="button" />
        </div>
        
        {/* Motif de fond */}
        {theme === 'senegalais' && (
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
              <path d="M50 80 L50 60 M45 65 Q50 55 55 65 M40 70 Q50 50 60 70 M35 75 Q50 45 65 75" 
                    stroke="currentColor" strokeWidth="0.5" fill="none" className="text-white"/>
              <circle cx="50" cy="85" r="3" fill="currentColor" className="text-white opacity-30"/>
            </svg>
          </div>
        )}
        
        <div className="relative px-8 py-12">
          {/* Header du Magazine */}
          <div className="text-center mb-12">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl ${
              theme === 'senegalais'
                ? 'bg-gradient-to-br from-yellow-400 to-orange-600 border-4 border-white/20'
                : 'bg-white border-4 border-gray-300'
            }`}>
              <svg className={`w-10 h-10 ${theme === 'senegalais' ? 'text-white' : 'text-black'}`} viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L15.09 5.09L19 4L18.18 7.82L22 9L18.18 10.18L19 14L15.09 12.91L12 16L8.91 12.91L5 14L5.82 10.18L2 9L5.82 7.82L5 4L8.91 5.09L12 2Z"/>
              </svg>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight font-sans">
              CityzenMag
            </h1>
            <div className={`h-2 w-24 mx-auto mb-6 rounded-full ${
              theme === 'senegalais'
                ? 'bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600'
                : 'bg-white'
            }`}></div>
            <p className={`text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed font-sans ${
              theme === 'senegalais' ? 'text-yellow-100' : 'text-gray-300'
            }`}>
              Le magazine digital de la transparence et de la modernisation institutionnelle au Sénégal
            </p>
            <div className={`mt-6 text-base font-sans ${
              theme === 'senegalais' ? 'text-yellow-300' : 'text-gray-300'
            }`}>
              Par <span className={`font-bold px-3 py-1 rounded-full ${
                theme === 'senegalais' ? 'text-white bg-orange-600/30' : 'text-black bg-white'
              }`}>@loi200812</span>
            </div>
          </div>

          {/* Article le Plus Récent Intégré */}
          {!hasActiveFilters && latestThread && (
            <div className={`relative overflow-hidden rounded-2xl shadow-xl border-2 mb-8 ${
              theme === 'senegalais' 
                ? 'bg-white/95 backdrop-blur-sm border-white/30'
                : 'bg-white/95 backdrop-blur-sm border-white/30'
            }`}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                {/* Contenu de l'article */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      theme === 'senegalais' 
                        ? 'bg-orange-600 text-white' 
                        : 'bg-black text-white'
                    }`}>
                      🔥 Dernier Article
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      latestThread.complete
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {latestThread.complete ? '✓ Complet' : '🔄 En cours'}
                    </span>
                  </div>
                  
                  <h2 className="text-2xl lg:text-3xl font-bold leading-tight text-gray-900">
                    {latestThread.title}
                  </h2>
                  
                  {latestThread.description && (
                    <p className="text-gray-700 leading-relaxed">
                      {latestThread.description.length > 150 
                        ? `${latestThread.description.substring(0, 150)}...` 
                        : latestThread.description}
                    </p>
                  )}
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>
                        {new Date(latestThread.date_created).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Twitter className="w-4 h-4" />
                      <span>{latestThread.total_tweets} tweets</span>
                    </div>
                    {latestThread.view_count && (
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{latestThread.view_count}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {latestThread.hashtags.slice(0, 2).map((tag, index) => (
                      <span key={index} className={`px-2 py-1 rounded-full text-xs font-medium ${
                        theme === 'senegalais'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <Link
                    to={`/thread/${latestThread.thread_id}`}
                    className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg font-bold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${
                      theme === 'senegalais'
                        ? 'bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white'
                        : 'bg-black hover:bg-gray-800 text-white'
                    }`}
                  >
                    <span>Lire l'article</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                
                {/* Image de l'article */}
                <div className="relative">
                  {latestThread.featured_image ? (
                    <div className="relative h-64 lg:h-full rounded-xl overflow-hidden shadow-lg">
                      <img
                        src={latestThread.featured_image.local_path || latestThread.featured_image.original_url}
                        alt={latestThread.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = latestThread.featured_image?.original_url || ''
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                  ) : (
                    <div className={`h-64 lg:h-full rounded-xl flex items-center justify-center ${
                      theme === 'senegalais'
                        ? 'bg-gradient-to-br from-orange-100 to-yellow-100'
                        : 'bg-gradient-to-br from-gray-100 to-gray-200'
                    }`}>
                      <div className="text-center">
                        <Twitter className={`w-12 h-12 mx-auto mb-3 ${
                          theme === 'senegalais' ? 'text-orange-600' : 'text-gray-600'
                        }`} />
                        <p className={`text-sm font-medium ${
                          theme === 'senegalais' ? 'text-orange-800' : 'text-gray-700'
                        }`}>
                          Thread Twitter
                        </p>
                        <p className={`text-xs ${
                          theme === 'senegalais' ? 'text-orange-600' : 'text-gray-500'
                        }`}>
                          {latestThread.total_tweets} tweets
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center group">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform ${
                theme === 'senegalais' ? 'bg-yellow-400' : 'bg-white'
              }`}>
                <span className={`text-2xl font-bold ${
                  theme === 'senegalais' ? 'text-orange-900' : 'text-black'
                }`}>{threads?.length || 0}</span>
              </div>
              <div className={`text-xs uppercase tracking-widest font-bold ${
                theme === 'senegalais' ? 'text-yellow-200' : 'text-gray-400'
              }`}>Articles</div>
            </div>
            <div className="text-center group">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform ${
                theme === 'senegalais' ? 'bg-orange-500' : 'bg-white'
              }`}>
                <span className={`text-2xl font-bold ${
                  theme === 'senegalais' ? 'text-white' : 'text-black'
                }`}>{totalTweets}</span>
              </div>
              <div className={`text-xs uppercase tracking-widest font-bold ${
                theme === 'senegalais' ? 'text-orange-200' : 'text-gray-400'
              }`}>Analyses</div>
            </div>
            <div className="text-center group">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform ${
                theme === 'senegalais' ? 'bg-blue-900' : 'bg-white'
              }`}>
                <span className={`text-2xl font-bold ${
                  theme === 'senegalais' ? 'text-yellow-400' : 'text-black'
                }`}>{completeThreads}</span>
              </div>
              <div className={`text-xs uppercase tracking-widest font-bold ${
                theme === 'senegalais' ? 'text-blue-200' : 'text-gray-400'
              }`}>Dossiers Complets</div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Filtres et Recherche */}
      <div className={`p-6 rounded-2xl border ${
        theme === 'minimaliste' 
          ? 'bg-white border-gray-200' 
          : 'bg-white border-orange-200/50'
      }`}>
        {/* Header des filtres */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold theme-text">Recherche et Filtres</h2>
            {hasActiveFilters && (
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                theme === 'senegalais' ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {filteredAndSortedThreads.length} résultat(s)
              </span>
            )}
            {!hasActiveFilters && latestThread && (
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                theme === 'senegalais' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
              }`}>
                Article le plus récent mis en avant
              </span>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {/* Layout Selector toujours visible */}
            <LayoutSelector 
              currentLayout={layoutType}
              onLayoutChange={setLayoutType}
            />
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                  theme === 'senegalais'
                    ? 'bg-orange-100 text-orange-800 hover:bg-orange-200'
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

        {/* Barre de recherche toujours visible */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 theme-text-muted" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher dans les articles..."
            className={`w-full pl-12 pr-4 py-4 border rounded-2xl outline-none transition-all text-lg ${
              theme === 'minimaliste'
                ? 'border-gray-300 focus:border-black focus:ring-2 focus:ring-black/10'
                : 'border-orange-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
            }`}
          />
        </div>

        {/* Filtres avancés */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-in">
            {/* Catégories */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`px-4 py-3 border rounded-xl outline-none transition-all ${
                theme === 'minimaliste'
                  ? 'border-gray-300 focus:border-black'
                  : 'border-orange-300 focus:border-orange-500'
              }`}
            >
              <option value="">Toutes les catégories</option>
              <option value="transparence-sn">#TransparenceSN</option>
              <option value="la-suite">#LaSuite</option>
              <option value="la-question-qui-derange">#LaQuestionQuiDérange</option>
            </select>

            {/* Complétion */}
            <select
              value={completionFilter}
              onChange={(e) => setCompletionFilter(e.target.value as any)}
              className={`px-4 py-3 border rounded-xl outline-none transition-all ${
                theme === 'minimaliste'
                  ? 'border-gray-300 focus:border-black'
                  : 'border-orange-300 focus:border-orange-500'
              }`}
            >
              <option value="all">Tous les articles</option>
              <option value="complete">Dossiers complets</option>
              <option value="partial">En cours</option>
            </select>

            {/* Tri */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className={`px-4 py-3 border rounded-xl outline-none transition-all ${
                theme === 'minimaliste'
                  ? 'border-gray-300 focus:border-black'
                  : 'border-orange-300 focus:border-orange-500'
              }`}
            >
              <option value="date">Plus récents</option>
              <option value="popularity">Plus populaires</option>
              <option value="title">Ordre alphabétique</option>
            </select>

            {/* Mode d'affichage (seulement pour layout grid) */}
            {layoutType === 'grid' && (
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium theme-text-muted">Vue:</span>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all ${
                    viewMode === 'grid'
                      ? theme === 'senegalais'
                        ? 'bg-orange-600 text-white'
                        : 'bg-black text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all ${
                    viewMode === 'list'
                      ? theme === 'senegalais'
                        ? 'bg-orange-600 text-white'
                        : 'bg-black text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Rubriques Magazine (uniquement si pas de filtres actifs) */}
      {!hasActiveFilters && theme === 'senegalais' && (
        <div className="mb-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-sans">
              Nos Rubriques
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-orange-600 via-yellow-500 to-blue-900 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* TransparenceSN */}
            <button
              onClick={() => setSelectedCategory('transparence-sn')}
              className="group relative bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl p-8 text-white shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-3 border-4 border-blue-700/30"
            >
              <div className="absolute top-4 right-4 opacity-20">
                <Hash className="w-16 h-16" />
              </div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center mb-6 shadow-lg border-3 border-white/20">
                  <Hash className="w-8 h-8 text-blue-900" />
                </div>
                <h3 className="text-2xl font-bold mb-4 font-sans">#TransparenceSN</h3>
                <p className="text-blue-100 leading-relaxed text-lg font-sans">
                  Investigations et analyses sur la transparence des institutions sénégalaises
                </p>
              </div>
            </button>
            
            {/* LaSuite */}
            <button
              onClick={() => setSelectedCategory('la-suite')}
              className="group relative bg-gradient-to-br from-orange-600 to-orange-800 rounded-2xl p-8 text-white shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-3 border-4 border-orange-500/30"
            >
              <div className="absolute top-4 right-4 opacity-20">
                <TrendingUp className="w-16 h-16" />
              </div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center mb-6 shadow-lg border-3 border-white/20">
                  <TrendingUp className="w-8 h-8 text-orange-900" />
                </div>
                <h3 className="text-2xl font-bold mb-4 font-sans">#LaSuite</h3>
                <p className="text-orange-100 leading-relaxed text-lg font-sans">
                  Dossiers spéciaux sur la modernisation et la réforme des institutions
                </p>
              </div>
            </button>
            
            {/* LaQuestionQuiDérange */}
            <button
              onClick={() => setSelectedCategory('la-question-qui-derange')}
              className="group relative bg-gradient-to-br from-yellow-600 to-yellow-800 rounded-2xl p-8 text-white shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-3 border-4 border-yellow-500/30"
            >
              <div className="absolute top-4 right-4 opacity-20">
                <Calendar className="w-16 h-16" />
              </div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-blue-900 rounded-2xl flex items-center justify-center mb-6 shadow-lg border-3 border-white/20">
                  <Calendar className="w-8 h-8 text-yellow-400" />
                </div>
                <h3 className="text-2xl font-bold mb-4 font-sans text-blue-900">#LaQuestionQuiDérange</h3>
                <p className="text-yellow-100 leading-relaxed text-lg font-sans">
                  Enquêtes citoyennes et questions constructives
                </p>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Section Articles avec Layout Dynamique */}
      {layoutType === 'columns' ? (
        <ColumnLayout threads={gridThreads} viewMode={viewMode} />
      ) : (
        <>
          {/* Header Articles */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
            <div>
              <h2 className="text-4xl font-bold theme-text font-sans mb-2">
                {hasActiveFilters ? 'Résultats de recherche' : 'Articles Récents'}
              </h2>
              <div className={`h-1 w-32 rounded-full ${
                theme === 'senegalais'
                  ? 'bg-gradient-to-r from-orange-600 to-yellow-500'
                  : 'bg-black'
              }`}></div>
            </div>
          </div>

          {/* Grille/Liste Articles */}
          {gridThreads.length > 0 ? (
            <div className={`${viewMode === 'grid' 
              ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8' 
              : 'space-y-6'
            }`}>
              {gridThreads.map((thread) => (
                <ThreadCard key={thread.id} thread={thread} viewMode={viewMode} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg ${
                theme === 'senegalais' ? 'bg-gradient-to-br from-orange-500 to-yellow-500' : 'bg-gray-900'
              }`}>
                <Eye className="w-12 h-12 text-white" />
              </div>
              <p className="text-gray-500 text-xl font-sans mb-4">Aucun article trouvé</p>
              <p className="text-gray-400 font-sans mb-6">Essayez de modifier vos filtres de recherche.</p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className={`px-6 py-3 rounded-xl font-bold transition-all ${
                    theme === 'senegalais'
                      ? 'bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white'
                      : 'bg-black hover:bg-gray-800 text-white'
                  }`}
                >
                  Effacer tous les filtres
                </button>
              )}
            </div>
          )}
        </>
      )}
      
      {/* CTA */}
      {!hasActiveFilters && (
        <div className={`text-center py-12 rounded-2xl border-2 ${
          theme === 'senegalais'
            ? 'bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200/50'
            : 'bg-gray-50 border-gray-200'
        }`}>
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg ${
            theme === 'senegalais'
              ? 'bg-gradient-to-br from-blue-900 to-blue-800'
              : 'bg-black'
          }`}>
            <Twitter className={`w-8 h-8 ${
              theme === 'senegalais' ? 'text-yellow-400' : 'text-white'
            }`} />
          </div>
          <p className={`mb-6 text-lg font-sans max-w-2xl mx-auto ${
            theme === 'senegalais' ? 'text-gray-700' : 'text-gray-600'
          }`}>
            Les threads sont automatiquement synchronisés depuis Twitter toutes les 6 heures pour vous offrir les analyses les plus récentes.
          </p>
          <Link 
            to="/search"
            className={`inline-flex items-center gap-3 px-8 py-4 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-sans ${
              theme === 'senegalais'
                ? 'bg-gradient-to-r from-orange-600 to-orange-700 text-white hover:from-orange-700 hover:to-orange-800'
                : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            <Calendar className="w-5 h-5" />
            Recherche avancée
          </Link>
        </div>
      )}
    </div>
  )
}
