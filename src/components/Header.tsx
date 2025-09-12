import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Search, 
  Twitter, 
  Menu, 
  X, 
  Hash, 
  Video, 
  Heart, 
  Mic, 
  ChevronDown,
  FileText,
  Plus
} from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { ThemeSelector } from './ThemeSelector'
import { useSyncTwitter } from '../hooks/useData'
import { useAuth } from '../contexts/AuthContext'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isContentMenuOpen, setIsContentMenuOpen] = useState(false)
  const [isParticipateMenuOpen, setIsParticipateMenuOpen] = useState(false)
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
          </Link>

          {/* Desktop Navigation - 2 niveaux */}
          <nav className="hidden lg:flex items-center space-x-2">
            {/* Niveau 1 : Navigation principale */}
            <Link 
              to="/" 
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-bold transition-all hover:bg-white/10 backdrop-blur-sm ${
                theme === 'senegalais' ? 'text-yellow-200 hover:text-white' : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              <Hash className="w-4 h-4" />
              <span>Accueil</span>
            </Link>

            {/* Dropdown Contenu */}
            <div className="relative">
              <button
                onMouseEnter={() => setIsContentMenuOpen(true)}
                onMouseLeave={() => setIsContentMenuOpen(false)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-bold transition-all hover:bg-white/10 backdrop-blur-sm ${
                  theme === 'senegalais' ? 'text-yellow-200 hover:text-white' : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Contenu</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {/* Sous-menu Contenu */}
              {isContentMenuOpen && (
                <div 
                  className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50"
                  onMouseEnter={() => setIsContentMenuOpen(true)}
                  onMouseLeave={() => setIsContentMenuOpen(false)}
                >
                  <Link
                    to="/search"
                    className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Search className="w-4 h-4 text-gray-500" />
                    <div>
                      <div className="font-medium">Rechercher</div>
                      <div className="text-xs text-gray-500">Articles et analyses</div>
                    </div>
                  </Link>
                  <Link
                    to="/interviews"
                    className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Mic className="w-4 h-4 text-gray-500" />
                    <div>
                      <div className="font-medium">Interviews</div>
                      <div className="text-xs text-gray-500">Témoignages d'experts</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* Dropdown Participer */}
            <div className="relative">
              <button
                onMouseEnter={() => setIsParticipateMenuOpen(true)}
                onMouseLeave={() => setIsParticipateMenuOpen(false)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-bold transition-all hover:bg-white/10 backdrop-blur-sm ${
                  theme === 'senegalais' ? 'text-yellow-200 hover:text-white' : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>Participer</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {/* Sous-menu Participer */}
              {isParticipateMenuOpen && (
                <div 
                  className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50"
                  onMouseEnter={() => setIsParticipateMenuOpen(true)}
                  onMouseLeave={() => setIsParticipateMenuOpen(false)}
                >
                  <Link
                    to="/debat"
                    className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Video className="w-4 h-4 text-gray-500" />
                    <div>
                      <div className="font-medium">Proposer un débat</div>
                      <div className="text-xs text-gray-500">Organiser une discussion</div>
                    </div>
                  </Link>
                  <Link
                    to="/partager-histoire"
                    className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Heart className="w-4 h-4 text-gray-500" />
                    <div>
                      <div className="font-medium">Partager votre histoire</div>
                      <div className="text-xs text-gray-500">Témoignage citoyen</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Actions à droite */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Search Bar - Compacte */}
            <form onSubmit={handleSearch} className="flex items-center">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher..."
                  className="w-64 pl-4 pr-10 py-2 bg-white/90 border border-orange-300 rounded-xl focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 focus:bg-white outline-none font-sans placeholder-gray-600 shadow-md backdrop-blur-sm"
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-orange-600 hover:text-orange-700 p-1 rounded-md hover:bg-yellow-100 transition-all"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Sync Button - Compact */}
            <button
              onClick={handleSync}
              disabled={syncing}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all shadow-md hover:shadow-lg ${
                syncing 
                  ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                  : 'bg-white text-orange-600 hover:bg-yellow-50 border border-orange-300 hover:border-yellow-400'
              }`}
            >
              <Twitter className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
              <span className="hidden xl:block">{syncing ? 'Sync...' : 'Sync'}</span>
            </button>

            {/* Theme Selector */}
            <ThemeSelector showLabel={false} variant="button" />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-3 text-yellow-200 hover:text-white bg-white/10 rounded-2xl hover:bg-white/20 transition-all"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu - Simplifié */}
        {isMenuOpen && (
          <div className="lg:hidden py-6 border-t-2 border-yellow-400/30 bg-gradient-to-r from-orange-700 to-blue-800">
            <div className="space-y-4">
              {/* Navigation principale mobile */}
              <div className="space-y-2">
                <Link 
                  to="/" 
                  className="flex items-center space-x-3 text-yellow-200 hover:text-white font-bold transition-colors font-sans px-4 py-3 rounded-xl hover:bg-white/10"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Hash className="w-5 h-5" />
                  <span>Accueil</span>
                </Link>

                {/* Section Contenu */}
                <div className="px-4">
                  <div className="text-yellow-300 text-sm font-bold mb-2 uppercase tracking-wide">Contenu</div>
                  <div className="space-y-1 ml-4">
                    <Link 
                      to="/search" 
                      className="flex items-center space-x-3 px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Search className="w-4 h-4" />
                      <span>Rechercher</span>
                    </Link>
                    <Link 
                      to="/interviews" 
                      className="flex items-center space-x-3 px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Mic className="w-4 h-4" />
                      <span>Interviews</span>
                    </Link>
                  </div>
                </div>

                {/* Section Participer */}
                <div className="px-4">
                  <div className="text-yellow-300 text-sm font-bold mb-2 uppercase tracking-wide">Participer</div>
                  <div className="space-y-1 ml-4">
                    <Link 
                      to="/debat" 
                      className="flex items-center space-x-3 px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Video className="w-4 h-4" />
                      <span>Proposer un débat</span>
                    </Link>
                    <Link 
                      to="/partager-histoire" 
                      className="flex items-center space-x-3 px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Heart className="w-4 h-4" />
                      <span>Partager votre histoire</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Mobile Search */}
              <div className="px-4 pt-4 border-t border-white/20">
                <form onSubmit={handleSearch} className="flex items-center">
                  <div className="relative w-full">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Rechercher..."
                      className="w-full pl-4 pr-10 py-3 bg-white/90 border border-orange-300 rounded-xl focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 focus:bg-white outline-none font-sans placeholder-gray-600 shadow-lg"
                    />
                    <button 
                      type="submit"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-orange-600 hover:text-orange-700 bg-yellow-400 w-8 h-8 rounded-lg flex items-center justify-center shadow-md"
                    >
                      <Search className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>

              {/* Mobile Sync Button */}
              <div className="px-4">
                <button
                  onClick={handleSync}
                  disabled={syncing}
                  className={`flex items-center justify-center space-x-3 px-6 py-3 rounded-xl font-bold transition-all shadow-lg font-sans border w-full ${
                    syncing 
                      ? 'bg-gray-100/80 text-gray-500 cursor-not-allowed border-gray-300' 
                      : 'bg-white text-orange-600 hover:bg-yellow-50 border-orange-300'
                  }`}
                >
                  <Twitter className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
                  <span>{syncing ? 'Synchronisation...' : 'Synchroniser'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}