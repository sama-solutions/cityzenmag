// Service pour les fonctionnalités sociales
export interface SocialInteraction {
  id: string
  userId: string
  contentId: string
  contentType: 'thread' | 'interview' | 'reportage' | 'video' | 'testimonial'
  type: 'like' | 'bookmark' | 'share' | 'view'
  timestamp: string
  metadata?: {
    platform?: 'twitter' | 'facebook' | 'whatsapp' | 'linkedin' | 'email'
    shareUrl?: string
    shareText?: string
  }
}

export interface SocialStats {
  likes: number
  bookmarks: number
  shares: number
  views: number
  engagement: number // Calculé : (likes + bookmarks + shares) / views * 100
}

export interface UserSocialData {
  userId: string
  likes: string[] // IDs des contenus likés
  bookmarks: string[] // IDs des contenus sauvegardés
  shares: string[] // IDs des contenus partagés
  views: string[] // IDs des contenus vus
  preferences: {
    autoShare: boolean
    notifications: boolean
    publicProfile: boolean
  }
}

class SocialService {
  private interactions: Map<string, SocialInteraction> = new Map()
  private userSocialData: Map<string, UserSocialData> = new Map()
  private contentStats: Map<string, SocialStats> = new Map()

  constructor() {
    this.loadFromStorage()
  }

  // Générer un ID utilisateur unique (simulation)
  private getUserId(): string {
    let userId = localStorage.getItem('cityzenmag-user-id')
    if (!userId) {
      userId = 'user-' + Math.random().toString(36).substr(2, 9)
      localStorage.setItem('cityzenmag-user-id', userId)
    }
    return userId
  }

  // Obtenir les données sociales d'un utilisateur
  getUserSocialData(userId?: string): UserSocialData {
    const id = userId || this.getUserId()
    
    if (!this.userSocialData.has(id)) {
      const defaultData: UserSocialData = {
        userId: id,
        likes: [],
        bookmarks: [],
        shares: [],
        views: [],
        preferences: {
          autoShare: false,
          notifications: true,
          publicProfile: false
        }
      }
      this.userSocialData.set(id, defaultData)
    }

    return this.userSocialData.get(id)!
  }

  // Liker un contenu
  async likeContent(contentId: string, contentType: SocialInteraction['contentType']): Promise<boolean> {
    const userId = this.getUserId()
    const userData = this.getUserSocialData(userId)

    const isLiked = userData.likes.includes(contentId)
    
    if (isLiked) {
      // Retirer le like
      userData.likes = userData.likes.filter(id => id !== contentId)
      this.removeInteraction(userId, contentId, 'like')
    } else {
      // Ajouter le like
      userData.likes.push(contentId)
      await this.recordInteraction({
        id: `${userId}-${contentId}-like-${Date.now()}`,
        userId,
        contentId,
        contentType,
        type: 'like',
        timestamp: new Date().toISOString()
      })
    }

    this.userSocialData.set(userId, userData)
    this.updateContentStats(contentId)
    this.saveToStorage()

    return !isLiked // Retourne le nouvel état
  }

  // Sauvegarder un contenu (bookmark)
  async bookmarkContent(contentId: string, contentType: SocialInteraction['contentType']): Promise<boolean> {
    const userId = this.getUserId()
    const userData = this.getUserSocialData(userId)

    const isBookmarked = userData.bookmarks.includes(contentId)
    
    if (isBookmarked) {
      // Retirer le bookmark
      userData.bookmarks = userData.bookmarks.filter(id => id !== contentId)
      this.removeInteraction(userId, contentId, 'bookmark')
    } else {
      // Ajouter le bookmark
      userData.bookmarks.push(contentId)
      await this.recordInteraction({
        id: `${userId}-${contentId}-bookmark-${Date.now()}`,
        userId,
        contentId,
        contentType,
        type: 'bookmark',
        timestamp: new Date().toISOString()
      })
    }

    this.userSocialData.set(userId, userData)
    this.updateContentStats(contentId)
    this.saveToStorage()

    return !isBookmarked
  }

  // Partager un contenu
  async shareContent(
    contentId: string, 
    contentType: SocialInteraction['contentType'],
    platform: string,
    shareUrl: string,
    shareText: string
  ): Promise<void> {
    const userId = this.getUserId()
    const userData = this.getUserSocialData(userId)

    // Ajouter à la liste des partages si pas déjà présent
    if (!userData.shares.includes(contentId)) {
      userData.shares.push(contentId)
    }

    await this.recordInteraction({
      id: `${userId}-${contentId}-share-${Date.now()}`,
      userId,
      contentId,
      contentType,
      type: 'share',
      timestamp: new Date().toISOString(),
      metadata: {
        platform: platform as any,
        shareUrl,
        shareText
      }
    })

    this.userSocialData.set(userId, userData)
    this.updateContentStats(contentId)
    this.saveToStorage()

    // Ouvrir la fenêtre de partage selon la plateforme
    this.openShareWindow(platform, shareUrl, shareText)
  }

