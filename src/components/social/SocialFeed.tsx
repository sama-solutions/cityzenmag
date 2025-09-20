// Composant de feed social unifié

import React, { useState, useMemo } from 'react';
import { SocialPost, SocialPlatform } from '../../services/social/base/types';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  Filter, 
  Search, 
  RefreshCw, 
  TrendingUp, 
  Calendar,
  Hash,
  User,
  ExternalLink
} from 'lucide-react';
import TwitterWidget from './TwitterWidget';
import YouTubeWidget from './YouTubeWidget';
import FacebookWidget from './FacebookWidget';

interface SocialFeedProps {
  posts: SocialPost[];
  loading?: boolean;
  onRefresh?: () => void;
  className?: string;
  layout?: 'unified' | 'separated' | 'grid';
  showFilters?: boolean;
  showSearch?: boolean;
}

type SortOption = 'date' | 'engagement' | 'platform';
type FilterOption = 'all' | 'twitter' | 'youtube' | 'facebook';

export function SocialFeed({
  posts,
  loading = false,
  onRefresh,
  className = '',
  layout = 'unified',
  showFilters = true,
  showSearch = true
}: SocialFeedProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [showOnlyRecent, setShowOnlyRecent] = useState(false);

  // Filtrage et tri des posts
  const filteredAndSortedPosts = useMemo(() => {
    let filtered = posts;

    // Filtrage par recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post =>
        post.content.toLowerCase().includes(query) ||
        post.author.name.toLowerCase().includes(query) ||
        post.hashtags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Filtrage par plateforme
    if (filterBy !== 'all') {
      filtered = filtered.filter(post => post.platform === filterBy);
    }

    // Filtrage par récence (dernières 24h)
    if (showOnlyRecent) {
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
      filtered = filtered.filter(post => post.createdAt > yesterday);
    }

    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return b.createdAt.getTime() - a.createdAt.getTime();
        case 'engagement':
          const engagementA = a.metrics.likes + a.metrics.shares + a.metrics.comments;
          const engagementB = b.metrics.likes + b.metrics.shares + b.metrics.comments;
          return engagementB - engagementA;
        case 'platform':
          return a.platform.localeCompare(b.platform);
        default:
          return 0;
      }
    });

    return filtered;
  }, [posts, searchQuery, sortBy, filterBy, showOnlyRecent]);

  // Statistiques
  const stats = useMemo(() => {
    const platformCounts = posts.reduce((acc, post) => {
      acc[post.platform] = (acc[post.platform] || 0) + 1;
      return acc;
    }, {} as Record<SocialPlatform, number>);

    const totalEngagement = posts.reduce((acc, post) => 
      acc + post.metrics.likes + post.metrics.shares + post.metrics.comments, 0
    );

    const topHashtags = posts
      .flatMap(post => post.hashtags)
      .reduce((acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    return {
      total: posts.length,
      platformCounts,
      totalEngagement,
      topHashtags: Object.entries(topHashtags)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([tag, count]) => ({ tag, count }))
    };
  }, [posts]);

  const renderUnifiedFeed = () => (
    <div className="space-y-6">
      {filteredAndSortedPosts.map((post) => (
        <UnifiedPostCard key={`${post.platform}-${post.id}`} post={post} />
      ))}
      {filteredAndSortedPosts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Hash className="w-12 h-12 mx-auto" />
          </div>
          <p className="text-gray-500">
            {searchQuery || filterBy !== 'all' 
              ? 'Aucun post ne correspond à vos critères'
              : 'Aucun post à afficher'
            }
          </p>
        </div>
      )}
    </div>
  );

  const renderSeparatedFeed = () => (
    <div className="space-y-8">
      <TwitterWidget posts={posts} maxPosts={10} />
      <YouTubeWidget posts={posts} maxPosts={6} />
      <FacebookWidget posts={posts} maxPosts={10} />
    </div>
  );

  const renderGridFeed = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <TwitterWidget posts={posts} maxPosts={5} />
      <YouTubeWidget posts={posts} maxPosts={4} layout="list" />
      <FacebookWidget posts={posts} maxPosts={5} />
    </div>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* En-tête avec statistiques */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Feed Social Multi-Réseaux
          </h2>
          
          <div className="flex items-center space-x-4">
            {onRefresh && (
              <button
                onClick={onRefresh}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Actualiser</span>
              </button>
            )}
          </div>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-500">Posts Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.totalEngagement}</div>
            <div className="text-sm text-gray-500">Engagement</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {Object.keys(stats.platformCounts).length}
            </div>
            <div className="text-sm text-gray-500">Plateformes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {stats.topHashtags.length}
            </div>
            <div className="text-sm text-gray-500">Top Hashtags</div>
          </div>
        </div>

        {/* Répartition par plateforme */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(stats.platformCounts).map(([platform, count]) => (
            <span
              key={platform}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                platform === 'twitter' ? 'bg-blue-100 text-blue-800' :
                platform === 'youtube' ? 'bg-red-100 text-red-800' :
                platform === 'facebook' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}
            >
              {platform}: {count}
            </span>
          ))}
        </div>
      </div>

      {/* Filtres et recherche */}
      {(showFilters || showSearch) && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Recherche */}
            {showSearch && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}

            {/* Filtre par plateforme */}
            {showFilters && (
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value as FilterOption)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Toutes les plateformes</option>
                <option value="twitter">Twitter/X</option>
                <option value="youtube">YouTube</option>
                <option value="facebook">Facebook</option>
              </select>
            )}

            {/* Tri */}
            {showFilters && (
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="date">Plus récent</option>
                <option value="engagement">Plus d'engagement</option>
                <option value="platform">Par plateforme</option>
              </select>
            )}

            {/* Filtre récent */}
            {showFilters && (
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showOnlyRecent}
                  onChange={(e) => setShowOnlyRecent(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Dernières 24h</span>
              </label>
            )}
          </div>
        </div>
      )}

      {/* Contenu principal */}
      <div>
        {layout === 'unified' && renderUnifiedFeed()}
        {layout === 'separated' && renderSeparatedFeed()}
        {layout === 'grid' && renderGridFeed()}
      </div>
    </div>
  );
}

