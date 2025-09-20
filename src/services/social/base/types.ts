// Types de base pour l'intégration multi-réseaux sociaux

export type SocialPlatform = 'twitter' | 'youtube' | 'facebook';

export interface SocialPost {
  id: string;
  platform: SocialPlatform;
  content: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatar?: string;
    verified?: boolean;
  };
  createdAt: Date;
  updatedAt?: Date;
  metrics: {
    likes: number;
    shares: number;
    comments: number;
    views?: number;
  };
  media?: SocialMedia[];
  url: string;
  hashtags: string[];
  mentions: string[];
  isRepost?: boolean;
  originalPost?: SocialPost;
  type: 'text' | 'image' | 'video' | 'link' | 'poll';
}

export interface SocialMedia {
  id: string;
  type: 'image' | 'video' | 'gif';
  url: string;
  thumbnailUrl?: string;
  alt?: string;
  width?: number;
  height?: number;
  duration?: number; // pour les vidéos en secondes
}

export interface SocialProfile {
  id: string;
  platform: SocialPlatform;
  name: string;
  username: string;
  bio?: string;
  avatar?: string;
  banner?: string;
  verified: boolean;
  followers: number;
  following: number;
  postsCount: number;
  url: string;
  location?: string;
  website?: string;
  joinedAt: Date;
}

export interface FetchOptions {
  limit?: number;
  since?: Date;
  until?: Date;
  hashtags?: string[];
  mentions?: string[];
  includeReplies?: boolean;
  includeRetweets?: boolean;
  sortBy?: 'date' | 'popularity';
  cursor?: string; // pour la pagination
}

export interface PostContent {
  text: string;
  media?: File[];
  hashtags?: string[];
  mentions?: string[];
  scheduledAt?: Date;
  replyTo?: string;
}

export interface SocialConfig {
  platform: SocialPlatform;
  apiKey?: string;
  apiSecret?: string;
  accessToken?: string;
  refreshToken?: string;
  clientId?: string;
  clientSecret?: string;
  enabled: boolean;
  rateLimits: {
    requestsPerHour: number;
    requestsPerDay: number;
  };
  webhookUrl?: string;
}

export interface SocialError {
  code: string;
  message: string;
  platform: SocialPlatform;
  timestamp: Date;
  details?: any;
}

export interface SocialAnalytics {
  platform: SocialPlatform;
  period: 'day' | 'week' | 'month' | 'year';
  metrics: {
    totalPosts: number;
    totalLikes: number;
    totalShares: number;
    totalComments: number;
    totalViews: number;
    engagement: number; // taux d'engagement en %
    reach: number;
    impressions: number;
  };
  topPosts: SocialPost[];
  topHashtags: Array<{ tag: string; count: number }>;
}

export interface SocialSyncStatus {
  platform: SocialPlatform;
  lastSync: Date;
  status: 'success' | 'error' | 'pending' | 'disabled';
  error?: SocialError;
  nextSync?: Date;
  postsCount: number;
}