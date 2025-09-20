// Composant pour afficher le contenu Facebook

import React from 'react';
import { SocialPost } from '../../services/social/base/types';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Heart, MessageCircle, Share2, ExternalLink, Image, Video, Link } from 'lucide-react';

interface FacebookWidgetProps {
  posts: SocialPost[];
  maxPosts?: number;
  showHeader?: boolean;
  className?: string;
}

export function FacebookWidget({ 
  posts, 
  maxPosts = 5, 
  showHeader = true, 
  className = '' 
}: FacebookWidgetProps) {
  const facebookPosts = posts
    .filter(post => post.platform === 'facebook')
    .slice(0, maxPosts);

  if (facebookPosts.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        {showHeader && (
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
              <span className="text-white font-bold text-sm">f</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Facebook</h3>
          </div>
        )}
        <p className="text-gray-500 text-center py-8">
          Aucun post Facebook récent à afficher
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      {showHeader && (
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-3">
              <span className="text-blue-600 font-bold text-sm">f</span>
            </div>
            <h3 className="text-lg font-semibold text-white">
              Derniers Posts Facebook
            </h3>
            <span className="ml-auto bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
              {facebookPosts.length}
            </span>
          </div>
        </div>
      )}
      
      <div className="divide-y divide-gray-100">
        {facebookPosts.map((post) => (
          <FacebookPostCard key={post.id} post={post} />
        ))}
      </div>
      
      {posts.filter(p => p.platform === 'facebook').length > maxPosts && (
        <div className="px-6 py-4 bg-gray-50 text-center">
          <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
            Voir plus de posts ({posts.filter(p => p.platform === 'facebook').length - maxPosts} autres)
          </button>
        </div>
      )}
    </div>
  );
}

interface FacebookPostCardProps {
  post: SocialPost;
}

function FacebookPostCard({ post }: FacebookPostCardProps) {
  const getPostTypeIcon = () => {
    switch (post.type) {
      case 'image':
        return <Image className="w-4 h-4 text-green-500" />;
      case 'video':
        return <Video className="w-4 h-4 text-red-500" />;
      case 'link':
        return <Link className="w-4 h-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const formatContent = (content: string) => {
    // Limiter la longueur du contenu affiché
    if (content.length > 300) {
      return content.substring(0, 300) + '...';
    }
    return content;
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
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-medium text-sm">
                {post.author.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          {/* En-tête */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <h4 className="font-semibold text-gray-900">
                {post.author.name}
              </h4>
              {post.author.verified && (
                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
              {getPostTypeIcon()}
            </div>
            
            <div className="flex items-center space-x-2 text-gray-500 text-sm">
              <span>
                {formatDistanceToNow(post.createdAt, { 
                  addSuffix: true, 
                  locale: fr 
                })}
              </span>
              <a
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
          
          {/* Contenu */}
          {post.content && (
            <div className="mb-3">
              <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">
                {formatContent(post.content)}
              </p>
            </div>
          )}
          
          {/* Médias */}
          {post.media && post.media.length > 0 && (
            <div className="mb-3">
              {post.media.length === 1 ? (
                <div className="rounded-lg overflow-hidden">
                  {post.media[0].type === 'image' && (
                    <img
                      src={post.media[0].url}
                      alt={post.media[0].alt || 'Image du post'}
                      className="w-full max-h-96 object-cover"
                    />
                  )}
                  {post.media[0].type === 'video' && (
                    <video
                      src={post.media[0].url}
                      poster={post.media[0].thumbnailUrl}
                      controls
                      className="w-full max-h-96"
                    >
                      Votre navigateur ne supporte pas la lecture vidéo.
                    </video>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 rounded-lg overflow-hidden">
                  {post.media.slice(0, 4).map((media, index) => (
                    <div key={media.id || index} className="relative">
                      {media.type === 'image' && (
                        <img
                          src={media.url}
                          alt={media.alt || `Image ${index + 1}`}
                          className="w-full h-32 object-cover"
                        />
                      )}
                      {media.type === 'video' && (
                        <div className="relative">
                          <img
                            src={media.thumbnailUrl || media.url}
                            alt={media.alt || `Vidéo ${index + 1}`}
                            className="w-full h-32 object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                            <Video className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      )}
                      {index === 3 && post.media.length > 4 && (
                        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                          <span className="text-white font-semibold">
                            +{post.media.length - 4}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
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
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center space-x-6 text-gray-500">
              <div className="flex items-center space-x-1 hover:text-blue-600 cursor-pointer transition-colors">
                <Heart className="w-4 h-4" />
                <span className="text-sm">{post.metrics.likes}</span>
              </div>
              
              <div className="flex items-center space-x-1 hover:text-blue-600 cursor-pointer transition-colors">
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm">{post.metrics.comments}</span>
              </div>
              
              <div className="flex items-center space-x-1 hover:text-blue-600 cursor-pointer transition-colors">
                <Share2 className="w-4 h-4" />
                <span className="text-sm">{post.metrics.shares}</span>
              </div>
            </div>
            
            <div className="text-gray-400 text-sm">
              {post.isRepost && (
                <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                  Partagé
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FacebookWidget;