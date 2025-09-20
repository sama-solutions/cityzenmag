import { useEffect, useState } from 'react'
import { 
  BarChart3, 
  FileText, 
  FolderOpen, 
  TrendingUp, 
  Users, 
  Eye,
  Clock,
  CheckCircle,
  Twitter,
  Edit3,
  Database,
  Activity
} from 'lucide-react'
import { useAdminContent, useAdminCategories } from '../../hooks/useAdmin'
import { useThreads } from '../../hooks/useData'
import { useArticles } from '../../hooks/useArticles'
import { useTheme } from '../../contexts/ThemeContext'
import { DrillDownModal } from '../../components/admin/DrillDownModal'
import { ThreadsDrillDown } from '../../components/admin/drilldown/ThreadsDrillDown'
import { ArticlesDrillDown } from '../../components/admin/drilldown/ArticlesDrillDown'
import { CategoriesDrillDown } from '../../components/admin/drilldown/CategoriesDrillDown'
import { ViewsDrillDown } from '../../components/admin/drilldown/ViewsDrillDown'

interface DashboardStats {
  totalThreads: number
  totalArticles: number
  publishedArticles: number
  draftArticles: number
  totalCategories: number
  totalViews: number
  totalLikes: number
  totalTweets: number
  completeThreads: number
}

