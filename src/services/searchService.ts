import type { Thread } from '../types/database'
import type { Interview } from '../types/interviews'
import type { PhotoReport } from '../types/photoReports'
import type { VideoAnalysis } from '../types/videoAnalyses'
import type { Testimonial } from '../types/testimonials'

// Types pour la recherche unifiée
export interface SearchResult {
  id: string
  type: 'thread' | 'interview' | 'reportage' | 'video' | 'testimonial'
  title: string
  description: string
  content?: string
  date: string
  theme?: string
  location?: string
  author?: string
  image?: string
  url: string
  relevanceScore: number
  highlights: string[]
}

export interface SearchFilters {
  types?: string[]
  dateRange?: {
    start?: string
    end?: string
  }
  themes?: string[]
  locations?: string[]
  authors?: string[]
}

export interface SearchOptions {
  query: string
  filters?: SearchFilters
  limit?: number
  offset?: number
  sortBy?: 'relevance' | 'date' | 'popularity'
}

export interface SearchResponse {
  results: SearchResult[]
  total: number
  suggestions: string[]
  facets: {
    types: { [key: string]: number }
    themes: { [key: string]: number }
    locations: { [key: string]: number }
    authors: { [key: string]: number }
  }
  query: string
  executionTime: number
}

class SearchService {
  private searchIndex: Map<string, SearchResult> = new Map()
  private searchHistory: string[] = []
  private popularQueries: Map<string, number> = new Map()

  constructor() {
    this.loadSearchHistory()
  }

  // Indexer tous les contenus pour la recherche
  indexContent(
    threads: Thread[],
    interviews: Interview[],
    reportages: PhotoReport[],
    videos: VideoAnalysis[],
    testimonials: Testimonial[]
  ) {
    this.searchIndex.clear()

    // Indexer les threads Twitter
    threads.forEach(thread => {
      const result: SearchResult = {
        id: thread.thread_id,
        type: 'thread',
        title: thread.title,
        description: thread.description || '',
        date: thread.date_created,
        theme: thread.theme,
        url: `/thread/${thread.thread_id}`,
        relevanceScore: 0,
        highlights: []
      }
      this.searchIndex.set(`thread-${thread.thread_id}`, result)
    })

    // Indexer les interviews
    interviews.forEach(interview => {
      const result: SearchResult = {
        id: interview.id,
        type: 'interview',
        title: interview.title,
        description: interview.description || '',
        content: interview.transcript || interview.questions?.map(q => q.answer).join(' ') || '',
        date: interview.publishedAt,
        theme: interview.category,
        author: interview.interviewee.name,
        image: interview.interviewee.photo || interview.thumbnail,
        url: `/interviews#${interview.id}`,
        relevanceScore: 0,
        highlights: []
      }
      this.searchIndex.set(`interview-${interview.id}`, result)
    })

    // Indexer les reportages photo
    reportages.forEach(reportage => {
      const result: SearchResult = {
        id: reportage.id,
        type: 'reportage',
        title: reportage.title,
        description: reportage.description,
        content: reportage.images?.map(img => img.caption).join(' ') || '',
        date: reportage.publishedAt,
        theme: reportage.category,
        location: reportage.location.name,
        author: reportage.photographer.name,
        image: reportage.coverImage,
        url: `/reportages#${reportage.id}`,
        relevanceScore: 0,
        highlights: []
      }
      this.searchIndex.set(`reportage-${reportage.id}`, result)
    })

    // Indexer les vidéos analyses
    videos.forEach(video => {
      const result: SearchResult = {
        id: video.id,
        type: 'video',
        title: video.title,
        description: video.description || '',
        content: video.transcript || video.chapters?.map(c => c.title).join(' ') || '',
        date: video.publishedAt,
        theme: video.category,
        author: video.speaker.name,
        image: video.thumbnail,
        url: `/videos#${video.id}`,
        relevanceScore: 0,
        highlights: []
      }
      this.searchIndex.set(`video-${video.id}`, result)
    })

    // Indexer les témoignages
    testimonials.forEach(testimonial => {
      const result: SearchResult = {
        id: testimonial.id,
        type: 'testimonial',
        title: testimonial.title,
        description: testimonial.content,
        content: testimonial.content,
        date: testimonial.createdAt,
        theme: testimonial.category,
        location: testimonial.author.location,
        author: testimonial.author.anonymous ? 'Anonyme' : testimonial.author.name,
        url: `/temoignages#${testimonial.id}`,
        relevanceScore: 0,
        highlights: []
      }
      this.searchIndex.set(`testimonial-${testimonial.id}`, result)
    })
  }

