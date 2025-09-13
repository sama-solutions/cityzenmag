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
                <div key={index} className="relative group">
                  <img 
                    src={getLocalMediaUrl(media)}
                    alt={`Media ${index + 1}`}
                    className="w-full h-auto object-contain rounded-xl border border-gray-200 group-hover:opacity-90 transition-opacity shadow-lg"
                    loading="lazy"
                    onError={(e) => {
                      // Fallback to original URL if local image fails
                      const target = e.target as HTMLImageElement
                      target.src = media.original_url
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 rounded-xl" />
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
    </div>
  )
}