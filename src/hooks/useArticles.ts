import { useState, useEffect } from 'react'

interface Article {
  id: string
  title: string
  content: string
  description?: string
  theme?: string
  hashtags: string[]
  category_id?: string
  status: 'draft' | 'published' | 'archived'
  is_featured: boolean
  featured_image?: string
  author: string
  published_date?: string
  created_at: string
  updated_at: string
}

export function useArticles() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true)
        
        // Simulation de données d'articles (en attendant une vraie API)
        const mockArticles: Article[] = [
          {
            id: 'article_1',
            title: 'La Transparence dans les Marchés Publics au Sénégal',
            content: `<h1>Introduction</h1>
<p>La transparence dans les marchés publics est un enjeu majeur pour le développement économique du Sénégal. Dans cet article, nous analysons les mécanismes mis en place et les défis à relever.</p>
<h2>Les Enjeux Actuels</h2>
<p>Les marchés publics représentent une part importante du budget national. Il est donc crucial d'assurer une gestion transparente et efficace de ces ressources.</p>`,
            description: 'Analyse approfondie des mécanismes de transparence dans les marchés publics sénégalais',
            theme: 'Transparence',
            hashtags: ['#TransparenceSN', '#MarchésPublics', '#Gouvernance'],
            category_id: 'transparence-sn',
            status: 'published',
            is_featured: true,
            featured_image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800',
            author: 'admin@cityzenmag.sn',
            published_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // Il y a 1 jour
            created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 'article_2',
            title: 'Modernisation de l\'Administration Publique',
            content: `<h1>La Modernisation Administrative au Sénégal</h1>
<p>L'administration publique sénégalaise connaît une transformation majeure avec l'introduction de nouvelles technologies et méthodes de gestion.</p>
<h2>Objectifs de la Modernisation</h2>
<ul>
<li>Améliorer l'efficacité des services</li>
<li>Réduire les délais de traitement</li>
<li>Renforcer la satisfaction citoyenne</li>
</ul>`,
            description: 'État des lieux et perspectives de la modernisation administrative au Sénégal',
            theme: 'Modernisation',
            hashtags: ['#LaSuite', '#Modernisation', '#Administration'],
            category_id: 'la-suite',
            status: 'published',
            is_featured: false,
            featured_image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800',
            author: 'admin@cityzenmag.sn',
            published_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // Il y a 2 jours
            created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 'article_3',
            title: 'L\'Impact de la Digitalisation sur la Gouvernance',
            content: `<h1>Digitalisation et Gouvernance</h1>
<p>La transformation numérique révolutionne les modes de gouvernance au Sénégal. Cet article explore les opportunités et les défis de cette transition.</p>
<h2>Les Opportunités</h2>
<p>La digitalisation offre de nombreuses possibilités pour améliorer la gouvernance et rapprocher l'administration des citoyens.</p>`,
            description: 'Comment la digitalisation transforme la gouvernance publique au Sénégal',
            theme: 'Gouvernance',
            hashtags: ['#Digitalisation', '#Gouvernance', '#Innovation'],
            category_id: 'gouvernance',
            status: 'published',
            is_featured: false,
            featured_image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
            author: 'admin@cityzenmag.sn',
            published_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // Il y a 3 jours
            created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 'article_4',
            title: 'Participation Citoyenne et Démocratie Locale',
            content: `<h1>La Participation Citoyenne au Sénégal</h1>
<p>La démocratie participative prend une nouvelle dimension avec les outils numériques et les initiatives citoyennes.</p>
<h2>Mécanismes de Participation</h2>
<p>Plusieurs mécanismes permettent aux citoyens de s'impliquer davantage dans la vie démocratique locale.</p>`,
            description: 'Analyse des mécanismes de participation citoyenne dans la démocratie sénégalaise',
            theme: 'Citoyenneté',
            hashtags: ['#Citoyenneté', '#Démocratie', '#Participation'],
            category_id: 'citoyennete',
            status: 'draft',
            is_featured: false,
            featured_image: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800',
            author: 'admin@cityzenmag.sn',
            published_date: undefined,
            created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() // Mis à jour il y a 1h
          },
          {
            id: 'article_5',
            title: 'Les Défis de l\'Éducation Numérique',
            content: `<h1>Éducation et Numérique au Sénégal</h1>
<p>L'intégration du numérique dans l'éducation représente un défi majeur pour le système éducatif sénégalais.</p>
<h2>État des Lieux</h2>
<p>Où en est le Sénégal dans la digitalisation de son système éducatif ?</p>`,
            description: 'Les enjeux et perspectives de l\'éducation numérique au Sénégal',
            theme: 'Éducation',
            hashtags: ['#Éducation', '#Numérique', '#Innovation'],
            category_id: 'education',
            status: 'published',
            is_featured: true,
            featured_image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
            author: 'admin@cityzenmag.sn',
            published_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // Il y a 5 jours
            created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
          }
        ]

        // Simulation d'un délai réseau
        await new Promise(resolve => setTimeout(resolve, 800))
        
        setArticles(mockArticles)
        setError(null)
      } catch (err) {
        setError('Erreur lors du chargement des articles')
        console.error('Erreur useArticles:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [])

  // Fonctions utilitaires
  const getPublishedArticles = () => {
    return articles.filter(article => article.status === 'published')
  }

  const getFeaturedArticles = () => {
    return articles.filter(article => article.is_featured && article.status === 'published')
  }

  const getArticlesByTheme = (theme: string) => {
    return articles.filter(article => 
      article.theme?.toLowerCase() === theme.toLowerCase() && 
      article.status === 'published'
    )
  }

  const getLatestArticles = (limit: number = 5) => {
    return getPublishedArticles()
      .sort((a, b) => new Date(b.published_date || b.created_at).getTime() - new Date(a.published_date || a.created_at).getTime())
      .slice(0, limit)
  }

  return {
    articles,
    loading,
    error,
    getPublishedArticles,
    getFeaturedArticles,
    getArticlesByTheme,
    getLatestArticles
  }
}