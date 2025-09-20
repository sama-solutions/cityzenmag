import { useState, useMemo, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { 
  Twitter, 
  Hash, 
  Calendar, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Eye, 
  Filter, 
  Search,
  X,
  SlidersHorizontal,
  ArrowUpDown,
  Grid,
  List,
  Settings,
  ArrowRight,
  Heart,
  MessageCircle
} from 'lucide-react'
import { useThreads } from '../hooks/useData'
import { useAdminCategories } from '../hooks/useAdmin'
import { useArticles } from '../hooks/useArticles'
import { useSiteSettings } from '../contexts/SiteSettingsContext'
import { ThreadCard } from '../components/ThreadCard'
import { ArticleCard } from '../components/ArticleCard'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ThemeSelector } from '../components/ThemeSelector'
import { LayoutSelector, type LayoutType } from '../components/LayoutSelector'
import { TabSystem, type TabType } from '../components/TabSystem'
import { ContentSidebar } from '../components/ContentSidebar'
import { useTheme } from '../contexts/ThemeContext'

type SortOption = 'date' | 'popularity' | 'title'
type ViewMode = 'grid' | 'list'

// Configuration des 3 catégories
const categories = [
  {
    id: 'transparence-sn',
    name: 'TransparenceSN',
    hashtag: '#TransparenceSN',
    description: 'Investigations et analyses sur la transparence des institutions sénégalaises',
    color: 'blue',
    gradient: 'from-blue-900 to-blue-800',
    borderColor: 'border-blue-700/30',
    iconBg: 'bg-yellow-400',
    iconColor: 'text-blue-900',
    textColor: 'text-blue-100'
  },
  {
    id: 'la-suite',
    name: 'La Suite',
    hashtag: '#LaSuite',
    description: 'Dossiers spéciaux sur la modernisation et la réforme des institutions',
    color: 'orange',
    gradient: 'from-orange-600 to-orange-800',
    borderColor: 'border-orange-500/30',
    iconBg: 'bg-yellow-400',
    iconColor: 'text-orange-900',
    textColor: 'text-orange-100'
  },
  {
    id: 'la-question-qui-derange',
    name: 'La Question Qui Dérange',
    hashtag: '#LaQuestionQuiDérange',
    description: 'Enquêtes citoyennes et questions constructives',
    color: 'yellow',
    gradient: 'from-yellow-600 to-yellow-800',
    borderColor: 'border-yellow-500/30',
    iconBg: 'bg-blue-900',
    iconColor: 'text-yellow-400',
    textColor: 'text-yellow-100'
  }
]

