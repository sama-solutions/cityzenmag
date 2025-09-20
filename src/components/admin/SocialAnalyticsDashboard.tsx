// Tableau de bord des analytics des réseaux sociaux

import React, { useState, useMemo } from 'react';
import { useAggregatedAnalytics, useSocial } from '../../contexts/SocialContext';
import { SocialPlatform } from '../../services/social/base/types';
import { 
  TrendingUp, 
  Users, 
  Heart, 
  MessageCircle, 
  Share2, 
  Eye,
  Calendar,
  Hash,
  Award,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

interface SocialAnalyticsDashboardProps {
  className?: string;
}

export function SocialAnalyticsDashboard({ className = '' }: SocialAnalyticsDashboardProps) {
  const { analytics: aggregatedAnalytics, loading } = useAggregatedAnalytics();
  const { analytics, posts, getEnabledPlatforms } = useSocial();
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month' | 'year'>('week');
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform | 'all'>('all');

  const enabledPlatforms = getEnabledPlatforms();

  // Métriques calculées
  const metrics = useMemo(() => {
    if (!aggregatedAnalytics) return null;

    const { metrics } = aggregatedAnalytics;
    const engagementRate = metrics.reach > 0 ? (metrics.engagement / metrics.reach) * 100 : 0;
    
    return {
      totalPosts: metrics.totalPosts,
      totalEngagement: metrics.totalLikes + metrics.totalShares + metrics.totalComments,
      totalReach: metrics.reach,
      engagementRate: engagementRate.toFixed(2),
      avgEngagementPerPost: metrics.totalPosts > 0 ? 
        ((metrics.totalLikes + metrics.totalShares + metrics.totalComments) / metrics.totalPosts).toFixed(1) : '0'
    };
  }, [aggregatedAnalytics]);

  // Données par plateforme
  const platformData = useMemo(() => {
    return enabledPlatforms.map(platform => {
      const platformAnalytics = analytics.get(platform);
      const platformPosts = posts.filter(p => p.platform === platform);
      
      return {
        platform,
        posts: platformPosts.length,
        likes: platformAnalytics?.metrics.totalLikes || 0,
        shares: platformAnalytics?.metrics.totalShares || 0,
        comments: platformAnalytics?.metrics.totalComments || 0,
        reach: platformAnalytics?.metrics.reach || 0,
        engagement: platformAnalytics?.metrics.engagement || 0
      };
    });
  }, [analytics, posts, enabledPlatforms]);

  // Top posts
  const topPosts = useMemo(() => {
    if (!aggregatedAnalytics) return [];
    
    return aggregatedAnalytics.topPosts.slice(0, 5).map(post => ({
      ...post,
      totalEngagement: post.metrics.likes + post.metrics.shares + post.metrics.comments
    }));
  }, [aggregatedAnalytics]);

  // Top hashtags
  const topHashtags = useMemo(() => {
    if (!aggregatedAnalytics) return [];
    return aggregatedAnalytics.topHashtags.slice(0, 10);
  }, [aggregatedAnalytics]);

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

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <div className="text-center py-12">
          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Aucune donnée d'analytics disponible</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md ${className}`}>
      {/* En-tête */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">
              Analytics des Réseaux Sociaux
            </h2>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="day">Dernières 24h</option>
              <option value="week">Dernière semaine</option>
              <option value="month">Dernier mois</option>
              <option value="year">Dernière année</option>
            </select>
            
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Toutes les plateformes</option>
              {enabledPlatforms.map(platform => (
                <option key={platform} value={platform} className="capitalize">
                  {platform}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Métriques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Posts Total</p>
                <p className="text-2xl font-bold">{metrics.totalPosts}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Engagement Total</p>
                <p className="text-2xl font-bold">{formatNumber(metrics.totalEngagement)}</p>
              </div>
              <Heart className="w-8 h-8 text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Portée Totale</p>
                <p className="text-2xl font-bold">{formatNumber(metrics.totalReach)}</p>
              </div>
              <Users className="w-8 h-8 text-purple-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Taux d'Engagement</p>
                <p className="text-2xl font-bold">{metrics.engagementRate}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-200" />
            </div>
          </div>
        </div>

        {/* Données par plateforme */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Performance par Plateforme
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {platformData.map(data => (
              <div key={data.platform} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className={`w-6 h-6 ${getPlatformColor(data.platform)} rounded-full flex items-center justify-center text-white text-sm font-bold`}>
                      {getPlatformIcon(data.platform)}
                    </div>
                    <span className="font-medium capitalize">{data.platform}</span>
                  </div>
                  <span className="text-sm text-gray-500">{data.posts} posts</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1">
                      <Heart className="w-4 h-4 text-red-500" />
                      <span>Likes</span>
                    </div>
                    <span className="font-medium">{formatNumber(data.likes)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1">
                      <Share2 className="w-4 h-4 text-blue-500" />
                      <span>Partages</span>
                    </div>
                    <span className="font-medium">{formatNumber(data.shares)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="w-4 h-4 text-green-500" />
                      <span>Commentaires</span>
                    </div>
                    <span className="font-medium">{formatNumber(data.comments)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4 text-purple-500" />
                      <span>Portée</span>
                    </div>
                    <span className="font-medium">{formatNumber(data.reach)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Posts */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Posts les Plus Performants
          </h3>
          <div className="space-y-4">
            {topPosts.map((post, index) => (
              <div key={`${post.platform}-${post.id}`} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                      <div className={`w-6 h-6 ${getPlatformColor(post.platform)} rounded-full flex items-center justify-center text-white text-sm font-bold`}>
                        {getPlatformIcon(post.platform)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 line-clamp-2 mb-2">
                      {post.content}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>❤️ {post.metrics.likes}</span>
                      <span>💬 {post.metrics.comments}</span>
                      <span>🔄 {post.metrics.shares}</span>
                      <span className="font-medium text-blue-600">
                        Total: {post.totalEngagement}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0">
                    <a
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Voir →
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Hashtags */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Hashtags les Plus Populaires
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {topHashtags.map((hashtag, index) => (
              <div key={hashtag.tag} className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Hash className="w-5 h-5 text-blue-500" />
                </div>
                <p className="font-medium text-gray-900">#{hashtag.tag}</p>
                <p className="text-sm text-gray-500">{hashtag.count} utilisations</p>
              </div>
            ))}
          </div>
        </div>

        {/* Métriques supplémentaires */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Activity className="w-6 h-6 text-blue-600" />
              <h4 className="font-semibold text-gray-900">Engagement Moyen</h4>
            </div>
            <p className="text-2xl font-bold text-blue-600">{metrics.avgEngagementPerPost}</p>
            <p className="text-sm text-gray-500">par post</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Calendar className="w-6 h-6 text-green-600" />
              <h4 className="font-semibold text-gray-900">Période</h4>
            </div>
            <p className="text-lg font-medium text-green-600 capitalize">{selectedPeriod}</p>
            <p className="text-sm text-gray-500">sélectionnée</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Award className="w-6 h-6 text-purple-600" />
              <h4 className="font-semibold text-gray-900">Plateformes</h4>
            </div>
            <p className="text-2xl font-bold text-purple-600">{enabledPlatforms.length}</p>
            <p className="text-sm text-gray-500">connectées</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SocialAnalyticsDashboard;