export interface Category {
  id: string
  name: string
  slug: string
  color: string
  description?: string
  icon?: string
  is_active: boolean
  display_order: number
  created_by?: string
  created_at: string
  updated_at: string
}

export interface ContentStatus {
  id: string
  name: string
  slug: string
  color: string
  description?: string
  created_at: string
}

export interface AdminUser {
  id: string
  user_id: string
  email: string
  full_name?: string
  role: 'editor' | 'admin' | 'super_admin'
  permissions: string[]
  is_active: boolean
  last_login?: string
  created_at: string
  updated_at: string
}

export interface SiteSetting {
  id: string
  key: string
  value: any
  description?: string
  category: string
  updated_by?: string
  created_at: string
  updated_at: string
}

export interface AdminThread {
  id: string
  thread_id: string
  title: string
  description?: string
  theme?: string
  hashtags: string[]
  total_tweets: number
  complete: boolean
  category_id?: string
  status_id?: string
  published_date?: string
  is_featured: boolean
  view_count: number
  like_count: number
  created_at: string
  updated_at: string
  category?: Category
  status?: ContentStatus
}

export type ThemeMode = 'senegalais' | 'minimaliste'

export interface ThemeConfig {
  mode: ThemeMode
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    surface: string
    text: string
    textSecondary: string
  }
  fonts: {
    sans: string
    serif?: string
  }
}