  // Enregistrer une vue
  async viewContent(contentId: string, contentType: SocialInteraction['contentType']): Promise<void> {
    const userId = this.getUserId()
    const userData = this.getUserSocialData(userId)

    // Éviter les vues multiples du même contenu par le même utilisateur
    if (userData.views.includes(contentId)) {
      return
    }

    userData.views.push(contentId)

    await this.recordInteraction({
      id: `${userId}-${contentId}-view-${Date.now()}`,
      userId,
      contentId,
      contentType,
      type: 'view',
      timestamp: new Date().toISOString()
    })

    this.userSocialData.set(userId, userData)
    this.updateContentStats(contentId)
    this.saveToStorage()
  }

  // Obtenir les statistiques d'un contenu
  getContentStats(contentId: string): SocialStats {
    if (!this.contentStats.has(contentId)) {
      this.updateContentStats(contentId)
    }
    return this.contentStats.get(contentId)!
  }

  // Vérifier si un contenu est liké par l'utilisateur
  isLiked(contentId: string): boolean {
    const userData = this.getUserSocialData()
    return userData.likes.includes(contentId)
  }

  // Vérifier si un contenu est sauvegardé par l'utilisateur
  isBookmarked(contentId: string): boolean {
    const userData = this.getUserSocialData()
    return userData.bookmarks.includes(contentId)
  }

  // Obtenir les contenus likés par l'utilisateur
  getLikedContent(): string[] {
    const userData = this.getUserSocialData()
    return userData.likes
  }

  // Obtenir les contenus sauvegardés par l'utilisateur
  getBookmarkedContent(): string[] {
    const userData = this.getUserSocialData()
    return userData.bookmarks
  }

  // Obtenir les contenus les plus populaires
  getTrendingContent(limit = 10): Array<{ contentId: string; stats: SocialStats }> {
    const trending = Array.from(this.contentStats.entries())
      .map(([contentId, stats]) => ({ contentId, stats }))
      .sort((a, b) => b.stats.engagement - a.stats.engagement)
      .slice(0, limit)

    return trending
  }

  // Enregistrer une interaction
  private async recordInteraction(interaction: SocialInteraction): Promise<void> {
    this.interactions.set(interaction.id, interaction)
  }

  // Supprimer une interaction
  private removeInteraction(userId: string, contentId: string, type: string): void {
    for (const [id, interaction] of this.interactions) {
      if (interaction.userId === userId && 
          interaction.contentId === contentId && 
          interaction.type === type) {
        this.interactions.delete(id)
        break
      }
    }
  }

  // Mettre à jour les statistiques d'un contenu
  private updateContentStats(contentId: string): void {
    const interactions = Array.from(this.interactions.values())
      .filter(i => i.contentId === contentId)

    const likes = interactions.filter(i => i.type === 'like').length
    const bookmarks = interactions.filter(i => i.type === 'bookmark').length
    const shares = interactions.filter(i => i.type === 'share').length
    const views = interactions.filter(i => i.type === 'view').length

    const engagement = views > 0 ? ((likes + bookmarks + shares) / views) * 100 : 0

    const stats: SocialStats = {
      likes,
      bookmarks,
      shares,
      views,
      engagement: Math.round(engagement * 100) / 100
    }

    this.contentStats.set(contentId, stats)
  }

  // Ouvrir la fenêtre de partage
  private openShareWindow(platform: string, url: string, text: string): void {
    let shareUrl = ''
    const encodedUrl = encodeURIComponent(url)
    const encodedText = encodeURIComponent(text)

    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`
        break
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
        break
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
        break
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodedText}%20${encodedUrl}`
        break
      case 'email':
        shareUrl = `mailto:?subject=${encodedText}&body=${encodedUrl}`
        break
      default:
        // Copier dans le presse-papier
        navigator.clipboard?.writeText(`${text} ${url}`)
        return
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400')
    }
  }

  // Sauvegarder dans localStorage
  private saveToStorage(): void {
    try {
      localStorage.setItem('cityzenmag-social-interactions', 
        JSON.stringify(Array.from(this.interactions.entries())))
      localStorage.setItem('cityzenmag-user-social-data', 
        JSON.stringify(Array.from(this.userSocialData.entries())))
      localStorage.setItem('cityzenmag-content-stats', 
        JSON.stringify(Array.from(this.contentStats.entries())))
    } catch (error) {
      console.error('Erreur sauvegarde données sociales:', error)
    }
  }

  // Charger depuis localStorage
  private loadFromStorage(): void {
    try {
      const interactions = localStorage.getItem('cityzenmag-social-interactions')
      if (interactions) {
        this.interactions = new Map(JSON.parse(interactions))
      }

      const userData = localStorage.getItem('cityzenmag-user-social-data')
      if (userData) {
        this.userSocialData = new Map(JSON.parse(userData))
      }

      const contentStats = localStorage.getItem('cityzenmag-content-stats')
      if (contentStats) {
        this.contentStats = new Map(JSON.parse(contentStats))
      }
    } catch (error) {
      console.error('Erreur chargement données sociales:', error)
    }
  }

  // Nettoyer les données (pour les tests)
  clearAllData(): void {
    this.interactions.clear()
    this.userSocialData.clear()
    this.contentStats.clear()
    localStorage.removeItem('cityzenmag-social-interactions')
    localStorage.removeItem('cityzenmag-user-social-data')
    localStorage.removeItem('cityzenmag-content-stats')
    localStorage.removeItem('cityzenmag-user-id')
  }
}

export const socialService = new SocialService()