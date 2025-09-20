// Gestionnaire principal pour l'intégration multi-réseaux sociaux

import { SocialService } from './base/SocialService';
import { TwitterService } from './twitter/TwitterService';
import { YouTubeService } from './youtube/YouTubeService';
import { FacebookService } from './facebook/FacebookService';
import { 
  SocialPost, 
  SocialProfile, 
  FetchOptions, 
  PostContent, 
  SocialConfig, 
  SocialAnalytics,
  SocialPlatform,
  SocialSyncStatus,
  SocialError
} from './base/types';

export interface SocialManagerConfig {
  twitter?: SocialConfig & { twitter: any };
  youtube?: SocialConfig & { youtube: any };
  facebook?: SocialConfig & { facebook: any };
}

export class SocialManager {
  private services: Map<SocialPlatform, SocialService> = new Map();
  private syncStatuses: Map<SocialPlatform, SocialSyncStatus> = new Map();
  private lastSync: Date | null = null;

  constructor(config: SocialManagerConfig) {
    this.initializeServices(config);
  }

  // Initialisation des services
  private initializeServices(config: SocialManagerConfig): void {
    if (config.twitter && config.twitter.enabled) {
      this.services.set('twitter', new TwitterService(config.twitter));
      this.syncStatuses.set('twitter', {
        platform: 'twitter',
        lastSync: new Date(0),
        status: 'pending',
        nextSync: new Date(),
        postsCount: 0
      });
    }

    if (config.youtube && config.youtube.enabled) {
      this.services.set('youtube', new YouTubeService(config.youtube));
      this.syncStatuses.set('youtube', {
        platform: 'youtube',
        lastSync: new Date(0),
        status: 'pending',
        nextSync: new Date(),
        postsCount: 0
      });
    }

    if (config.facebook && config.facebook.enabled) {
      this.services.set('facebook', new FacebookService(config.facebook));
      this.syncStatuses.set('facebook', {
        platform: 'facebook',
        lastSync: new Date(0),
        status: 'pending',
        nextSync: new Date(),
        postsCount: 0
      });
    }
  }

  // Méthodes publiques

  public getEnabledPlatforms(): SocialPlatform[] {
    return Array.from(this.services.keys());
  }

  public isEnabled(platform: SocialPlatform): boolean {
    return this.services.has(platform);
  }

  public getService(platform: SocialPlatform): SocialService | undefined {
    return this.services.get(platform);
  }

  // Authentification de tous les services
  public async authenticateAll(): Promise<Map<SocialPlatform, boolean>> {
    const results = new Map<SocialPlatform, boolean>();
    
    for (const [platform, service] of this.services) {
      try {
        const success = await service.authenticate();
        results.set(platform, success);
        
        if (success) {
          this.updateSyncStatus(platform, { status: 'success' });
        } else {
          this.updateSyncStatus(platform, { 
            status: 'error',
            error: {
              code: 'AUTH_FAILED',
              message: 'Authentication failed',
              platform,
              timestamp: new Date()
            }
          });
        }
      } catch (error) {
        results.set(platform, false);
        this.updateSyncStatus(platform, { 
          status: 'error',
          error: {
            code: 'AUTH_ERROR',
            message: error instanceof Error ? error.message : 'Unknown error',
            platform,
            timestamp: new Date()
          }
        });
      }
    }
    
    return results;
  }

  // Récupération des posts de toutes les plateformes
  public async fetchAllPosts(options?: FetchOptions): Promise<Map<SocialPlatform, SocialPost[]>> {
    const results = new Map<SocialPlatform, SocialPost[]>();
    
    for (const [platform, service] of this.services) {
      try {
        const posts = await service.fetchPosts(options);
        results.set(platform, posts);
        
        this.updateSyncStatus(platform, { 
          status: 'success',
          lastSync: new Date(),
          postsCount: posts.length
        });
      } catch (error) {
        results.set(platform, []);
        this.updateSyncStatus(platform, { 
          status: 'error',
          error: {
            code: 'FETCH_ERROR',
            message: error instanceof Error ? error.message : 'Unknown error',
            platform,
            timestamp: new Date()
          }
        });
      }
    }
    
    this.lastSync = new Date();
    return results;
  }

