import { useState, useEffect } from 'react'
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Save, 
  X, 
  FileText,
  Hash,
  Calendar,
  AlertCircle,
  Eye,
  EyeOff,
  Upload,
  Image as ImageIcon,
  Link as LinkIcon,
  CheckCircle,
  Clock
} from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { useAdminCategories } from '../../hooks/useAdmin'
import { WysiwygEditor } from '../../components/admin/WysiwygEditor'
import { ImageUploader } from '../../components/admin/ImageUploader'

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

interface ArticleForm {
  title: string
  content: string
  description: string
  theme: string
  hashtags: string[]
  category_id: string
  status: 'draft' | 'published' | 'archived'
  is_featured: boolean
  featured_image: string
}

const availableThemes = [
  'Transparence',
  'Modernisation',
  'Gouvernance',
  'Citoyenneté',
  'Développement',
  'Justice',
  'Éducation',
  'Santé',
  'Économie',
  'Environnement'
]

const statusOptions = [
  { value: 'draft', label: 'Brouillon', color: 'bg-gray-100 text-gray-800', icon: Clock },
  { value: 'published', label: 'Publié', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  { value: 'archived', label: 'Archivé', color: 'bg-red-100 text-red-800', icon: Eye }
]

export function AdminArticles() {
  const { theme } = useTheme()
  const { categories } = useAdminCategories()
  const [articles, setArticles] = useState<Article[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<ArticleForm>({
    title: '',
    content: '',
    description: '',
    theme: '',
    hashtags: [],
    category_id: '',
    status: 'draft',
    is_featured: false,
    featured_image: ''
  })
  const [formLoading, setFormLoading] = useState(false)
  const [error, setError] = useState('')
  const [hashtagInput, setHashtagInput] = useState('')

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      description: '',
      theme: '',
      hashtags: [],
      category_id: '',
      status: 'draft',
      is_featured: false,
      featured_image: ''
    })
    setHashtagInput('')
    setShowForm(false)
    setEditingId(null)
    setError('')
  }

  const generateId = () => {
    return 'article_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormLoading(true)
    setError('')

    try {
      const articleData: Article = {
        id: editingId || generateId(),
        title: formData.title,
        content: formData.content,
        description: formData.description,
        theme: formData.theme,
        hashtags: formData.hashtags,
        category_id: formData.category_id,
        status: formData.status,
        is_featured: formData.is_featured,
        featured_image: formData.featured_image,
        author: 'admin@cityzenmag.sn', // TODO: Get from auth context
        published_date: formData.status === 'published' ? new Date().toISOString() : undefined,
        created_at: editingId ? articles.find(a => a.id === editingId)?.created_at || new Date().toISOString() : new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      if (editingId) {
        setArticles(prev => prev.map(article => 
          article.id === editingId ? articleData : article
        ))
      } else {
        setArticles(prev => [articleData, ...prev])
      }

      resetForm()
    } catch (error: any) {
      setError(error.message || 'Erreur lors de la sauvegarde')
    } finally {
      setFormLoading(false)
    }
  }

  const handleEdit = (article: Article) => {
    setFormData({
      title: article.title,
      content: article.content,
      description: article.description || '',
      theme: article.theme || '',
      hashtags: article.hashtags,
      category_id: article.category_id || '',
      status: article.status,
      is_featured: article.is_featured,
      featured_image: article.featured_image || ''
    })
    setHashtagInput(article.hashtags.join(', '))
    setEditingId(article.id)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      setArticles(prev => prev.filter(article => article.id !== id))
    }
  }

  const handleHashtagsChange = (value: string) => {
    setHashtagInput(value)
    const hashtags = value
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
      .map(tag => tag.startsWith('#') ? tag : `#${tag}`)
    
    setFormData(prev => ({ ...prev, hashtags }))
  }

  const getStatusInfo = (status: string) => {
    return statusOptions.find(s => s.value === status) || statusOptions[0]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Données de démonstration
  useEffect(() => {
    setArticles([
      {
        id: 'demo_1',
        title: 'La Transparence dans les Marchés Publics au Sénégal',
        content: `<h1>Introduction</h1>

<p>La transparence dans les marchés publics est un enjeu majeur pour le développement économique du Sénégal. Dans cet article, nous analysons les mécanismes mis en place et les défis à relever.</p>

<h2>Les Enjeux Actuels</h2>

<p>Les marchés publics représentent une part importante du budget national. Il est donc crucial d'assurer une gestion transparente et efficace de ces ressources.</p>

<div class="video-embed youtube-embed">
  <iframe 
    width="560" 
    height="315" 
    src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
    title="Exemple vidéo sur la transparence"
    frameborder="0" 
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
    allowfullscreen>
  </iframe>
</div>

<h3>Points Clés</h3>

<ol>
<li><strong>Digitalisation des procédures</strong></li>
<li><strong>Renforcement des contrôles</strong></li>
<li><strong>Participation citoyenne</strong></li>
</ol>

<h2>Recommandations</h2>

<p>Pour améliorer la transparence, nous proposons :</p>

<ul>
<li>Mise en place d'une plateforme unique</li>
<li>Formation des agents publics</li>
<li>Sensibilisation des citoyens</li>
</ul>

<div class="image-embed">
  <img src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800" alt="Transparence gouvernementale" style="max-width: 100%; height: auto;" />
  <p class="image-caption">La transparence au cœur de la gouvernance moderne</p>
</div>

<h2>Conclusion</h2>

<p>La transparence dans les marchés publics nécessite une approche globale impliquant tous les acteurs de la société sénégalaise.</p>`,
        description: 'Analyse approfondie des mécanismes de transparence dans les marchés publics sénégalais',
        theme: 'Transparence',
        hashtags: ['#TransparenceSN', '#MarchésPublics', '#Gouvernance'],
        category_id: 'transparence-sn',
        status: 'published',
        is_featured: true,
        featured_image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800',
        author: 'admin@cityzenmag.sn',
        published_date: '2025-09-17T08:00:00Z',
        created_at: '2025-09-17T08:00:00Z',
        updated_at: '2025-09-17T08:00:00Z'
      },
      {
        id: 'demo_2',
        title: 'Modernisation de l\'Administration Publique',
        content: `<h1>La Modernisation Administrative au Sénégal</h1>

<p>L'administration publique sénégalaise connaît une transformation majeure avec l'introduction de nouvelles technologies et méthodes de gestion.</p>

<h2>Objectifs de la Modernisation</h2>

<ul>
<li>Améliorer l'efficacité des services</li>
<li>Réduire les délais de traitement</li>
<li>Renforcer la satisfaction citoyenne</li>
</ul>

<h2>Initiatives en Cours</h2>

<h3>Digitalisation</h3>
<ul>
<li>Dématérialisation des procédures</li>
<li>Services en ligne</li>
<li>Signature électronique</li>
</ul>

<div class="image-embed">
  <img src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800" alt="Modernisation administrative" style="max-width: 100%; height: auto;" />
  <p class="image-caption">La digitalisation au service de l'efficacité administrative</p>
</div>

<h3>Formation</h3>
<ul>
<li>Renforcement des capacités</li>
<li>Nouvelles compétences numériques</li>
<li>Management moderne</li>
</ul>

<h2>Défis à Relever</h2>

<p>La modernisation fait face à plusieurs défis :</p>
<ol>
<li>Résistance au changement</li>
<li>Contraintes budgétaires</li>
<li>Infrastructure technologique</li>
</ol>

<blockquote>
<p>"La modernisation de l'administration est un processus continu qui nécessite l'engagement de tous les acteurs."</p>
</blockquote>

<h2>Perspectives d'Avenir</h2>

<p>L'avenir de l'administration sénégalaise s'annonce prometteur avec ces réformes structurelles.</p>

<p>Pour en savoir plus, consultez <a href="https://www.gouv.sn" target="_blank" rel="noopener noreferrer" class="external-link">le site officiel du gouvernement</a>.</p>`,
        description: 'État des lieux et perspectives de la modernisation administrative au Sénégal',
        theme: 'Modernisation',
        hashtags: ['#LaSuite', '#Modernisation', '#Administration'],
        category_id: 'la-suite',
        status: 'published',
        is_featured: false,
        featured_image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800',
        author: 'admin@cityzenmag.sn',
        published_date: '2025-09-16T14:30:00Z',
        created_at: '2025-09-16T14:30:00Z',
        updated_at: '2025-09-16T14:30:00Z'
      }
    ])
  }, [])

  return (
    <div className="space-y-8 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold theme-text mb-2">Articles</h1>
          <p className="theme-text-muted text-lg">Créez et gérez vos articles éditoriaux</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-white transition-all ${
            theme === 'senegalais'
              ? 'bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800'
              : 'bg-black hover:bg-gray-800'
          } shadow-lg hover:shadow-xl transform hover:-translate-y-1`}
        >
          <Plus className="w-5 h-5" />
          <span>Nouvel Article</span>
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="admin-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm theme-text-muted">Total Articles</p>
              <p className="text-3xl font-bold theme-text">{articles.length}</p>
            </div>
            <FileText className={`w-8 h-8 ${theme === 'senegalais' ? 'text-orange-600' : 'text-gray-600'}`} />
          </div>
        </div>
        <div className="admin-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm theme-text-muted">Publiés</p>
              <p className="text-3xl font-bold text-green-600">{articles.filter(a => a.status === 'published').length}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="admin-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm theme-text-muted">Brouillons</p>
              <p className="text-3xl font-bold text-gray-600">{articles.filter(a => a.status === 'draft').length}</p>
            </div>
            <Clock className="w-8 h-8 text-gray-600" />
          </div>
        </div>
        <div className="admin-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm theme-text-muted">En Vedette</p>
              <p className="text-3xl font-bold text-blue-600">{articles.filter(a => a.is_featured).length}</p>
            </div>
            <Eye className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Formulaire */}
      {showForm && (
        <div className="admin-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold theme-text">
              {editingId ? 'Modifier l\'Article' : 'Nouvel Article'}
            </h2>
            <button
              onClick={resetForm}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 theme-text-muted" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Titre et Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium theme-text mb-2">
                  Titre de l'article *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-transparent outline-none"
                  placeholder="Ex: La Transparence dans les Marchés Publics"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium theme-text mb-2">
                  Thème
                </label>
                <select
                  value={formData.theme}
                  onChange={(e) => setFormData(prev => ({ ...prev, theme: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-transparent outline-none"
                >
                  <option value="">Sélectionner un thème</option>
                  {availableThemes.map(theme => (
                    <option key={theme} value={theme}>{theme}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium theme-text mb-2">
                Description courte
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={2}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-transparent outline-none"
                placeholder="Résumé de l'article en quelques lignes..."
              />
            </div>

            {/* Contenu */}
            <div>
              <label className="block text-sm font-medium theme-text mb-2">
                Contenu de l'article *
              </label>
              <WysiwygEditor
                value={formData.content}
                onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                placeholder="Rédigez votre article avec l'éditeur visuel...

Utilisez la barre d'outils pour formater votre texte et intégrer des vidéos YouTube, images et liens."
                className="min-h-[500px]"
              />
              <p className="text-xs theme-text-muted mt-2">
                Utilisez l'éditeur visuel pour formater votre article et intégrer du contenu multimédia
              </p>
            </div>

            {/* Hashtags et Catégorie */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium theme-text mb-2">
                  Hashtags
                </label>
                <input
                  type="text"
                  value={hashtagInput}
                  onChange={(e) => handleHashtagsChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-transparent outline-none"
                  placeholder="TransparenceSN, Gouvernance, Citoyenneté"
                />
                <p className="text-xs theme-text-muted mt-1">
                  Séparez les hashtags par des virgules
                </p>
                {formData.hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.hashtags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium theme-text mb-2">
                  Catégorie
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-transparent outline-none"
                >
                  <option value="">Aucune catégorie</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Image et Statut */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <ImageUploader
                  value={formData.featured_image}
                  onChange={(value) => setFormData(prev => ({ ...prev, featured_image: value }))}
                  label="Image de couverture"
                  placeholder="Glissez une image ici ou cliquez pour sélectionner"
                  maxSize={5}
                />
              </div>

              <div>
                <label className="block text-sm font-medium theme-text mb-2">
                  Statut
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-transparent outline-none"
                >
                  {statusOptions.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center space-x-6">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                  className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                />
                <span className="text-sm font-medium theme-text">
                  Article en vedette
                </span>
              </label>
            </div>

            {/* Erreur */}
            {error && (
              <div className="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-xl">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Boutons */}
            <div className="flex items-center space-x-4">
              <button
                type="submit"
                disabled={formLoading}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-white transition-all ${
                  theme === 'senegalais'
                    ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
                    : 'bg-green-600 hover:bg-green-700'
                } disabled:opacity-50`}
              >
                <Save className="w-5 h-5" />
                <span>{formLoading ? 'Sauvegarde...' : 'Sauvegarder'}</span>
              </button>
              
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 border border-gray-300 rounded-xl font-medium theme-text hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Liste des articles */}
      <div className="admin-card">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold theme-text">Articles Existants</h2>
        </div>
        
        {articles.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {articles.map((article) => {
              const statusInfo = getStatusInfo(article.status)
              const StatusIcon = statusInfo.icon
              
              return (
                <div key={article.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold theme-text">{article.title}</h3>
                        {article.is_featured && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            Vedette
                          </span>
                        )}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                          <StatusIcon className="w-3 h-3 inline mr-1" />
                          {statusInfo.label}
                        </span>
                      </div>
                      
                      {article.description && (
                        <p className="theme-text-muted text-sm mb-3 line-clamp-2">
                          {article.description}
                        </p>
                      )}
                      
                      <div className="flex items-center space-x-4 text-xs theme-text-muted">
                        <span>Par {article.author}</span>
                        <span>•</span>
                        <span>{formatDate(article.created_at)}</span>
                        {article.published_date && (
                          <>
                            <span>•</span>
                            <span>Publié le {formatDate(article.published_date)}</span>
                          </>
                        )}
                        {article.theme && (
                          <>
                            <span>•</span>
                            <span className="px-2 py-1 bg-gray-100 rounded-full">
                              {article.theme}
                            </span>
                          </>
                        )}
                      </div>
                      
                      {article.hashtags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {article.hashtags.map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleEdit(article)}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit3 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(article.id)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="p-12 text-center">
            <FileText className="w-16 h-16 mx-auto mb-4 theme-text-muted opacity-50" />
            <p className="text-lg theme-text-muted">Aucun article créé</p>
            <p className="theme-text-muted">Créez votre premier article éditorial</p>
          </div>
        )}
      </div>
    </div>
  )
}