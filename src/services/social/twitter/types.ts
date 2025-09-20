// Types spécifiques à Twitter/X

export interface TwitterConfig {
  apiKey: string;
  apiSecret: string;
  accessToken: string;
  accessTokenSecret: string;
  bearerToken: string;
}

export interface TwitterUser {
  id: string;
  username: string;
  name: string;
  profile_image_url?: string;
  verified?: boolean;
  description?: string;
  location?: string;
  url?: string;
  created_at: string;
  public_metrics: {
    followers_count: number;
    following_count: number;
    tweet_count: number;
    listed_count: number;
  };
}

export interface TwitterTweet {
  id: string;
  text: string;
  author_id: string;
  created_at: string;
  conversation_id?: string;
  in_reply_to_user_id?: string;
  referenced_tweets?: Array<{
    type: 'retweeted' | 'quoted' | 'replied_to';
    id: string;
  }>;
  attachments?: {
    media_keys?: string[];
    poll_ids?: string[];
  };
  entities?: {
    hashtags?: Array<{ start: number; end: number; tag: string }>;
    mentions?: Array<{ start: number; end: number; username: string; id: string }>;
    urls?: Array<{ start: number; end: number; url: string; expanded_url: string; display_url: string }>;
  };
  public_metrics: {
    retweet_count: number;
    like_count: number;
    reply_count: number;
    quote_count: number;
    bookmark_count?: number;
    impression_count?: number;
  };
  context_annotations?: Array<{
    domain: { id: string; name: string; description: string };
    entity: { id: string; name: string; description?: string };
  }>;
}

export interface TwitterMedia {
  media_key: string;
  type: 'photo' | 'video' | 'animated_gif';
  url?: string;
  preview_image_url?: string;
  width?: number;
  height?: number;
  duration_ms?: number;
  alt_text?: string;
}

export interface TwitterResponse<T> {
  data?: T;
  includes?: {
    users?: TwitterUser[];
    tweets?: TwitterTweet[];
    media?: TwitterMedia[];
  };
  meta?: {
    result_count: number;
    next_token?: string;
    previous_token?: string;
    newest_id?: string;
    oldest_id?: string;
  };
  errors?: Array<{
    title: string;
    detail: string;
    type: string;
    value?: string;
  }>;
}

export interface TwitterSearchOptions {
  query: string;
  max_results?: number;
  next_token?: string;
  since_id?: string;
  until_id?: string;
  start_time?: string;
  end_time?: string;
  sort_order?: 'recency' | 'relevancy';
  tweet_fields?: string[];
  user_fields?: string[];
  media_fields?: string[];
  expansions?: string[];
}

export interface TwitterStreamRule {
  id?: string;
  value: string;
  tag?: string;
}

export interface TwitterWebhookEvent {
  for_user_id: string;
  tweet_create_events?: TwitterTweet[];
  tweet_delete_events?: Array<{ status: { id: string; user_id: string } }>;
  favorite_events?: Array<{ id: string; created_at: string; user: TwitterUser; favorited_status: TwitterTweet }>;
  follow_events?: Array<{ type: string; created_at: string; target: TwitterUser; source: TwitterUser }>;
}