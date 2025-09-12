import { useState, useEffect } from 'react'
import { Menu, Save, Plus, Trash2, Edit3, GripVertical, X } from 'lucide-react'
import { useAdminCategories, useAdminSettings } from '../../hooks/useAdmin'
import { useTheme } from '../../contexts/ThemeContext'

interface MenuItem {
  id: string
  label: string
  path: string
  category_id?: string
  display_order: number
  is_active: boolean
}

interface MenuForm {
  label: string
  path: string
  category_id: string
}

export function AdminMenus() {
  const { categories, loading: categoriesLoading } = useAdminCategories()
  const { getSetting, updateSetting } = useAdminSettings()
  const { theme } = useTheme()
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<MenuForm>({
    label: '',
    path: '',
    category_id: ''
  })
  const [saving, setSaving] = useState(false)

  // Initialiser les éléments de menu par défaut
  useEffect(() => {
    const defaultMenus: MenuItem[] = [
      {
        id: 'home',
        label: 'Accueil',
        path: '/',
        display_order: 1,
        is_active: true
      },
      {
        id: 'transparency',
        label: '#TransparenceSN',
        path: '/?category=transparence-sn',
        display_order: 2,
        is_active: true
      },
      {
        id: 'suite',
        label: '#LaSuite',
        path: '/?category=la-suite',
        display_order: 3,
        is_active: true
      },
      {
        id: 'question',
        label: '#LaQuestionQuiDérange',
        path: '/?category=la-question-qui-derange',
        display_order: 4,
        is_active: true
      },
      {
        id: 'search',
        label: 'Recherche',
        path: '/search',
        display_order: 5,
        is_active: true
      }
    ]
    setMenuItems(defaultMenus)
  }, [])

  const resetForm = () => {
    setFormData({ label: '', path: '', category_id: '' })
    setShowForm(false)
    setEditingId(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingId) {
      // Modifier
      setMenuItems(prev => prev.map(item => 
        item.id === editingId 
          ? { ...item, ...formData }
          : item
      ))
    } else {
      // Ajouter
      const newItem: MenuItem = {
        id: Date.now().toString(),
        ...formData,
        display_order: menuItems.length + 1,
        is_active: true
      }
      setMenuItems(prev => [...prev, newItem])
    }
    
    resetForm()
  }

  const handleEdit = (item: MenuItem) => {
    setFormData({
      label: item.label,
      path: item.path,
      category_id: item.category_id || ''
    })
    setEditingId(item.id)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet élément de menu ?')) {
      setMenuItems(prev => prev.filter(item => item.id !== id))
    }
  }

  const toggleActive = (id: string) => {
    setMenuItems(prev => prev.map(item => 
      item.id === id 
        ? { ...item, is_active: !item.is_active }
        : item
    ))
  }

  const moveUp = (id: string) => {
    setMenuItems(prev => {
      const items = [...prev]
      const index = items.findIndex(item => item.id === id)
      if (index > 0) {
        [items[index], items[index - 1]] = [items[index - 1], items[index]]
        // Réorganiser les display_order
        items.forEach((item, i) => {
          item.display_order = i + 1
        })
      }
      return items
    })
  }

  const moveDown = (id: string) => {
    setMenuItems(prev => {
      const items = [...prev]
      const index = items.findIndex(item => item.id === id)
      if (index < items.length - 1) {
        [items[index], items[index + 1]] = [items[index + 1], items[index]]
        // Réorganiser les display_order
        items.forEach((item, i) => {
          item.display_order = i + 1
        })
      }
      return items
    })
  }

  const saveMenus = async () => {
    setSaving(true)
    try {
      // Sauvegarder dans les paramètres du site
      await updateSetting('navigation_menu', JSON.stringify(menuItems))
      alert('Configuration des menus sauvegardée avec succès !')
    } catch (error: any) {
      alert('Erreur lors de la sauvegarde: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  if (categoriesLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4 theme-text-muted">Chargement...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold theme-text mb-2">Configuration des Menus</h1>
          <p className="theme-text-muted text-lg">Personnalisez la navigation de votre site</p>
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
          <span>Nouvel Élément</span>
        </button>
      </div>

      {/* Formulaire */}
      {showForm && (
        <div className="admin-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold theme-text">
              {editingId ? 'Modifier l\'Élément' : 'Nouvel Élément de Menu'}
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
              {/* Label */}
              <div>
                <label className="block text-sm font-medium theme-text mb-2">
                  Libellé du menu
                </label>
                <input
                  type="text"
                  value={formData.label}
                  onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-transparent outline-none"
                  placeholder="Ex: Accueil, #TransparenceSN..."
                  required
                />
              </div>

              {/* Path */}
              <div>
                <label className="block text-sm font-medium theme-text mb-2">
                  Chemin/URL
                </label>
                <input
                  type="text"
                  value={formData.path}
                  onChange={(e) => setFormData(prev => ({ ...prev, path: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-transparent outline-none"
                  placeholder="Ex: /, /search, /?category=..."
                  required
                />
              </div>
            </div>

            {/* Catégorie associée */}
            <div>
              <label className="block text-sm font-medium theme-text mb-2">
                Catégorie associée (optionnel)
              </label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-transparent outline-none"
              >
                <option value="">Aucune catégorie</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>

            {/* Boutons */}
            <div className="flex items-center space-x-4">
              <button
                type="submit"
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-white transition-all ${
                  theme === 'senegalais'
                    ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
                    : 'bg-green-600 hover:bg-green-700'
                } shadow-lg hover:shadow-xl`}
              >
                <Save className="w-5 h-5" />
                <span>{editingId ? 'Modifier' : 'Ajouter'}</span>
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

      {/* Liste des menus */}
      <div className="admin-card">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold theme-text">Éléments de Navigation</h2>
          <button
            onClick={saveMenus}
            disabled={saving}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-white transition-all disabled:opacity-50 ${
              theme === 'senegalais'
                ? 'bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700'
                : 'bg-blue-600 hover:bg-blue-700'
            } shadow-lg hover:shadow-xl`}
          >
            <Save className="w-5 h-5" />
            <span>{saving ? 'Sauvegarde...' : 'Sauvegarder'}</span>
          </button>
        </div>
        
        <div className="divide-y divide-gray-200">
          {menuItems.map((item, index) => (
            <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col space-y-1">
                    <button
                      onClick={() => moveUp(item.id)}
                      disabled={index === 0}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveDown(item.id)}
                      disabled={index === menuItems.length - 1}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ↓
                    </button>
                  </div>
                  <GripVertical className="w-5 h-5 text-gray-400" />
                  <div>
                    <h3 className="text-lg font-semibold theme-text">{item.label}</h3>
                    <p className="text-sm theme-text-muted">{item.path}</p>
                    {item.category_id && (
                      <p className="text-xs text-blue-600 mt-1">
                        Catégorie: {categories.find(c => c.id === item.category_id)?.name}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleActive(item.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      item.is_active 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {item.is_active ? 'Actif' : 'Inactif'}
                  </button>
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
