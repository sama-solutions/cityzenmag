// Sidebar avec le contenu des réseaux sociaux pour la page d'accueil

import React, { useState } from 'react';
import { useSocial } from '../../contexts/SocialContext';
import TwitterWidget from './TwitterWidget';
import YouTubeWidget from './YouTubeWidget';
import FacebookWidget from './FacebookWidget';
import { 
  RefreshCw, 
  Settings, 
  TrendingUp, 
  Users,
  Hash,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface SocialSidebarProps {
  className?: string;
  maxPosts?: number;
  showHeader?: boolean;
  compact?: boolean;
}

export function SocialSidebar({ 
  className = '', 
  maxPosts = 3,
  showHeader = true,
  compact = false
}: SocialSidebarProps) {
  const { 
    posts, 
    loading, 
    error, 
    refreshData, 
    getEnabledPlatforms,
    lastUpdate 
  } = useSocial();

  const [expandedPlatforms, setExpandedPlatforms] = useState<Set<string>>(new Set(['twitter']));
  const [showAllPlatforms, setShowAllPlatforms] = useState(false);

  const enabledPlatforms = getEnabledPlatforms();
  const recentPosts = posts.slice(0, maxPosts * 3); // Plus de posts pour la répartition

  const togglePlatform = (platform: string) => {
    const newExpanded = new Set(expandedPlatforms);
    if (newExpanded.has(platform)) {
      newExpanded.delete(platform);
    } else {
      newExpanded.add(platform);
    }
    setExpandedPlatforms(newExpanded);
  };

  const getPostsByPlatform = (platform: string) => {
    return posts.filter(post => post.platform === platform).slice(0, maxPosts);
  };

  const getTotalEngagement = () => {
    return posts.reduce((total, post) => 
      total + post.metrics.likes + post.metrics.shares + post.metrics.comments, 0
    );
  };

  const getTopHashtags = () => {
    const hashtagCounts = new Map<string, number>();
    
    posts.forEach(post => {
      post.hashtags.forEach(tag => {
        hashtagCounts.set(tag, (hashtagCounts.get(tag) || 0) + 1);
      });
    });
    
    return Array.from(hashtagCounts.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([tag, count]) => ({ tag, count }));
  };

  if (enabledPlatforms.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <div className="text-center">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Réseaux Sociaux
          </h3>
          <p className="text-gray-500 text-sm mb-4">
            Aucune intégration configurée
          </p>
          <a
            href="/admin/social"
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            <Settings className="w-4 h-4" />
            <span>Configurer</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* En-tête avec statistiques */}
      {showHeader && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">
              Réseaux Sociaux
            </h2>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={refreshData}
                disabled={loading}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Actualiser"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
              
              <a
                href="/admin/social"
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Administration"
              >
                <Settings className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Statistiques rapides */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className="text-xl font-bold text-blue-600">{posts.length}</div>
              <div className="text-xs text-gray-500">Posts</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-green-600">{getTotalEngagement()}</div>
              <div className="text-xs text-gray-500">Engagement</div>
            </div>
          </div>

          {/* Plateformes connectées */}
          <div className="flex flex-wrap gap-2 mb-4">
            {enabledPlatforms.map(platform => (
              <span
                key={platform}
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  platform === 'twitter' ? 'bg-blue-100 text-blue-800' :
                  platform === 'youtube' ? 'bg-red-100 text-red-800' :
                  platform === 'facebook' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}
              >
                {platform}
              </span>
            ))}
          </div>

          {/* Top hashtags */}
          {!compact && getTopHashtags().length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Hashtags populaires
              </h4>
              <div className="flex flex-wrap gap-1">
                {getTopHashtags().map(({ tag, count }) => (
                  <span
                    key={tag}
                    className="inline-flex items-center space-x-1 bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                  >
                    <Hash className="w-3 h-3" />
                    <span>{tag}</span>
                    <span className="text-gray-500">({count})</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {lastUpdate && (
            <div className="text-xs text-gray-500 mt-4">
              Dernière mise à jour: {lastUpdate.toLocaleTimeString()}
            </div>
          )}
        </div>
      )}

      {/* Erreur */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Contenu par plateforme */}
      <div className="space-y-4">
        {/* Twitter */}
        {enabledPlatforms.includes('twitter') && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <button
              onClick={() => togglePlatform('twitter')}
              className="w-full px-4 py-3 bg-blue-500 text-white flex items-center justify-between hover:bg-blue-600 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <span className="font-medium">Twitter/X</span>
                <span className="bg-blue-400 text-white px-2 py-1 rounded-full text-xs">
                  {getPostsByPlatform('twitter').length}
                </span>
              </div>
              {expandedPlatforms.has('twitter') ? 
                <ChevronUp className="w-4 h-4" /> : 
                <ChevronDown className="w-4 h-4" />
              }
            </button>
            
            {expandedPlatforms.has('twitter') && (
              <div className="p-4">
                <TwitterWidget 
                  posts={getPostsByPlatform('twitter')} 
                  maxPosts={maxPosts}
                  showHeader={false}
                />
              </div>
            )}
          </div>
        )}

        {/* YouTube */}
        {enabledPlatforms.includes('youtube') && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <button
              onClick={() => togglePlatform('youtube')}
              className="w-full px-4 py-3 bg-red-600 text-white flex items-center justify-between hover:bg-red-700 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <span className="font-medium">YouTube</span>
                <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                  {getPostsByPlatform('youtube').length}
                </span>
              </div>
              {expandedPlatforms.has('youtube') ? 
                <ChevronUp className="w-4 h-4" /> : 
                <ChevronDown className="w-4 h-4" />
              }
            </button>
            
            {expandedPlatforms.has('youtube') && (
              <div className="p-4">
                <YouTubeWidget 
                  posts={getPostsByPlatform('youtube')} 
                  maxPosts={maxPosts}
                  showHeader={false}
                  layout="list"
                />
              </div>
            )}
          </div>
        )}

        {/* Facebook */}
        {enabledPlatforms.includes('facebook') && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <button
              onClick={() => togglePlatform('facebook')}
              className="w-full px-4 py-3 bg-blue-600 text-white flex items-center justify-between hover:bg-blue-700 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <span className="font-medium">Facebook</span>
                <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
                  {getPostsByPlatform('facebook').length}
                </span>
              </div>
              {expandedPlatforms.has('facebook') ? 
                <ChevronUp className="w-4 h-4" /> : 
                <ChevronDown className="w-4 h-4" />
              }
            </button>
            
            {expandedPlatforms.has('facebook') && (
              <div className="p-4">
                <FacebookWidget 
                  posts={getPostsByPlatform('facebook')} 
                  maxPosts={maxPosts}
                  showHeader={false}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Lien vers l'administration */}
      {!compact && (
        <div className="bg-white rounded-lg shadow-md p-4">
          <a
            href="/admin/social"
            className="flex items-center justify-between w-full text-gray-700 hover:text-blue-600 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span className="font-medium">Voir toutes les analytics</span>
            </div>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      )}
    </div>
  );
}

export default SocialSidebar;