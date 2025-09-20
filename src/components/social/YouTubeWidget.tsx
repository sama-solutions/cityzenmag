// Composant pour afficher le contenu YouTube

import React, { useState } from 'react';
import { SocialPost } from '../../services/social/base/types';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Play, Eye, ThumbsUp, MessageCircle, ExternalLink, Clock } from 'lucide-react';

interface YouTubeWidgetProps {
  posts: SocialPost[];
  maxPosts?: number;
  showHeader?: boolean;
  className?: string;
  layout?: 'list' | 'grid';
}

export function YouTubeWidget({ 
  posts, 
  maxPosts = 6, 
  showHeader = true, 
  className = '',
  layout = 'grid'
}: YouTubeWidgetProps) {
  const youtubePosts = posts
    .filter(post => post.platform === 'youtube')
    .slice(0, maxPosts);

  if (youtubePosts.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        {showHeader && (
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center mr-3">
              <Play className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">YouTube</h3>
          </div>
        )}
        <p className="text-gray-500 text-center py-8">
          Aucune vidéo récente à afficher
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      {showHeader && (
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-3">
              <Play className="w-4 h-4 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-white">
              Dernières Vidéos
            </h3>
            <span className="ml-auto bg-red-500 text-white px-2 py-1 rounded-full text-xs">
              {youtubePosts.length}
            </span>
          </div>
        </div>
      )}
      
      <div className="p-6">
        {layout === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {youtubePosts.map((post) => (
              <YouTubeVideoCard key={post.id} post={post} compact />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {youtubePosts.map((post) => (
              <YouTubeVideoCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
      
      {posts.filter(p => p.platform === 'youtube').length > maxPosts && (
        <div className="px-6 py-4 bg-gray-50 text-center border-t">
          <button className="text-red-600 hover:text-red-700 font-medium text-sm">
            Voir plus de vidéos ({posts.filter(p => p.platform === 'youtube').length - maxPosts} autres)
          </button>
        </div>
      )}
    </div>
  );
}

interface YouTubeVideoCardProps {
  post: SocialPost;
  compact?: boolean;
}

function YouTubeVideoCard({ post, compact = false }: YouTubeVideoCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  
  const video = post.media?.[0];
  const thumbnail = video?.thumbnailUrl || `https://img.youtube.com/vi/${post.id}/hqdefault.jpg`;
  
  const formatDuration = (seconds?: number) => {
    if (!seconds) return '';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  const handlePlayClick = () => {
    setIsPlaying(true);
  };

  if (compact) {
    return (
      <div className="group cursor-pointer">
        <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden mb-3">
          {!isPlaying ? (
            <>
              <img
                src={thumbnail}
                alt={post.content}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                <button
                  onClick={handlePlayClick}
                  className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-700"
                >
                  <Play className="w-6 h-6 text-white ml-1" />
                </button>
              </div>
              {video?.duration && (
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
                  {formatDuration(video.duration)}
                </div>
              )}
            </>
          ) : (
            <iframe
              src={`https://www.youtube.com/embed/${post.id}?autoplay=1`}
              title={post.content}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>
        
        <div>
          <h4 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">
            {post.content.split('\n')[0] || 'Vidéo sans titre'}
          </h4>
          
          <p className="text-gray-600 text-xs mb-2">
            {post.author.name}
          </p>
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-3">
              {post.metrics.views > 0 && (
                <span>{formatViews(post.metrics.views)} vues</span>
              )}
              <span>
                {formatDistanceToNow(post.createdAt, { 
                  addSuffix: true, 
                  locale: fr 
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex space-x-4 group">
      {/* Thumbnail */}
      <div className="flex-shrink-0 w-48">
        <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
          {!isPlaying ? (
            <>
              <img
                src={thumbnail}
                alt={post.content}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                <button
                  onClick={handlePlayClick}
                  className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-700"
                >
                  <Play className="w-6 h-6 text-white ml-1" />
                </button>
              </div>
              {video?.duration && (
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
                  <Clock className="w-3 h-3 inline mr-1" />
                  {formatDuration(video.duration)}
                </div>
              )}
            </>
          ) : (
            <iframe
              src={`https://www.youtube.com/embed/${post.id}?autoplay=1`}
              title={post.content}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>
      </div>
      
      {/* Contenu */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-semibold text-gray-900 line-clamp-2 pr-4">
            {post.content.split('\n')[0] || 'Vidéo sans titre'}
          </h4>
          
          <a
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 text-gray-400 hover:text-red-600 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
        
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-gray-600 text-sm font-medium">
            {post.author.name}
          </span>
          <span className="text-gray-400">·</span>
          <span className="text-gray-500 text-sm">
            {formatDistanceToNow(post.createdAt, { 
              addSuffix: true, 
              locale: fr 
            })}
          </span>
        </div>
        
        {/* Description */}
        {post.content.split('\n').length > 1 && (
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
            {post.content.split('\n').slice(1).join('\n')}
          </p>
        )}
        
        {/* Hashtags */}
        {post.hashtags.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {post.hashtags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full"
                >
                  #{tag}
                </span>
              ))}
              {post.hashtags.length > 3 && (
                <span className="text-gray-500 text-xs">
                  +{post.hashtags.length - 3} autres
                </span>
              )}
            </div>
          </div>
        )}
        
        {/* Métriques */}
        <div className="flex items-center space-x-4 text-gray-500 text-sm">
          {post.metrics.views > 0 && (
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>{formatViews(post.metrics.views)} vues</span>
            </div>
          )}
          
          <div className="flex items-center space-x-1">
            <ThumbsUp className="w-4 h-4" />
            <span>{post.metrics.likes}</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <MessageCircle className="w-4 h-4" />
            <span>{post.metrics.comments}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default YouTubeWidget;