export function Home() {
  const { threads, loading: threadsLoading, error: threadsError } = useThreads()
  const { articles, loading: articlesLoading, getPublishedArticles } = useArticles()
  const { categories: adminCategories } = useAdminCategories()
  const { settings } = useSiteSettings()
  const { theme } = useTheme()
  const [searchParams, setSearchParams] = useSearchParams()
  
  // État de l'onglet actif
  const [activeTab, setActiveTab] = useState<TabType>(
    (searchParams.get('tab') as TabType) || 'tweets'
  )
  
  // États des filtres
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [completionFilter, setCompletionFilter] = useState<'all' | 'complete' | 'partial'>(searchParams.get('completion') as any || 'all')
  const [sortBy, setSortBy] = useState<SortOption>(searchParams.get('sort') as SortOption || 'date')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [showFilters, setShowFilters] = useState(false)
  
  // Layout selector
  const [currentLayout, setCurrentLayout] = useState<LayoutType>('grid')

  // Synchroniser avec l'URL
  useEffect(() => {
    const params = new URLSearchParams()
    if (searchTerm) params.set('search', searchTerm)
    if (selectedCategory) params.set('category', selectedCategory)
    if (completionFilter !== 'all') params.set('completion', completionFilter)
    if (sortBy !== 'date') params.set('sort', sortBy)
    if (activeTab !== 'tweets') params.set('tab', activeTab)
    
    setSearchParams(params)
  }, [searchTerm, selectedCategory, completionFilter, sortBy, activeTab, setSearchParams])

  // Gestion du changement d'onglet
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab)
    // Réinitialiser les filtres lors du changement d'onglet
    setSearchTerm('')
    setSelectedCategory('')
    setCompletionFilter('all')
    setSortBy('date')
  }

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

  // Filtres et tri pour les articles
  const filteredAndSortedArticles = useMemo(() => {
    const publishedArticles = getPublishedArticles()
    if (!publishedArticles) return []
    
    let filtered = publishedArticles.filter(article => {
      // Recherche textuelle
      const matchesSearch = !searchTerm || 
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.description?.toLowerCase().includes(searchTerm.toLowerCase())
      
      // Filtrage par catégorie (utiliser le thème comme catégorie)
      const matchesCategory = !selectedCategory || 
        article.theme?.toLowerCase().replace(/\s+/g, '-') === selectedCategory.toLowerCase()
      
      return matchesSearch && matchesCategory
    })

    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.published_date || b.created_at).getTime() - new Date(a.published_date || a.created_at).getTime()
        case 'title':
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

    return filtered
  }, [getPublishedArticles, searchTerm, selectedCategory, sortBy])

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('')
    setCompletionFilter('all')
    setSortBy('date')
  }

  const hasActiveFilters = searchTerm || selectedCategory || completionFilter !== 'all' || sortBy !== 'date'
  
  // Gestion du chargement et des erreurs
  const loading = activeTab === 'tweets' ? threadsLoading : articlesLoading
  const error = activeTab === 'tweets' ? threadsError : null
  const currentData = activeTab === 'tweets' ? filteredAndSortedThreads : filteredAndSortedArticles

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

  // Récupérer le contenu croisé pour la hero section
  const latestThread = threads && threads.length > 0 ? threads[0] : null
  const latestArticle = getPublishedArticles().length > 0 ? getPublishedArticles()[0] : null
  
  // Contenu croisé selon l'onglet actif
  const heroContent = activeTab === 'tweets' ? latestThread : latestArticle
  const heroType = activeTab === 'tweets' ? 'thread' : 'article'

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

  // Fonction pour obtenir l'URL de l'image du tweet
  const getTweetImageUrl = (thread: any) => {
    if (thread.featured_image) {
      // Priorité à l'URL originale, puis local_path, puis url
      return thread.featured_image.original_url || 
             thread.featured_image.local_path || 
             thread.featured_image.url
    }
    return null
  }

  return (
    <div className="space-y-8">
      {/* Système d'onglets */}
      <TabSystem 
        activeTab={activeTab}
        onTabChange={handleTabChange}
        tweetsCount={threads?.length || 0}
        articlesCount={getPublishedArticles().length}
      />
      {/* Hero Section avec contenu croisé */}
      {heroContent ? (
        <div className={`relative overflow-hidden rounded-3xl shadow-2xl ${
          theme === 'senegalais'
            ? 'bg-gradient-to-br from-orange-600 via-blue-900 to-green-700 border-4 border-yellow-400/20'
            : theme === 'dark'
              ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700'
              : theme === 'ocean'
                ? 'bg-gradient-to-br from-cyan-600 via-blue-600 to-teal-700 border border-cyan-400/30'
                : theme === 'enterprise'
                  ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-slate-800 border border-gray-600'
                  : 'bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700'
        }`}>
          {/* Sélecteur de thème en haut à droite */}
          <div className="absolute top-6 right-6 z-20">
            <ThemeSelector showLabel={false} variant="button" />
          </div>

          {/* Image de fond du contenu si disponible */}
          {((heroType === 'thread' && getTweetImageUrl(heroContent)) || (heroType === 'article' && heroContent.featured_image)) && (
            <div className="absolute inset-0">
              <img 
                src={heroType === 'thread' ? getTweetImageUrl(heroContent) : heroContent.featured_image}
                alt={heroContent.title}
                className="w-full h-full object-cover opacity-20"
                onError={(e) => {
                  // Masquer l'image si elle ne charge pas
                  e.currentTarget.style.display = 'none'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70"></div>
            </div>
          )}

          <div className="relative z-10 p-8 md:p-12 lg:p-16">
            {/* Header avec paramètres personnalisés */}
            <div className="text-center mb-12">
              {/* Logo si défini */}
              {settings.logo && (
                <div className="mb-6">
                  <img 
                    src={settings.logo} 
                    alt="Logo" 
                    className="w-20 h-20 mx-auto rounded-2xl object-cover shadow-2xl border-4 border-white/20"
                  />
                </div>
              )}
              
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight font-sans">
                {settings.heroTitle}
              </h1>
              <div className={`h-2 w-32 mx-auto mb-6 rounded-full ${
                theme === 'senegalais'
                  ? 'bg-gradient-to-r from-yellow-400 via-orange-400 to-green-400'
                  : theme === 'ocean'
                    ? 'bg-gradient-to-r from-cyan-300 via-blue-400 to-teal-400'
                    : theme === 'enterprise'
                      ? 'bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400'
                      : 'bg-white'
              }`}></div>
              <p className={`text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-sans ${
                theme === 'senegalais' ? 'text-yellow-100' : 
                theme === 'dark' ? 'text-slate-200' :
                theme === 'ocean' ? 'text-cyan-100' :
                theme === 'enterprise' ? 'text-gray-200' : 'text-gray-300'
              }`}>
                {settings.heroDescription}
              </p>
            </div>

            {/* Contenu en vedette */}
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8">
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
                  theme === 'senegalais'
                    ? 'bg-yellow-400 text-orange-900'
                    : 'bg-white text-black'
                }`}>
                  {heroType === 'thread' ? '🐦 DERNIER THREAD' : '📰 DERNIER ARTICLE'}
                </span>
              </div>

              <div className={`grid gap-8 items-center ${
                ((heroType === 'thread' && getTweetImageUrl(heroContent)) || (heroType === 'article' && heroContent.featured_image)) ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'
              }`}>
                {/* Contenu */}
                <div className="space-y-6">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                    {heroContent.title}
                  </h2>
                  
                  {heroContent.description && (
                    <p className="text-lg md:text-xl text-gray-200 leading-relaxed">
                      {truncateText(heroContent.description, 200)}
                    </p>
                  )}

                  {/* Métadonnées */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(heroType === 'thread' ? heroContent.date_created : (heroContent.published_date || heroContent.created_at))}</span>
                    </div>
                    {heroContent.theme && (
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          theme === 'senegalais'
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-700 text-gray-200'
                        }`}>
                          {heroContent.theme}
                        </span>
                      </div>
                    )}
                    {heroType === 'thread' && heroContent.total_tweets && (
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          theme === 'senegalais'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-600 text-gray-200'
                        }`}>
                          {heroContent.total_tweets} tweets
                        </span>
                      </div>
                    )}
                    {heroType === 'article' && (
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          theme === 'senegalais'
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-600 text-gray-200'
                        }`}>
                          Article éditorial
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Bouton de lecture */}
                  <div className="pt-4">
                    <Link
                      to={heroType === 'thread' ? `/thread/${heroContent.thread_id}` : `/article/${heroContent.id}`}
                      className={`inline-flex items-center space-x-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 shadow-xl ${
                        theme === 'senegalais'
                          ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-orange-900 hover:from-yellow-300 hover:to-orange-400'
                          : 'bg-white text-black hover:bg-gray-100'
                      }`}
                    >
                      <span>{heroType === 'thread' ? 'Lire le thread' : 'Lire l\'article'}</span>
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>

                {/* Image du contenu si disponible */}
                {((heroType === 'thread' && getTweetImageUrl(heroContent)) || (heroType === 'article' && heroContent.featured_image)) && (
                  <div className="relative">
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                      <img 
                        src={heroType === 'thread' ? getTweetImageUrl(heroContent) : heroContent.featured_image}
                        alt={heroContent.title}
                        className="w-full h-64 md:h-80 object-cover"
                        onError={(e) => {
                          // Masquer l'image si elle ne charge pas
                          e.currentTarget.parentElement?.parentElement?.remove()
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                      
                      {/* Métadonnées sur l'image */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-center justify-between text-white text-sm">
                          <div className="flex items-center space-x-4">
                            {heroType === 'thread' && heroContent.view_count && (
                              <div className="flex items-center space-x-1">
                                <Eye className="w-4 h-4" />
                                <span>{heroContent.view_count} vues</span>
                              </div>
                            )}
                            {heroType === 'thread' && heroContent.like_count && (
                              <div className="flex items-center space-x-1">
                                <Heart className="w-4 h-4" />
                                <span>{heroContent.like_count} likes</span>
                              </div>
                            )}
                            {heroType === 'article' && (
                              <div className="flex items-center space-x-1">
                                <span className="px-2 py-1 bg-white/20 rounded-full text-xs">
                                  {heroContent.is_featured ? '⭐ Article vedette' : 'Article éditorial'}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Stats rapides */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-4xl mx-auto mt-16">
              <div className="text-center group">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform ${
                  theme === 'senegalais' ? 'bg-yellow-400' : 'bg-white'
                }`}>
                  <span className={`text-3xl font-bold ${
                    theme === 'senegalais' ? 'text-orange-900' : 'text-black'
                  }`}>{threads?.length || 0}</span>
                </div>
                <div className={`text-sm uppercase tracking-widest font-bold ${
                  theme === 'senegalais' ? 'text-yellow-200' : 'text-gray-400'
                }`}>Threads</div>
              </div>
              <div className="text-center group">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform ${
                  theme === 'senegalais' ? 'bg-green-500' : 'bg-white'
                }`}>
                  <span className={`text-3xl font-bold ${
                    theme === 'senegalais' ? 'text-white' : 'text-black'
                  }`}>{getPublishedArticles().length}</span>
                </div>
                <div className={`text-sm uppercase tracking-widest font-bold ${
                  theme === 'senegalais' ? 'text-green-200' : 'text-gray-400'
                }`}>Articles</div>
              </div>
              <div className="text-center group">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform ${
                  theme === 'senegalais' ? 'bg-orange-500' : 'bg-white'
                }`}>
                  <span className={`text-3xl font-bold ${
                    theme === 'senegalais' ? 'text-white' : 'text-black'
                  }`}>{totalTweets}</span>
                </div>
                <div className={`text-sm uppercase tracking-widest font-bold ${
                  theme === 'senegalais' ? 'text-orange-200' : 'text-gray-400'
                }`}>Analyses</div>
              </div>
              <div className="text-center group">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform ${
                  theme === 'senegalais' ? 'bg-blue-900' : 'bg-white'
                }`}>
                  <span className={`text-3xl font-bold ${
                    theme === 'senegalais' ? 'text-yellow-400' : 'text-black'
                  }`}>{completeThreads}</span>
                </div>
                <div className={`text-sm uppercase tracking-widest font-bold ${
                  theme === 'senegalais' ? 'text-blue-200' : 'text-gray-400'
                }`}>Dossiers Complets</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Hero section de fallback si pas d'articles
        <div className={`relative overflow-hidden rounded-3xl shadow-2xl ${
          theme === 'senegalais' 
            ? 'bg-gradient-to-br from-orange-500 via-yellow-500 to-green-500 border-4 border-yellow-400/20'
            : 'bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700'
        }`}>
          {/* Sélecteur de thème en haut à droite */}
          <div className="absolute top-6 right-6 z-20">
            <ThemeSelector showLabel={false} variant="button" />
          </div>
          
          <div className="relative z-10 text-center py-20 px-8">
            {/* Logo ou icône par défaut */}
            {settings.logo ? (
              <div className="mb-8">
                <img 
                  src={settings.logo} 
                  alt="Logo" 
                  className="w-24 h-24 mx-auto rounded-2xl object-cover shadow-2xl border-4 border-white/20"
                />
              </div>
            ) : (
              <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl ${
                theme === 'senegalais'
                  ? 'bg-gradient-to-br from-yellow-400 to-orange-600 border-4 border-white/20'
                  : 'bg-white border-4 border-gray-300'
              }`}>
                <svg className={`w-12 h-12 ${theme === 'senegalais' ? 'text-white' : 'text-black'}`} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L15.09 5.09L19 4L18.18 7.82L22 9L18.18 10.18L19 14L15.09 12.91L12 16L8.91 12.91L5 14L5.82 10.18L2 9L5.82 7.82L5 4L8.91 5.09L12 2Z"/>
                </svg>
              </div>
            )}
            
            <h1 className="text-6xl font-bold text-white mb-6 tracking-tight font-sans">
              {settings.heroTitle}
            </h1>
            <div className={`h-2 w-32 mx-auto mb-8 rounded-full ${
              theme === 'senegalais'
                ? 'bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600'
                : 'bg-white'
            }`}></div>
            <p className={`text-2xl mb-10 max-w-4xl mx-auto leading-relaxed font-sans ${
              theme === 'senegalais' ? 'text-yellow-100' : 'text-gray-300'
            }`}>
              {settings.heroDescription}
            </p>
            <p className={`text-xl max-w-3xl mx-auto mb-8 font-sans ${
              theme === 'senegalais' ? 'text-orange-200' : 'text-gray-400'
            }`}>
              {settings.heroSubtitle}
              {theme === 'senegalais' && ' - Dans l\'esprit de la Teranga'}
            </p>
            <div className={`mt-10 text-lg font-sans ${
              theme === 'senegalais' ? 'text-yellow-300' : 'text-gray-300'
            }`}>
              Par <span className={`font-bold px-4 py-2 rounded-full ${
                theme === 'senegalais' ? 'text-white bg-orange-600/30' : 'text-black bg-white'
              }`}>{settings.author}</span>
            </div>
          </div>
        </div>
      )}

      {/* Sélecteur de contenu sous la hero section */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold theme-text font-sans mb-2">
            {activeTab === 'tweets' ? 'Threads Twitter' : 'Articles Éditoriaux'}
          </h2>
          <div className={`h-1 w-24 rounded-full ${
            theme === 'senegalais'
              ? 'bg-gradient-to-r from-orange-600 via-yellow-500 to-blue-900'
              : 'bg-black'
          }`}></div>
          <p className={`text-sm mt-2 ${
            theme === 'senegalais' ? 'text-orange-700' : 'text-gray-600'
          }`}>
            {activeTab === 'tweets' 
              ? 'Analyses et investigations importées depuis notre compte X (@loi200812)'
              : 'Contenus originaux rédigés par notre équipe avec éditeur WYSIWYG'
            }
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <LayoutSelector 
            currentLayout={currentLayout}
            onLayoutChange={setCurrentLayout}
          />
        </div>
      </div>

      {/* 3 Cards Configurables pour Filtrer le Contenu */}
      {!hasActiveFilters && theme === 'senegalais' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`group relative bg-gradient-to-br ${category.gradient} rounded-2xl p-8 text-white shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-3 border-4 ${category.borderColor}`}
            >
              <div className="absolute top-4 right-4 opacity-20">
                <Hash className="w-16 h-16" />
              </div>
              <div className="relative z-10">
                <div className={`w-16 h-16 ${category.iconBg} rounded-2xl flex items-center justify-center mb-6 shadow-lg border-3 border-white/20`}>
                  <Hash className={`w-8 h-8 ${category.iconColor}`} />
                </div>
                <h3 className="text-2xl font-bold mb-4 font-sans">{category.hashtag}</h3>
                <p className={`${category.textColor} leading-relaxed text-lg font-sans`}>
                  {category.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

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
          </div>
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
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.hashtag}
                </option>
              ))}
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

            {/* Mode d'affichage */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all ${
                  viewMode === 'grid'
                    ? theme === 'senegalais'
                      ? 'bg-orange-600 text-white'
                      : 'bg-black text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all ${
                  viewMode === 'list'
                    ? theme === 'senegalais'
                      ? 'bg-orange-600 text-white'
                      : 'bg-black text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Section Articles */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
        <div>
          <h2 className="text-4xl font-bold theme-text font-sans mb-2">
            {hasActiveFilters ? 'Résultats de recherche' : 'Articles Récents'}
            <span className={`ml-4 text-lg font-normal px-3 py-1 rounded-full ${
              theme === 'senegalais' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600'
            }`}>
              {currentLayout === 'grid' ? '📊 Grille' : 
               currentLayout === 'columns' ? '📊 Colonnes' :
               currentLayout === 'focus' ? '🎯 Focus' :
               currentLayout === 'mosaic' ? '🎨 Mosaïque' : '📊 Grille'}
            </span>
          </h2>
          <div className={`h-1 w-32 rounded-full ${
            theme === 'senegalais'
              ? 'bg-gradient-to-r from-orange-600 to-yellow-500'
              : 'bg-black'
          }`}></div>
        </div>
      </div>

      {/* Contenu principal avec sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Contenu principal */}
        <div className="lg:col-span-3">
          {/* Grille/Liste avec numérotation */}
          {currentData.length > 0 ? (
            <div className={`${
              currentLayout === 'grid' || viewMode === 'grid'
                ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8'
                : currentLayout === 'columns'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                  : currentLayout === 'focus'
                    ? 'grid grid-cols-1 lg:grid-cols-3 gap-8'
                    : currentLayout === 'mosaic'
                      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
                      : 'space-y-6'
            }`}>
              {currentLayout === 'focus' ? (
                <>
                  {/* Article principal en focus */}
                  <div className="lg:col-span-2">
                    {activeTab === 'tweets' ? (
                      <ThreadCard 
                        key={currentData[0].id} 
                        thread={currentData[0]} 
                        viewMode="grid"
                        compact={false}
                        index={currentData.length}
                      />
                    ) : (
                      <ArticleCard 
                        key={currentData[0].id} 
                        article={currentData[0]} 
                        viewMode="grid"
                        compact={false}
                        index={currentData.length}
                      />
                    )}
                  </div>
                  {/* Articles secondaires */}
                  <div className="space-y-4">
                    {currentData.slice(1, 5).map((item, index) => (
                      activeTab === 'tweets' ? (
                        <ThreadCard 
                          key={item.id} 
                          thread={item} 
                          viewMode="grid"
                          compact={true}
                          index={currentData.length - (index + 1)}
                        />
                      ) : (
                        <ArticleCard 
                          key={item.id} 
                          article={item} 
                          viewMode="grid"
                          compact={true}
                          index={currentData.length - (index + 1)}
                        />
                      )
                    ))}
                  </div>
                </>
              ) : (
                currentData.map((item, index) => (
                  activeTab === 'tweets' ? (
                    <ThreadCard 
                      key={item.id} 
                      thread={item} 
                      viewMode={currentLayout === 'columns' || currentLayout === 'mosaic' ? 'grid' : viewMode}
                      compact={currentLayout === 'columns' || currentLayout === 'mosaic'}
                      index={currentData.length - index}
                    />
                  ) : (
                    <ArticleCard 
                      key={item.id} 
                      article={item} 
                      viewMode={currentLayout === 'columns' || currentLayout === 'mosaic' ? 'grid' : viewMode}
                      compact={currentLayout === 'columns' || currentLayout === 'mosaic'}
                      index={currentData.length - index}
                    />
                  )
                ))
              )}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg ${
                theme === 'senegalais' ? 'bg-gradient-to-br from-orange-500 to-yellow-500' : 'bg-gray-900'
              }`}>
                <Eye className="w-12 h-12 text-white" />
              </div>
              <p className="text-gray-500 text-xl font-sans mb-4">
                Aucun {activeTab === 'tweets' ? 'thread' : 'article'} trouvé
              </p>
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
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <ContentSidebar 
            currentTab={activeTab}
            articles={articles}
            threads={threads || []}
          />
        </div>
      </div>
      
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