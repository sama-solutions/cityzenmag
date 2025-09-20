// Composant pour afficher le contenu Twitter

import React from 'react';
import { SocialPost } from '../../services/social/base/types';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Heart, MessageCircle, Repeat2, ExternalLink, Verified } from 'lucide-react';

interface TwitterWidgetProps {
  posts: SocialPost[];
  maxPosts?: number;
  showHeader?: boolean;
  className?: string;
}

export function TwitterWidget({ 
  posts, 
  maxPosts = 5, 
  showHeader = true, 
  className = '' 
}: TwitterWidgetProps) {
  const twitterPosts = posts
    .filter(post => post.platform === 'twitter')
    .slice(0, maxPosts);

  if (twitterPosts.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        {showHeader && (
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white font-bold text-sm">𝕏</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Twitter/X</h3>
          </div>
        )}
        <p className="text-gray-500 text-center py-8">
          Aucun tweet récent à afficher
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      {showHeader && (
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-3">
              <span className="text-blue-500 font-bold text-sm">𝕏</span>
            </div>
            <h3 className="text-lg font-semibold text-white">
              Derniers Tweets
            </h3>
            <span className="ml-auto bg-blue-400 text-white px-2 py-1 rounded-full text-xs">
              {twitterPosts.length}
            </span>
          </div>
        </div>
      )}
      
      <div className="divide-y divide-gray-100">
        {twitterPosts.map((post) => (
          <TwitterPostCard key={post.id} post={post} />
        ))}
      </div>
      
      {posts.filter(p => p.platform === 'twitter').length > maxPosts && (
        <div className="px-6 py-4 bg-gray-50 text-center">
          <button className="text-blue-500 hover:text-blue-600 font-medium text-sm">
            Voir plus de tweets ({posts.filter(p => p.platform === 'twitter').length - maxPosts} autres)
          </button>
        </div>
      )}
    </div>
  );
}

interface TwitterPostCardProps {
  post: SocialPost;
}

function TwitterPostCard({ post }: TwitterPostCardProps) {
  const formatContent = (content: string) => {
    // Remplacer les hashtags par des liens stylés
    let formattedContent = content.replace(
      /#(\w+)/g, 
      '<span class="text-blue-500 font-medium">#$1</span>'
    );
    
    // Remplacer les mentions par des liens stylés
    formattedContent = formattedContent.replace(
      /@(\w+)/g, 
      '<span class="text-blue-500 font-medium">@$1</span>'
    );
    
    return formattedContent;
  };

  return (
    <div className="p-6 hover:bg-gray-50 transition-colors">
      <div className="flex space-x-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {post.author.avatar ? (
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 font-medium text-sm">
                {post.author.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          {/* En-tête */}
          <div className="flex items-center space-x-2 mb-2">
            <h4 className="font-semibold text-gray-900 truncate">
              {post.author.name}
            </h4>
            {post.author.verified && (
              <Verified className="w-4 h-4 text-blue-500" />
            )}
            <span className="text-gray-500 text-sm">
              @{post.author.username}
            </span>
            <span className="text-gray-400">·</span>
            <span className="text-gray-500 text-sm">
              {formatDistanceToNow(post.createdAt, { 
                addSuffix: true, 
                locale: fr 
              })}
            </span>
          </div>
          
          {/* Contenu */}
          <div className="mb-3">
            <p 
              className="text-gray-900 leading-relaxed"
              dangerouslySetInnerHTML={{ 
                __html: formatContent(post.content) 
              }}
            />
          </div>
          
          {/* Médias */}
          {post.media && post.media.length > 0 && (
            <div className="mb-3">
              {post.media.map((media, index) => (
                <div key={media.id || index} className="rounded-lg overflow-hidden">
                  {media.type === 'image' && (
                    <img
                      src={media.url}
                      alt={media.alt || 'Image du tweet'}
                      className="w-full max-h-80 object-cover"
                    />
                  )}
                  {media.type === 'video' && (
                    <video
                      src={media.url}
                      poster={media.thumbnailUrl}
                      controls
                      className="w-full max-h-80"
                    >
                      Votre navigateur ne supporte pas la lecture vidéo.
                    </video>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {/* Hashtags */}
          {post.hashtags.length > 0 && (
            <div className="mb-3">
              <div className="flex flex-wrap gap-1">
                {post.hashtags.slice(0, 5).map((tag, index) => (
                  <span
                    key={index}
                    className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
                {post.hashtags.length > 5 && (
                  <span className="text-gray-500 text-xs">
                    +{post.hashtags.length - 5} autres
                  </span>
                )}
              </div>
            </div>
          )}
          
          {/* Métriques */}
          <div className="flex items-center justify-between text-gray-500">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-1 hover:text-red-500 cursor-pointer">
                <Heart className="w-4 h-4" />
                <span className="text-sm">{post.metrics.likes}</span>
              </div>
              
              <div className="flex items-center space-x-1 hover:text-blue-500 cursor-pointer">
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm">{post.metrics.comments}</span>
              </div>
              
              <div className="flex items-center space-x-1 hover:text-green-500 cursor-pointer">
                <Repeat2 className="w-4 h-4" />
                <span className="text-sm">{post.metrics.shares}</span>
              </div>
              
              {post.metrics.views && post.metrics.views > 0 && (
                <div className="flex items-center space-x-1">
                  <span className="text-sm">{post.metrics.views} vues</span>
                </div>
              )}
            </div>
            
            <a
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 hover:text-blue-500 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="text-sm">Voir sur X</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TwitterWidget;