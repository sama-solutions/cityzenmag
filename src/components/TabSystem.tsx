import { useState } from 'react'
import { Twitter, FileText, TrendingUp, Calendar } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

export type TabType = 'tweets' | 'articles'

interface TabSystemProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
  tweetsCount?: number
  articlesCount?: number
}

export function TabSystem({ activeTab, onTabChange, tweetsCount = 0, articlesCount = 0 }: TabSystemProps) {
  const { theme } = useTheme()

  const tabs = [
    {
      id: 'tweets' as TabType,
      label: 'Threads Twitter',
      icon: Twitter,
      count: tweetsCount,
      description: 'Analyses importées depuis X'
    },
    {
      id: 'articles' as TabType,
      label: 'Articles Éditoriaux',
      icon: FileText,
      count: articlesCount,
      description: 'Contenus rédigés par notre équipe'
    }
  ]

  return (
    <div className="mb-8">
      {/* Onglets */}
      <div className={`flex flex-col sm:flex-row gap-4 p-2 rounded-2xl border ${
        theme === 'senegalais'
          ? 'bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200/50'
          : 'bg-gray-50 border-gray-200'
      }`}>
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-3 px-6 py-4 rounded-xl font-bold transition-all duration-300 transform ${
                isActive
                  ? theme === 'senegalais'
                    ? 'bg-gradient-to-r from-orange-600 to-orange-700 text-white shadow-lg scale-105'
                    : 'theme-primary-bg shadow-lg scale-105'
                  : theme === 'senegalais'
                    ? 'text-orange-700 hover:bg-orange-100 hover:scale-102'
                    : 'theme-text hover:bg-gray-100 hover:scale-102'
              }`}
            >
              <Icon className={`w-5 h-5 ${
                isActive 
                  ? 'text-white' 
                  : theme === 'senegalais' 
                    ? 'text-orange-600' 
                    : 'theme-text-muted'
              }`} />
              <div className="flex flex-col items-start">
                <span className="text-sm sm:text-base">{tab.label}</span>
                <div className="flex items-center space-x-2 text-xs theme-text-muted">
                  <span>{tab.count} {tab.id === 'tweets' ? 'threads' : 'articles'}</span>
                  {!isActive && (
                    <span className="hidden sm:inline">• {tab.description}</span>
                  )}
                </div>
              </div>
              {tab.count > 0 && (
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : theme === 'senegalais'
                      ? 'bg-orange-100 text-orange-800'
                      : 'theme-surface theme-text'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Description de l'onglet actif */}
      <div className={`mt-4 p-4 rounded-xl ${
        theme === 'senegalais'
          ? 'bg-orange-50 border border-orange-200/50'
          : 'theme-surface border theme-border'
      }`}>
        <div className="flex items-center space-x-3">
          {activeTab === 'tweets' ? (
            <>
              <div className={`p-2 rounded-lg ${
                theme === 'senegalais' ? 'bg-orange-100' : 'bg-gray-100'
              }`}>
                <Twitter className={`w-4 h-4 ${
                  theme === 'senegalais' ? 'text-orange-600' : 'theme-text-muted'
                }`} />
              </div>
              <div>
                <h3 className={`font-bold ${
                  theme === 'senegalais' ? 'text-orange-900' : 'theme-text'
                }`}>
                  Threads Twitter
                </h3>
                <p className={`text-sm ${
                  theme === 'senegalais' ? 'text-orange-700' : 'theme-text-muted'
                }`}>
                  Analyses et investigations importées automatiquement depuis notre compte X (@loi200812)
                </p>
              </div>
            </>
          ) : (
            <>
              <div className={`p-2 rounded-lg ${
                theme === 'senegalais' ? 'bg-orange-100' : 'bg-gray-100'
              }`}>
                <FileText className={`w-4 h-4 ${
                  theme === 'senegalais' ? 'text-orange-600' : 'theme-text-muted'
                }`} />
              </div>
              <div>
                <h3 className={`font-bold ${
                  theme === 'senegalais' ? 'text-orange-900' : 'theme-text'
                }`}>
                  Articles Éditoriaux
                </h3>
                <p className={`text-sm ${
                  theme === 'senegalais' ? 'text-orange-700' : 'theme-text-muted'
                }`}>
                  Contenus originaux rédigés par notre équipe avec éditeur WYSIWYG et contenu multimédia
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}