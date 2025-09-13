import type { Tweet, MediaFile } from '../types/database'

// Données de test pour l'agrandissement des photos
export const mockTweets: Tweet[] = [
  {
    id: 'test-tweet-1',
    tweet_id: 'test-tweet-1',
    thread_id: 'test-thread-1',
    content: 'Voici un tweet de test avec une image pour tester l\'agrandissement des photos dans CityzenMag. Cette fonctionnalité permet aux présentateurs d\'agrandir facilement les images.',
    date_posted: '2024-01-15T10:00:00Z',
    position: '1/2',
    media_urls: ['https://picsum.photos/800/600?random=1', 'https://picsum.photos/800/600?random=3'],
    engagement: {
      likes: 25,
      retweets: 8,
      replies: 3,
      quotes: 2
    },
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 'test-tweet-2',
    tweet_id: 'test-tweet-2', 
    thread_id: 'test-thread-1',
    content: 'Deuxième tweet avec une autre image pour tester la navigation entre plusieurs images dans le modal d\'agrandissement.',
    date_posted: '2024-01-15T10:05:00Z',
    position: '2/2',
    media_urls: ['https://picsum.photos/800/600?random=2'],
    engagement: {
      likes: 18,
      retweets: 5,
      replies: 1,
      quotes: 0
    },
    created_at: '2024-01-15T10:05:00Z',
    updated_at: '2024-01-15T10:05:00Z'
  }
]

export const mockMediaFiles: MediaFile[] = [
  {
    id: 'media-1',
    tweet_id: 'test-tweet-1',
    original_url: 'https://picsum.photos/800/600?random=1',
    local_path: 'test/image1.jpg',
    filename: 'image1.jpg',
    file_type: 'image/jpeg',
    file_size: 245760,
    created_at: '2024-01-15T10:00:00Z',
    downloaded_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 'media-2',
    tweet_id: 'test-tweet-2', 
    original_url: 'https://picsum.photos/800/600?random=2',
    local_path: 'test/image2.jpg',
    filename: 'image2.jpg',
    file_type: 'image/jpeg',
    file_size: 198432,
    created_at: '2024-01-15T10:05:00Z',
    downloaded_at: '2024-01-15T10:05:00Z'
  },
  {
    id: 'media-3',
    tweet_id: 'test-tweet-1',
    original_url: 'https://picsum.photos/800/600?random=3', 
    local_path: 'test/image3.jpg',
    filename: 'image3.jpg',
    file_type: 'image/jpeg',
    file_size: 312456,
    created_at: '2024-01-15T10:00:00Z',
    downloaded_at: '2024-01-15T10:00:00Z'
  }
]