export function AdminDashboard() {
  const { threads, loading: threadsLoading } = useThreads()
  const { articles, getPublishedArticles } = useArticles()
  const { categories: adminCategories, loading: categoriesLoading } = useAdminCategories()
  const { theme } = useTheme()
  const [drillDownModal, setDrillDownModal] = useState<{
    isOpen: boolean
    title: string
    type: 'threads' | 'articles' | 'categories' | 'views' | 'likes' | 'tweets' | 'complete' | 'published' | 'draft'
  }>({ isOpen: false, title: '', type: 'threads' })
  const [stats, setStats] = useState<DashboardStats>({
    totalThreads: 0,
    totalArticles: 0,
    publishedArticles: 0,
    draftArticles: 0,
    totalCategories: 0,
    totalViews: 0,
    totalLikes: 0,
    totalTweets: 0,
    completeThreads: 0
  })

  useEffect(() => {
    const publishedArticles = getPublishedArticles()
    const draftArticles = articles.filter(a => a.status === 'draft')
    const completeThreadsCount = threads?.filter(t => t.complete).length || 0
    const totalTweets = threads?.reduce((sum, t) => sum + (t.total_tweets || 0), 0) || 0
    
    setStats({
      totalThreads: threads?.length || 0,
      totalArticles: articles.length,
      publishedArticles: publishedArticles.length,
      draftArticles: draftArticles.length,
      totalCategories: adminCategories.length,
      totalViews: threads?.reduce((sum, t) => sum + (t.view_count || 0), 0) || 0,
      totalLikes: threads?.reduce((sum, t) => sum + (t.like_count || 0), 0) || 0,
      totalTweets: totalTweets,
      completeThreads: completeThreadsCount
    })
  }, [threads, articles, getPublishedArticles, adminCategories])

  const isLoading = threadsLoading || categoriesLoading

  const openDrillDown = (type: typeof drillDownModal.type, title: string) => {
    setDrillDownModal({ isOpen: true, title, type })
  }

  const closeDrillDown = () => {
    setDrillDownModal({ isOpen: false, title: '', type: 'threads' })
  }

  const renderDrillDownContent = () => {
    switch (drillDownModal.type) {
      case 'threads':
        return <ThreadsDrillDown filterType="all" />
      case 'articles':
        return <ArticlesDrillDown filterType="all" />
      case 'published':
        return <ArticlesDrillDown filterType="published" />
      case 'draft':
        return <ArticlesDrillDown filterType="draft" />
      case 'complete':
        return <ThreadsDrillDown filterType="complete" />
      case 'categories':
        return <CategoriesDrillDown />
      case 'views':
        return <ViewsDrillDown />
      default:
        return <ThreadsDrillDown filterType="all" />
    }
  }

  const statCards = [
    {
      title: 'Threads Twitter',
      value: stats.totalThreads,
      icon: Twitter,
      color: theme === 'senegalais' ? 'from-blue-600 to-blue-700' : 'from-blue-600 to-blue-700',
      textColor: 'text-white',
      description: 'Analyses importées depuis X',
      drillDownType: 'threads' as const
    },
    {
      title: 'Articles Éditoriaux',
      value: stats.totalArticles,
      icon: Edit3,
      color: theme === 'senegalais' ? 'from-green-600 to-green-700' : 'from-green-600 to-green-700',
      textColor: 'text-white',
      description: 'Contenus rédigés par l\'equipe',
      drillDownType: 'articles' as const
    },
    {
      title: 'Articles Publiés',
      value: stats.publishedArticles,
      icon: CheckCircle,
      color: theme === 'senegalais' ? 'from-emerald-600 to-emerald-700' : 'from-emerald-600 to-emerald-700',
      textColor: 'text-white',
      description: 'Articles visibles publiquement',
      drillDownType: 'published' as const
    },
    {
      title: 'Brouillons',
      value: stats.draftArticles,
      icon: Clock,
      color: theme === 'senegalais' ? 'from-orange-600 to-orange-700' : 'from-orange-600 to-orange-700',
      textColor: 'text-white',
      description: 'Articles en cours de rédaction',
      drillDownType: 'draft' as const
    },
    {
      title: 'Analyses Totales',
      value: stats.totalTweets,
      icon: Activity,
      color: theme === 'senegalais' ? 'from-purple-600 to-purple-700' : 'from-purple-600 to-purple-700',
      textColor: 'text-white',
      description: 'Tweets analysés au total',
      drillDownType: 'tweets' as const
    },
    {
      title: 'Dossiers Complets',
      value: stats.completeThreads,
      icon: FileText,
      color: theme === 'senegalais' ? 'from-indigo-600 to-indigo-700' : 'from-indigo-600 to-indigo-700',
      textColor: 'text-white',
      description: 'Threads terminés et complets',
      drillDownType: 'complete' as const
    },
    {
      title: 'Catégories',
      value: stats.totalCategories,
      icon: FolderOpen,
      color: theme === 'senegalais' ? 'from-yellow-600 to-yellow-700' : 'from-yellow-600 to-yellow-700',
      textColor: 'text-white',
      description: 'Catégories de contenu',
      drillDownType: 'categories' as const
    },
    {
      title: 'Vues Totales',
      value: stats.totalViews,
      icon: Eye,
      color: theme === 'senegalais' ? 'from-pink-600 to-pink-700' : 'from-pink-600 to-pink-700',
      textColor: 'text-white',
      description: 'Vues cumulées des threads',
      drillDownType: 'views' as const
    }
  ]

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold theme-text">Dashboard</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="admin-card p-6 animate-pulse">
              <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-300 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold theme-text mb-2">Dashboard</h1>
          <p className="theme-text-muted text-lg">Vue d'ensemble de votre magazine</p>
        </div>
        <div className={`p-4 rounded-2xl ${
          theme === 'senegalais' 
            ? 'bg-gradient-to-br from-orange-600 to-yellow-600' 
            : 'bg-gray-900'
        }`}>
          <BarChart3 className="w-8 h-8 text-white" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <div 
              key={card.title}
              onClick={() => openDrillDown(card.drillDownType, card.title)}
              className={`admin-card p-6 bg-gradient-to-br ${card.color} text-white relative overflow-hidden group hover:scale-105 transition-all duration-300 cursor-pointer`}
            >
              {/* Background pattern */}
              <div className="absolute top-0 right-0 w-24 h-24 opacity-10">
                <Icon className="w-full h-full" />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {card.value.toLocaleString()}
                    </div>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-white/90 mb-2">
                  {card.title}
                </h3>
                
                {card.description && (
                  <p className="text-sm text-white/70">
                    {card.description}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Articles Récents */}
      <div className="admin-card p-6">
        <h2 className="text-2xl font-bold theme-text mb-6">Articles Récents</h2>
        
        {threads && threads.length > 0 ? (
          <div className="space-y-4">
            {threads.slice(0, 5).map((thread) => (
              <div 
                key={thread.id}
                className={`p-4 border rounded-xl transition-all hover:shadow-md ${
                  theme === 'minimaliste' 
                    ? 'border-gray-200 hover:border-gray-300' 
                    : 'border-orange-200 hover:border-orange-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold theme-text mb-1">{thread.title}</h3>
                    <div className="flex items-center space-x-4 text-sm theme-text-muted">
                      <span>Catégorie: {thread.category?.name || 'Non classé'}</span>
                      <span>Statut: {thread.status?.name || 'Non défini'}</span>
                      <span>{thread.total_tweets} analyses</span>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    thread.status?.slug === 'published' 
                      ? 'bg-green-100 text-green-800'
                      : thread.status?.slug === 'draft'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {thread.status?.name || 'Non défini'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 theme-text-muted">
            <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">Aucun article trouvé</p>
          </div>
        )}
      </div>

      {/* Modal de drill down */}
      <DrillDownModal
        isOpen={drillDownModal.isOpen}
        onClose={closeDrillDown}
        title={`Détails - ${drillDownModal.title}`}
      >
        {renderDrillDownContent()}
      </DrillDownModal>
    </div>
  )
}