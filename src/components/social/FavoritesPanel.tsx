import { useState } from 'react'
import { Heart, Bookmark, X, Trash2 } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { useUserFavorites } from '../../hooks/useSocial'
import { socialService } from '../../services/socialService'

interface FavoritesPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function FavoritesPanel({ isOpen, onClose }: FavoritesPanelProps) {
  const { theme } = useTheme()
  const { likedContent, bookmarkedContent, refreshFavorites } = useUserFavorites()
  const [activeTab, setActiveTab] = useState<'likes' | 'bookmarks'>('bookmarks')

  if (!isOpen) return null

  const handleClearAll = () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer tous vos favoris ?')) {
      socialService.clearAllData()
      refreshFavorites()
    }
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const currentContent = activeTab === 'likes' ? likedContent : bookmarkedContent
  const emptyMessage = activeTab === 'likes' 
    ? 'Aucun contenu liké pour le moment'
    : 'Aucun contenu sauvegardé pour le moment'

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className={`bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden ${
        theme === 'senegalais' ? 'border-2 border-orange-200' : 'border border-gray-200'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Mes Favoris</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleClearAll}
              className="p-2 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50 transition-colors"
              title="Tout supprimer"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 font-medium transition-colors ${
              activeTab === 'bookmarks'
                ? theme === 'senegalais'
                  ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50'
                  : 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Sauvegardés ({bookmarkedContent.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('likes')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 font-medium transition-colors ${
              activeTab === 'likes'
                ? theme === 'senegalais'
                  ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50'
                  : 'text-red-600 border-b-2 border-red-600 bg-red-50'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Likés ({likedContent.length})</span>
          </button>
        </div>

        {/* Contenu */}
        <div className="p-6 overflow-y-auto max-h-96">
          {currentContent.length === 0 ? (
            <div className="text-center py-12">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                theme === 'senegalais' ? 'bg-orange-100' : 'bg-gray-100'
              }`}>
                {activeTab === 'likes' ? (
                  <Heart className={`w-8 h-8 ${theme === 'senegalais' ? 'text-orange-600' : 'text-gray-600'}`} />
                ) : (
                  <Bookmark className={`w-8 h-8 ${theme === 'senegalais' ? 'text-orange-600' : 'text-gray-600'}`} />
                )}
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">{emptyMessage}</h4>
              <p className="text-gray-600 text-sm">
                {activeTab === 'likes' 
                  ? 'Commencez à liker des articles pour les retrouver ici'
                  : 'Sauvegardez des articles pour les lire plus tard'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {currentContent.map((contentId) => (
                <FavoriteItem
                  key={contentId}
                  contentId={contentId}
                  type={activeTab}
                  onUpdate={refreshFavorites}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-500 text-center">
            Vos favoris sont sauvegardés localement sur cet appareil
          </p>
        </div>
      </div>
    </div>
  )
}

// Composant pour un élément favori
function FavoriteItem({ 
  contentId, 
  type, 
  onUpdate 
}: { 
  contentId: string
  type: 'likes' | 'bookmarks'
  onUpdate: () => void 
}) {
  const { theme } = useTheme()
  const stats = socialService.getContentStats(contentId)

  const handleRemove = async () => {
    if (type === 'likes') {
      await socialService.likeContent(contentId, 'thread') // Toggle pour retirer
    } else {
      await socialService.bookmarkContent(contentId, 'thread') // Toggle pour retirer
    }
    onUpdate()
  }

  return (
    <div className={`p-4 rounded-lg border transition-all hover:shadow-md ${
      theme === 'senegalais' ? 'border-orange-200 hover:border-orange-300' : 'border-gray-200 hover:border-gray-300'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h5 className="font-medium text-gray-900 mb-1">
            Contenu #{contentId.slice(-8)}
          </h5>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>{stats.views} vues</span>
            <span>{stats.likes} likes</span>
            <span>{stats.shares} partages</span>
          </div>
        </div>
        <button
          onClick={handleRemove}
          className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
          title="Retirer des favoris"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}