  // Recherche principale
  async search(options: SearchOptions): Promise<SearchResponse> {
    const startTime = Date.now()
    const { query, filters = {}, limit = 20, offset = 0, sortBy = 'relevance' } = options

    // Enregistrer la recherche
    this.recordSearch(query)

    // Recherche full-text
    const results = this.performFullTextSearch(query, filters)

    // Trier les résultats
    const sortedResults = this.sortResults(results, sortBy)

    // Pagination
    const paginatedResults = sortedResults.slice(offset, offset + limit)

    // Générer les facettes
    const facets = this.generateFacets(results)

    // Générer les suggestions
    const suggestions = this.generateSuggestions(query)

    const executionTime = Date.now() - startTime

    return {
      results: paginatedResults,
      total: results.length,
      suggestions,
      facets,
      query,
      executionTime
    }
  }

  // Recherche full-text
  private performFullTextSearch(query: string, filters: SearchFilters): SearchResult[] {
    const queryTerms = query.toLowerCase().split(/\s+/).filter(term => term.length > 2)
    const results: SearchResult[] = []

    for (const [key, item] of this.searchIndex) {
      // Appliquer les filtres
      if (!this.matchesFilters(item, filters)) {
        continue
      }

      // Calculer le score de pertinence
      const score = this.calculateRelevanceScore(item, queryTerms)
      
      if (score > 0) {
        const result = { ...item }
        result.relevanceScore = score
        result.highlights = this.generateHighlights(item, queryTerms)
        results.push(result)
      }
    }

    return results
  }

  // Calculer le score de pertinence
  private calculateRelevanceScore(item: SearchResult, queryTerms: string[]): number {
    let score = 0
    const searchableText = [
      item.title,
      item.description,
      item.content || '',
      item.theme || '',
      item.location || '',
      item.author || ''
    ].join(' ').toLowerCase()

    queryTerms.forEach(term => {
      // Score pour le titre (poids 3)
      if (item.title.toLowerCase().includes(term)) {
        score += 3
      }

      // Score pour la description (poids 2)
      if (item.description.toLowerCase().includes(term)) {
        score += 2
      }

      // Score pour le contenu (poids 1)
      if (searchableText.includes(term)) {
        score += 1
      }

      // Bonus pour correspondance exacte
      if (searchableText.includes(queryTerms.join(' '))) {
        score += 5
      }
    })

    return score
  }

  // Vérifier si l'item correspond aux filtres
  private matchesFilters(item: SearchResult, filters: SearchFilters): boolean {
    // Filtre par type
    if (filters.types && filters.types.length > 0) {
      if (!filters.types.includes(item.type)) {
        return false
      }
    }

    // Filtre par date
    if (filters.dateRange) {
      const itemDate = new Date(item.date)
      if (filters.dateRange.start && itemDate < new Date(filters.dateRange.start)) {
        return false
      }
      if (filters.dateRange.end && itemDate > new Date(filters.dateRange.end)) {
        return false
      }
    }

    // Filtre par thème
    if (filters.themes && filters.themes.length > 0) {
      if (!item.theme || !filters.themes.includes(item.theme)) {
        return false
      }
    }

    // Filtre par lieu
    if (filters.locations && filters.locations.length > 0) {
      if (!item.location || !filters.locations.includes(item.location)) {
        return false
      }
    }

    // Filtre par auteur
    if (filters.authors && filters.authors.length > 0) {
      if (!item.author || !filters.authors.includes(item.author)) {
        return false
      }
    }

    return true
  }

  // Trier les résultats
  private sortResults(results: SearchResult[], sortBy: string): SearchResult[] {
    switch (sortBy) {
      case 'date':
        return results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      case 'popularity':
        // Simuler la popularité basée sur le type et la date
        return results.sort((a, b) => {
          const aPopularity = this.getPopularityScore(a)
          const bPopularity = this.getPopularityScore(b)
          return bPopularity - aPopularity
        })
      case 'relevance':
      default:
        return results.sort((a, b) => b.relevanceScore - a.relevanceScore)
    }
  }

