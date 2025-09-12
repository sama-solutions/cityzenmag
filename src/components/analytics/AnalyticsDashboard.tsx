import { useState, useEffect } from 'react'
import { 
  BarChart3, 
  Users, 
  Eye, 
  Clock, 
  TrendingUp, 
  Target,
  RefreshCw,
  Download,
  Calendar,
  Filter
} from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { useAnalytics } from '../../services/analytics'
import type { AnalyticsMetrics, RecommendationMetrics } from '../../services/analytics'

export function AnalyticsDashboard() {
  const { theme } = useTheme()
  const { getMetrics, getRecommendationMetrics } = useAnalytics()
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null)
  const [recMetrics, setRecMetrics] = useState<RecommendationMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('7d')

  useEffect(() => {
    loadMetrics()
  }, [timeRange])

  const loadMetrics = async () => {
    setLoading(true)
    try {
      // Simulation d'un délai de chargement
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const analyticsMetrics = getMetrics()
      const recommendationMetrics = getRecommendationMetrics()
      
      setMetrics(analyticsMetrics)
      setRecMetrics(recommendationMetrics)
    } catch (error) {
      console.error('Error loading metrics:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
      </div>
    )
  }

  if (!metrics || !recMetrics) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-500">Aucune donnée disponible</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold theme-text">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">Vue d'ensemble des performances de la plateforme</p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Sélecteur de période */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as '24h' | '7d' | '30d')}
            className={`px-4 py-2 border rounded-xl outline-none transition-all ${
              theme === 'senegalais'
                ? 'border-orange-300 focus:border-orange-500'
                : 'border-gray-300 focus:border-gray-500'
            }`}
          >
            <option value="24h">Dernières 24h</option>
            <option value="7d">7 derniers jours</option>
            <option value="30d">30 derniers jours</option>
          </select>
          
          <button
            onClick={loadMetrics}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
              theme === 'senegalais'
                ? 'bg-orange-100 text-orange-800 hover:bg-orange-200'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            <span>Actualiser</span>
          </button>
          
          <button className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
            theme === 'senegalais'
              ? 'bg-orange-600 text-white hover:bg-orange-700'
              : 'bg-black text-white hover:bg-gray-800'
          }`}>
            <Download className="w-4 h-4" />
            <span>Exporter</span>
          </button>
        </div>
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className={`p-6 rounded-2xl border ${
          theme === 'senegalais'
            ? 'bg-white border-orange-200'
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl ${
              theme === 'senegalais' ? 'bg-blue-100' : 'bg-blue-50'
            }`}>
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-green-600 text-sm font-medium">+12%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{metrics.totalUsers}</h3>
          <p className="text-gray-600 text-sm">Utilisateurs actifs</p>
        </div>

        <div className={`p-6 rounded-2xl border ${
          theme === 'senegalais'
            ? 'bg-white border-orange-200'
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl ${
              theme === 'senegalais' ? 'bg-green-100' : 'bg-green-50'
            }`}>
              <Eye className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-green-600 text-sm font-medium">+8%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{metrics.pageViews}</h3>
          <p className="text-gray-600 text-sm">Pages vues</p>
        </div>

        <div className={`p-6 rounded-2xl border ${
          theme === 'senegalais'
            ? 'bg-white border-orange-200'
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl ${
              theme === 'senegalais' ? 'bg-purple-100' : 'bg-purple-50'
            }`}>
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-green-600 text-sm font-medium">+5%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{formatDuration(metrics.averageSessionDuration)}</h3>
          <p className="text-gray-600 text-sm">Durée moyenne</p>
        </div>

        <div className={`p-6 rounded-2xl border ${
          theme === 'senegalais'
            ? 'bg-white border-orange-200'
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl ${
              theme === 'senegalais' ? 'bg-orange-100' : 'bg-orange-50'
            }`}>
              <Target className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-red-600 text-sm font-medium">-3%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{formatPercentage(metrics.bounceRate)}</h3>
          <p className="text-gray-600 text-sm">Taux de rebond</p>
        </div>
      </div>

      {/* Métriques de recommandations */}
      <div className={`p-6 rounded-2xl border ${
        theme === 'senegalais'
          ? 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200'
          : 'bg-gray-50 border-gray-200'
      }`}>
        <h2 className="text-xl font-bold theme-text mb-6">Performance des Recommandations</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{formatPercentage(recMetrics.clickThroughRate)}</div>
            <div className="text-gray-600 text-sm">Taux de clic</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{formatPercentage(recMetrics.conversionRate)}</div>
            <div className="text-gray-600 text-sm">Taux de conversion</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{formatPercentage(recMetrics.diversityScore)}</div>
            <div className="text-gray-600 text-sm">Score de diversité</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">{recMetrics.userSatisfaction.toFixed(1)}/5</div>
            <div className="text-gray-600 text-sm">Satisfaction utilisateur</div>
          </div>
        </div>
      </div>

      {/* Graphiques et tableaux */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Pages */}
        <div className={`p-6 rounded-2xl border ${
          theme === 'senegalais'
            ? 'bg-white border-orange-200'
            : 'bg-white border-gray-200'
        }`}>
          <h3 className="text-lg font-bold theme-text mb-4">Pages les plus visitées</h3>
          <div className="space-y-3">
            {metrics.topPages.slice(0, 5).map((page, index) => (
              <div key={page.page} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    index === 0 ? 'bg-yellow-400 text-yellow-900' :
                    index === 1 ? 'bg-gray-300 text-gray-700' :
                    index === 2 ? 'bg-orange-300 text-orange-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {index + 1}
                  </span>
                  <span className="font-medium">{page.page}</span>
                </div>
                <span className="text-gray-600">{page.views} vues</span>
              </div>
            ))}
          </div>
        </div>

        {/* Performance des algorithmes */}
        <div className={`p-6 rounded-2xl border ${
          theme === 'senegalais'
            ? 'bg-white border-orange-200'
            : 'bg-white border-gray-200'
        }`}>
          <h3 className="text-lg font-bold theme-text mb-4">Performance des algorithmes</h3>
          <div className="space-y-4">
            {recMetrics.algorithmPerformance.map((algo, index) => (
              <div key={algo.algorithm} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium capitalize">{algo.algorithm}</span>
                  <span className="text-sm text-gray-600">CTR: {formatPercentage(algo.ctr)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      index === 0 ? 'bg-green-500' :
                      index === 1 ? 'bg-blue-500' :
                      'bg-purple-500'
                    }`}
                    style={{ width: `${algo.ctr * 500}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Flux utilisateur */}
        <div className={`p-6 rounded-2xl border ${
          theme === 'senegalais'
            ? 'bg-white border-orange-200'
            : 'bg-white border-gray-200'
        }`}>
          <h3 className="text-lg font-bold theme-text mb-4">Flux de navigation</h3>
          <div className="space-y-3">
            {metrics.userFlow.slice(0, 5).map((flow, index) => (
              <div key={`${flow.from}-${flow.to}`} className="flex items-center space-x-3">
                <div className="flex-1 flex items-center space-x-2">
                  <span className="text-sm text-gray-600 truncate">{flow.from}</span>
                  <span className="text-gray-400">→</span>
                  <span className="text-sm text-gray-600 truncate">{flow.to}</span>
                </div>
                <span className="text-sm font-medium">{flow.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top événements */}
        <div className={`p-6 rounded-2xl border ${
          theme === 'senegalais'
            ? 'bg-white border-orange-200'
            : 'bg-white border-gray-200'
        }`}>
          <h3 className="text-lg font-bold theme-text mb-4">Événements populaires</h3>
          <div className="space-y-3">
            {metrics.topEvents.slice(0, 5).map((event, index) => (
              <div key={event.event} className="flex items-center justify-between">
                <span className="text-sm font-medium">{event.event}</span>
                <span className="text-sm text-gray-600">{event.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}