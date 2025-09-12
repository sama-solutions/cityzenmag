import { useState } from 'react'
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Save, 
  X, 
  FolderOpen,
  Hash,
  Palette,
  AlertCircle
} from 'lucide-react'
import { useAdminCategories } from '../../hooks/useAdmin'
import { useTheme } from '../../contexts/ThemeContext'
import type { Category } from '../../types/admin'

interface CategoryForm {
  name: string
  slug: string
  description: string
  color: string
  icon: string
}

const availableIcons = ['Hash', 'TrendingUp', 'Calendar', 'FolderOpen', 'FileText', 'Star', 'Heart', 'Zap']
const availableColors = ['#1e3a8a', '#D2691E', '#fbbf24', '#22c55e', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4']

export function AdminCategories() {
  const { categories, loading, createCategory, updateCategory, deleteCategory } = useAdminCategories()
  const { theme } = useTheme()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<CategoryForm>({
    name: '',
    slug: '',
    description: '',
    color: '#D2691E',
    icon: 'Hash'
  })
  const [formLoading, setFormLoading] = useState(false)
  const [error, setError] = useState('')

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      color: '#D2691E',
      icon: 'Hash'
    })
    setShowForm(false)
    setEditingId(null)
    setError('')
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9à-ſ\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: editingId ? prev.slug : generateSlug(name)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormLoading(true)
    setError('')

    try {
      if (editingId) {
        await updateCategory(editingId, formData)
      } else {
        await createCategory(formData)
      }
      resetForm()
    } catch (error: any) {
      setError(error.message || 'Erreur lors de la sauvegarde')
    } finally {
      setFormLoading(false)
    }
  }

  const handleEdit = (category: Category) => {
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      color: category.color,
      icon: category.icon || 'Hash'
    })
    setEditingId(category.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      try {
        await deleteCategory(id)
      } catch (error: any) {
        alert('Erreur lors de la suppression: ' + error.message)
      }
    }
  }

  return (
    <div className="space-y-8 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold theme-text mb-2">Catégories</h1>
          <p className="theme-text-muted text-lg">Gérez les catégories de votre magazine</p>
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
          <span>Nouvelle Catégorie</span>
        </button>
      </div>

      {/* Formulaire */}
      {showForm && (
        <div className="admin-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold theme-text">
              {editingId ? 'Modifier la Catégorie' : 'Nouvelle Catégorie'}
            </h2>
            <button
              onClick={resetForm}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 theme-text-muted" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nom */}
              <div>
                <label className="block text-sm font-medium theme-text mb-2">
                  Nom de la catégorie
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-transparent outline-none"
                  placeholder="Ex: TransparenceSN"
                  required
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium theme-text mb-2">
                  Slug (URL)
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-transparent outline-none"
                  placeholder="transparence-sn"
                  required
                />
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
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-transparent outline-none"
                placeholder="Description de la catégorie..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Couleur */}
              <div>
                <label className="block text-sm font-medium theme-text mb-2">
                  Couleur
                </label>
                <div className="flex space-x-2">
                  {availableColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, color }))}
                      className={`w-10 h-10 rounded-full border-4 transition-all ${
                        formData.color === color ? 'border-gray-900 scale-110' : 'border-gray-200'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Icône */}
              <div>
                <label className="block text-sm font-medium theme-text mb-2">
                  Icône
                </label>
                <select
                  value={formData.icon}
                  onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-transparent outline-none"
                >
                  {availableIcons.map((icon) => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
              </div>
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

      {/* Liste des catégories */}
      <div className="admin-card">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold theme-text">Catégories Existantes</h2>
        </div>
        
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 theme-text-muted">Chargement...</p>
          </div>
        ) : categories.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {categories.map((category) => (
              <div key={category.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: category.color }}
                    >
                      <Hash className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold theme-text">{category.name}</h3>
                      <p className="theme-text-muted text-sm">/{category.slug}</p>
                      {category.description && (
                        <p className="theme-text-muted text-sm mt-1">{category.description}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit3 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
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
            <FolderOpen className="w-16 h-16 mx-auto mb-4 theme-text-muted opacity-50" />
            <p className="text-lg theme-text-muted">Aucune catégorie créée</p>
            <p className="theme-text-muted">Créez votre première catégorie pour organiser vos contenus</p>
          </div>
        )}
      </div>
    </div>
  )
}