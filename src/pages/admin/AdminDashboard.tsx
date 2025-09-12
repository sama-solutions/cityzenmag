import { useEffect, useState } from 'react'
import { 
  BarChart3, 
  FileText, 
  FolderOpen, 
  TrendingUp, 
  Users, 
  Eye,
  Clock,
  CheckCircle
} from 'lucide-react'
import { useAdminContent, useAdminCategories } from '../../hooks/useAdmin'
import { useTheme } from '../../contexts/ThemeContext'

interface DashboardStats {
  totalThreads: number
  publishedThreads: number
  draftThreads: number
  totalCategories: number
  totalViews: number
  totalLikes: number
}

export function AdminDashboard() {
  const { threads, categories, loading: contentLoading } = useAdminContent()
  const { categories: adminCategories, loading: categoriesLoading } = useAdminCategories()
  const { theme } = useTheme()
  const [stats, setStats] = useState<DashboardStats>({
    totalThreads: 0,
    publishedThreads: 0,
    draftThreads: 0,
    totalCategories: 0,
    totalViews: 0,
    totalLikes: 0
  })

  useEffect(() => {
    if (threads && categories) {
      const publishedCount = threads.filter(t => t.status?.slug === 'published').length
      const draftCount = threads.filter(t => t.status?.slug === 'draft').length
      
      setStats({
        totalThreads: threads.length,
        publishedThreads: publishedCount,
        draftThreads: draftCount,
        totalCategories: adminCategories.length,
        totalViews: threads.reduce((sum, t) => sum + (t.view_count || 0), 0),
        totalLikes: threads.reduce((sum, t) => sum + (t.like_count || 0), 0)
      })
    }
  }, [threads, categories, adminCategories])

  const isLoading = contentLoading || categoriesLoading

  const statCards = [
    {
      title: 'Total Articles',
      value: stats.totalThreads,
      icon: FileText,
      color: theme === 'senegalais' ? 'from-blue-900 to-blue-800' : 'from-gray-900 to-gray-800',
      textColor: 'text-white'
    },
    {
      title: 'Articles Publiés',
      value: stats.publishedThreads,
      icon: CheckCircle,
      color: theme === 'senegalais' ? 'from-green-600 to-green-700' : 'from-green-600 to-green-700',
      textColor: 'text-white'
    },
    {
      title: 'Brouillons',
      value: stats.draftThreads,
      icon: Clock,
      color: theme === 'senegalais' ? 'from-orange-600 to-orange-700' : 'from-yellow-500 to-yellow-600',
      textColor: 'text-white'
    },
    {
      title: 'Catégories',
      value: stats.totalCategories,
      icon: FolderOpen,
      color: theme === 'senegalais' ? 'from-yellow-600 to-yellow-700' : 'from-blue-600 to-blue-700',
      textColor: 'text-white'
    },
    {
      title: 'Vues Totales',
      value: stats.totalViews,
      icon: Eye,
      color: theme === 'senegalais' ? 'from-purple-600 to-purple-700' : 'from-purple-600 to-purple-700',
      textColor: 'text-white'
    },
    {
      title: 'J\'aime',
      value: stats.totalLikes,
      icon: TrendingUp,
      color: theme === 'senegalais' ? 'from-pink-600 to-pink-700' : 'from-red-600 to-red-700',
      textColor: 'text-white'
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <div 
              key={card.title}
              className={`admin-card p-6 bg-gradient-to-br ${card.color} text-white relative overflow-hidden group`}
            >
              {/* Background pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                <Icon className="w-full h-full" />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">
                      {card.value.toLocaleString()}
                    </div>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-white/90">
                  {card.title}
                </h3>
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
    </div>
  )
}