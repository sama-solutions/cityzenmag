import { useState } from 'react'
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
  
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className={`relative overflow-hidden rounded-3xl shadow-2xl ${
        theme === 'senegalais' 
          ? 'bg-gradient-to-br from-orange-500 via-yellow-500 to-green-500 border-4 border-yellow-400/20'
          : 'bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-gray-700'
      }`}>
        <div className="relative text-center py-20 px-8">
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
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-3xl mx-auto mt-16">
            <div className="text-center group">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform ${
                theme === 'senegalais' ? 'bg-white' : 'bg-white'
              }`}>
                <span className={`text-2xl font-bold ${
                  theme === 'senegalais' ? 'text-orange-600' : 'text-black'
                }`}>🎤</span>
              </div>
              <div className={`text-xs uppercase tracking-widest font-bold ${
                theme === 'senegalais' ? 'text-white' : 'text-gray-400'
              }`}>Interviews</div>
            </div>
            
            <div className="text-center group">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform ${
                theme === 'senegalais' ? 'bg-white' : 'bg-white'
              }`}>
                <span className={`text-2xl font-bold ${
                  theme === 'senegalais' ? 'text-orange-600' : 'text-black'
                }`}>📸</span>
              </div>
              <div className={`text-xs uppercase tracking-widest font-bold ${
                theme === 'senegalais' ? 'text-white' : 'text-gray-400'
              }`}>Reportages</div>
            </div>
            
            <div className="text-center group">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform ${
                theme === 'senegalais' ? 'bg-white' : 'bg-white'
              }`}>
                <span className={`text-2xl font-bold ${
                  theme === 'senegalais' ? 'text-orange-600' : 'text-black'
                }`}>🎥</span>
              </div>
              <div className={`text-xs uppercase tracking-widest font-bold ${
                theme === 'senegalais' ? 'text-white' : 'text-gray-400'
              }`}>Vidéos</div>
            </div>
            
            <div className="text-center group">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform ${
                theme === 'senegalais' ? 'bg-white' : 'bg-white'
              }`}>
                <span className={`text-2xl font-bold ${
                  theme === 'senegalais' ? 'text-orange-600' : 'text-black'
                }`}>💬</span>
              </div>
              <div className={`text-xs uppercase tracking-widest font-bold ${
                theme === 'senegalais' ? 'text-white' : 'text-gray-400'
              }`}>Témoignages</div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Articles Twitter */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold theme-text">Articles & Analyses</h2>
            <p className="text-gray-600 mt-2">Derniers contenus de notre veille Twitter</p>
          </div>
        </div>

        {/* Articles Grid */}
        {threads && threads.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {threads.slice(0, 9).map(thread => (
              <ThreadCard key={thread.thread_id} thread={thread} />
            ))}
          </div>
        ) : (
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
    </div>
  )
}