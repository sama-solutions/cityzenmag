export interface Thread {
  id: string
  thread_id: string
  title: string
  theme?: string
  description?: string
  date_created: string
  hashtags: string[]
  total_tweets: number
  complete: boolean
  view_count?: number
  like_count?: number
  created_at: string
  updated_at: string
}

export interface Tweet {
  id: string
  tweet_id: string
  thread_id: string
  position: string
  content: string
  date_posted: string
  engagement: {
    likes: number
    retweets: number
    replies: number
    quotes: number
  }
  media_urls: string[]
  created_at: string
  updated_at: string
}

export interface MediaFile {
  id: string
  original_url: string
  local_path: string
  filename: string
  file_type: string
  file_size: number
  tweet_id: string
  downloaded_at: string
  created_at: string
}

export interface ThreadWithTweets extends Thread {
  tweets: Tweet[]
  media_files: MediaFile[]
}