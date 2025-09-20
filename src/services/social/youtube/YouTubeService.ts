// Service YouTube pour l'intégration avec l'API YouTube Data v3

import { SocialService } from '../base/SocialService';
import { 
  SocialPost, 
  SocialProfile, 
  FetchOptions, 
  PostContent, 
  SocialConfig, 
  SocialAnalytics,
  SocialMedia
} from '../base/types';
import { 
  YouTubeConfig, 
  YouTubeVideo, 
  YouTubeChannel, 
  YouTubeResponse,
  YouTubeSearchOptions,
  ParsedDuration,
  YouTubeUploadOptions
} from './types';

export class YouTubeService extends SocialService {
  private youtubeConfig: YouTubeConfig;
  private baseUrl = 'https://www.googleapis.com/youtube/v3';

  constructor(config: SocialConfig & { youtube: YouTubeConfig }) {
    super(config);
    this.youtubeConfig = config.youtube;
  }

  async authenticate(): Promise<boolean> {
    try {
      await this.checkRateLimit();
      
      // Test de l'API avec une requête simple
      const response = await fetch(`${this.baseUrl}/channels?part=snippet&mine=true&key=${this.youtubeConfig.apiKey}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        this.isAuthenticated = true;
        return true;
      } else {
        const error = await response.json();
        throw new Error(`YouTube authentication failed: ${error.error?.message || response.statusText}`);
      }
    } catch (error) {
      this.handleError(error, 'authenticate');
      this.isAuthenticated = false;
      return false;
    }
  }

  async fetchPosts(options?: FetchOptions): Promise<SocialPost[]> {
    try {
      await this.checkRateLimit();
      
      if (!this.isAuthenticated) {
        await this.authenticate();
      }

      const searchOptions: YouTubeSearchOptions = {
        part: 'snippet',
        type: 'video',
        maxResults: Math.min(options?.limit || 10, 50),
        order: options?.sortBy === 'popularity' ? 'viewCount' : 'date'
      };

      // Si un channelId est configuré, récupérer les vidéos de ce canal
      if (this.youtubeConfig.channelId) {
        searchOptions.channelId = this.youtubeConfig.channelId;
      }

      if (options?.since) {
        searchOptions.publishedAfter = options.since.toISOString();
      }

      if (options?.until) {
        searchOptions.publishedBefore = options.until.toISOString();
      }

      if (options?.cursor) {
        searchOptions.pageToken = options.cursor;
      }

      // Construire la requête de recherche
      if (options?.hashtags && options.hashtags.length > 0) {
        searchOptions.q = options.hashtags.join(' ');
      }

      const queryParams = new URLSearchParams();
      Object.entries(searchOptions).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });

      queryParams.append('key', this.youtubeConfig.apiKey);

      const response = await fetch(`${this.baseUrl}/search?${queryParams}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to fetch YouTube videos: ${error.error?.message || response.statusText}`);
      }

      const data: YouTubeResponse<YouTubeVideo> = await response.json();
      
      // Récupérer les détails complets des vidéos
      const videoIds = data.items.map(item => 
        typeof item.id === 'string' ? item.id : item.id.videoId
      ).filter(Boolean);

      if (videoIds.length === 0) {
        return [];
      }

      const detailedVideos = await this.fetchVideoDetails(videoIds);
      return this.convertVideosToSocialPosts(detailedVideos);
    } catch (error) {
      this.handleError(error, 'fetchPosts');
      return [];
    }
  }

  async fetchProfile(channelId?: string): Promise<SocialProfile> {
    try {
      await this.checkRateLimit();
      
      if (!this.isAuthenticated) {
        await this.authenticate();
      }

      const targetChannelId = channelId || this.youtubeConfig.channelId;
      if (!targetChannelId) {
        throw new Error('No channel ID provided');
      }

      const response = await fetch(`${this.baseUrl}/channels?part=snippet,statistics,brandingSettings&id=${targetChannelId}&key=${this.youtubeConfig.apiKey}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to fetch YouTube channel: ${error.error?.message || response.statusText}`);
      }

      const data: YouTubeResponse<YouTubeChannel> = await response.json();
      
      if (!data.items || data.items.length === 0) {
        throw new Error('Channel not found');
      }

      return this.convertChannelToSocialProfile(data.items[0]);
    } catch (error) {
      this.handleError(error, 'fetchProfile');
      throw error;
    }
  }

  async publishPost(content: PostContent): Promise<SocialPost> {
    // Note: L'upload de vidéos nécessite OAuth2 et des permissions spéciales
    // Pour l'instant, cette méthode n'est pas implémentée
    throw new Error('Video upload not implemented. YouTube publishing requires OAuth2 authentication and special permissions.');
  }

  async deletePost(postId: string): Promise<boolean> {
    // Note: La suppression de vidéos nécessite OAuth2 et des permissions spéciales
    try {
      await this.checkRateLimit();
      
      if (!this.isAuthenticated) {
        await this.authenticate();
      }

      // Cette fonctionnalité nécessite OAuth2
      throw new Error('Video deletion requires OAuth2 authentication');
    } catch (error) {
      this.handleError(error, 'deletePost');
      return false;
    }
  }

  async getAnalytics(period: 'day' | 'week' | 'month' | 'year'): Promise<SocialAnalytics> {
    // Note: L'API YouTube Analytics nécessite des permissions spéciales
    // Pour l'instant, on calcule les métriques à partir des vidéos récentes
    const now = new Date();
    const startDate = new Date();
    
    switch (period) {
      case 'day':
        startDate.setDate(now.getDate() - 1);
        break;
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    const posts = await this.fetchPosts({ since: startDate, limit: 50 });
    
    const metrics = posts.reduce((acc, post) => ({
      totalLikes: acc.totalLikes + post.metrics.likes,
      totalShares: acc.totalShares + post.metrics.shares,
      totalComments: acc.totalComments + post.metrics.comments,
      totalViews: acc.totalViews + (post.metrics.views || 0)
    }), { totalLikes: 0, totalShares: 0, totalComments: 0, totalViews: 0 });

    const engagement = posts.length > 0 
      ? ((metrics.totalLikes + metrics.totalShares + metrics.totalComments) / metrics.totalViews) * 100 
      : 0;

    return {
      platform: 'youtube',
      period,
      metrics: {
        totalPosts: posts.length,
        ...metrics,
        engagement,
        reach: metrics.totalViews,
        impressions: metrics.totalViews
      },
      topPosts: posts.slice(0, 5),
      topHashtags: this.extractTopHashtags(posts)
    };
  }

  // Méthodes privées

  private async fetchVideoDetails(videoIds: string[]): Promise<YouTubeVideo[]> {
    const response = await fetch(`${this.baseUrl}/videos?part=snippet,statistics,contentDetails&id=${videoIds.join(',')}&key=${this.youtubeConfig.apiKey}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to fetch video details: ${error.error?.message || response.statusText}`);
    }

    const data: YouTubeResponse<YouTubeVideo> = await response.json();
    return data.items;
  }

  private convertVideosToSocialPosts(videos: YouTubeVideo[]): SocialPost[] {
    return videos.map(video => {
      const videoId = typeof video.id === 'string' ? video.id : video.id.videoId;
      
      return {
        id: videoId,
        platform: 'youtube' as const,
        content: video.snippet.description,
        author: {
          id: video.snippet.channelId,
          name: video.snippet.channelTitle,
          username: video.snippet.channelTitle,
          verified: false // YouTube ne fournit pas cette info dans l'API de base
        },
        createdAt: new Date(video.snippet.publishedAt),
        metrics: {
          likes: parseInt(video.statistics?.likeCount || '0'),
          shares: 0, // YouTube ne fournit pas le nombre de partages
          comments: parseInt(video.statistics?.commentCount || '0'),
          views: parseInt(video.statistics?.viewCount || '0')
        },
        media: this.convertVideoToSocialMedia(video),
        url: `https://www.youtube.com/watch?v=${videoId}`,
        hashtags: video.snippet.tags || [],
        mentions: [],
        type: 'video' as const
      };
    });
  }

  private convertVideoToSocialMedia(video: YouTubeVideo): SocialMedia[] {
    const videoId = typeof video.id === 'string' ? video.id : video.id.videoId;
    const thumbnail = video.snippet.thumbnails.maxres || 
                     video.snippet.thumbnails.high || 
                     video.snippet.thumbnails.medium || 
                     video.snippet.thumbnails.default;

    const duration = video.contentDetails?.duration ? 
      this.parseDuration(video.contentDetails.duration) : undefined;

    return [{
      id: videoId,
      type: 'video',
      url: `https://www.youtube.com/watch?v=${videoId}`,
      thumbnailUrl: thumbnail?.url,
      width: thumbnail?.width,
      height: thumbnail?.height,
      duration: duration?.totalSeconds
    }];
  }

  private convertChannelToSocialProfile(channel: YouTubeChannel): SocialProfile {
    return {
      id: channel.id,
      platform: 'youtube',
      name: channel.snippet.title,
      username: channel.snippet.customUrl || channel.snippet.title,
      bio: channel.snippet.description,
      avatar: channel.snippet.thumbnails.high?.url || channel.snippet.thumbnails.default?.url,
      banner: channel.brandingSettings?.image.bannerExternalUrl,
      verified: false, // YouTube ne fournit pas cette info dans l'API de base
      followers: parseInt(channel.statistics.subscriberCount),
      following: 0, // YouTube ne fournit pas cette info
      postsCount: parseInt(channel.statistics.videoCount),
      url: `https://www.youtube.com/channel/${channel.id}`,
      location: channel.snippet.country,
      joinedAt: new Date(channel.snippet.publishedAt)
    };
  }

  private parseDuration(duration: string): ParsedDuration {
    // Parse ISO 8601 duration format (PT4M13S)
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    
    if (!match) {
      return { hours: 0, minutes: 0, seconds: 0, totalSeconds: 0 };
    }

    const hours = parseInt(match[1] || '0');
    const minutes = parseInt(match[2] || '0');
    const seconds = parseInt(match[3] || '0');
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;

    return { hours, minutes, seconds, totalSeconds };
  }

  private extractTopHashtags(posts: SocialPost[]): Array<{ tag: string; count: number }> {
    const hashtagCounts = new Map<string, number>();
    
    posts.forEach(post => {
      post.hashtags.forEach(tag => {
        const cleanTag = tag.replace('#', '');
        hashtagCounts.set(cleanTag, (hashtagCounts.get(cleanTag) || 0) + 1);
      });
    });
    
    return Array.from(hashtagCounts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  // Méthodes utilitaires publiques

  public async searchVideos(query: string, options?: Partial<YouTubeSearchOptions>): Promise<SocialPost[]> {
    const searchOptions: YouTubeSearchOptions = {
      q: query,
      type: 'video',
      part: 'snippet',
      maxResults: 25,
      ...options
    };

    return this.fetchPosts({ 
      limit: searchOptions.maxResults,
      cursor: searchOptions.pageToken 
    });
  }

  public async getChannelVideos(channelId: string, limit: number = 25): Promise<SocialPost[]> {
    const oldChannelId = this.youtubeConfig.channelId;
    this.youtubeConfig.channelId = channelId;
    
    try {
      const videos = await this.fetchPosts({ limit });
      return videos;
    } finally {
      this.youtubeConfig.channelId = oldChannelId;
    }
  }

  public getVideoEmbedUrl(videoId: string): string {
    return `https://www.youtube.com/embed/${videoId}`;
  }

  public getVideoThumbnail(videoId: string, quality: 'default' | 'medium' | 'high' | 'maxres' = 'high'): string {
    return `https://img.youtube.com/vi/${videoId}/${quality === 'maxres' ? 'maxresdefault' : quality === 'high' ? 'hqdefault' : quality === 'medium' ? 'mqdefault' : 'default'}.jpg`;
  }
}