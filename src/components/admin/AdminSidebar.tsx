import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  FolderOpen, 
  FileText, 
  Calendar, 
  Menu as MenuIcon,
  BarChart3,
  LogOut,
  Home
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import { ThemeSelector } from '../ThemeSelector'

const menuItems = [
  { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { path: '/admin/categories', icon: FolderOpen, label: 'Catégories' },
  { path: '/admin/content', icon: FileText, label: 'Contenu' },
  { path: '/admin/scheduler', icon: Calendar, label: 'Planificateur' },
  { path: '/admin/menus', icon: MenuIcon, label: 'Menus' },
  { path: '/admin/analytics', icon: BarChart3, label: 'Analytics' }
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
      <nav className="flex-1 px-4 py-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path)
          const Icon = item.icon
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                isActive
                  ? theme === 'senegalais'
                    ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-lg'
                    : 'bg-white/10 text-white shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className={`mr-3 h-5 w-5 transition-colors ${
                isActive ? 'text-white' : 'text-white/70 group-hover:text-white'
              }`} />
              {!isCollapsed && (
                <div className="flex-1">
                  <div className="font-medium">{item.label}</div>
                </div>
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