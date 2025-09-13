import { useState, useEffect } from 'react'
import { Calendar, Heart, Repeat, MessageCircle, Eye, ExternalLink, Expand } from 'lucide-react'
import type { Tweet, MediaFile } from '../types/database'
// import { ImageModal } from './ImageModal'

interface TweetCardProps {
  tweet: Tweet
  mediaFiles: MediaFile[]
  showBorder?: boolean
}

export function TweetCard({ tweet, mediaFiles, showBorder = true }: TweetCardProps) {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const tweetMediaFiles = mediaFiles.filter(media => media.tweet_id === tweet.tweet_id)
  
  const formatContent = (content: string) => {
    // First, convert URLs to clickable links
    let formattedContent = content.replace(
      /(https?:\/\/[^\s]+)/g, 
      '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline font-medium transition-colors">$1</a>'
    )
    
    // Then convert hashtags to styled spans
    formattedContent = formattedContent.replace(
      /#(\w+)/g, 
      '<span class="text-blue-600 font-medium">#$1</span>'
    )
    
    // Convert @mentions to styled spans
    formattedContent = formattedContent.replace(
      /@(\w+)/g, 
      '<span class="text-purple-600 font-medium">@$1</span>'
    )
    
    return formattedContent
  }

  const getLocalMediaUrl = (mediaFile: MediaFile) => {
    // Pour les tests, utiliser directement l'URL originale si c'est une URL Picsum
    if (mediaFile.original_url && mediaFile.original_url.includes('picsum.photos')) {
      return mediaFile.original_url
    }
    
    // Sinon, utiliser l'URL Supabase normale
    const supabaseUrl = 'https://ghpptudzucrnygrozpht.supabase.co'
    return `${supabaseUrl}/storage/v1/object/public/twitter-media/${mediaFile.local_path}`
  }

  const handleImageClick = (index: number) => {
    // Vérifier que l'index est valide
    if (index < 0 || index >= tweetMediaFiles.length) {
      return
    }
    
    // Mettre à jour l'index d'abord
    setSelectedImageIndex(index)
    
    // Puis ouvrir le modal
    setIsImageModalOpen(true)
  }

  // Gestion du clavier pour le modal
  useEffect(() => {
    if (!isImageModalOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          setIsImageModalOpen(false)
          break
        case 'ArrowLeft':
          if (tweetMediaFiles.length > 1) {
            setSelectedImageIndex(prev => prev > 0 ? prev - 1 : tweetMediaFiles.length - 1)
          }
          break
        case 'ArrowRight':
          if (tweetMediaFiles.length > 1) {
            setSelectedImageIndex(prev => prev < tweetMediaFiles.length - 1 ? prev + 1 : 0)
          }
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isImageModalOpen, tweetMediaFiles.length])

  return (
    <div className={`bg-white rounded-lg p-4 sm:p-8 ${showBorder ? 'border border-gray-200' : ''} min-h-[300px] sm:min-h-[400px]`}>

      {/* Tweet Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg sm:text-2xl">L</span>
          </div>
          <div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <h4 className="font-bold text-lg sm:text-xl text-gray-900">@loi200812</h4>
              <span className="text-blue-600 text-sm sm:text-lg font-bold bg-blue-50 px-2 py-1 sm:px-4 sm:py-2 rounded-lg">
                {tweet.position}
              </span>
            </div>
            <p className="text-sm sm:text-base text-gray-500 flex items-center space-x-2 mt-1">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm">{formatDate(tweet.date_posted)}</span>
            </p>
          </div>
        </div>
        
        <a 
          href={`https://twitter.com/loi200812/status/${tweet.tweet_id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-blue-600 transition-colors"
        >
          <ExternalLink className="w-6 h-6" />
        </a>
      </div>

      {/* Main Content Layout: Responsive - Column on mobile, Row on desktop */}
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 items-start">
        {/* Media Section - Top on mobile, Left on desktop */}
        {tweetMediaFiles.length > 0 && (
          <div className="w-full lg:flex-shrink-0 lg:w-1/3">
            <div className="space-y-4">
              {tweetMediaFiles.map((media, index) => (
                <div key={index} className="relative group cursor-pointer">
                  <img 
                    src={getLocalMediaUrl(media)}
                    alt={`Media ${index + 1}`}
                    className="w-full object-contain rounded-xl border border-gray-200 group-hover:opacity-90 transition-opacity shadow-lg"
                    style={{
                      maxHeight: '300px',
                      height: 'auto'
                    }}
                    loading="lazy"
                    onClick={() => handleImageClick(index)}
                    onError={(e) => {
                      // Fallback to original URL if local image fails
                      const target = e.target as HTMLImageElement
                      target.src = media.original_url
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-xl flex items-center justify-center pointer-events-none">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="bg-black bg-opacity-70 text-white p-3 rounded-full">
                        <Expand className="w-6 h-6" />
                      </div>
                    </div>
                  </div>
                  {/* Indicateur pour les présentateurs */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                      Cliquer pour agrandir
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Text Content - Bottom on mobile, Right on desktop */}
        <div className={`${tweetMediaFiles.length > 0 ? 'w-full lg:flex-1' : 'w-full'} flex flex-col justify-center`}>
          <div className="space-y-4">
            <p 
              className="text-gray-800 leading-relaxed text-base sm:text-lg lg:text-xl font-medium"
              dangerouslySetInnerHTML={{ __html: formatContent(tweet.content) }}
            />
            
            {/* Engagement Stats - Moved to bottom of text */}
            <div className="flex items-center space-x-4 sm:space-x-6 lg:space-x-8 pt-4 border-t border-gray-100">
              {tweet.engagement.likes > 0 && (
                <div className="flex items-center space-x-1 sm:space-x-2 text-gray-500">
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base lg:text-lg font-medium">{tweet.engagement.likes}</span>
                </div>
              )}
              {tweet.engagement.retweets > 0 && (
                <div className="flex items-center space-x-1 sm:space-x-2 text-gray-500">
                  <Repeat className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base lg:text-lg font-medium">{tweet.engagement.retweets}</span>
                </div>
              )}
              {tweet.engagement.replies > 0 && (
                <div className="flex items-center space-x-1 sm:space-x-2 text-gray-500">
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base lg:text-lg font-medium">{tweet.engagement.replies}</span>
                </div>
              )}
              {tweet.engagement.quotes > 0 && (
                <div className="flex items-center space-x-1 sm:space-x-2 text-gray-500">
                  <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base lg:text-lg font-medium">{tweet.engagement.quotes}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Fallback for tweets without media - Full width text */}
      {tweetMediaFiles.length === 0 && (
        <div className="mt-6">
          <p 
            className="text-gray-800 leading-relaxed text-xl font-medium text-center"
            style={{ fontSize: '1.5rem', lineHeight: '1.6' }}
            dangerouslySetInnerHTML={{ __html: formatContent(tweet.content) }}
          />
          
          {/* Engagement Stats for no-media tweets */}
          <div className="flex items-center justify-center space-x-8 pt-6 border-t border-gray-100 mt-6">
            {tweet.engagement.likes > 0 && (
              <div className="flex items-center space-x-2 text-gray-500">
                <Heart className="w-5 h-5" />
                <span className="text-lg font-medium">{tweet.engagement.likes}</span>
              </div>
            )}
            {tweet.engagement.retweets > 0 && (
              <div className="flex items-center space-x-2 text-gray-500">
                <Repeat className="w-5 h-5" />
                <span className="text-lg font-medium">{tweet.engagement.retweets}</span>
              </div>
            )}
            {tweet.engagement.replies > 0 && (
              <div className="flex items-center space-x-2 text-gray-500">
                <MessageCircle className="w-5 h-5" />
                <span className="text-lg font-medium">{tweet.engagement.replies}</span>
              </div>
            )}
            {tweet.engagement.quotes > 0 && (
              <div className="flex items-center space-x-2 text-gray-500">
                <Eye className="w-5 h-5" />
                <span className="text-lg font-medium">{tweet.engagement.quotes}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal d'agrandissement des images - Version responsive */}
      {isImageModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center p-1 sm:p-4"
          style={{ zIndex: 9999 }}
          onClick={() => setIsImageModalOpen(false)}
        >
          <div 
            className="relative w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Bouton fermer */}
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 bg-red-600 text-white p-2 sm:p-3 rounded-full hover:bg-red-700 text-lg sm:text-xl font-bold shadow-lg"
            >
              ✕
            </button>
            
            {/* Image avec contraintes d'écran optimisées mobile */}
            {tweetMediaFiles.length > 0 && tweetMediaFiles[selectedImageIndex] && (
              <img
                src={getLocalMediaUrl(tweetMediaFiles[selectedImageIndex])}
                alt={`Image ${selectedImageIndex + 1}`}
                className="max-w-full max-h-full object-contain"
                style={{
                  maxWidth: 'calc(100vw - 0.5rem)',
                  maxHeight: 'calc(100vh - 0.5rem)',
                  width: 'auto',
                  height: 'auto'
                }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  if (tweetMediaFiles[selectedImageIndex]) {
                    target.src = tweetMediaFiles[selectedImageIndex].original_url
                  }
                }}
              />
            )}
            
            {/* Info compteur */}
            <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 bg-black bg-opacity-70 text-white p-2 rounded text-xs sm:text-sm">
              {selectedImageIndex + 1} / {tweetMediaFiles.length}
            </div>
            
            {/* Message si pas d'images */}
            {tweetMediaFiles.length === 0 && (
              <div className="bg-white p-8 rounded-lg text-center">
                <h3 className="text-xl font-bold mb-4">Aucune image</h3>
                <p>Aucune image trouvée pour ce tweet.</p>
                <button
                  onClick={() => setIsImageModalOpen(false)}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Fermer
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}