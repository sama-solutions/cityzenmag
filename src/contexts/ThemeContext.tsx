import React, { createContext, useContext, useEffect, useState } from 'react'
import type { ThemeMode, ThemeConfig } from '../types/admin'

type ExtendedThemeMode = ThemeMode | 'dark' | 'ocean' | 'enterprise'

interface ThemeContextType {
  theme: ExtendedThemeMode
  setTheme: (theme: ExtendedThemeMode) => void
  themeConfig: ThemeConfig
  toggleTheme: () => void
}

const senegalaisTheme: ThemeConfig = {
  mode: 'senegalais',
  colors: {
    primary: '#D2691E', // Orange terre
    secondary: '#1e3a8a', // Bleu nuit
    accent: '#fbbf24', // Jaune soleil
    background: 'linear-gradient(135deg, #fed7aa 0%, #fef3c7 50%, #dbeafe 100%)',
    surface: '#ffffff',
    text: '#1f2937',
    textSecondary: '#6b7280'
  },
  fonts: {
    sans: '"Inter", "Segoe UI", "Roboto", "Helvetica Neue", sans-serif'
  }
}

const minimalisteTheme: ThemeConfig = {
  mode: 'minimaliste',
  colors: {
    primary: '#000000',
    secondary: '#6c757d',
    accent: '#374151',
    background: '#ffffff',
    surface: '#f8f9fa',
    text: '#000000',
    textSecondary: '#6c757d'
  },
  fonts: {
    sans: '"Inter", "system-ui", "-apple-system", sans-serif'
  }
}

const darkTheme: ThemeConfig = {
  mode: 'dark',
  colors: {
    primary: '#3b82f6',
    secondary: '#64748b',
    accent: '#06b6d4',
    background: '#0f172a',
    surface: '#1e293b',
    text: '#f1f5f9',
    textSecondary: '#94a3b8'
  },
  fonts: {
    sans: '"Inter", "system-ui", "-apple-system", sans-serif'
  }
}

const oceanTheme: ThemeConfig = {
  mode: 'ocean',
  colors: {
    primary: '#0891b2', // Cyan océan
    secondary: '#0e7490', // Cyan foncé
    accent: '#06b6d4', // Cyan clair
    background: 'linear-gradient(135deg, #cffafe 0%, #e0f2fe 50%, #f0f9ff 100%)',
    surface: '#ffffff',
    text: '#0f172a',
    textSecondary: '#475569'
  },
  fonts: {
    sans: '"Inter", "system-ui", "-apple-system", sans-serif'
  }
}

const enterpriseTheme: ThemeConfig = {
  mode: 'enterprise',
  colors: {
    primary: '#1f2937', // Gris anthracite
    secondary: '#4b5563', // Gris moyen
    accent: '#3b82f6', // Bleu corporate
    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)',
    surface: '#ffffff',
    text: '#111827',
    textSecondary: '#6b7280'
  },
  fonts: {
    sans: '"Inter", "system-ui", "-apple-system", sans-serif'
  }
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ExtendedThemeMode>('senegalais')

  useEffect(() => {
    // Charger le thème depuis localStorage
    const savedTheme = localStorage.getItem('cityzenmag-theme') as ExtendedThemeMode
    if (savedTheme && ['senegalais', 'minimaliste', 'dark', 'ocean', 'enterprise'].includes(savedTheme)) {
      setThemeState(savedTheme)
    }
  }, [])

  useEffect(() => {
    // Appliquer le thème aux CSS variables
    const config = theme === 'senegalais' ? senegalaisTheme : 
                   theme === 'dark' ? darkTheme :
                   theme === 'ocean' ? oceanTheme :
                   theme === 'enterprise' ? enterpriseTheme : minimalisteTheme
    const root = document.documentElement
    
    root.style.setProperty('--theme-primary', config.colors.primary)
    root.style.setProperty('--theme-secondary', config.colors.secondary)
    root.style.setProperty('--theme-accent', config.colors.accent)
    root.style.setProperty('--theme-background', config.colors.background)
    root.style.setProperty('--theme-surface', config.colors.surface)
    root.style.setProperty('--theme-text', config.colors.text)
    root.style.setProperty('--theme-text-secondary', config.colors.textSecondary)
    root.style.setProperty('--theme-font-sans', config.fonts.sans)
    
    // Appliquer la classe du thème au body
    document.body.className = `theme-${theme}`
    
    // Ajouter/supprimer la classe dark pour Tailwind
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  const setTheme = (newTheme: ExtendedThemeMode) => {
    setThemeState(newTheme)
    localStorage.setItem('cityzenmag-theme', newTheme)
  }

  const toggleTheme = () => {
    const nextTheme = theme === 'senegalais' ? 'minimaliste' : 
                      theme === 'minimaliste' ? 'dark' :
                      theme === 'dark' ? 'ocean' :
                      theme === 'ocean' ? 'enterprise' : 'senegalais'
    setTheme(nextTheme)
  }

  const themeConfig = theme === 'senegalais' ? senegalaisTheme : 
                      theme === 'dark' ? darkTheme :
                      theme === 'ocean' ? oceanTheme :
                      theme === 'enterprise' ? enterpriseTheme : minimalisteTheme

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themeConfig, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}