import { Calendar, Heart, Repeat, MessageCircle, Eye, ExternalLink } from 'lucide-react'
import type { Tweet, MediaFile } from '../types/database'

interface TweetCardProps {
  tweet: Tweet
  mediaFiles: MediaFile[]
  showBorder?: boolean
}

export function TweetCard({ tweet, mediaFiles, showBorder = true }: TweetCardProps) {
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

  return (
    <div className={`bg-white rounded-lg p-6 ${showBorder ? 'border border-gray-200' : ''}`}>
      {/* Tweet Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">L</span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="font-semibold text-gray-900">@loi200812</h4>
              <span className="text-blue-600 text-sm font-medium bg-blue-50 px-2 py-1 rounded">
                {tweet.position}
              </span>
            </div>
            <p className="text-sm text-gray-500 flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
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
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Tweet Content */}
      <div className="mb-4">
        <p 
          className="text-gray-800 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: formatContent(tweet.content) }}
        />
      </div>

      {/* Media */}
      {tweetMediaFiles.length > 0 && (
        <div className="mb-4">
          <div className={`grid gap-3 ${
            tweetMediaFiles.length === 1 ? 'grid-cols-1' : 
            tweetMediaFiles.length === 2 ? 'grid-cols-1 sm:grid-cols-2' : 
            'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
          }`}>
            {tweetMediaFiles.map((media, index) => (
              <div key={index} className="relative group">
                <img 
                  src={getLocalMediaUrl(media)}
                  alt={`Media ${index + 1}`}
                  className="w-full max-w-full h-auto object-contain rounded-lg border border-gray-200 group-hover:opacity-90 transition-opacity shadow-sm"
                  loading="lazy"
                  onError={(e) => {
                    // Fallback to original URL if local image fails
                    const target = e.target as HTMLImageElement
                    target.src = media.original_url
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Engagement Stats */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center space-x-6 text-sm text-gray-500">
          {tweet.engagement.likes > 0 && (
            <div className="flex items-center space-x-1">
              <Heart className="w-4 h-4" />
              <span>{tweet.engagement.likes}</span>
            </div>
          )}
          {tweet.engagement.retweets > 0 && (
            <div className="flex items-center space-x-1">
              <Repeat className="w-4 h-4" />
              <span>{tweet.engagement.retweets}</span>
            </div>
          )}
          {tweet.engagement.replies > 0 && (
            <div className="flex items-center space-x-1">
              <MessageCircle className="w-4 h-4" />
              <span>{tweet.engagement.replies}</span>
            </div>
          )}
          {tweet.engagement.quotes > 0 && (
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>{tweet.engagement.quotes}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}