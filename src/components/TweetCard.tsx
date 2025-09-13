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
    const supabaseUrl = 'https://ghpptudzucrnygrozpht.supabase.co'
    return `${supabaseUrl}/storage/v1/object/public/twitter-media/${mediaFile.local_path}`
  }

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index)
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
    <div className={`bg-white rounded-lg p-8 ${showBorder ? 'border border-gray-200' : ''} min-h-[400px]`}>
      {/* Tweet Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-2xl">L</span>
          </div>
          <div>
            <div className="flex items-center space-x-3">
              <h4 className="font-bold text-xl text-gray-900">@loi200812</h4>
              <span className="text-blue-600 text-lg font-bold bg-blue-50 px-4 py-2 rounded-lg">
                {tweet.position}
              </span>
            </div>
            <p className="text-base text-gray-500 flex items-center space-x-2 mt-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(tweet.date_posted)}</span>
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

      {/* Main Content Layout: Image Left, Text Right */}
      <div className="flex gap-8 items-start">
        {/* Media Section - Left Side */}
        {tweetMediaFiles.length > 0 && (
          <div className="flex-shrink-0 w-1/3">
            <div className="space-y-4">
              {tweetMediaFiles.map((media, index) => (
                <div key={index} className="relative group cursor-pointer">
                  <img 
                    src={getLocalMediaUrl(media)}
                    alt={`Media ${index + 1}`}
                    className="w-full h-auto object-contain rounded-xl border border-gray-200 group-hover:opacity-90 transition-opacity shadow-lg"
                    loading="lazy"
                    onClick={() => handleImageClick(index)}
                    onError={(e) => {
                      // Fallback to original URL if local image fails
                      const target = e.target as HTMLImageElement
                      target.src = media.original_url
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-xl flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="bg-black bg-opacity-70 text-white p-3 rounded-full">
                        <Expand className="w-6 h-6" />
                      </div>
                    </div>
                  </div>
                  {/* Indicateur pour les présentateurs */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                      Cliquer pour agrandir
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Text Content - Right Side */}
        <div className={`${tweetMediaFiles.length > 0 ? 'flex-1' : 'w-full'} flex flex-col justify-center`}>
          <div className="space-y-4">
            <p 
              className="text-gray-800 leading-relaxed text-xl font-medium"
              style={{ fontSize: '1.375rem', lineHeight: '1.6' }}
              dangerouslySetInnerHTML={{ __html: formatContent(tweet.content) }}
            />
            
            {/* Engagement Stats - Moved to bottom of text */}
            <div className="flex items-center space-x-8 pt-4 border-t border-gray-100">
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

      {/* Modal d'agrandissement des images */}
      {isImageModalOpen && tweetMediaFiles.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center">
          {/* Header Controls */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            <div className="flex items-center space-x-2 text-white">
              <span className="text-lg font-medium">
                {selectedImageIndex + 1} / {tweetMediaFiles.length}
              </span>
              <span className="text-sm text-gray-300">
                Cliquez pour fermer • Échap pour quitter
              </span>
            </div>
            
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="p-2 bg-black bg-opacity-50 text-white rounded-lg hover:bg-opacity-70 transition-all"
              title="Fermer (Échap)"
            >
              <ExternalLink className="w-5 h-5 rotate-45" />
            </button>
          </div>

          {/* Navigation Arrows */}
          {tweetMediaFiles.length > 1 && (
            <>
              <button
                onClick={() => setSelectedImageIndex(prev => prev > 0 ? prev - 1 : tweetMediaFiles.length - 1)}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all z-10"
                title="Image précédente"
              >
                <span className="text-2xl">‹</span>
              </button>
              
              <button
                onClick={() => setSelectedImageIndex(prev => prev < tweetMediaFiles.length - 1 ? prev + 1 : 0)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all z-10"
                title="Image suivante"
              >
                <span className="text-2xl">›</span>
              </button>
            </>
          )}

          {/* Main Image */}
          <div 
            className="flex-1 flex items-center justify-center p-16 overflow-hidden cursor-pointer"
            onClick={() => setIsImageModalOpen(false)}
          >
            <img
              src={getLocalMediaUrl(tweetMediaFiles[selectedImageIndex])}
              alt={`Image ${selectedImageIndex + 1}`}
              className="max-w-full max-h-full object-contain select-none"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = tweetMediaFiles[selectedImageIndex].original_url
              }}
              draggable={false}
            />
          </div>

          {/* Bottom Info */}
          <div className="absolute bottom-4 left-4 right-4 text-center text-white z-10">
            <div className="bg-black bg-opacity-50 rounded-lg px-4 py-2 inline-block">
              <p className="text-sm">
                <span className="font-medium">Mode Présentation:</span>
                {' '}Cliquez n'importe où pour fermer • Flèches pour naviguer
              </p>
            </div>
          </div>

          {/* Thumbnail Strip */}
          {tweetMediaFiles.length > 1 && (
            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
              {tweetMediaFiles.map((image, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedImageIndex(index)
                  }}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    index === selectedImageIndex 
                      ? 'border-white shadow-lg' 
                      : 'border-gray-500 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={getLocalMediaUrl(image)}
                    alt={`Miniature ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = image.original_url
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}