  // Score de popularité simulé
  private getPopularityScore(item: SearchResult): number {
    const typeScores = {
      thread: 1,
      interview: 3,
      reportage: 2,
      video: 4,
      testimonial: 2
    }
    
    const daysSincePublication = Math.floor(
      (Date.now() - new Date(item.date).getTime()) / (1000 * 60 * 60 * 24)
    )
    
    return (typeScores[item.type] || 1) * Math.max(1, 30 - daysSincePublication)
  }

  // Générer les highlights
  private generateHighlights(item: SearchResult, queryTerms: string[]): string[] {
    const highlights: string[] = []
    const text = item.description

    queryTerms.forEach(term => {
      const regex = new RegExp(`(.{0,50})(${term})(.{0,50})`, 'gi')
      const match = text.match(regex)
      if (match) {
        highlights.push(match[0].replace(new RegExp(term, 'gi'), `<mark>$&</mark>`))
      }
    })

    return highlights.slice(0, 3) // Limiter à 3 highlights
  }

  // Générer les facettes
  private generateFacets(results: SearchResult[]) {
    const facets = {
      types: {} as { [key: string]: number },
      themes: {} as { [key: string]: number },
      locations: {} as { [key: string]: number },
      authors: {} as { [key: string]: number }
    }

    results.forEach(result => {
      // Types
      facets.types[result.type] = (facets.types[result.type] || 0) + 1

      // Thèmes
      if (result.theme) {
        facets.themes[result.theme] = (facets.themes[result.theme] || 0) + 1
      }

      // Lieux
      if (result.location) {
        facets.locations[result.location] = (facets.locations[result.location] || 0) + 1
      }

      // Auteurs
      if (result.author) {
        facets.authors[result.author] = (facets.authors[result.author] || 0) + 1
      }
    })

    return facets
  }

  // Générer les suggestions
  private generateSuggestions(query: string): string[] {
    const suggestions: string[] = []
    
    // Suggestions basées sur les recherches populaires
    for (const [popularQuery, count] of this.popularQueries) {
      if (popularQuery.toLowerCase().includes(query.toLowerCase()) && popularQuery !== query) {
        suggestions.push(popularQuery)
      }
    }

    // Suggestions basées sur le contenu indexé
    const contentSuggestions = [
      'transparence gouvernementale',
      'corruption Sénégal',
      'modernisation administration',
      'accès information publique',
      'gouvernance locale',
      'participation citoyenne',
      'réformes institutionnelles',
      'digitalisation services'
    ]

    contentSuggestions.forEach(suggestion => {
      if (suggestion.toLowerCase().includes(query.toLowerCase()) && !suggestions.includes(suggestion)) {
        suggestions.push(suggestion)
      }
    })

    return suggestions.slice(0, 5)
  }

  // Enregistrer une recherche
  private recordSearch(query: string) {
    if (query.trim().length > 2) {
      this.searchHistory.unshift(query)
      this.searchHistory = this.searchHistory.slice(0, 50) // Garder les 50 dernières
      
      this.popularQueries.set(query, (this.popularQueries.get(query) || 0) + 1)
      
      this.saveSearchHistory()
    }
  }

  // Obtenir l'historique des recherches
  getSearchHistory(): string[] {
    return this.searchHistory.slice(0, 10)
  }

  // Obtenir les recherches populaires
  getPopularSearches(): string[] {
    return Array.from(this.popularQueries.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([query]) => query)
  }

  // Sauvegarder l'historique
  private saveSearchHistory() {
    try {
      localStorage.setItem('cityzenmag-search-history', JSON.stringify(this.searchHistory))
      localStorage.setItem('cityzenmag-popular-queries', JSON.stringify(Array.from(this.popularQueries.entries())))
    } catch (error) {
      console.error('Erreur sauvegarde historique recherche:', error)
    }
  }

  // Charger l'historique
  private loadSearchHistory() {
    try {
      const history = localStorage.getItem('cityzenmag-search-history')
      if (history) {
        this.searchHistory = JSON.parse(history)
      }

      const popular = localStorage.getItem('cityzenmag-popular-queries')
      if (popular) {
        this.popularQueries = new Map(JSON.parse(popular))
      }
    } catch (error) {
      console.error('Erreur chargement historique recherche:', error)
    }
  }

  // Nettoyer l'historique
  clearSearchHistory() {
    this.searchHistory = []
    this.popularQueries.clear()
    localStorage.removeItem('cityzenmag-search-history')
    localStorage.removeItem('cityzenmag-popular-queries')
  }
}

export const searchService = new SearchService()