  // Récupération des posts agrégés et triés
  public async fetchAggregatedPosts(options?: FetchOptions): Promise<SocialPost[]> {
    const allPostsMap = await this.fetchAllPosts(options);
    const allPosts: SocialPost[] = [];
    
    // Agréger tous les posts
    for (const posts of allPostsMap.values()) {
      allPosts.push(...posts);
    }
    
    // Trier par date (plus récent en premier)
    allPosts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    // Limiter le nombre de résultats si spécifié
    if (options?.limit) {
      return allPosts.slice(0, options.limit);
    }
    
    return allPosts;
  }

  // Récupération des profils de toutes les plateformes
  public async fetchAllProfiles(): Promise<Map<SocialPlatform, SocialProfile>> {
    const results = new Map<SocialPlatform, SocialProfile>();
    
    for (const [platform, service] of this.services) {
      try {
        const profile = await service.fetchProfile();
        results.set(platform, profile);
      } catch (error) {
        console.error(`Failed to fetch ${platform} profile:`, error);
      }
    }
    
    return results;
  }

  // Publication sur une plateforme spécifique
  public async publishToplatform(platform: SocialPlatform, content: PostContent): Promise<SocialPost> {
    const service = this.services.get(platform);
    if (!service) {
      throw new Error(`Platform ${platform} is not enabled`);
    }
    
    return await service.publishPost(content);
  }

  // Publication sur plusieurs plateformes
  public async publishToMultiplePlatforms(
    platforms: SocialPlatform[], 
    content: PostContent
  ): Promise<Map<SocialPlatform, SocialPost | Error>> {
    const results = new Map<SocialPlatform, SocialPost | Error>();
    
    for (const platform of platforms) {
      try {
        const post = await this.publishToplatform(platform, content);
        results.set(platform, post);
      } catch (error) {
        results.set(platform, error instanceof Error ? error : new Error('Unknown error'));
      }
    }
    
    return results;
  }

  // Publication sur toutes les plateformes activées
  public async publishToAll(content: PostContent): Promise<Map<SocialPlatform, SocialPost | Error>> {
    const platforms = this.getEnabledPlatforms();
    return await this.publishToMultiplePlatforms(platforms, content);
  }

  // Suppression d'un post sur une plateforme
  public async deletePost(platform: SocialPlatform, postId: string): Promise<boolean> {
    const service = this.services.get(platform);
    if (!service) {
      throw new Error(`Platform ${platform} is not enabled`);
    }
    
    return await service.deletePost(postId);
  }

  // Récupération des analytics de toutes les plateformes
  public async getAllAnalytics(period: 'day' | 'week' | 'month' | 'year'): Promise<Map<SocialPlatform, SocialAnalytics>> {
    const results = new Map<SocialPlatform, SocialAnalytics>();
    
    for (const [platform, service] of this.services) {
      try {
        const analytics = await service.getAnalytics(period);
        results.set(platform, analytics);
      } catch (error) {
        console.error(`Failed to fetch ${platform} analytics:`, error);
      }
    }
    
    return results;
  }

