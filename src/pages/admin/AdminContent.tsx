import { useState, useMemo } from 'react'
import { 
  Edit3, 
  Trash2, 
  Save, 
  X, 
  FileText,
  Search,
  Filter,
  Calendar,
  Tag,
  Eye,
  Heart
} from 'lucide-react'
import { useAdminContent } from '../../hooks/useAdmin'
import { useTheme } from '../../contexts/ThemeContext'
import type { AdminThread } from '../../types/admin'

interface ContentFilters {
  search: string
  category: string
  status: string
}

interface ThreadForm {
  title: string
  description: string
  category_id: string
  status_id: string
  published_date: string
  is_featured: boolean
}

export function AdminContent() {
  const { threads, categories, statuses, loading, updateThread, deleteThread } = useAdminContent()
  const { theme } = useTheme()
  const [filters, setFilters] = useState<ContentFilters>({
    search: '',
    category: '',
    status: ''
  })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<ThreadForm>({
    title: '',
    description: '',
    category_id: '',
    status_id: '',
    published_date: '',
    is_featured: false
  })
  const [formLoading, setFormLoading] = useState(false)

  // Filtrer et rechercher les threads
  const filteredThreads = useMemo(() => {
    if (!threads) return []
    
    return threads.filter(thread => {
      const matchesSearch = !filters.search || 
        thread.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        (thread.description && thread.description.toLowerCase().includes(filters.search.toLowerCase()))
      
      const matchesCategory = !filters.category || thread.category_id === filters.category
      const matchesStatus = !filters.status || thread.status_id === filters.status
      
      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [threads, filters])

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category_id: '',
      status_id: '',
      published_date: '',
      is_featured: false
    })
    setEditingId(null)
  }

  const handleEdit = (thread: AdminThread) => {
    setFormData({
      title: thread.title,
      description: thread.description || '',
      category_id: thread.category_id || '',
      status_id: thread.status_id || '',
      published_date: thread.published_date ? thread.published_date.split('T')[0] : '',
      is_featured: thread.is_featured
    })
    setEditingId(thread.thread_id)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingId) return
    
    setFormLoading(true)
    try {
      const updateData = {
        ...formData,
        published_date: formData.published_date ? new Date(formData.published_date).toISOString() : null
      }
      await updateThread(editingId, updateData)
      resetForm()
    } catch (error: any) {
      alert('Erreur lors de la mise à jour: ' + error.message)
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async (threadId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      try {
        await deleteThread(threadId)
      } catch (error: any) {
        alert('Erreur lors de la suppression: ' + error.message)
      }
    }
  }

  const getStatusColor = (status: any) => {
    switch (status?.slug) {
      case 'published': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-yellow-100 text-yellow-800'
      case 'archived': return 'bg-gray-100 text-gray-800'
      case 'deleted': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-8 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold theme-text mb-2">Gestion du Contenu</h1>
          <p className="theme-text-muted text-lg">Gérez vos articles et leur publication</p>
        </div>
        <div className="flex items-center space-x-2 theme-text-muted">
          <FileText className="w-5 h-5" />
          <span>{filteredThreads.length} article(s) affiché(s)</span>
        </div>
      </div>

      {/* Filtres */}
      <div className="admin-card p-6">
        <h2 className="text-xl font-bold theme-text mb-4">Filtres et Recherche</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 theme-text-muted" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              placeholder="Rechercher..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-transparent outline-none"
            />
          </div>

          {/* Catégorie */}
          <select
            value={filters.category}
            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-transparent outline-none"
          >
            <option value="">Toutes les catégories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>

          {/* Statut */}
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-transparent outline-none"
          >
            <option value="">Tous les statuts</option>
            {statuses.map(status => (
              <option key={status.id} value={status.id}>{status.name}</option>
            ))}
          </select>

          {/* Reset */}
          <button
            onClick={() => setFilters({ search: '', category: '', status: '' })}
            className="px-4 py-3 border border-gray-300 rounded-xl font-medium theme-text hover:bg-gray-50 transition-colors"
          >
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Formulaire d'édition */}
      {editingId && (
        <div className="admin-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold theme-text">Modifier l'Article</h2>
            <button
              onClick={resetForm}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 theme-text-muted" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Titre */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium theme-text mb-2">
                  Titre
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-transparent outline-none"
                  required
                />
              </div>

              {/* Catégorie */}
              <div>
                <label className="block text-sm font-medium theme-text mb-2">
                  Catégorie
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-transparent outline-none"
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>

              {/* Statut */}
              <div>
                <label className="block text-sm font-medium theme-text mb-2">
                  Statut
                </label>
                <select
                  value={formData.status_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, status_id: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-transparent outline-none"
                >
                  <option value="">Sélectionner un statut</option>
                  {statuses.map(status => (
                    <option key={status.id} value={status.id}>{status.name}</option>
                  ))}
                </select>
              </div>

              {/* Date de publication */}
              <div>
                <label className="block text-sm font-medium theme-text mb-2">
                  Date de publication
                </label>
                <input
                  type="date"
                  value={formData.published_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, published_date: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-transparent outline-none"
                />
              </div>

              {/* Article vedette */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="is_featured"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                  className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                />
                <label htmlFor="is_featured" className="text-sm font-medium theme-text">
                  Article vedette
                </label>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium theme-text mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-transparent outline-none"
                placeholder="Description de l'article..."
              />
            </div>

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
          <h2 className="text-2xl font-bold theme-text">Articles</h2>
        </div>
        
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 theme-text-muted">Chargement...</p>
          </div>
        ) : filteredThreads.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredThreads.map((thread) => (
              <div key={thread.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold theme-text">{thread.title}</h3>
                      {thread.is_featured && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                          Vedette
                        </span>
                      )}
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(thread.status)}`}>
                        {thread.status?.name || 'Non défini'}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm theme-text-muted mb-3">
                      <div className="flex items-center space-x-1">
                        <Tag className="w-4 h-4" />
                        <span>{thread.category?.name || 'Non classé'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {thread.published_date 
                            ? new Date(thread.published_date).toLocaleDateString('fr-FR')
                            : 'Non programmé'
                          }
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FileText className="w-4 h-4" />
                        <span>{thread.total_tweets} analyses</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{thread.view_count || 0} vues</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart className="w-4 h-4" />
                        <span>{thread.like_count || 0} j'aime</span>
                      </div>
                    </div>
                    
                    {thread.description && (
                      <p className="theme-text-muted text-sm">{thread.description}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(thread)}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit3 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(thread.thread_id)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <FileText className="w-16 h-16 mx-auto mb-4 theme-text-muted opacity-50" />
            <p className="text-lg theme-text-muted">Aucun article trouvé</p>
            <p className="theme-text-muted">Ajustez vos filtres pour voir plus de contenus</p>
          </div>
        )}
      </div>
    </div>
  )
}