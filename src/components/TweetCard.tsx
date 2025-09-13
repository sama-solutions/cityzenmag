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
  
  // Debug: Log media files
  console.log('🖼️ TweetCard media debug:', {
    tweetId: tweet.tweet_id,
    totalMediaFiles: mediaFiles.length,
    tweetMediaFiles: tweetMediaFiles.length,
    mediaFiles: tweetMediaFiles.map(m => ({ id: m.id, tweet_id: m.tweet_id, local_path: m.local_path })),
    allMediaFiles: mediaFiles.map(m => ({ id: m.id, tweet_id: m.tweet_id, local_path: m.local_path }))
  })
  
  // Debug: Test si on a des images
  if (tweetMediaFiles.length > 0) {
    console.log('✅ Images disponibles pour ce tweet:', tweetMediaFiles.length)
  } else {
    console.log('⚠️ Aucune image pour ce tweet. Total médias:', mediaFiles.length)
  }
  
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
      console.log('🖼️ Using Picsum URL for test:', mediaFile.original_url)
      return mediaFile.original_url
    }
    
    // Sinon, utiliser l'URL Supabase normale
    const supabaseUrl = 'https://ghpptudzucrnygrozpht.supabase.co'
    return `${supabaseUrl}/storage/v1/object/public/twitter-media/${mediaFile.local_path}`
  }

  const handleImageClick = (index: number) => {
    console.log('🖼️ Image clicked:', { index, tweetMediaFilesLength: tweetMediaFiles.length })
    
    // Vérifier que l'index est valide
    if (index < 0 || index >= tweetMediaFiles.length) {
      console.error('🖼️ Invalid image index:', index)
      return
    }
    
    // Mettre à jour l'index d'abord
    setSelectedImageIndex(index)
    
    // Puis ouvrir le modal
    setIsImageModalOpen(true)
    
    console.log('🖼️ Modal opening:', { 
      selectedImageIndex: index, 
      isImageModalOpen: true,
      imageUrl: getLocalMediaUrl(tweetMediaFiles[index])
    })
    
    // Alert pour confirmer
    alert(`Image ${index + 1} cliquée ! Modal devrait s'ouvrir.`)
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

  // Log pour debug du rendu
  console.log('🖼️ TweetCard render:', {
    isImageModalOpen,
    selectedImageIndex,
    tweetMediaFilesLength: tweetMediaFiles.length
  })

  return (
    <div className={`bg-white rounded-lg p-8 ${showBorder ? 'border border-gray-200' : ''} min-h-[400px]`}>
      {/* Bouton de test pour debug */}
      {tweetMediaFiles.length > 0 && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-800">Debug Agrandissement</p>
              <p className="text-xs text-yellow-600">{tweetMediaFiles.length} image(s) détectée(s)</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  console.log('🖼️ Test button clicked - forcing modal open')
                  setSelectedImageIndex(0)
                  setIsImageModalOpen(true)
                }}
                className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700"
              >
                Test Modal 🖼️
              </button>
              <button
                onClick={() => {
                  console.log('🖼️ Force modal - no conditions')
                  setIsImageModalOpen(!isImageModalOpen)
                }}
                className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
              >
                Toggle Modal
              </button>
            </div>
          </div>
        </div>
      )}

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

      {/* Modal d'agrandissement des images - Version corrigée */}
      {isImageModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center"
          style={{ zIndex: 9999 }}
          onClick={() => setIsImageModalOpen(false)}
        >
          <div 
            className="relative max-w-4xl max-h-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Bouton fermer */}
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="absolute top-4 right-4 z-10 bg-red-600 text-white p-3 rounded-full hover:bg-red-700 text-xl font-bold"
            >
              ✕
            </button>
            
            {/* Image */}
            {tweetMediaFiles.length > 0 && tweetMediaFiles[selectedImageIndex] && (
              <img
                src={getLocalMediaUrl(tweetMediaFiles[selectedImageIndex])}
                alt={`Image ${selectedImageIndex + 1}`}
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  console.log('🖼️ Image error, trying fallback')
                  const target = e.target as HTMLImageElement
                  if (tweetMediaFiles[selectedImageIndex]) {
                    target.src = tweetMediaFiles[selectedImageIndex].original_url
                  }
                }}
              />
            )}
            
            {/* Info debug */}
            <div className="absolute bottom-4 left-4 bg-blue-600 text-white p-2 rounded">
              Modal ouvert - Image {selectedImageIndex + 1} / {tweetMediaFiles.length}
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