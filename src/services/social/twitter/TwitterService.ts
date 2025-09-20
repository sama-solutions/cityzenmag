// Service Twitter/X pour l'intégration avec l'API Twitter v2

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
  TwitterConfig, 
  TwitterUser, 
  TwitterTweet, 
  TwitterMedia, 
  TwitterResponse,
  TwitterSearchOptions 
} from './types';

export class TwitterService extends SocialService {
  private twitterConfig: TwitterConfig;
  private baseUrl = 'https://api.twitter.com/2';

  constructor(config: SocialConfig & { twitter: TwitterConfig }) {
    super(config);
    this.twitterConfig = config.twitter;
  }

  async authenticate(): Promise<boolean> {
    try {
      await this.checkRateLimit();
      
      const response = await fetch(`${this.baseUrl}/users/me`, {
        headers: {
          'Authorization': `Bearer ${this.twitterConfig.bearerToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        this.isAuthenticated = true;
        return true;
      } else {
        const error = await response.json();
        throw new Error(`Twitter authentication failed: ${error.detail || response.statusText}`);
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

      const searchOptions: TwitterSearchOptions = {
        query: this.buildSearchQuery(options),
        max_results: Math.min(options?.limit || 10, 100),
        tweet_fields: ['id', 'text', 'author_id', 'created_at', 'public_metrics', 'entities', 'attachments'],
        user_fields: ['id', 'username', 'name', 'profile_image_url', 'verified'],
        media_fields: ['media_key', 'type', 'url', 'preview_image_url', 'width', 'height', 'duration_ms', 'alt_text'],
        expansions: ['author_id', 'attachments.media_keys']
      };

      if (options?.cursor) {
        searchOptions.next_token = options.cursor;
      }

      if (options?.since) {
        searchOptions.start_time = options.since.toISOString();
      }

      if (options?.until) {
        searchOptions.end_time = options.until.toISOString();
      }

      const queryParams = new URLSearchParams();
      Object.entries(searchOptions).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            queryParams.append(key, value.join(','));
          } else {
            queryParams.append(key, value.toString());
          }
        }
      });

      const response = await fetch(`${this.baseUrl}/tweets/search/recent?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${this.twitterConfig.bearerToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to fetch tweets: ${error.detail || response.statusText}`);
      }

      const data: TwitterResponse<TwitterTweet[]> = await response.json();
      
      return this.convertTweetsToSocialPosts(data);
    } catch (error) {
      this.handleError(error, 'fetchPosts');
      return [];
    }
  }

  async fetchProfile(userId?: string): Promise<SocialProfile> {
    try {
      await this.checkRateLimit();
      
      if (!this.isAuthenticated) {
        await this.authenticate();
      }

      const endpoint = userId ? `${this.baseUrl}/users/${userId}` : `${this.baseUrl}/users/me`;
      const response = await fetch(`${endpoint}?user.fields=id,username,name,description,profile_image_url,verified,location,url,created_at,public_metrics`, {
        headers: {
          'Authorization': `Bearer ${this.twitterConfig.bearerToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to fetch profile: ${error.detail || response.statusText}`);
      }

      const data: TwitterResponse<TwitterUser> = await response.json();
      
      if (!data.data) {
        throw new Error('No user data received');
      }

      return this.convertTwitterUserToSocialProfile(data.data);
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

      const tweetData: any = {
        text: content.text
      };

      // Ajouter les hashtags et mentions au texte si nécessaire
      if (content.hashtags && content.hashtags.length > 0) {
        const hashtags = this.formatHashtags(content.hashtags);
        tweetData.text += ' ' + hashtags.join(' ');
      }

      if (content.mentions && content.mentions.length > 0) {
        const mentions = this.formatMentions(content.mentions);
        tweetData.text += ' ' + mentions.join(' ');
      }

      if (content.replyTo) {
        tweetData.reply = { in_reply_to_tweet_id: content.replyTo };
      }

      const response = await fetch(`${this.baseUrl}/tweets`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.twitterConfig.bearerToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(tweetData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to publish tweet: ${error.detail || response.statusText}`);
      }

      const data: TwitterResponse<TwitterTweet> = await response.json();
      
      if (!data.data) {
        throw new Error('No tweet data received');
      }

      // Récupérer le tweet complet avec les détails
      const fullTweet = await this.fetchTweetById(data.data.id);
      return fullTweet;
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

      const response = await fetch(`${this.baseUrl}/tweets/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.twitterConfig.bearerToken}`,
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
    // Note: L'API Twitter Analytics nécessite des permissions spéciales
    // Pour l'instant, on retourne des données simulées
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

    // Récupérer les posts récents pour calculer les métriques
    const posts = await this.fetchPosts({ since: startDate, limit: 100 });
    
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
      platform: 'twitter',
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

  private buildSearchQuery(options?: FetchOptions): string {
    let query = '';
    
    if (options?.hashtags && options.hashtags.length > 0) {
      query += options.hashtags.map(tag => `#${tag.replace('#', '')}`).join(' OR ');
    }
    
    if (options?.mentions && options.mentions.length > 0) {
      if (query) query += ' OR ';
      query += options.mentions.map(mention => `@${mention.replace('@', '')}`).join(' OR ');
    }
    
    if (!query) {
      query = 'from:me'; // Par défaut, récupérer nos propres tweets
    }
    
    // Exclure les réponses si demandé
    if (!options?.includeReplies) {
      query += ' -is:reply';
    }
    
    // Exclure les retweets si demandé
    if (!options?.includeRetweets) {
      query += ' -is:retweet';
    }
    
    return query;
  }

  private async fetchTweetById(tweetId: string): Promise<SocialPost> {
    const response = await fetch(`${this.baseUrl}/tweets/${tweetId}?tweet.fields=id,text,author_id,created_at,public_metrics,entities,attachments&user.fields=id,username,name,profile_image_url,verified&media.fields=media_key,type,url,preview_image_url,width,height,duration_ms,alt_text&expansions=author_id,attachments.media_keys`, {
      headers: {
        'Authorization': `Bearer ${this.twitterConfig.bearerToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch tweet details');
    }

    const data: TwitterResponse<TwitterTweet> = await response.json();
    const posts = this.convertTweetsToSocialPosts(data);
    
    if (posts.length === 0) {
      throw new Error('Tweet not found');
    }
    
    return posts[0];
  }

  private convertTweetsToSocialPosts(data: TwitterResponse<TwitterTweet[] | TwitterTweet>): SocialPost[] {
    const tweets = Array.isArray(data.data) ? data.data : [data.data];
    const users = data.includes?.users || [];
    const media = data.includes?.media || [];

    if (!tweets || tweets.length === 0) {
      return [];
    }

    return tweets.map(tweet => {
      const author = users.find(user => user.id === tweet.author_id);
      const tweetMedia = tweet.attachments?.media_keys?.map(key => 
        media.find(m => m.media_key === key)
      ).filter(Boolean) || [];

      return {
        id: tweet.id,
        platform: 'twitter' as const,
        content: tweet.text,
        author: {
          id: tweet.author_id,
          name: author?.name || 'Unknown',
          username: author?.username || 'unknown',
          avatar: author?.profile_image_url,
          verified: author?.verified || false
        },
        createdAt: new Date(tweet.created_at),
        metrics: {
          likes: tweet.public_metrics.like_count,
          shares: tweet.public_metrics.retweet_count + tweet.public_metrics.quote_count,
          comments: tweet.public_metrics.reply_count,
          views: tweet.public_metrics.impression_count
        },
        media: this.convertTwitterMediaToSocialMedia(tweetMedia as TwitterMedia[]),
        url: `https://twitter.com/${author?.username}/status/${tweet.id}`,
        hashtags: tweet.entities?.hashtags?.map(h => h.tag) || [],
        mentions: tweet.entities?.mentions?.map(m => m.username) || [],
        isRepost: tweet.referenced_tweets?.some(ref => ref.type === 'retweeted') || false,
        type: this.determineTweetType(tweet, tweetMedia as TwitterMedia[])
      };
    });
  }

  private convertTwitterMediaToSocialMedia(twitterMedia: TwitterMedia[]): SocialMedia[] {
    return twitterMedia.map(media => ({
      id: media.media_key,
      type: media.type === 'photo' ? 'image' : media.type === 'animated_gif' ? 'gif' : 'video',
      url: media.url || media.preview_image_url || '',
      thumbnailUrl: media.preview_image_url,
      alt: media.alt_text,
      width: media.width,
      height: media.height,
      duration: media.duration_ms ? media.duration_ms / 1000 : undefined
    }));
  }

  private convertTwitterUserToSocialProfile(user: TwitterUser): SocialProfile {
    return {
      id: user.id,
      platform: 'twitter',
      name: user.name,
      username: user.username,
      bio: user.description,
      avatar: user.profile_image_url,
      verified: user.verified || false,
      followers: user.public_metrics.followers_count,
      following: user.public_metrics.following_count,
      postsCount: user.public_metrics.tweet_count,
      url: `https://twitter.com/${user.username}`,
      location: user.location,
      website: user.url,
      joinedAt: new Date(user.created_at)
    };
  }

  private determineTweetType(tweet: TwitterTweet, media: TwitterMedia[]): 'text' | 'image' | 'video' | 'link' | 'poll' {
    if (tweet.attachments?.poll_ids && tweet.attachments.poll_ids.length > 0) {
      return 'poll';
    }
    
    if (media.length > 0) {
      return media.some(m => m.type === 'video') ? 'video' : 'image';
    }
    
    if (tweet.entities?.urls && tweet.entities.urls.length > 0) {
      return 'link';
    }
    
    return 'text';
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
}