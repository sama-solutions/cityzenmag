import { useState, useEffect } from 'react'
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
  Camera,
  ChevronDown,
  FileText,
  Plus,
  MessageSquare,
  MessageCircle,
  Users,
  Bookmark
} from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { useSiteSettings } from '../contexts/SiteSettingsContext'
import { ThemeSelector } from './ThemeSelector'
import { AdvancedSearchBar } from './search/AdvancedSearchBar'
import { FavoritesPanel } from './social/FavoritesPanel'
import { useSyncTwitter } from '../hooks/useData'
import { useAuth } from '../contexts/AuthContext'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isContentMenuOpen, setIsContentMenuOpen] = useState(false)
  const [isParticipateMenuOpen, setIsParticipateMenuOpen] = useState(false)
  const [contentMenuTimeout, setContentMenuTimeout] = useState<NodeJS.Timeout | null>(null)
  const [participateMenuTimeout, setParticipateMenuTimeout] = useState<NodeJS.Timeout | null>(null)
  const [showFavorites, setShowFavorites] = useState(false)
  const { syncNow, loading: syncing } = useSyncTwitter()
  const { isAdmin } = useAuth()
  const { theme } = useTheme()
  const { settings } = useSiteSettings()

  // Nettoyage des timeouts au démontage
  useEffect(() => {
    return () => {
      if (contentMenuTimeout) clearTimeout(contentMenuTimeout)
      if (participateMenuTimeout) clearTimeout(participateMenuTimeout)
    }
  }, [contentMenuTimeout, participateMenuTimeout])

  const handleSync = async () => {
    try {
      await syncNow()
      window.location.reload() // Refresh to show new data
    } catch (error) {
      console.error('Sync failed:', error)
    }
  }

  // Fonctions pour gérer les menus avec délai
  const handleContentMenuEnter = () => {
    if (contentMenuTimeout) {
      clearTimeout(contentMenuTimeout)
      setContentMenuTimeout(null)
    }
    setIsContentMenuOpen(true)
  }

  const handleContentMenuLeave = () => {
    const timeout = setTimeout(() => {
      setIsContentMenuOpen(false)
    }, 150) // Délai de 150ms
    setContentMenuTimeout(timeout)
  }

  const handleParticipateMenuEnter = () => {
    if (participateMenuTimeout) {
      clearTimeout(participateMenuTimeout)
      setParticipateMenuTimeout(null)
    }
    setIsParticipateMenuOpen(true)
  }

  const handleParticipateMenuLeave = () => {
    const timeout = setTimeout(() => {
      setIsParticipateMenuOpen(false)
    }, 150) // Délai de 150ms
    setParticipateMenuTimeout(timeout)
  }

  return (
    <>
    <header className={`shadow-2xl border-b-4 ${
      theme === 'senegalais'
        ? 'bg-gradient-to-r from-orange-800 via-blue-900 to-yellow-600 border-yellow-400/30'
        : 'bg-white border-gray-200'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo - Style adaptatif avec paramètres personnalisés */}
          <Link to="/" className="flex items-center space-x-4 group">
            {/* Logo personnalisé ou icône par défaut */}
            {settings.logo ? (
              <img 
                src={settings.logo} 
                alt="Logo" 
                className="w-12 h-12 rounded-2xl object-cover shadow-lg border-3 border-white/20 group-hover:scale-110 transition-transform"
              />
            ) : (
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg border-3 group-hover:scale-110 transition-transform ${
                theme === 'senegalais'
                  ? 'bg-gradient-to-br from-yellow-400 to-orange-600 border-white/20'
                  : theme === 'dark'
                    ? 'bg-gradient-to-br from-slate-700 to-slate-600 border-slate-500'
                    : 'bg-black border-gray-300'
              }`}>
                <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L15.09 5.09L19 4L18.18 7.82L22 9L18.18 10.18L19 14L15.09 12.91L12 16L8.91 12.91L5 14L5.82 10.18L2 9L5.82 7.82L5 4L8.91 5.09L12 2Z"/>
                </svg>
              </div>
            )}
            
            <div>
              <h1 className={`text-2xl font-bold font-sans ${
                theme === 'senegalais' ? 'text-white' : 'theme-text'
              }`}>{settings.title}</h1>
              <p className={`text-sm font-sans ${
                theme === 'senegalais' ? 'text-yellow-200' : 'theme-text-muted'
              }`}>{settings.subtitle}</p>
            </div>
          </Link>

          {/* Desktop Navigation - 2 niveaux */}
          <nav className="hidden lg:flex items-center space-x-2">
            {/* Niveau 1 : Navigation principale */}
            <Link 
              to="/" 
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-bold transition-all hover:bg-white/10 backdrop-blur-sm ${
                theme === 'senegalais' ? 'text-yellow-200 hover:text-white' : 'theme-text'
              }`}
            >
              <Hash className="w-4 h-4" />
              <span>Accueil</span>
            </Link>

            {/* Dropdown Contenu */}
            <div className="relative">
              <button
                onMouseEnter={handleContentMenuEnter}
                onMouseLeave={handleContentMenuLeave}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-bold transition-all hover:bg-white/10 backdrop-blur-sm ${
                  theme === 'senegalais' ? 'text-yellow-200 hover:text-white' : 'theme-text'
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
                  onMouseEnter={handleContentMenuEnter}
                  onMouseLeave={handleContentMenuLeave}
                >
                  <Link
                    to="/search"
                    className="flex items-center space-x-3 px-4 py-3 theme-text hover:bg-gray-50 transition-colors"
                  >
                    <Search className="w-4 h-4 theme-text-muted" />
                    <div>
                      <div className="font-medium">Rechercher</div>
                      <div className="text-xs theme-text-muted">Articles et analyses</div>
                    </div>
                  </Link>
                  <Link
                    to="/interviews"
                    className="flex items-center space-x-3 px-4 py-3 theme-text hover:bg-gray-50 transition-colors"
                  >
                    <Mic className="w-4 h-4 theme-text-muted" />
                    <div>
                      <div className="font-medium">Interviews</div>
                      <div className="text-xs theme-text-muted">Témoignages d'experts</div>
                    </div>
                  </Link>
                  <Link
                    to="/reportages"
                    className="flex items-center space-x-3 px-4 py-3 theme-text hover:bg-gray-50 transition-colors"
                  >
                    <Camera className="w-4 h-4 theme-text-muted" />
                    <div>
                      <div className="font-medium">Reportages Photo</div>
                      <div className="text-xs theme-text-muted">Galeries immersives</div>
                    </div>
                  </Link>
                  <Link
                    to="/videos"
                    className="flex items-center space-x-3 px-4 py-3 theme-text hover:bg-gray-50 transition-colors"
                  >
                    <Video className="w-4 h-4 theme-text-muted" />
                    <div>
                      <div className="font-medium">Vidéos Analyses</div>
                      <div className="text-xs theme-text-muted">Décryptages d'experts</div>
                    </div>
                  </Link>
                  <Link
                    to="/temoignages"
                    className="flex items-center space-x-3 px-4 py-3 theme-text hover:bg-gray-50 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 theme-text-muted" />
                    <div>
                      <div className="font-medium">Témoignages Citoyens</div>
                      <div className="text-xs theme-text-muted">Voix des citoyens</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* Dropdown Participer */}
            <div className="relative">
              <button
                onMouseEnter={handleParticipateMenuEnter}
                onMouseLeave={handleParticipateMenuLeave}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-bold transition-all hover:bg-white/10 backdrop-blur-sm ${
                  theme === 'senegalais' ? 'text-yellow-200 hover:text-white' : 'theme-text'
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
                  onMouseEnter={handleParticipateMenuEnter}
                  onMouseLeave={handleParticipateMenuLeave}
                >
                  <Link
                    to="/debat"
                    className="flex items-center space-x-3 px-4 py-3 theme-text hover:bg-gray-50 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4 theme-text-muted" />
                    <div>
                      <div className="font-medium">Proposer un débat</div>
                      <div className="text-xs theme-text-muted">Organiser une discussion</div>
                    </div>
                  </Link>
                  <Link
                    to="/partager-histoire"
                    className="flex items-center space-x-3 px-4 py-3 theme-text hover:bg-gray-50 transition-colors"
                  >
                    <Heart className="w-4 h-4 theme-text-muted" />
                    <div>
                      <div className="font-medium">Partager votre histoire</div>
                      <div className="text-xs theme-text-muted">Témoignage citoyen</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Actions à droite */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Search Bar Avancée */}
            <div className="w-80">
              <AdvancedSearchBar
                size="sm"
                placeholder="Rechercher..."
              />
            </div>

            {/* Bouton Favoris */}
            <button
              onClick={() => setShowFavorites(true)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all ${
                theme === 'senegalais'
                  ? 'bg-orange-100 text-orange-600 hover:bg-orange-200 border border-orange-300'
                  : 'theme-primary-bg'
              }`}
              title="Mes favoris"
            >
              <Bookmark className="w-4 h-4" />
              <span className="hidden sm:inline">Favoris</span>
            </button>

            {/* Sync Button - Compact */}
            <button
              onClick={handleSync}
              disabled={syncing}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all ${
                syncing
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : theme === 'senegalais'
                    ? 'bg-blue-900 text-yellow-400 hover:bg-blue-800 border-2 border-yellow-400/30'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <Twitter className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{syncing ? 'Sync...' : 'Sync'}</span>
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
                    <Link 
                      to="/reportages" 
                      className="flex items-center space-x-3 px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Camera className="w-4 h-4" />
                      <span>Reportages Photo</span>
                    </Link>
                    <Link 
                      to="/videos" 
                      className="flex items-center space-x-3 px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Video className="w-4 h-4" />
                      <span>Vidéos Analyses</span>
                    </Link>
                    <Link 
                      to="/temoignages" 
                      className="flex items-center space-x-3 px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Témoignages Citoyens</span>
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
                      <MessageSquare className="w-4 h-4" />
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
                <AdvancedSearchBar
                  size="md"
                  placeholder="Rechercher..."
                />
              </div>

              {/* Mobile Sync Button */}
              <div className="px-4">
                <button
                  onClick={handleSync}
                  disabled={syncing}
                  className={`flex items-center justify-center space-x-3 px-6 py-3 rounded-xl font-bold transition-all shadow-lg font-sans border w-full ${
                    syncing 
                      ? 'bg-gray-100/80 text-gray-500 cursor-not-allowed border-gray-300' 
                      : 'theme-surface theme-text theme-border'
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

    {/* Panel des favoris */}
    <FavoritesPanel
      isOpen={showFavorites}
      onClose={() => setShowFavorites(false)}
    />
    </>
  )
}