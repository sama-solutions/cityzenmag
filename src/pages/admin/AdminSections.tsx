import { useState, useEffect } from 'react'
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Save, 
  X, 
  Layout,
  Hash,
  Palette,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Settings
} from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'

interface Section {
  id: string
  name: string
  hashtag: string
  description: string
  color: string
  gradient: string
  borderColor: string
  iconBg: string
  iconColor: string
  textColor: string
  enabled: boolean
  order: number
}

interface SectionForm {
  name: string
  hashtag: string
  description: string
  color: string
  enabled: boolean
}

const availableColors = [
  { name: 'Bleu', value: 'blue', gradient: 'from-blue-900 to-blue-800', borderColor: 'border-blue-700/30', iconBg: 'bg-yellow-400', iconColor: 'text-blue-900', textColor: 'text-blue-100' },
  { name: 'Orange', value: 'orange', gradient: 'from-orange-600 to-orange-800', borderColor: 'border-orange-500/30', iconBg: 'bg-yellow-400', iconColor: 'text-orange-900', textColor: 'text-orange-100' },
  { name: 'Jaune', value: 'yellow', gradient: 'from-yellow-600 to-yellow-800', borderColor: 'border-yellow-500/30', iconBg: 'bg-blue-900', iconColor: 'text-yellow-400', textColor: 'text-yellow-100' },
  { name: 'Vert', value: 'green', gradient: 'from-green-600 to-green-800', borderColor: 'border-green-500/30', iconBg: 'bg-yellow-400', iconColor: 'text-green-900', textColor: 'text-green-100' },
  { name: 'Rouge', value: 'red', gradient: 'from-red-600 to-red-800', borderColor: 'border-red-500/30', iconBg: 'bg-yellow-400', iconColor: 'text-red-900', textColor: 'text-red-100' },
  { name: 'Violet', value: 'purple', gradient: 'from-purple-600 to-purple-800', borderColor: 'border-purple-500/30', iconBg: 'bg-yellow-400', iconColor: 'text-purple-900', textColor: 'text-purple-100' }
]

