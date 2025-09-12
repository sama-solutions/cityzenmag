import { useState } from 'react'
import { Palette, Check, Sun, Moon } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

interface ThemeSelectorProps {
  showLabel?: boolean
  variant?: 'button' | 'dropdown'
}

export function ThemeSelector({ showLabel = true, variant = 'dropdown' }: ThemeSelectorProps) {
  const { theme, setTheme, toggleTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  if (variant === 'button') {
    return (
      <button
        onClick={toggleTheme}
        className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 text-white border border-white/20 hover:border-white/30"
      >
        {theme === 'senegalais' ? (
          <Sun className="w-5 h-5" />
        ) : (
          <Moon className="w-5 h-5" />
        )}
        {showLabel && (
          <span className="font-medium">
            {theme === 'senegalais' ? 'Sénégalais' : 'Minimaliste'}
          </span>
        )}
      </button>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 text-white border border-white/20 hover:border-white/30"
      >
        <Palette className="w-5 h-5" />
        {showLabel && (
          <span className="font-medium">
            Thème: {theme === 'senegalais' ? 'Sénégalais' : 'Minimaliste'}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-200 z-20 overflow-hidden">
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Choisir un thème</h3>
              
              {/* Thème Sénégalais */}
              <button
                onClick={() => {
                  setTheme('senegalais')
                  setIsOpen(false)
                }}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-300 mb-3 text-left ${
                  theme === 'senegalais'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-gray-900 mb-1">Sénégalais</div>
                    <div className="text-sm text-gray-600">Couleurs chaudes et symboles culturels</div>
                  </div>
                  {theme === 'senegalais' && (
                    <Check className="w-5 h-5 text-orange-600" />
                  )}
                </div>
                <div className="flex space-x-2 mt-3">
                  <div className="w-6 h-6 rounded-full bg-orange-600"></div>
                  <div className="w-6 h-6 rounded-full bg-blue-900"></div>
                  <div className="w-6 h-6 rounded-full bg-yellow-500"></div>
                </div>
              </button>
              
              {/* Thème Minimaliste */}
              <button
                onClick={() => {
                  setTheme('minimaliste')
                  setIsOpen(false)
                }}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                  theme === 'minimaliste'
                    ? 'border-gray-900 bg-gray-50'
                    : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-gray-900 mb-1">Minimaliste</div>
                    <div className="text-sm text-gray-600">Design épuré et professionnel</div>
                  </div>
                  {theme === 'minimaliste' && (
                    <Check className="w-5 h-5 text-gray-900" />
                  )}
                </div>
                <div className="flex space-x-2 mt-3">
                  <div className="w-6 h-6 rounded-full bg-black"></div>
                  <div className="w-6 h-6 rounded-full bg-gray-500"></div>
                  <div className="w-6 h-6 rounded-full bg-white border border-gray-300"></div>
                </div>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}