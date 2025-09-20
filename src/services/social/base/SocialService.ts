// Interface de base pour tous les services de réseaux sociaux

import { 
  SocialPost, 
  SocialProfile, 
  FetchOptions, 
  PostContent, 
  SocialConfig, 
  SocialAnalytics,
  SocialPlatform,
  SocialError
} from './types';

export abstract class SocialService {
  protected config: SocialConfig;
  protected isAuthenticated: boolean = false;
  protected lastRequest: Date | null = null;
  protected requestCount: number = 0;

  constructor(config: SocialConfig) {
    this.config = config;
  }

  // Méthodes abstraites à implémenter par chaque service
  abstract authenticate(): Promise<boolean>;
  abstract fetchPosts(options?: FetchOptions): Promise<SocialPost[]>;
  abstract fetchProfile(userId?: string): Promise<SocialProfile>;
  abstract publishPost(content: PostContent): Promise<SocialPost>;
  abstract deletePost(postId: string): Promise<boolean>;
  abstract getAnalytics(period: 'day' | 'week' | 'month' | 'year'): Promise<SocialAnalytics>;

  // Méthodes communes
  public getPlatform(): SocialPlatform {
    return this.config.platform;
  }

  public isEnabled(): boolean {
    return this.config.enabled;
  }

  public getConfig(): SocialConfig {
    return { ...this.config };
  }

  public updateConfig(newConfig: Partial<SocialConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  // Gestion du rate limiting
  protected async checkRateLimit(): Promise<void> {
    const now = new Date();
    const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    
    // Réinitialiser le compteur si plus d'une heure s'est écoulée
    if (!this.lastRequest || this.lastRequest < hourAgo) {
      this.requestCount = 0;
    }

    if (this.requestCount >= this.config.rateLimits.requestsPerHour) {
      throw new Error(`Rate limit exceeded for ${this.config.platform}. Max ${this.config.rateLimits.requestsPerHour} requests per hour.`);
    }

    this.requestCount++;
    this.lastRequest = now;
  }

  // Gestion des erreurs
  protected handleError(error: any, context: string): SocialError {
    const socialError: SocialError = {
      code: error.code || 'UNKNOWN_ERROR',
      message: error.message || 'An unknown error occurred',
      platform: this.config.platform,
      timestamp: new Date(),
      details: {
        context,
        originalError: error
      }
    };

    console.error(`[${this.config.platform.toUpperCase()}] Error in ${context}:`, socialError);
    return socialError;
  }

  // Validation des données
  protected validatePostContent(content: PostContent): boolean {
    if (!content.text || content.text.trim().length === 0) {
      throw new Error('Post content cannot be empty');
    }
    return true;
  }

  // Formatage des hashtags
  protected formatHashtags(hashtags: string[]): string[] {
    return hashtags.map(tag => tag.startsWith('#') ? tag : `#${tag}`);
  }

  // Formatage des mentions
  protected formatMentions(mentions: string[]): string[] {
    return mentions.map(mention => mention.startsWith('@') ? mention : `@${mention}`);
  }

  // Méthode utilitaire pour la pagination
  protected buildPaginationParams(options?: FetchOptions): Record<string, any> {
    const params: Record<string, any> = {};
    
    if (options?.limit) {
      params.limit = Math.min(options.limit, 100); // Limite max de 100
    }
    
    if (options?.cursor) {
      params.cursor = options.cursor;
    }
    
    if (options?.since) {
      params.since = options.since.toISOString();
    }
    
    if (options?.until) {
      params.until = options.until.toISOString();
    }
    
    return params;
  }

  // Méthode pour tester la connexion
  public async testConnection(): Promise<boolean> {
    try {
      await this.checkRateLimit();
      return await this.authenticate();
    } catch (error) {
      console.error(`Connection test failed for ${this.config.platform}:`, error);
      return false;
    }
  }

  // Méthode pour obtenir le statut du service
  public getStatus(): { 
    platform: SocialPlatform; 
    authenticated: boolean; 
    enabled: boolean; 
    lastRequest: Date | null;
    requestCount: number;
  } {
    return {
      platform: this.config.platform,
      authenticated: this.isAuthenticated,
      enabled: this.config.enabled,
      lastRequest: this.lastRequest,
      requestCount: this.requestCount
    };
  }
}