// Types spécifiques à YouTube

export interface YouTubeConfig {
  apiKey: string;
  clientId?: string;
  clientSecret?: string;
  refreshToken?: string;
  channelId?: string;
}

export interface YouTubeVideo {
  kind: string;
  etag: string;
  id: string | { videoId: string };
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
      default?: YouTubeThumbnail;
      medium?: YouTubeThumbnail;
      high?: YouTubeThumbnail;
      standard?: YouTubeThumbnail;
      maxres?: YouTubeThumbnail;
    };
    channelTitle: string;
    tags?: string[];
    categoryId: string;
    liveBroadcastContent: string;
    defaultLanguage?: string;
    defaultAudioLanguage?: string;
  };
  statistics?: {
    viewCount: string;
    likeCount: string;
    dislikeCount?: string;
    favoriteCount: string;
    commentCount: string;
  };
  contentDetails?: {
    duration: string;
    dimension: string;
    definition: string;
    caption: string;
    licensedContent: boolean;
    regionRestriction?: {
      allowed?: string[];
      blocked?: string[];
    };
  };
  status?: {
    uploadStatus: string;
    privacyStatus: string;
    license: string;
    embeddable: boolean;
    publicStatsViewable: boolean;
  };
}

export interface YouTubeThumbnail {
  url: string;
  width: number;
  height: number;
}

export interface YouTubeChannel {
  kind: string;
  etag: string;
  id: string;
  snippet: {
    title: string;
    description: string;
    customUrl?: string;
    publishedAt: string;
    thumbnails: {
      default?: YouTubeThumbnail;
      medium?: YouTubeThumbnail;
      high?: YouTubeThumbnail;
    };
    defaultLanguage?: string;
    country?: string;
  };
  statistics: {
    viewCount: string;
    subscriberCount: string;
    hiddenSubscriberCount: boolean;
    videoCount: string;
  };
  brandingSettings?: {
    channel: {
      title: string;
      description: string;
      keywords?: string;
      defaultTab?: string;
      trackingAnalyticsAccountId?: string;
      moderateComments?: boolean;
      showRelatedChannels?: boolean;
      showBrowseView?: boolean;
      featuredChannelsTitle?: string;
      featuredChannelsUrls?: string[];
      unsubscribedTrailer?: string;
      profileColor?: string;
    };
    image: {
      bannerExternalUrl?: string;
      bannerMobileImageUrl?: string;
      bannerTabletLowImageUrl?: string;
      bannerTabletImageUrl?: string;
      bannerTabletHdImageUrl?: string;
      bannerTabletExtraHdImageUrl?: string;
      bannerMobileLowImageUrl?: string;
      bannerMobileMediumHdImageUrl?: string;
      bannerMobileHdImageUrl?: string;
      bannerMobileExtraHdImageUrl?: string;
      bannerTvImageUrl?: string;
      bannerTvLowImageUrl?: string;
      bannerTvMediumImageUrl?: string;
      bannerTvHighImageUrl?: string;
    };
  };
}

export interface YouTubePlaylist {
  kind: string;
  etag: string;
  id: string;
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
      default?: YouTubeThumbnail;
      medium?: YouTubeThumbnail;
      high?: YouTubeThumbnail;
      standard?: YouTubeThumbnail;
      maxres?: YouTubeThumbnail;
    };
    channelTitle: string;
    defaultLanguage?: string;
  };
  status: {
    privacyStatus: string;
  };
  contentDetails: {
    itemCount: number;
  };
}

export interface YouTubeComment {
  kind: string;
  etag: string;
  id: string;
  snippet: {
    authorDisplayName: string;
    authorProfileImageUrl: string;
    authorChannelUrl: string;
    authorChannelId: {
      value: string;
    };
    videoId: string;
    textDisplay: string;
    textOriginal: string;
    canRate: boolean;
    totalReplyCount: number;
    likeCount: number;
    moderationStatus?: string;
    publishedAt: string;
    updatedAt: string;
  };
  replies?: {
    comments: YouTubeComment[];
  };
}

export interface YouTubeSearchOptions {
  q?: string;
  channelId?: string;
  channelType?: 'any' | 'show';
  eventType?: 'completed' | 'live' | 'upcoming';
  location?: string;
  locationRadius?: string;
  maxResults?: number;
  order?: 'date' | 'rating' | 'relevance' | 'title' | 'videoCount' | 'viewCount';
  pageToken?: string;
  publishedAfter?: string;
  publishedBefore?: string;
  regionCode?: string;
  relevanceLanguage?: string;
  safeSearch?: 'moderate' | 'none' | 'strict';
  topicId?: string;
  type?: 'channel' | 'playlist' | 'video';
  videoCaption?: 'any' | 'closedCaption' | 'none';
  videoCategoryId?: string;
  videoDefinition?: 'any' | 'high' | 'standard';
  videoDimension?: 'any' | '2d' | '3d';
  videoDuration?: 'any' | 'long' | 'medium' | 'short';
  videoEmbeddable?: 'any' | 'true';
  videoLicense?: 'any' | 'creativeCommon' | 'youtube';
  videoSyndicated?: 'any' | 'true';
  videoType?: 'any' | 'episode' | 'movie';
}

export interface YouTubeResponse<T> {
  kind: string;
  etag: string;
  nextPageToken?: string;
  prevPageToken?: string;
  regionCode?: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: T[];
}

export interface YouTubeAnalytics {
  kind: string;
  columnHeaders: Array<{
    name: string;
    columnType: string;
    dataType: string;
  }>;
  rows: any[][];
}

export interface YouTubeUploadOptions {
  title: string;
  description?: string;
  tags?: string[];
  categoryId?: string;
  privacyStatus?: 'private' | 'public' | 'unlisted';
  publishAt?: string;
  thumbnail?: File;
}

// Utilitaires pour la durée ISO 8601
export interface ParsedDuration {
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
}