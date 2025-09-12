import { Grid, Columns, Focus, Layers } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

type LayoutType = 'grid' | 'columns' | 'focus' | 'mosaic'

interface LayoutSelectorProps {
  currentLayout: LayoutType
  onLayoutChange: (layout: LayoutType) => void
  className?: string
}

const layouts = [
  {
    id: 'grid' as LayoutType,
    name: 'Grille',
    description: 'Vue en grille classique',
    icon: Grid
  },
  {
    id: 'columns' as LayoutType,
    name: 'Colonnes',
    description: 'Organisé par thématiques',
    icon: Columns
  },
  {
    id: 'focus' as LayoutType,
    name: 'Focus',
    description: 'Article principal + sidebar',
    icon: Focus
  },
  {
    id: 'mosaic' as LayoutType,
    name: 'Mosaïque',
    description: 'Tailles variables dynamiques',
    icon: Layers
  }
]

export function LayoutSelector({ currentLayout, onLayoutChange, className = '' }: LayoutSelectorProps) {
  const { theme } = useTheme()

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <span className="text-sm font-medium theme-text-muted mr-2">Layout:</span>
      {layouts.map((layout) => {
        const Icon = layout.icon
        const isActive = currentLayout === layout.id
        
        return (
          <button
            key={layout.id}
            onClick={() => onLayoutChange(layout.id)}
            title={`${layout.name} - ${layout.description}`}
            className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 ${
              isActive
                ? theme === 'senegalais'
                  ? 'bg-orange-600 text-white shadow-lg'
                  : 'bg-black text-white shadow-lg'
                : theme === 'senegalais'
                  ? 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Icon className="w-5 h-5" />
          </button>
        )
      })}
    </div>
  )
}

export type { LayoutType }