// Composant pour un post unifié
interface UnifiedPostCardProps {
  post: SocialPost;
}

function UnifiedPostCard({ post }: UnifiedPostCardProps) {
  const getPlatformColor = (platform: SocialPlatform) => {
    switch (platform) {
      case 'twitter': return 'bg-blue-500';
      case 'youtube': return 'bg-red-600';
      case 'facebook': return 'bg-blue-600';
      default: return 'bg-gray-500';
    }
  };

  const getPlatformIcon = (platform: SocialPlatform) => {
    switch (platform) {
      case 'twitter': return '𝕏';
      case 'youtube': return '▶';
      case 'facebook': return 'f';
      default: return '?';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        {/* En-tête avec plateforme */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 ${getPlatformColor(post.platform)} rounded-full flex items-center justify-center`}>
              <span className="text-white font-bold text-sm">
                {getPlatformIcon(post.platform)}
              </span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">{post.author.name}</h4>
              <p className="text-sm text-gray-500">
                {formatDistanceToNow(post.createdAt, { addSuffix: true, locale: fr })}
              </p>
            </div>
          </div>
          
          <a
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-blue-600 transition-colors"
          >
            <ExternalLink className="w-5 h-5" />
          </a>
        </div>

        {/* Contenu */}
        <div className="mb-4">
          <p className="text-gray-900 leading-relaxed line-clamp-3">
            {post.content}
          </p>
        </div>

        {/* Médias */}
        {post.media && post.media.length > 0 && (
          <div className="mb-4 rounded-lg overflow-hidden">
            {post.media[0].type === 'image' && (
              <img
                src={post.media[0].url}
                alt={post.media[0].alt || 'Media'}
                className="w-full max-h-64 object-cover"
              />
            )}
            {post.media[0].type === 'video' && (
              <video
                src={post.media[0].url}
                poster={post.media[0].thumbnailUrl}
                controls
                className="w-full max-h-64"
              />
            )}
          </div>
        )}

        {/* Hashtags */}
        {post.hashtags.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {post.hashtags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                >
                  #{tag}
                </span>
              ))}
              {post.hashtags.length > 3 && (
                <span className="text-gray-500 text-xs">
                  +{post.hashtags.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Métriques */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4 text-gray-500 text-sm">
            <span>❤️ {post.metrics.likes}</span>
            <span>💬 {post.metrics.comments}</span>
            <span>🔄 {post.metrics.shares}</span>
            {post.metrics.views && post.metrics.views > 0 && (
              <span>👁️ {post.metrics.views}</span>
            )}
          </div>
          
          <span className={`px-2 py-1 rounded text-xs font-medium ${getPlatformColor(post.platform)} text-white`}>
            {post.platform.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
}

export default SocialFeed;