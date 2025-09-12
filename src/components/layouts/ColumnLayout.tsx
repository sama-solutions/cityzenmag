import { useMemo } from 'react'
import { Hash, TrendingUp, Calendar, Users, Eye, Clock } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { ThreadCard } from '../ThreadCard'
import type { Thread } from '../../types/database'

interface ColumnLayoutProps {
  threads: Thread[]
  viewMode?: 'grid' | 'list'
}

interface CategoryColumn {
  id: string
  title: string
  hashtag: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  color: {
    senegalais: string
    minimaliste: string
  }
  threads: Thread[]
}

export function ColumnLayout({ threads, viewMode = 'grid' }: ColumnLayoutProps) {
  const { theme } = useTheme()

  // Organiser les threads par catégories
  const columns = useMemo(() => {
    const categories: CategoryColumn[] = [
      {
        id: 'transparence',
        title: 'Transparence',
        hashtag: '#TransparenceSN',
        description: 'Investigations et analyses sur la transparence des institutions',
        icon: Hash,
        color: {
          senegalais: 'from-blue-900 to-blue-800',
          minimaliste: 'from-blue-600 to-blue-700'
        },
        threads: []
      },
      {
        id: 'modernisation',
        title: 'Modernisation',
        hashtag: '#LaSuite',
        description: 'Dossiers sur la modernisation et la réforme des institutions',
        icon: TrendingUp,
        color: {
          senegalais: 'from-orange-600 to-orange-700',
          minimaliste: 'from-orange-500 to-orange-600'
        },
        threads: []
      },
      {
        id: 'democratie',
        title: 'Démocratie',
        hashtag: '#LaQuestionQuiDérange',
        description: 'Enquêtes citoyennes et questions constructives',
        icon: Calendar,
        color: {
          senegalais: 'from-yellow-600 to-yellow-700',
          minimaliste: 'from-green-600 to-green-700'
        },
        threads: []
      }
    ]

    // Distribuer les threads dans les colonnes selon leurs hashtags
    threads.forEach(thread => {
      const threadHashtags = thread.hashtags.map(tag => tag.toLowerCase())
      
      if (threadHashtags.some(tag => tag.includes('transparence'))) {
        categories[0].threads.push(thread)
      } else if (threadHashtags.some(tag => tag.includes('suite') || tag.includes('modernisation'))) {
        categories[1].threads.push(thread)
      } else if (threadHashtags.some(tag => tag.includes('question') || tag.includes('dérange'))) {
        categories[2].threads.push(thread)
      } else {
        // Par défaut, mettre dans la première colonne non vide ou transparence
        const minColumn = categories.reduce((min, col) => 
          col.threads.length < min.threads.length ? col : min
        )
        minColumn.threads.push(thread)
      }
    })

    return categories
  }, [threads])

  const totalThreads = threads.length
  const totalTweets = threads.reduce((sum, thread) => sum + thread.total_tweets, 0)

  return (
    <div className="space-y-8">
      {/* Header des colonnes */}
      <div className="text-center">
        <h2 className="text-3xl font-bold theme-text mb-4">Nos Rubriques Thématiques</h2>
        <div className={`h-1 w-32 mx-auto rounded-full mb-6 ${
          theme === 'senegalais'
            ? 'bg-gradient-to-r from-orange-600 via-yellow-500 to-blue-900'
            : 'bg-black'
        }`}></div>
        <p className="theme-text-muted max-w-2xl mx-auto">
          Explorez nos analyses organisées par thématiques pour une navigation ciblée
        </p>
        
        {/* Stats globales */}
        <div className="flex justify-center items-center space-x-8 mt-6">
          <div className="flex items-center space-x-2 text-sm theme-text-muted">
            <Users className="w-4 h-4" />
            <span>{totalThreads} articles</span>
          </div>
          <div className="flex items-center space-x-2 text-sm theme-text-muted">
            <Eye className="w-4 h-4" />
            <span>{totalTweets} analyses</span>
          </div>
          <div className="flex items-center space-x-2 text-sm theme-text-muted">
            <Clock className="w-4 h-4" />
            <span>Mis à jour quotidiennement</span>
          </div>
        </div>
      </div>

      {/* Grille des colonnes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {columns.map((column) => {
          const Icon = column.icon
          const hasThreads = column.threads.length > 0
          
          return (
            <div key={column.id} className="space-y-6">
              {/* Header de la colonne */}
              <div className={`relative overflow-hidden rounded-2xl p-6 text-white shadow-lg bg-gradient-to-br ${
                column.color[theme as keyof typeof column.color]
              }`}>
                <div className="relative z-10">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      theme === 'senegalais' ? 'bg-yellow-400' : 'bg-white'
                    }`}>
                      <Icon className={`w-6 h-6 ${
                        theme === 'senegalais' ? 'text-gray-900' : 'text-gray-900'
                      }`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{column.title}</h3>
                      <p className="text-sm opacity-90">{column.hashtag}</p>
                    </div>
                  </div>
                  
                  <p className="text-white/90 text-sm leading-relaxed mb-4">
                    {column.description}
                  </p>
                  
                  {/* Stats de la colonne */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{column.threads.length}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{column.threads.reduce((sum, t) => sum + t.total_tweets, 0)}</span>
                      </span>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      hasThreads 
                        ? 'bg-white/20 text-white' 
                        : 'bg-white/10 text-white/70'
                    }`}>
                      {hasThreads ? 'Actif' : 'Bientôt'}
                    </div>
                  </div>
                </div>
                
                {/* Motif de fond */}
                <div className="absolute top-4 right-4 opacity-20">
                  <Icon className="w-16 h-16" />
                </div>
              </div>

              {/* Articles de la colonne */}
              <div className="space-y-4">
                {hasThreads ? (
                  column.threads.map((thread) => (
                    <ThreadCard 
                      key={thread.id} 
                      thread={thread} 
                      viewMode={viewMode}
                      compact={true}
                    />
                  ))
                ) : (
                  <div className={`p-6 rounded-xl border-2 border-dashed text-center ${
                    theme === 'senegalais'
                      ? 'border-orange-200 bg-orange-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}>
                    <Icon className={`w-8 h-8 mx-auto mb-3 ${
                      theme === 'senegalais' ? 'text-orange-400' : 'text-gray-400'
                    }`} />
                    <p className={`text-sm font-medium mb-2 ${
                      theme === 'senegalais' ? 'text-orange-800' : 'text-gray-700'
                    }`}>
                      Bientôt disponible
                    </p>
                    <p className={`text-xs ${
                      theme === 'senegalais' ? 'text-orange-600' : 'text-gray-500'
                    }`}>
                      Nouveaux contenus {column.title.toLowerCase()} en préparation
                    </p>
                  </div>
                )}
              </div>

              {/* Voir plus */}
              {column.threads.length > 3 && (
                <button className={`w-full py-3 rounded-xl font-medium transition-all ${
                  theme === 'senegalais'
                    ? 'bg-orange-100 text-orange-800 hover:bg-orange-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}>
                  Voir tous les articles {column.title} ({column.threads.length})
                </button>
              )}
            </div>
          )
        })}
      </div>

      {/* Footer des colonnes */}
      <div className={`text-center py-8 rounded-2xl ${
        theme === 'senegalais'
          ? 'bg-gradient-to-r from-orange-50 to-yellow-50'
          : 'bg-gray-50'
      }`}>
        <h3 className="text-xl font-bold theme-text mb-2">Explorez par Thématique</h3>
        <p className="theme-text-muted mb-4">
          Chaque colonne regroupe les articles selon leur focus principal
        </p>
        <div className="flex justify-center space-x-4">
          {columns.map((column) => (
            <button
              key={column.id}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                theme === 'senegalais'
                  ? 'bg-white text-orange-800 hover:bg-orange-100 border border-orange-200'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {column.hashtag}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}