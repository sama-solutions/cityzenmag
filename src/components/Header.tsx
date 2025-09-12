import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Twitter, Menu, X, Sparkles, Hash, Settings, Video, Heart } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { ThemeSelector } from './ThemeSelector'
import { useSyncTwitter } from '../hooks/useData'
import { useAuth } from '../contexts/AuthContext'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { syncNow, loading: syncing } = useSyncTwitter()
  const { isAdmin } = useAuth()
  const { theme } = useTheme()
  const navigate = useNavigate()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleSync = async () => {
    try {
      await syncNow()
      window.location.reload() // Refresh to show new data
    } catch (error) {
      console.error('Sync failed:', error)
    }
  }

  return (
    <header className={`shadow-2xl border-b-4 ${
      theme === 'senegalais'
        ? 'bg-gradient-to-r from-orange-800 via-blue-900 to-yellow-600 border-yellow-400/30'
        : 'bg-white border-gray-200'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo - Style adaptatif */}
          <Link to="/" className="flex items-center space-x-4 group">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg border-3 group-hover:scale-110 transition-transform ${
              theme === 'senegalais'
                ? 'bg-gradient-to-br from-yellow-400 to-orange-600 border-white/20'
                : 'bg-black border-gray-300'
            }`}>
              <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L15.09 5.09L19 4L18.18 7.82L22 9L18.18 10.18L19 14L15.09 12.91L12 16L8.91 12.91L5 14L5.82 10.18L2 9L5.82 7.82L5 4L8.91 5.09L12 2Z"/>
              </svg>
            </div>
            <div>
              <h1 className={`text-2xl font-bold font-sans ${
                theme === 'senegalais' ? 'text-white' : 'text-gray-900'
              }`}>CityzenMag</h1>
              <p className={`text-sm font-sans ${
                theme === 'senegalais' ? 'text-yellow-200' : 'text-gray-600'
              }`}>Magazine de Transparence & Modernisation</p>
            </div>
            {/* Motif décoratif */}
            <div className={`hidden lg:block w-8 h-8 border-2 rounded-full ${
              theme === 'senegalais' ? 'border-yellow-400/50' : 'border-gray-300'
            }`}>
              <div className={`w-4 h-4 rounded-full mt-1 ml-1 opacity-60 ${
                theme === 'senegalais' ? 'bg-yellow-400' : 'bg-gray-400'
              }`}></div>
            </div>
          </Link>

          {/* Desktop Navigation - Style Sénégalais */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-yellow-200 hover:text-white font-bold transition-colors font-sans flex items-center space-x-2 px-4 py-2 rounded-full hover:bg-white/10"
            >
              <Hash className="w-4 h-4" />
              <span>Accueil</span>
            </Link>
            {/* Navigation Links - Style Sénégalais */}
            <Link 
              to="/search" 
              className="flex items-center space-x-2 px-4 py-2 rounded-xl font-bold transition-all hover:bg-white/10 backdrop-blur-sm"
            >
              <Search className="w-4 h-4" />
              <span>Rechercher</span>
            </Link>
            
            <Link 
              to="/debat" 
              className="flex items-center space-x-2 px-4 py-2 rounded-xl font-bold transition-all hover:bg-white/10 backdrop-blur-sm"
            >
              <Video className="w-4 h-4" />
              <span>Proposer un débat</span>
            </Link>
            
            <Link 
              to="/partager-histoire" 
              className="flex items-center space-x-2 px-4 py-2 rounded-xl font-bold transition-all hover:bg-white/10 backdrop-blur-sm"
            >
              <Heart className="w-4 h-4" />
              <span>Partagez votre histoire</span>
            </Link>
          </nav>

          {/* Search Bar - Style Sénégalais */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher dans les threads..."
                className="w-72 pl-5 pr-12 py-3 bg-white/90 border-2 border-orange-300 rounded-2xl focus:ring-4 focus:ring-yellow-400/50 focus:border-yellow-400 focus:bg-white outline-none font-sans placeholder-gray-600 shadow-lg backdrop-blur-sm"
              />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-orange-600 hover:text-orange-700 bg-yellow-400 w-8 h-8 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all hover:scale-110"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Sync Button - Style Sénégalais */}
          <button
            onClick={handleSync}
            disabled={syncing}
            className={`hidden md:flex items-center space-x-3 px-6 py-3 rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-sans border-2 ${
              syncing 
                ? 'bg-gray-100/80 text-gray-500 cursor-not-allowed border-gray-300' 
                : 'bg-white text-orange-600 hover:bg-yellow-50 border-orange-300 hover:border-yellow-400'
            }`}
          >
            <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center">
              <Twitter className={`w-4 h-4 text-white ${syncing ? 'animate-spin' : ''}`} />
            </div>
            <span>{syncing ? 'Synchronisation...' : 'Synchroniser'}</span>
          </button>

          {/* Mobile Menu Button - Style Sénégalais */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-3 text-yellow-200 hover:text-white bg-white/10 rounded-2xl hover:bg-white/20 transition-all"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu - Style Sénégalais */}
        {isMenuOpen && (
          <div className="md:hidden py-6 border-t-2 border-yellow-400/30 bg-gradient-to-r from-orange-700 to-blue-800">
            <div className="space-y-6">
              <Link 
                to="/" 
                className="flex items-center space-x-3 text-yellow-200 hover:text-white font-bold transition-colors font-sans px-4 py-3 rounded-xl hover:bg-white/10"
                onClick={() => setIsMenuOpen(false)}
              >
                <Hash className="w-5 h-5" />
                <span>Accueil</span>
              </Link>
              <Link 
                to="/search" 
                className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Search className="w-5 h-5" />
                <span>Rechercher</span>
              </Link>
              
              <Link 
                to="/debat" 
                className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Video className="w-5 h-5" />
                <span>Proposer un débat</span>
              </Link>
              
              <Link 
                to="/partager-histoire" 
                className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Heart className="w-5 h-5" />
                <span>Partagez votre histoire</span>
              </Link>
              
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="flex items-center px-4">
                <div className="relative w-full">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher..."
                    className="w-full pl-5 pr-12 py-3 bg-white/90 border-2 border-orange-300 rounded-2xl focus:ring-4 focus:ring-yellow-400/50 focus:border-yellow-400 focus:bg-white outline-none font-sans placeholder-gray-600 shadow-lg"
                  />
                  <button 
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-orange-600 hover:text-orange-700 bg-yellow-400 w-8 h-8 rounded-full flex items-center justify-center shadow-md"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </div>
              </form>

              {/* Mobile Sync Button */}
              <button
                onClick={handleSync}
                disabled={syncing}
                className={`mx-4 flex items-center justify-center space-x-3 px-6 py-4 rounded-2xl font-bold transition-all duration-300 shadow-lg font-sans border-2 w-full ${
                  syncing 
                    ? 'bg-gray-100/80 text-gray-500 cursor-not-allowed border-gray-300' 
                    : 'bg-white text-orange-600 hover:bg-yellow-50 border-orange-300'
                }`}
              >
                <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center">
                  <Twitter className={`w-4 h-4 text-white ${syncing ? 'animate-spin' : ''}`} />
                </div>
                <span>{syncing ? 'Synchronisation...' : 'Synchroniser'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}