import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, User, ArrowRight, Eye, Heart } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { useData } from '../hooks/useData'
import { ThreadCard } from '../components/ThreadCard'
import { LoadingSpinner } from '../components/LoadingSpinner'

export function Home() {
  const { theme } = useTheme()
  const { threads, loading, error } = useData()
  
  if (loading) return <LoadingSpinner />
  
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <p className="text-lg font-semibold">Erreur de chargement</p>
          <p className="text-sm text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  // Récupérer le dernier article pour la hero section
  const latestThread = threads && threads.length > 0 ? threads[0] : null
  const remainingThreads = threads && threads.length > 1 ? threads.slice(1, 9) : []

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

  // Images de fallback pour la démonstration
  const getFallbackImage = (thread: any) => {
    const fallbackImages = [
      'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=800&h=600&fit=crop&crop=center', // Sénégal flag
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center', // African politics
      'https://images.unsplash.com/photo-1541872705-1f73c6400ec9?w=800&h=600&fit=crop&crop=center', // Government building
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&crop=face', // African leader
      'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&h=600&fit=crop&crop=center', // Democracy
    ]
    
    // Utiliser l'ID du thread pour sélectionner une image de manière déterministe
    const index = thread.thread_id ? parseInt(thread.thread_id.slice(-1)) % fallbackImages.length : 0
    return fallbackImages[index]
  }

  const getImageUrl = (thread: any) => {
    // Priorité : image featured > image de fallback
    if (thread.featured_image?.url) {
      return thread.featured_image.url
    }
    return getFallbackImage(thread)
  }
  
  return (
    <div className="space-y-8">
      {/* Hero Section avec dernier post */}
      {latestThread ? (
        <div className={`relative overflow-hidden rounded-3xl shadow-2xl ${
          theme === 'senegalais' 
            ? 'bg-gradient-to-br from-orange-600 via-blue-900 to-green-700 border-4 border-yellow-400/20'
            : 'bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700'
        }`}>
          {/* Image de fond */}
          <div className="absolute inset-0">
            <img 
              src={getImageUrl(latestThread)}
              alt={latestThread.title}
              className="w-full h-full object-cover opacity-30"
              onError={(e) => {
                // Fallback si l'image ne charge pas
                e.currentTarget.src = 'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=800&h=600&fit=crop&crop=center'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70"></div>
          </div>

          <div className="relative z-10 p-8 md:p-12 lg:p-16">
            {/* Header CityzenMag */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight font-sans">
                CityzenMag
              </h1>
              <div className={`h-2 w-32 mx-auto mb-6 rounded-full ${
                theme === 'senegalais'
                  ? 'bg-gradient-to-r from-yellow-400 via-orange-400 to-green-400'
                  : 'bg-white'
              }`}></div>
              <p className={`text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-sans ${
                theme === 'senegalais' ? 'text-yellow-100' : 'text-gray-300'
              }`}>
                Plateforme de transparence et modernisation du Sénégal
              </p>
            </div>

            {/* Dernier Article en vedette */}
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8">
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
                  theme === 'senegalais'
                    ? 'bg-yellow-400 text-orange-900'
                    : 'bg-white text-black'
                }`}>
                  📰 DERNIER ARTICLE
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {/* Contenu de l'article */}
                <div className="space-y-6">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                    {latestThread.title}
                  </h2>
                  
                  {latestThread.description && (
                    <p className="text-lg md:text-xl text-gray-200 leading-relaxed">
                      {truncateText(latestThread.description, 200)}
                    </p>
                  )}

                  {/* Métadonnées */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(latestThread.date_created)}</span>
                    </div>
                    {latestThread.theme && (
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          theme === 'senegalais'
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-700 text-gray-200'
                        }`}>
                          {latestThread.theme}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Bouton de lecture */}
                  <div className="pt-4">
                    <Link
                      to={`/thread/${latestThread.thread_id}`}
                      className={`inline-flex items-center space-x-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 shadow-xl ${
                        theme === 'senegalais'
                          ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-orange-900 hover:from-yellow-300 hover:to-orange-400'
                          : 'bg-white text-black hover:bg-gray-100'
                      }`}
                    >
                      <span>Lire l'article</span>
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>

                {/* Image de l'article */}
                <div className="relative">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                    <img 
                      src={getImageUrl(latestThread)}
                      alt={latestThread.title}
                      className="w-full h-64 md:h-80 object-cover"
                      onError={(e) => {
                        // Fallback si l'image ne charge pas
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=800&h=600&fit=crop&crop=center'
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    
                    {/* Badge sur l'image */}
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        theme === 'senegalais'
                          ? 'bg-yellow-400 text-orange-900'
                          : 'bg-white text-black'
                      }`}>
                        🔥 TRENDING
                      </span>
                    </div>

                    {/* Métadonnées sur l'image */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center justify-between text-white text-sm">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>2.3k vues</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Heart className="w-4 h-4" />
                            <span>156 likes</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats rapides */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-16">
              <div className="text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg ${
                  theme === 'senegalais' ? 'bg-yellow-400' : 'bg-white'
                }`}>
                  <span className={`text-2xl ${
                    theme === 'senegalais' ? 'text-orange-900' : 'text-black'
                  }`}>🎤</span>
                </div>
                <div className={`text-xs uppercase tracking-widest font-bold ${
                  theme === 'senegalais' ? 'text-yellow-200' : 'text-gray-400'
                }`}>Interviews</div>
              </div>
              
              <div className="text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg ${
                  theme === 'senegalais' ? 'bg-yellow-400' : 'bg-white'
                }`}>
                  <span className={`text-2xl ${
                    theme === 'senegalais' ? 'text-orange-900' : 'text-black'
                  }`}>📸</span>
                </div>
                <div className={`text-xs uppercase tracking-widest font-bold ${
                  theme === 'senegalais' ? 'text-yellow-200' : 'text-gray-400'
                }`}>Reportages</div>
              </div>
              
              <div className="text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg ${
                  theme === 'senegalais' ? 'bg-yellow-400' : 'bg-white'
                }`}>
                  <span className={`text-2xl ${
                    theme === 'senegalais' ? 'text-orange-900' : 'text-black'
                  }`}>🎥</span>
                </div>
                <div className={`text-xs uppercase tracking-widest font-bold ${
                  theme === 'senegalais' ? 'text-yellow-200' : 'text-gray-400'
                }`}>Vidéos</div>
              </div>
              
              <div className="text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg ${
                  theme === 'senegalais' ? 'bg-yellow-400' : 'bg-white'
                }`}>
                  <span className={`text-2xl ${
                    theme === 'senegalais' ? 'text-orange-900' : 'text-black'
                  }`}>💬</span>
                </div>
                <div className={`text-xs uppercase tracking-widest font-bold ${
                  theme === 'senegalais' ? 'text-yellow-200' : 'text-gray-400'
                }`}>Témoignages</div>
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
          {/* Image de fond par défaut */}
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=1200&h=800&fit=crop&crop=center"
              alt="Sénégal"
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60"></div>
          </div>
          
          <div className="relative z-10 text-center py-20 px-8">
            <h1 className="text-6xl font-bold text-white mb-6 tracking-tight font-sans">
              CityzenMag
            </h1>
            <div className={`h-2 w-32 mx-auto mb-8 rounded-full ${
              theme === 'senegalais'
                ? 'bg-gradient-to-r from-white via-yellow-200 to-green-200'
                : 'bg-white'
            }`}></div>
            <p className={`text-2xl mb-10 max-w-4xl mx-auto leading-relaxed font-sans ${
              theme === 'senegalais' ? 'text-white' : 'text-gray-300'
            }`}>
              Plateforme de transparence et modernisation du Sénégal
            </p>
          </div>
        </div>
      )}

      {/* Section Articles Restants */}
      {remainingThreads.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold theme-text">Autres Articles & Analyses</h2>
              <p className="text-gray-600 mt-2">Découvrez plus de contenus de notre veille</p>
            </div>
            <Link 
              to="/search"
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${
                theme === 'senegalais'
                  ? 'bg-orange-100 text-orange-800 hover:bg-orange-200'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              <span>Voir tout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {remainingThreads.map(thread => (
              <ThreadCard key={thread.thread_id} thread={thread} />
            ))}
          </div>
        </div>
      )}

      {/* Message si aucun article */}
      {(!threads || threads.length === 0) && (
        <div className="text-center py-12">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
            theme === 'senegalais'
              ? 'bg-gradient-to-br from-orange-500 to-yellow-500'
              : 'bg-gray-900'
          }`}>
            <span className="text-2xl">📄</span>
          </div>
          <p className="text-gray-500 text-lg mb-2">Aucun article disponible</p>
          <p className="text-gray-400 text-sm">Les articles seront bientôt disponibles.</p>
        </div>
      )}
    </div>
  )
}