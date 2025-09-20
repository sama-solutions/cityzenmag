// Types spécifiques à Facebook

export interface FacebookConfig {
  appId: string;
  appSecret: string;
  accessToken: string;
  pageId?: string;
  version?: string; // Version de l'API (ex: "v18.0")
}

export interface FacebookPost {
  id: string;
  message?: string;
  story?: string;
  created_time: string;
  updated_time?: string;
  from: {
    id: string;
    name: string;
    picture?: {
      data: {
        url: string;
        is_silhouette: boolean;
      };
    };
  };
  attachments?: {
    data: FacebookAttachment[];
  };
  reactions?: {
    data: FacebookReaction[];
    summary: {
      total_count: number;
      can_like: boolean;
      has_liked: boolean;
    };
  };
  comments?: {
    data: FacebookComment[];
    summary: {
      order: string;
      total_count: number;
      can_comment: boolean;
    };
  };
  shares?: {
    count: number;
  };
  insights?: {
    data: FacebookInsight[];
  };
  permalink_url?: string;
  full_picture?: string;
  picture?: string;
  link?: string;
  name?: string;
  caption?: string;
  description?: string;
  type: 'status' | 'photo' | 'video' | 'link' | 'offer' | 'music' | 'note' | 'event';
  status_type?: 'mobile_status_update' | 'created_note' | 'added_photos' | 'added_video' | 'shared_story' | 'created_group' | 'created_event' | 'wall_post' | 'app_created_story' | 'published_story' | 'tagged_in_photo' | 'approved_friend';
  object_id?: string;
  privacy?: {
    value: 'EVERYONE' | 'ALL_FRIENDS' | 'FRIENDS_OF_FRIENDS' | 'SELF' | 'CUSTOM';
    description: string;
    friends?: string;
    networks?: string;
    allow?: string;
    deny?: string;
  };
}

export interface FacebookAttachment {
  type: 'photo' | 'video' | 'album' | 'share' | 'note' | 'music' | 'file';
  media?: {
    image?: {
      height: number;
      src: string;
      width: number;
    };
    source?: string;
  };
  target?: {
    id: string;
    url: string;
  };
  title?: string;
  description?: string;
  url?: string;
  subattachments?: {
    data: FacebookAttachment[];
  };
}

export interface FacebookReaction {
  id: string;
  name: string;
  type: 'LIKE' | 'LOVE' | 'WOW' | 'HAHA' | 'SAD' | 'ANGRY' | 'THANKFUL' | 'PRIDE' | 'CARE';
}

export interface FacebookComment {
  id: string;
  message: string;
  created_time: string;
  from: {
    id: string;
    name: string;
    picture?: {
      data: {
        url: string;
        is_silhouette: boolean;
      };
    };
  };
  like_count: number;
  comment_count: number;
  parent?: {
    id: string;
  };
  attachment?: FacebookAttachment;
  can_comment: boolean;
  can_remove: boolean;
  can_like: boolean;
  can_reply_privately: boolean;
  user_likes: boolean;
}

export interface FacebookPage {
  id: string;
  name: string;
  about?: string;
  category: string;
  category_list: Array<{
    id: string;
    name: string;
  }>;
  cover?: {
    cover_id: string;
    offset_x: number;
    offset_y: number;
    source: string;
    id: string;
  };
  description?: string;
  emails?: string[];
  fan_count: number;
  followers_count: number;
  link: string;
  location?: {
    city: string;
    country: string;
    latitude: number;
    longitude: number;
    state: string;
    street: string;
    zip: string;
  };
  phone?: string;
  picture: {
    data: {
      height: number;
      is_silhouette: boolean;
      url: string;
      width: number;
    };
  };
  username?: string;
  verification_status: string;
  website?: string;
  were_here_count?: number;
  whatsapp_number?: string;
  created_time: string;
}

