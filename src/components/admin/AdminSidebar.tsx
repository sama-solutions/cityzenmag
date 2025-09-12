import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Home,
  FolderOpen,
  FileText,
  Calendar,
  Menu as MenuIcon,
  Settings,
  BarChart3,
  LogOut
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import { ThemeSelector } from '../ThemeSelector'

interface SidebarItem {
  icon: React.ComponentType<{ className?: string }>
  label: string
  path: string
  description: string
}

const sidebarItems: SidebarItem[] = [
  {
    icon: BarChart3,
    label: 'Dashboard',
    path: '/admin',
    description: 'Vue d\'ensemble et statistiques'
  },
  {
    icon: FolderOpen,
    label: 'Catégories',
    path: '/admin/categories',
    description: 'Gestion des catégories'
  },
  {
    icon: FileText,
    label: 'Contenu',
    path: '/admin/content',
    description: 'Gestion des articles'
  },
  {
    icon: Calendar,
    label: 'Planificateur',
    path: '/admin/scheduler',
    description: 'Dates de publication'
  },
  {
    icon: MenuIcon,
    label: 'Menus',
    path: '/admin/menus',
    description: 'Configuration navigation'
  }
]

export function AdminSidebar() {
  const { logout } = useAuth()
  const { theme } = useTheme()
  const location = useLocation()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleLogout = () => {
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      logout()
    }
  }

  return (
    <div className={`flex flex-col h-full transition-all duration-300 ${
      isCollapsed ? 'w-20' : 'w-72'
    } ${
      theme === 'senegalais'
        ? 'bg-gradient-to-b from-blue-900 to-blue-800 border-r-4 border-yellow-400/30'
        : 'bg-black border-r border-gray-800'
    }`}>
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h1 className="text-xl font-bold text-white mb-1">CityzenMag</h1>
              <p className="text-sm text-white/70">Administration</p>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all"
          >
            <MenuIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {sidebarItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? theme === 'senegalais'
                    ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/30'
                    : 'bg-white/10 text-white border border-white/20'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className={`w-5 h-5 transition-colors ${
                isActive ? '' : 'group-hover:scale-110'
              }`} />
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs opacity-70 line-clamp-1">{item.description}</div>
                </div>
              )}
              {isActive && !isCollapsed && (
                <div className={`w-2 h-2 rounded-full ${
                  theme === 'senegalais' ? 'bg-yellow-400' : 'bg-white'
                }`}></div>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 space-y-3">
        {/* Sélecteur de thème */}
        {!isCollapsed && (
          <div className="px-2">
            <p className="text-xs text-white/70 mb-2">Thème</p>
            <ThemeSelector showLabel={false} variant="button" />
          </div>
        )}
        
        {/* Lien vers le site */}
        <Link
          to="/"
          className="flex items-center space-x-3 px-4 py-3 text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-all"
        >
          <Home className="w-5 h-5" />
          {!isCollapsed && <span>Voir le site</span>}
        </Link>
        
        {/* Déconnexion */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 text-white/70 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span>Déconnexion</span>}
        </button>
      </div>
    </div>
  )
}
