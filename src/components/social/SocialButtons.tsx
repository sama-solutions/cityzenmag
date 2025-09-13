import { useState } from 'react'
import { Heart, Bookmark, Share2, Eye, TrendingUp } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { useSocial } from '../../hooks/useSocial'
import { ShareModal } from './ShareModal'
import type { SocialInteraction } from '../../services/socialService'

interface SocialButtonsProps {
  contentId: string
  contentType: SocialInteraction['contentType']
  title: string
  description?: string
  url?: string
  size?: 'sm' | 'md' | 'lg'
  layout?: 'horizontal' | 'vertical'
  showLabels?: boolean
  showStats?: boolean
}

export function SocialButtons({
  contentId,
  contentType,
  title,
  description = '',
  url,
  size = 'md',
  layout = 'horizontal',
  showLabels = true,
  showStats = true
}: SocialButtonsProps) {
  const { theme } = useTheme()
  const { stats, isLiked, isBookmarked, isLoading, toggleLike, toggleBookmark, share } = useSocial(contentId, contentType)
  const [showShareModal, setShowShareModal] = useState(false)

  const currentUrl = url || window.location.href
  const shareText = `${title} - ${description}`.slice(0, 200)

  const handleShare = (platform: string) => {
    share(platform, currentUrl, shareText)
    setShowShareModal(false)
  }

  // Styles selon la taille
  const sizeClasses = {
    sm: 'p-2 text-sm',
    md: 'p-3 text-base',
    lg: 'p-4 text-lg'
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  const containerClasses = layout === 'horizontal' 
    ? 'flex items-center space-x-2' 
    : 'flex flex-col space-y-2'

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k'
    }
    return num.toString()
  }

  return (
    <>
      <div className={containerClasses}>
        {/* Bouton Like */}
        <button
          onClick={toggleLike}
          disabled={isLoading}
          className={`flex items-center space-x-2 rounded-lg transition-all ${sizeClasses[size]} ${
            isLiked
              ? theme === 'senegalais'
                ? 'bg-red-100 text-red-600 hover:bg-red-200'
                : 'bg-red-50 text-red-600 hover:bg-red-100'
              : theme === 'senegalais'
                ? 'bg-orange-50 text-orange-600 hover:bg-orange-100'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
        >
          <Heart className={`${iconSizes[size]} ${isLiked ? 'fill-current' : ''}`} />
          {showLabels && (
            <span className="font-medium">
              {showStats && stats.likes > 0 ? formatNumber(stats.likes) : 'J\'aime'}
            </span>
          )}
        </button>

        {/* Bouton Bookmark */}
        <button
          onClick={toggleBookmark}
          disabled={isLoading}
          className={`flex items-center space-x-2 rounded-lg transition-all ${sizeClasses[size]} ${
            isBookmarked
              ? theme === 'senegalais'
                ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
              : theme === 'senegalais'
                ? 'bg-orange-50 text-orange-600 hover:bg-orange-100'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
        >
          <Bookmark className={`${iconSizes[size]} ${isBookmarked ? 'fill-current' : ''}`} />
          {showLabels && (
            <span className="font-medium">
              {showStats && stats.bookmarks > 0 ? formatNumber(stats.bookmarks) : 'Sauver'}
            </span>
          )}
        </button>

        {/* Bouton Share */}
        <button
          onClick={() => setShowShareModal(true)}
          disabled={isLoading}
          className={`flex items-center space-x-2 rounded-lg transition-all ${sizeClasses[size]} ${
            theme === 'senegalais'
              ? 'bg-green-50 text-green-600 hover:bg-green-100'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
        >
          <Share2 className={iconSizes[size]} />
          {showLabels && (
            <span className="font-medium">
              {showStats && stats.shares > 0 ? formatNumber(stats.shares) : 'Partager'}
            </span>
          )}
        </button>

        {/* Statistiques supplémentaires */}
        {showStats && (
          <>
            {/* Vues */}
            {stats.views > 0 && (
              <div className={`flex items-center space-x-1 text-gray-500 ${sizeClasses[size]}`}>
                <Eye className={iconSizes[size]} />
                <span className="text-sm">{formatNumber(stats.views)}</span>
              </div>
            )}

            {/* Engagement */}
            {stats.engagement > 0 && (
              <div className={`flex items-center space-x-1 text-gray-500 ${sizeClasses[size]}`}>
                <TrendingUp className={iconSizes[size]} />
                <span className="text-sm">{stats.engagement.toFixed(1)}%</span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal de partage */}
      {showShareModal && (
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          onShare={handleShare}
          title={title}
          description={description}
          url={currentUrl}
        />
      )}
    </>
  )
}