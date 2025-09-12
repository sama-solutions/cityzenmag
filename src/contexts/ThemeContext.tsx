import React, { createContext, useContext, useEffect, useState } from 'react'
import type { ThemeMode, ThemeConfig } from '../types/admin'

interface ThemeContextType {
  theme: ThemeMode
  setTheme: (theme: ThemeMode) => void
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

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>('senegalais')

  useEffect(() => {
    // Charger le thème depuis localStorage
    const savedTheme = localStorage.getItem('cityzenmag-theme') as ThemeMode
    if (savedTheme && (savedTheme === 'senegalais' || savedTheme === 'minimaliste')) {
      setThemeState(savedTheme)
    }
  }, [])

  useEffect(() => {
    // Appliquer le thème aux CSS variables
    const config = theme === 'senegalais' ? senegalaisTheme : minimalisteTheme
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
  }, [theme])

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme)
    localStorage.setItem('cityzenmag-theme', newTheme)
  }

  const toggleTheme = () => {
    setTheme(theme === 'senegalais' ? 'minimaliste' : 'senegalais')
  }

  const themeConfig = theme === 'senegalais' ? senegalaisTheme : minimalisteTheme

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