export interface FacebookUser {
  id: string;
  name: string;
  first_name?: string;
  last_name?: string;
  middle_name?: string;
  email?: string;
  picture?: {
    data: {
      height: number;
      is_silhouette: boolean;
      url: string;
      width: number;
    };
  };
  cover?: {
    cover_id: string;
    offset_x: number;
    offset_y: number;
    source: string;
    id: string;
  };
  age_range?: {
    min: number;
    max?: number;
  };
  birthday?: string;
  gender?: string;
  hometown?: {
    id: string;
    name: string;
  };
  location?: {
    id: string;
    name: string;
  };
  locale?: string;
  timezone?: number;
  verified?: boolean;
  website?: string;
  link: string;
}

export interface FacebookInsight {
  name: string;
  period: 'day' | 'week' | 'days_28' | 'month' | 'lifetime';
  values: Array<{
    value: number | object;
    end_time: string;
  }>;
  title: string;
  description: string;
  id: string;
}

export interface FacebookResponse<T> {
  data: T[];
  paging?: {
    cursors: {
      before: string;
      after: string;
    };
    next?: string;
    previous?: string;
  };
  error?: {
    message: string;
    type: string;
    code: number;
    error_subcode?: number;
    fbtrace_id: string;
  };
}

export interface FacebookSearchOptions {
  q?: string;
  type?: 'post' | 'user' | 'page' | 'event' | 'group' | 'place' | 'placetopic';
  limit?: number;
  offset?: number;
  since?: string;
  until?: string;
  fields?: string[];
}

export interface FacebookPublishOptions {
  message: string;
  link?: string;
  picture?: string;
  name?: string;
  caption?: string;
  description?: string;
  actions?: Array<{
    name: string;
    link: string;
  }>;
  privacy?: {
    value: 'EVERYONE' | 'ALL_FRIENDS' | 'FRIENDS_OF_FRIENDS' | 'SELF' | 'CUSTOM';
  };
  targeting?: {
    countries?: string[];
    regions?: string[];
    cities?: string[];
    age_min?: number;
    age_max?: number;
    genders?: number[];
    interests?: string[];
  };
  feed_targeting?: {
    countries?: string[];
    regions?: string[];
    cities?: string[];
    age_min?: number;
    age_max?: number;
    genders?: number[];
    interests?: string[];
    relationship_statuses?: number[];
    interested_in?: number[];
  };
  published?: boolean;
  scheduled_publish_time?: number;
  backdated_time?: string;
  backdated_time_granularity?: 'year' | 'month' | 'day' | 'hour' | 'min';
  child_attachments?: Array<{
    link?: string;
    picture?: string;
    name?: string;
    description?: string;
  }>;
  multi_share_optimized?: boolean;
  multi_share_end_card?: boolean;
}

export interface FacebookEvent {
  id: string;
  name: string;
  description?: string;
  start_time: string;
  end_time?: string;
  location?: string;
  place?: {
    id: string;
    name: string;
    location: {
      city: string;
      country: string;
      latitude: number;
      longitude: number;
      state: string;
      street: string;
      zip: string;
    };
  };
  privacy: 'OPEN' | 'CLOSED' | 'SECRET';
  attending_count: number;
  declined_count: number;
  maybe_count: number;
  noreply_count: number;
  owner: {
    id: string;
    name: string;
  };
  parent_group?: {
    id: string;
    name: string;
  };
  cover?: {
    cover_id: string;
    offset_x: number;
    offset_y: number;
    source: string;
    id: string;
  };
  picture: {
    data: {
      height: number;
      is_silhouette: boolean;
      url: string;
      width: number;
    };
  };
  ticket_uri?: string;
  timezone: string;
  type: 'private' | 'public' | 'group' | 'community';
  updated_time: string;
  is_canceled?: boolean;
  is_draft?: boolean;
  is_online?: boolean;
  is_page_owned: boolean;
  can_guests_invite: boolean;
  guest_list_enabled: boolean;
  created_time: string;
}