  // Analytics agrégées
  public async getAggregatedAnalytics(period: 'day' | 'week' | 'month' | 'year'): Promise<SocialAnalytics> {
    const allAnalytics = await this.getAllAnalytics(period);
    
    const aggregated: SocialAnalytics = {
      platform: 'twitter', // Plateforme par défaut pour l'agrégation
      period,
      metrics: {
        totalPosts: 0,
        totalLikes: 0,
        totalShares: 0,
        totalComments: 0,
        totalViews: 0,
        engagement: 0,
        reach: 0,
        impressions: 0
      },
      topPosts: [],
      topHashtags: []
    };
    
    const allPosts: SocialPost[] = [];
    const hashtagCounts = new Map<string, number>();
    
    for (const analytics of allAnalytics.values()) {
      aggregated.metrics.totalPosts += analytics.metrics.totalPosts;
      aggregated.metrics.totalLikes += analytics.metrics.totalLikes;
      aggregated.metrics.totalShares += analytics.metrics.totalShares;
      aggregated.metrics.totalComments += analytics.metrics.totalComments;
      aggregated.metrics.totalViews += analytics.metrics.totalViews;
      aggregated.metrics.reach += analytics.metrics.reach;
      aggregated.metrics.impressions += analytics.metrics.impressions;
      
      allPosts.push(...analytics.topPosts);
      
      analytics.topHashtags.forEach(({ tag, count }) => {
        hashtagCounts.set(tag, (hashtagCounts.get(tag) || 0) + count);
      });
    }
    
    // Calculer l'engagement moyen
    if (aggregated.metrics.reach > 0) {
      aggregated.metrics.engagement = (
        (aggregated.metrics.totalLikes + aggregated.metrics.totalShares + aggregated.metrics.totalComments) / 
        aggregated.metrics.reach
      ) * 100;
    }
    
    // Top posts triés par engagement
    aggregated.topPosts = allPosts
      .sort((a, b) => {
        const engagementA = a.metrics.likes + a.metrics.shares + a.metrics.comments;
        const engagementB = b.metrics.likes + b.metrics.shares + b.metrics.comments;
        return engagementB - engagementA;
      })
      .slice(0, 10);
    
    // Top hashtags agrégés
    aggregated.topHashtags = Array.from(hashtagCounts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    return aggregated;
  }

  // Statut de synchronisation
  public getSyncStatus(platform?: SocialPlatform): SocialSyncStatus | Map<SocialPlatform, SocialSyncStatus> {
    if (platform) {
      return this.syncStatuses.get(platform) || {
        platform,
        lastSync: new Date(0),
        status: 'disabled',
        postsCount: 0
      };
    }
    
    return new Map(this.syncStatuses);
  }

  // Test de connexion pour toutes les plateformes
  public async testAllConnections(): Promise<Map<SocialPlatform, boolean>> {
    const results = new Map<SocialPlatform, boolean>();
    
    for (const [platform, service] of this.services) {
      try {
        const success = await service.testConnection();
        results.set(platform, success);
      } catch (error) {
        results.set(platform, false);
      }
    }
    
    return results;
  }

  // Synchronisation automatique
  public async syncAll(options?: FetchOptions): Promise<void> {
    console.log('Starting social media sync...');
    
    for (const [platform, service] of this.services) {
      try {
        console.log(`Syncing ${platform}...`);
        
        const posts = await service.fetchPosts(options);
        
        this.updateSyncStatus(platform, {
          status: 'success',
          lastSync: new Date(),
          postsCount: posts.length
        });
        
        console.log(`✅ ${platform}: ${posts.length} posts synced`);
      } catch (error) {
        console.error(`❌ ${platform} sync failed:`, error);
        
        this.updateSyncStatus(platform, {
          status: 'error',
          error: {
            code: 'SYNC_ERROR',
            message: error instanceof Error ? error.message : 'Unknown error',
            platform,
            timestamp: new Date()
          }
        });
      }
    }
    
    this.lastSync = new Date();
    console.log('Social media sync completed');
  }

  // Méthodes utilitaires

  private updateSyncStatus(platform: SocialPlatform, updates: Partial<SocialSyncStatus>): void {
    const current = this.syncStatuses.get(platform);
    if (current) {
      this.syncStatuses.set(platform, { ...current, ...updates });
    }
  }

  public getLastSyncTime(): Date | null {
    return this.lastSync;
  }

  public getServiceStatus(platform: SocialPlatform): any {
    const service = this.services.get(platform);
    return service ? service.getStatus() : null;
  }

  public getAllServiceStatuses(): Map<SocialPlatform, any> {
    const statuses = new Map();
    
    for (const [platform, service] of this.services) {
      statuses.set(platform, service.getStatus());
    }
    
    return statuses;
  }

  // Configuration dynamique
  public updateServiceConfig(platform: SocialPlatform, config: Partial<SocialConfig>): void {
    const service = this.services.get(platform);
    if (service) {
      service.updateConfig(config);
    }
  }

  public enablePlatform(platform: SocialPlatform): void {
    this.updateServiceConfig(platform, { enabled: true });
  }

  public disablePlatform(platform: SocialPlatform): void {
    this.updateServiceConfig(platform, { enabled: false });
    this.updateSyncStatus(platform, { status: 'disabled' });
  }
}