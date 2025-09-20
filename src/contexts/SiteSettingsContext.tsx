import React, { createContext, useContext, useEffect, useState } from 'react'

export interface SiteSettings {
  title: string
  subtitle: string
  description: string
  heroTitle: string
  heroSubtitle: string
  heroDescription: string
  logo: string | null
  favicon: string | null
  author: string
  keywords: string[]
}

interface SiteSettingsContextType {
  settings: SiteSettings
  updateSettings: (newSettings: Partial<SiteSettings>) => void
  resetSettings: () => void
}

const defaultSettings: SiteSettings = {
  title: 'CityzenMag',
  subtitle: 'Magazine Citoyen Sénégalais',
  description: 'Le magazine digital de la transparence et de la modernisation institutionnelle au Sénégal',
  heroTitle: 'CityzenMag',
  heroSubtitle: 'Magazine Citoyen Sénégalais',
  heroDescription: 'Le magazine digital de la transparence et de la modernisation institutionnelle au Sénégal',
  logo: null,
  favicon: null,
  author: '@loi200812',
  keywords: ['transparence', 'sénégal', 'gouvernance', 'citoyenneté', 'modernisation']
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined)

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)

  // Charger les paramètres depuis localStorage au démarrage
  useEffect(() => {
    const savedSettings = localStorage.getItem('cityzenmag-site-settings')
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setSettings({ ...defaultSettings, ...parsed })
      } catch (error) {
        console.error('Erreur lors du chargement des paramètres:', error)
      }
    }
  }, [])

  // Appliquer les paramètres au document quand ils changent
  useEffect(() => {
    // Mettre à jour le titre de la page
    document.title = `${settings.title} - ${settings.subtitle}`
    
    // Mettre à jour les meta tags
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', settings.description)
    } else {
      const meta = document.createElement('meta')
      meta.name = 'description'
      meta.content = settings.description
      document.head.appendChild(meta)
    }
    
    const metaKeywords = document.querySelector('meta[name="keywords"]')
    if (metaKeywords) {
      metaKeywords.setAttribute('content', settings.keywords.join(', '))
    } else {
      const meta = document.createElement('meta')
      meta.name = 'keywords'
      meta.content = settings.keywords.join(', ')
      document.head.appendChild(meta)
    }
    
    // Mettre à jour le favicon si défini
    if (settings.favicon) {
      let favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement
      if (!favicon) {
        favicon = document.createElement('link')
        favicon.rel = 'icon'
        document.head.appendChild(favicon)
      }
      favicon.href = settings.favicon
    }
  }, [settings])

  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    const updatedSettings = { ...settings, ...newSettings }
    setSettings(updatedSettings)
    localStorage.setItem('cityzenmag-site-settings', JSON.stringify(updatedSettings))
  }

  const resetSettings = () => {
    setSettings(defaultSettings)
    localStorage.removeItem('cityzenmag-site-settings')
  }

  return (
    <SiteSettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SiteSettingsContext.Provider>
  )
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext)
  if (context === undefined) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider')
  }
  return context
}