import { useState } from 'react'
import { X, Twitter, Facebook, Linkedin, MessageCircle, Mail, Copy, Check } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  onShare: (platform: string) => void
  title: string
  description: string
  url: string
}

export function ShareModal({ isOpen, onClose, onShare, title, description, url }: ShareModalProps) {
  const { theme } = useTheme()
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const shareOptions = [
    {
      id: 'twitter',
      name: 'Twitter',
      icon: Twitter,
      color: 'bg-blue-500 hover:bg-blue-600 text-white',
      description: 'Partager sur Twitter'
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-600 hover:bg-blue-700 text-white',
      description: 'Partager sur Facebook'
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'bg-blue-700 hover:bg-blue-800 text-white',
      description: 'Partager sur LinkedIn'
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-green-500 hover:bg-green-600 text-white',
      description: 'Partager sur WhatsApp'
    },
    {
      id: 'email',
      name: 'Email',
      icon: Mail,
      color: 'bg-gray-600 hover:bg-gray-700 text-white',
      description: 'Partager par email'
    }
  ]

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Erreur copie lien:', error)
    }
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className={`bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto ${
        theme === 'senegalais' ? 'border-2 border-orange-200' : 'border border-gray-200'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Partager cet article</h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenu */}
        <div className="p-6">
          {/* Aperçu de l'article */}
          <div className={`p-4 rounded-lg mb-6 ${
            theme === 'senegalais' ? 'bg-orange-50' : 'bg-gray-50'
          }`}>
            <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">{title}</h4>
            <p className="text-gray-600 text-sm line-clamp-3">{description}</p>
          </div>

          {/* Options de partage */}
          <div className="space-y-3 mb-6">
            <h5 className="font-medium text-gray-900 mb-3">Choisir une plateforme :</h5>
            {shareOptions.map((option) => {
              const IconComponent = option.icon
              return (
                <button
                  key={option.id}
                  onClick={() => onShare(option.id)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all ${option.color} hover:scale-105`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="font-medium">{option.name}</span>
                  <span className="text-sm opacity-90 ml-auto">{option.description}</span>
                </button>
              )
            })}
          </div>

          {/* Copier le lien */}
          <div className="border-t border-gray-200 pt-6">
            <h5 className="font-medium text-gray-900 mb-3">Ou copier le lien :</h5>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={url}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm"
              />
              <button
                onClick={handleCopyLink}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  copied
                    ? 'bg-green-100 text-green-700'
                    : theme === 'senegalais'
                      ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Copié !</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copier</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Statistiques de partage */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Partagez pour aider à diffuser l'information et promouvoir la transparence au Sénégal
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}