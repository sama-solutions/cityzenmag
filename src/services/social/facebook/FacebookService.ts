// Service Facebook pour l'intégration avec l'API Graph de Facebook

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
  FacebookConfig, 
  FacebookPost, 
  FacebookPage, 
  FacebookUser,
  FacebookResponse,
  FacebookSearchOptions,
  FacebookPublishOptions,
  FacebookAttachment,
  FacebookInsight
} from './types';

export class FacebookService extends SocialService {
  private facebookConfig: FacebookConfig;
  private baseUrl: string;

  constructor(config: SocialConfig & { facebook: FacebookConfig }) {
    super(config);
    this.facebookConfig = config.facebook;
    this.baseUrl = `https://graph.facebook.com/${this.facebookConfig.version || 'v18.0'}`;
  }

  async authenticate(): Promise<boolean> {
    try {
      await this.checkRateLimit();
      
      // Test de l'API avec une requête simple pour vérifier le token
      const response = await fetch(`${this.baseUrl}/me?access_token=${this.facebookConfig.accessToken}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        this.isAuthenticated = true;
        return true;
      } else {
        const error = await response.json();
        throw new Error(`Facebook authentication failed: ${error.error?.message || response.statusText}`);
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

      const pageId = this.facebookConfig.pageId;
      if (!pageId) {
        throw new Error('No Facebook page ID configured');
      }

      const fields = [
        'id', 'message', 'story', 'created_time', 'updated_time',
        'from', 'attachments', 'reactions.summary(true)', 
        'comments.summary(true)', 'shares', 'permalink_url',
        'full_picture', 'picture', 'link', 'name', 'caption',
        'description', 'type', 'status_type'
      ].join(',');

      const queryParams = new URLSearchParams({
        fields,
        access_token: this.facebookConfig.accessToken,
        limit: Math.min(options?.limit || 25, 100).toString()
      });

      if (options?.since) {
        queryParams.append('since', Math.floor(options.since.getTime() / 1000).toString());
      }

      if (options?.until) {
        queryParams.append('until', Math.floor(options.until.getTime() / 1000).toString());
      }

      if (options?.cursor) {
        queryParams.append('after', options.cursor);
      }

      const response = await fetch(`${this.baseUrl}/${pageId}/posts?${queryParams}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to fetch Facebook posts: ${error.error?.message || response.statusText}`);
      }

      const data: FacebookResponse<FacebookPost> = await response.json();
      
      return this.convertPostsToSocialPosts(data.data);
    } catch (error) {
      this.handleError(error, 'fetchPosts');
      return [];
    }
  }

  async fetchProfile(pageId?: string): Promise<SocialProfile> {
    try {
      await this.checkRateLimit();
      
      if (!this.isAuthenticated) {
        await this.authenticate();
      }

      const targetPageId = pageId || this.facebookConfig.pageId;
      if (!targetPageId) {
        throw new Error('No Facebook page ID provided');
      }

      const fields = [
        'id', 'name', 'about', 'category', 'category_list',
        'cover', 'description', 'fan_count', 'followers_count',
        'link', 'location', 'phone', 'picture', 'username',
        'verification_status', 'website', 'created_time'
      ].join(',');

      const response = await fetch(`${this.baseUrl}/${targetPageId}?fields=${fields}&access_token=${this.facebookConfig.accessToken}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to fetch Facebook page: ${error.error?.message || response.statusText}`);
      }

      const page: FacebookPage = await response.json();
      
      return this.convertPageToSocialProfile(page);
    } catch (error) {
      this.handleError(error, 'fetchProfile');
      throw error;
    }
  }

  async publishPost(content: PostContent): Promise<SocialPost> {
    try {
      this.validatePostContent(content);
      await this.checkRateLimit();
      
      if (!this.isAuthenticated) {
        await this.authenticate();
      }

      const pageId = this.facebookConfig.pageId;
      if (!pageId) {
        throw new Error('No Facebook page ID configured');
      }

      const publishOptions: FacebookPublishOptions = {
        message: content.text,
        published: !content.scheduledAt
      };

      // Ajouter les hashtags au message
      if (content.hashtags && content.hashtags.length > 0) {
        const hashtags = this.formatHashtags(content.hashtags);
        publishOptions.message += '\n\n' + hashtags.join(' ');
      }

      // Programmer la publication si nécessaire
      if (content.scheduledAt) {
        publishOptions.scheduled_publish_time = Math.floor(content.scheduledAt.getTime() / 1000);
      }

      const formData = new FormData();
      Object.entries(publishOptions).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, value.toString());
        }
      });

      formData.append('access_token', this.facebookConfig.accessToken);

      // Ajouter les médias si présents
      if (content.media && content.media.length > 0) {
        // Pour les médias, Facebook nécessite un processus en deux étapes
        // 1. Upload des médias
        // 2. Création du post avec les IDs des médias
        const mediaIds = await this.uploadMedia(content.media);
        if (mediaIds.length > 0) {
          formData.append('attached_media', JSON.stringify(
            mediaIds.map(id => ({ media_fbid: id }))
          ));
        }
      }

      const response = await fetch(`${this.baseUrl}/${pageId}/feed`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to publish Facebook post: ${error.error?.message || response.statusText}`);
      }

      const result = await response.json();
      
      // Récupérer le post complet
      const fullPost = await this.fetchPostById(result.id);
      return fullPost;
    } catch (error) {
      this.handleError(error, 'publishPost');
      throw error;
    }
  }

  async deletePost(postId: string): Promise<boolean> {
    try {
      await this.checkRateLimit();
      
      if (!this.isAuthenticated) {
        await this.authenticate();
      }

      const response = await fetch(`${this.baseUrl}/${postId}?access_token=${this.facebookConfig.accessToken}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return response.ok;
    } catch (error) {
      this.handleError(error, 'deletePost');
      return false;
    }
  }

  async getAnalytics(period: 'day' | 'week' | 'month' | 'year'): Promise<SocialAnalytics> {
    try {
      await this.checkRateLimit();
      
      if (!this.isAuthenticated) {
        await this.authenticate();
      }

      const pageId = this.facebookConfig.pageId;
      if (!pageId) {
        throw new Error('No Facebook page ID configured');
      }

      // Récupérer les insights de la page
      const insightMetrics = [
        'page_impressions', 'page_reach', 'page_engaged_users',
        'page_post_engagements', 'page_fans', 'page_views_total'
      ];

      const periodMap = {
        'day': 'day',
        'week': 'week',
        'month': 'days_28',
        'year': 'days_28'
      };

      const queryParams = new URLSearchParams({
        metric: insightMetrics.join(','),
        period: periodMap[period],
        access_token: this.facebookConfig.accessToken
      });

      const response = await fetch(`${this.baseUrl}/${pageId}/insights?${queryParams}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to fetch Facebook insights: ${error.error?.message || response.statusText}`);
      }

      const insightsData: FacebookResponse<FacebookInsight> = await response.json();
      
      // Récupérer aussi les posts récents pour les métriques détaillées
      const posts = await this.fetchPosts({ limit: 50 });
      
      return this.buildAnalyticsFromInsights(insightsData.data, posts, period);
    } catch (error) {
      this.handleError(error, 'getAnalytics');
      
      // Fallback: calculer les métriques à partir des posts récents
      const posts = await this.fetchPosts({ limit: 50 });
      return this.buildBasicAnalytics(posts, period);
    }
  }

  // Méthodes privées

  private async uploadMedia(files: File[]): Promise<string[]> {
    const mediaIds: string[] = [];
    
    for (const file of files) {
      try {
        const formData = new FormData();
        formData.append('source', file);
        formData.append('access_token', this.facebookConfig.accessToken);

        const response = await fetch(`${this.baseUrl}/${this.facebookConfig.pageId}/photos`, {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          const result = await response.json();
          mediaIds.push(result.id);
        }
      } catch (error) {
        console.error('Failed to upload media:', error);
      }
    }
    
    return mediaIds;
  }

  private async fetchPostById(postId: string): Promise<SocialPost> {
    const fields = [
      'id', 'message', 'story', 'created_time', 'updated_time',
      'from', 'attachments', 'reactions.summary(true)', 
      'comments.summary(true)', 'shares', 'permalink_url',
      'full_picture', 'picture', 'link', 'name', 'caption',
      'description', 'type', 'status_type'
    ].join(',');

    const response = await fetch(`${this.baseUrl}/${postId}?fields=${fields}&access_token=${this.facebookConfig.accessToken}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch post details');
    }

    const post: FacebookPost = await response.json();
    const socialPosts = this.convertPostsToSocialPosts([post]);
    
    if (socialPosts.length === 0) {
      throw new Error('Post not found');
    }
    
    return socialPosts[0];
  }

  private convertPostsToSocialPosts(posts: FacebookPost[]): SocialPost[] {
    return posts.map(post => ({
      id: post.id,
      platform: 'facebook' as const,
      content: post.message || post.story || '',
      author: {
        id: post.from.id,
        name: post.from.name,
        username: post.from.name,
        avatar: post.from.picture?.data.url,
        verified: false // Facebook ne fournit pas cette info facilement
      },
      createdAt: new Date(post.created_time),
      updatedAt: post.updated_time ? new Date(post.updated_time) : undefined,
      metrics: {
        likes: post.reactions?.summary.total_count || 0,
        shares: post.shares?.count || 0,
        comments: post.comments?.summary.total_count || 0,
        views: 0 // Facebook ne fournit pas cette métrique pour les posts normaux
      },
      media: this.convertAttachmentsToSocialMedia(post.attachments?.data || []),
      url: post.permalink_url || `https://facebook.com/${post.id}`,
      hashtags: this.extractHashtags(post.message || ''),
      mentions: this.extractMentions(post.message || ''),
      type: this.determineFacebookPostType(post)
    }));
  }

  private convertAttachmentsToSocialMedia(attachments: FacebookAttachment[]): SocialMedia[] {
    return attachments.map((attachment, index) => ({
      id: `${attachment.target?.id || index}`,
      type: attachment.type === 'photo' ? 'image' : attachment.type === 'video' ? 'video' : 'image',
      url: attachment.media?.source || attachment.media?.image?.src || attachment.url || '',
      thumbnailUrl: attachment.media?.image?.src,
      width: attachment.media?.image?.width,
      height: attachment.media?.image?.height,
      alt: attachment.title || attachment.description
    }));
  }

  private convertPageToSocialProfile(page: FacebookPage): SocialProfile {
    return {
      id: page.id,
      platform: 'facebook',
      name: page.name,
      username: page.username || page.name,
      bio: page.about || page.description,
      avatar: page.picture.data.url,
      banner: page.cover?.source,
      verified: page.verification_status === 'blue_verified' || page.verification_status === 'gray_verified',
      followers: page.fan_count,
      following: 0, // Facebook ne fournit pas cette info pour les pages
      postsCount: 0, // Nécessiterait une requête séparée
      url: page.link,
      location: page.location ? `${page.location.city}, ${page.location.country}` : undefined,
      website: page.website,
      joinedAt: new Date(page.created_time)
    };
  }

  private determineFacebookPostType(post: FacebookPost): 'text' | 'image' | 'video' | 'link' | 'poll' {
    if (post.type === 'video') return 'video';
    if (post.type === 'photo') return 'image';
    if (post.type === 'link') return 'link';
    if (post.attachments?.data.some(a => a.type === 'video')) return 'video';
    if (post.attachments?.data.some(a => a.type === 'photo')) return 'image';
    return 'text';
  }

  private extractHashtags(text: string): string[] {
    const hashtagRegex = /#[\w\u00c0-\u024f\u1e00-\u1eff]+/gi;
    const matches = text.match(hashtagRegex);
    return matches ? matches.map(tag => tag.substring(1)) : [];
  }

  private extractMentions(text: string): string[] {
    const mentionRegex = /@[\w\u00c0-\u024f\u1e00-\u1eff]+/gi;
    const matches = text.match(mentionRegex);
    return matches ? matches.map(mention => mention.substring(1)) : [];
  }

  private buildAnalyticsFromInsights(insights: FacebookInsight[], posts: SocialPost[], period: string): SocialAnalytics {
    const metrics = {
      totalPosts: posts.length,
      totalLikes: posts.reduce((sum, post) => sum + post.metrics.likes, 0),
      totalShares: posts.reduce((sum, post) => sum + post.metrics.shares, 0),
      totalComments: posts.reduce((sum, post) => sum + post.metrics.comments, 0),
      totalViews: 0,
      engagement: 0,
      reach: 0,
      impressions: 0
    };

    // Extraire les métriques des insights
    insights.forEach(insight => {
      const latestValue = insight.values[insight.values.length - 1];
      const value = typeof latestValue.value === 'number' ? latestValue.value : 0;

      switch (insight.name) {
        case 'page_impressions':
          metrics.impressions = value;
          break;
        case 'page_reach':
          metrics.reach = value;
          break;
        case 'page_engaged_users':
          metrics.engagement = value;
          break;
      }
    });

    // Calculer le taux d'engagement
    if (metrics.reach > 0) {
      metrics.engagement = ((metrics.totalLikes + metrics.totalShares + metrics.totalComments) / metrics.reach) * 100;
    }

    return {
      platform: 'facebook',
      period: period as any,
      metrics,
      topPosts: posts.slice(0, 5),
      topHashtags: this.extractTopHashtags(posts)
    };
  }

  private buildBasicAnalytics(posts: SocialPost[], period: string): SocialAnalytics {
    const metrics = posts.reduce((acc, post) => ({
      totalLikes: acc.totalLikes + post.metrics.likes,
      totalShares: acc.totalShares + post.metrics.shares,
      totalComments: acc.totalComments + post.metrics.comments,
      totalViews: acc.totalViews + (post.metrics.views || 0)
    }), { totalLikes: 0, totalShares: 0, totalComments: 0, totalViews: 0 });

    const engagement = posts.length > 0 
      ? ((metrics.totalLikes + metrics.totalShares + metrics.totalComments) / posts.length) * 100 
      : 0;

    return {
      platform: 'facebook',
      period: period as any,
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

  public async searchPosts(query: string, options?: Partial<FacebookSearchOptions>): Promise<SocialPost[]> {
    // Note: La recherche Facebook est limitée et nécessite des permissions spéciales
    // Pour l'instant, on retourne les posts récents filtrés
    const posts = await this.fetchPosts({ limit: options?.limit || 25 });
    
    if (!query) return posts;
    
    return posts.filter(post => 
      post.content.toLowerCase().includes(query.toLowerCase()) ||
      post.hashtags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
  }

  public async getPageEvents(pageId?: string): Promise<any[]> {
    // Récupérer les événements d'une page Facebook
    const targetPageId = pageId || this.facebookConfig.pageId;
    if (!targetPageId) {
      throw new Error('No Facebook page ID provided');
    }

    try {
      const response = await fetch(`${this.baseUrl}/${targetPageId}/events?access_token=${this.facebookConfig.accessToken}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      this.handleError(error, 'getPageEvents');
      return [];
    }
  }
}