export function AdminSections() {
  const { theme } = useTheme()
  const [sections, setSections] = useState<Section[]>([
    {
      id: 'transparence-sn',
      name: 'TransparenceSN',
      hashtag: '#TransparenceSN',
      description: 'Investigations et analyses sur la transparence des institutions sénégalaises',
      color: 'blue',
      gradient: 'from-blue-900 to-blue-800',
      borderColor: 'border-blue-700/30',
      iconBg: 'bg-yellow-400',
      iconColor: 'text-blue-900',
      textColor: 'text-blue-100',
      enabled: true,
      order: 1
    },
    {
      id: 'la-suite',
      name: 'La Suite',
      hashtag: '#LaSuite',
      description: 'Dossiers spéciaux sur la modernisation et la réforme des institutions',
      color: 'orange',
      gradient: 'from-orange-600 to-orange-800',
      borderColor: 'border-orange-500/30',
      iconBg: 'bg-yellow-400',
      iconColor: 'text-orange-900',
      textColor: 'text-orange-100',
      enabled: true,
      order: 2
    },
    {
      id: 'la-question-qui-derange',
      name: 'La Question Qui Dérange',
      hashtag: '#LaQuestionQuiDérange',
      description: 'Enquêtes citoyennes et questions constructives',
      color: 'yellow',
      gradient: 'from-yellow-600 to-yellow-800',
      borderColor: 'border-yellow-500/30',
      iconBg: 'bg-blue-900',
      iconColor: 'text-yellow-400',
      textColor: 'text-yellow-100',
      enabled: true,
      order: 3
    }
  ])
  
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<SectionForm>({
    name: '',
    hashtag: '',
    description: '',
    color: 'blue',
    enabled: true
  })
  const [formLoading, setFormLoading] = useState(false)
  const [error, setError] = useState('')

  const resetForm = () => {
    setFormData({
      name: '',
      hashtag: '',
      description: '',
      color: 'blue',
      enabled: true
    })
    setShowForm(false)
    setEditingId(null)
    setError('')
  }

  const generateId = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9à-ſ\\s-]/g, '')
      .replace(/\\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const generateHashtag = (name: string) => {
    return '#' + name.replace(/\\s+/g, '')
  }

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      hashtag: editingId ? prev.hashtag : generateHashtag(name)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormLoading(true)
    setError('')

    try {
      const colorConfig = availableColors.find(c => c.value === formData.color)!
      
      if (editingId) {
        setSections(prev => prev.map(section => 
          section.id === editingId 
            ? {
                ...section,
                name: formData.name,
                hashtag: formData.hashtag,
                description: formData.description,
                color: formData.color,
                gradient: colorConfig.gradient,
                borderColor: colorConfig.borderColor,
                iconBg: colorConfig.iconBg,
                iconColor: colorConfig.iconColor,
                textColor: colorConfig.textColor,
                enabled: formData.enabled
              }
            : section
        ))
      } else {
        const newSection: Section = {
          id: generateId(formData.name),
          name: formData.name,
          hashtag: formData.hashtag,
          description: formData.description,
          color: formData.color,
          gradient: colorConfig.gradient,
          borderColor: colorConfig.borderColor,
          iconBg: colorConfig.iconBg,
          iconColor: colorConfig.iconColor,
          textColor: colorConfig.textColor,
          enabled: formData.enabled,
          order: sections.length + 1
        }
        setSections(prev => [...prev, newSection])
      }
      resetForm()
    } catch (error: any) {
      setError(error.message || 'Erreur lors de la sauvegarde')
    } finally {
      setFormLoading(false)
    }
  }

  const handleEdit = (section: Section) => {
    setFormData({
      name: section.name,
      hashtag: section.hashtag,
      description: section.description,
      color: section.color,
      enabled: section.enabled
    })
    setEditingId(section.id)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette section ?')) {
      setSections(prev => prev.filter(section => section.id !== id))
    }
  }

  const handleToggleEnabled = (id: string) => {
    setSections(prev => prev.map(section => 
      section.id === id 
        ? { ...section, enabled: !section.enabled }
        : section
    ))
  }

  const handleMoveUp = (id: string) => {
    setSections(prev => {
      const index = prev.findIndex(s => s.id === id)
      if (index > 0) {
        const newSections = [...prev]
        const temp = newSections[index].order
        newSections[index].order = newSections[index - 1].order
        newSections[index - 1].order = temp
        return newSections.sort((a, b) => a.order - b.order)
      }
      return prev
    })
  }

  const handleMoveDown = (id: string) => {
    setSections(prev => {
      const index = prev.findIndex(s => s.id === id)
      if (index < prev.length - 1) {
        const newSections = [...prev]
        const temp = newSections[index].order
        newSections[index].order = newSections[index + 1].order
        newSections[index + 1].order = temp
        return newSections.sort((a, b) => a.order - b.order)
      }
      return prev
    })
  }

  const enabledSections = sections.filter(s => s.enabled).sort((a, b) => a.order - b.order)

  return (
    <div className="space-y-8 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold theme-text mb-2">Sections Homepage</h1>
          <p className="theme-text-muted text-lg">Configurez les sections de la page d'accueil</p>
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
          <span>Nouvelle Section</span>
        </button>
      </div>

      {/* Aperçu des sections actives */}
      <div className="admin-card p-6">
        <h2 className="text-2xl font-bold theme-text mb-6">Aperçu des Sections Actives</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {enabledSections.map((section) => (
            <div
              key={section.id}
              className={`relative bg-gradient-to-br ${section.gradient} rounded-2xl p-6 text-white shadow-lg border-4 ${section.borderColor}`}
            >
              <div className="absolute top-4 right-4 opacity-20">
                <Hash className="w-12 h-12" />
              </div>
              <div className="relative z-10">
                <div className={`w-12 h-12 ${section.iconBg} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                  <Hash className={`w-6 h-6 ${section.iconColor}`} />
                </div>
                <h3 className="text-lg font-bold mb-2">{section.hashtag}</h3>
                <p className={`${section.textColor} text-sm leading-relaxed`}>
                  {section.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        {enabledSections.length === 0 && (
          <div className="text-center py-8">
            <Layout className="w-16 h-16 mx-auto mb-4 theme-text-muted opacity-50" />
            <p className="text-lg theme-text-muted">Aucune section active</p>
            <p className="theme-text-muted">Activez au moins une section pour l'afficher sur la homepage</p>
          </div>
        )}
      </div>

      {/* Formulaire */}
      {showForm && (
        <div className="admin-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold theme-text">
              {editingId ? 'Modifier la Section' : 'Nouvelle Section'}
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
                  Nom de la section
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

              {/* Hashtag */}
              <div>
                <label className="block text-sm font-medium theme-text mb-2">
                  Hashtag
                </label>
                <input
                  type="text"
                  value={formData.hashtag}
                  onChange={(e) => setFormData(prev => ({ ...prev, hashtag: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-transparent outline-none"
                  placeholder="#TransparenceSN"
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
                placeholder="Description de la section..."
                required
              />
            </div>

            {/* Couleur */}
            <div>
              <label className="block text-sm font-medium theme-text mb-2">
                Couleur de la section
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {availableColors.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.color === color.value 
                        ? 'border-orange-500 bg-orange-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-full h-8 bg-gradient-to-r ${color.gradient} rounded-lg mb-2`}></div>
                    <p className="text-sm font-medium theme-text">{color.name}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Activé */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="enabled"
                checked={formData.enabled}
                onChange={(e) => setFormData(prev => ({ ...prev, enabled: e.target.checked }))}
                className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
              />
              <label htmlFor="enabled" className="text-sm font-medium theme-text">
                Section active sur la homepage
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

      {/* Liste des sections */}
      <div className="admin-card">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold theme-text">Toutes les Sections</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {sections.sort((a, b) => a.order - b.order).map((section, index) => (
            <div key={section.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div 
                    className={`w-12 h-12 bg-gradient-to-br ${section.gradient} rounded-xl flex items-center justify-center text-white font-bold`}
                  >
                    <Hash className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold theme-text">{section.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        section.enabled 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {section.enabled ? 'Actif' : 'Inactif'}
                      </span>
                    </div>
                    <p className="theme-text-muted text-sm">{section.hashtag}</p>
                    <p className="theme-text-muted text-sm mt-1">{section.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {/* Ordre */}
                  <div className="flex flex-col space-y-1">
                    <button
                      onClick={() => handleMoveUp(section.id)}
                      disabled={index === 0}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleMoveDown(section.id)}
                      disabled={index === sections.length - 1}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* Activer/Désactiver */}
                  <button
                    onClick={() => handleToggleEnabled(section.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      section.enabled
                        ? 'text-green-600 hover:bg-green-50'
                        : 'text-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    {section.enabled ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                  </button>
                  
                  {/* Modifier */}
                  <button
                    onClick={() => handleEdit(section)}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit3 className="w-5 h-5" />
                  </button>
                  
                  {/* Supprimer */}
                  <button
                    onClick={() => handleDelete(section.id)}
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