import { useState, useEffect } from 'react'
import { 
  Settings, 
  Save, 
  Upload, 
  Image, 
  Type, 
  FileText, 
  Eye, 
  RefreshCw,
  X,
  Check,
  AlertCircle,
  Info
} from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { useSiteSettings, type SiteSettings } from '../../contexts/SiteSettingsContext'

export function AdminSettings() {
  const { theme } = useTheme()
  const { settings, updateSettings } = useSiteSettings()
  const [localSettings, setLocalSettings] = useState<SiteSettings>(settings)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null)

  // Synchroniser les paramètres locaux avec le contexte
  useEffect(() => {
    setLocalSettings(settings)
    setLogoPreview(settings.logo)
    setFaviconPreview(settings.favicon)
  }, [settings])

  // Sauvegarder les paramètres
  const saveSettings = async () => {
    setIsLoading(true)
    try {
      // Simulation d'une sauvegarde
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mettre à jour via le contexte
      updateSettings(localSettings)
      
      setIsSaved(true)
      setTimeout(() => setIsSaved(false), 3000)
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Gérer l'upload du logo
  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB max
        alert('Le fichier est trop volumineux. Taille maximum : 2MB')
        return
      }
      
      if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner un fichier image')
        return
      }
      
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setLogoPreview(result)
        setLocalSettings(prev => ({ ...prev, logo: result }))
      }
      reader.readAsDataURL(file)
    }
  }

  // Gérer l'upload du favicon
  const handleFaviconUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 512 * 1024) { // 512KB max pour favicon
        alert('Le fichier est trop volumineux. Taille maximum : 512KB')
        return
      }
      
      if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner un fichier image')
        return
      }
      
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setFaviconPreview(result)
        setLocalSettings(prev => ({ ...prev, favicon: result }))
      }
      reader.readAsDataURL(file)
    }
  }

  // Supprimer le logo
  const removeLogo = () => {
    setLogoPreview(null)
    setLocalSettings(prev => ({ ...prev, logo: null }))
  }

  // Supprimer le favicon
  const removeFavicon = () => {
    setFaviconPreview(null)
    setLocalSettings(prev => ({ ...prev, favicon: null }))
  }

  // Ajouter un mot-clé
  const addKeyword = (keyword: string) => {
    if (keyword.trim() && !localSettings.keywords.includes(keyword.trim())) {
      setLocalSettings(prev => ({
        ...prev,
        keywords: [...prev.keywords, keyword.trim()]
      }))
    }
  }

  // Supprimer un mot-clé
  const removeKeyword = (index: number) => {
    setLocalSettings(prev => ({
      ...prev,
      keywords: prev.keywords.filter((_, i) => i !== index)
    }))
  }

  return (
    <div className="space-y-8 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold theme-text mb-2">Paramètres du Site</h1>
          <p className="theme-text-muted text-lg">Personnalisez l'apparence et le contenu de votre site</p>
        </div>
        <div className={`p-4 rounded-2xl ${
          theme === 'senegalais' 
            ? 'bg-gradient-to-br from-orange-600 to-yellow-600' 
            : theme === 'dark'
              ? 'bg-gradient-to-br from-slate-700 to-slate-600'
              : 'bg-gray-900'
        }`}>
          <Settings className="w-8 h-8 text-white" />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all ${
              previewMode
                ? theme === 'senegalais'
                  ? 'bg-orange-600 text-white'
                  : theme === 'dark'
                    ? 'bg-slate-600 text-white'
                    : 'bg-black text-white'
                : theme === 'senegalais'
                  ? 'bg-orange-100 text-orange-800 hover:bg-orange-200'
                  : theme === 'dark'
                    ? 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>{previewMode ? 'Masquer' : 'Aperçu'}</span>
          </button>
        </div>

        <button
          onClick={saveSettings}
          disabled={isLoading}
          className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold transition-all ${
            isSaved
              ? 'bg-green-600 text-white'
              : theme === 'senegalais'
                ? 'bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white'
                : theme === 'dark'
                  ? 'bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white'
                  : 'bg-black hover:bg-gray-800 text-white'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? (
            <RefreshCw className="w-5 h-5 animate-spin" />
          ) : isSaved ? (
            <Check className="w-5 h-5" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          <span>
            {isLoading ? 'Sauvegarde...' : isSaved ? 'Sauvegardé !' : 'Sauvegarder'}
          </span>
        </button>
      </div>

      {/* Aperçu */}
      {previewMode && (
        <div className={`admin-card p-6 border-l-4 border-blue-500 ${
          theme === 'dark' ? 'bg-slate-800' : 'bg-blue-50'
        }`}>
          <div className="flex items-start space-x-3">
            <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className={`font-bold mb-4 ${
                theme === 'dark' ? 'text-blue-400' : 'text-blue-900'
              }`}>
                Aperçu de la Hero Section
              </h3>
              
              {/* Simulation de la hero section */}
              <div className={`relative overflow-hidden rounded-2xl p-8 ${
                theme === 'senegalais' 
                  ? 'bg-gradient-to-br from-orange-600 via-blue-900 to-green-700'
                  : theme === 'dark'
                    ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
                    : 'bg-gradient-to-br from-gray-900 via-black to-gray-800'
              }`}>
                <div className="text-center text-white">
                  {logoPreview && (
                    <div className="mb-6">
                      <img 
                        src={logoPreview} 
                        alt="Logo" 
                        className="w-16 h-16 mx-auto rounded-xl object-cover"
                      />
                    </div>
                  )}
                  <h1 className="text-4xl font-bold mb-4">{localSettings.heroTitle}</h1>
                  <div className={`h-2 w-32 mx-auto mb-6 rounded-full ${
                    theme === 'senegalais'
                      ? 'bg-gradient-to-r from-yellow-400 via-orange-400 to-green-400'
                      : 'bg-white'
                  }`}></div>
                  <p className="text-xl mb-4">{localSettings.heroSubtitle}</p>
                  <p className="text-lg opacity-90">{localSettings.heroDescription}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Informations générales */}
        <div className="admin-card p-6">
          <h2 className="text-2xl font-bold theme-text mb-6 flex items-center">
            <Type className="w-6 h-6 mr-3" />
            Informations Générales
          </h2>

          <div className="space-y-6">
            {/* Titre du site */}
            <div>
              <label className="block text-sm font-medium theme-text mb-2">
                Titre du site
              </label>
              <input
                type="text"
                value={localSettings.title}
                onChange={(e) => setLocalSettings(prev => ({ ...prev, title: e.target.value }))}
                placeholder="CityzenMag"
                className={`w-full px-4 py-3 border rounded-xl outline-none transition-all ${
                  theme === 'dark'
                    ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500'
                    : 'border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
                }`}
              />
            </div>

            {/* Sous-titre */}
            <div>
              <label className="block text-sm font-medium theme-text mb-2">
                Sous-titre
              </label>
              <input
                type="text"
                value={localSettings.subtitle}
                onChange={(e) => setLocalSettings(prev => ({ ...prev, subtitle: e.target.value }))}
                placeholder="Magazine Citoyen Sénégalais"
                className={`w-full px-4 py-3 border rounded-xl outline-none transition-all ${
                  theme === 'dark'
                    ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500'
                    : 'border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
                }`}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium theme-text mb-2">
                Description du site
              </label>
              <textarea
                value={localSettings.description}
                onChange={(e) => setLocalSettings(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Le magazine digital de la transparence..."
                rows={3}
                className={`w-full px-4 py-3 border rounded-xl outline-none transition-all resize-none ${
                  theme === 'dark'
                    ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500'
                    : 'border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
                }`}
              />
            </div>

            {/* Auteur */}
            <div>
              <label className="block text-sm font-medium theme-text mb-2">
                Auteur
              </label>
              <input
                type="text"
                value={localSettings.author}
                onChange={(e) => setLocalSettings(prev => ({ ...prev, author: e.target.value }))}
                placeholder="@loi200812"
                className={`w-full px-4 py-3 border rounded-xl outline-none transition-all ${
                  theme === 'dark'
                    ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500'
                    : 'border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="admin-card p-6">
          <h2 className="text-2xl font-bold theme-text mb-6 flex items-center">
            <FileText className="w-6 h-6 mr-3" />
            Hero Section
          </h2>

          <div className="space-y-6">
            {/* Titre Hero */}
            <div>
              <label className="block text-sm font-medium theme-text mb-2">
                Titre principal
              </label>
              <input
                type="text"
                value={localSettings.heroTitle}
                onChange={(e) => setLocalSettings(prev => ({ ...prev, heroTitle: e.target.value }))}
                placeholder="CityzenMag"
                className={`w-full px-4 py-3 border rounded-xl outline-none transition-all ${
                  theme === 'dark'
                    ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500'
                    : 'border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
                }`}
              />
            </div>

            {/* Sous-titre Hero */}
            <div>
              <label className="block text-sm font-medium theme-text mb-2">
                Sous-titre
              </label>
              <input
                type="text"
                value={localSettings.heroSubtitle}
                onChange={(e) => setLocalSettings(prev => ({ ...prev, heroSubtitle: e.target.value }))}
                placeholder="Magazine Citoyen Sénégalais"
                className={`w-full px-4 py-3 border rounded-xl outline-none transition-all ${
                  theme === 'dark'
                    ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500'
                    : 'border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
                }`}
              />
            </div>

            {/* Description Hero */}
            <div>
              <label className="block text-sm font-medium theme-text mb-2">
                Description
              </label>
              <textarea
                value={localSettings.heroDescription}
                onChange={(e) => setLocalSettings(prev => ({ ...prev, heroDescription: e.target.value }))}
                placeholder="Le magazine digital de la transparence et de la modernisation institutionnelle au Sénégal"
                rows={4}
                className={`w-full px-4 py-3 border rounded-xl outline-none transition-all resize-none ${
                  theme === 'dark'
                    ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500'
                    : 'border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Logo et Favicon */}
        <div className="admin-card p-6">
          <h2 className="text-2xl font-bold theme-text mb-6 flex items-center">
            <Image className="w-6 h-6 mr-3" />
            Images
          </h2>

          <div className="space-y-6">
            {/* Logo */}
            <div>
              <label className="block text-sm font-medium theme-text mb-2">
                Logo du site
              </label>
              <div className="space-y-4">
                {logoPreview && (
                  <div className="flex items-center space-x-4">
                    <img 
                      src={logoPreview} 
                      alt="Logo preview" 
                      className="w-16 h-16 object-cover rounded-xl border-2 border-gray-200"
                    />
                    <button
                      onClick={removeLogo}
                      className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <X className="w-4 h-4" />
                      <span>Supprimer</span>
                    </button>
                  </div>
                )}
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label
                    htmlFor="logo-upload"
                    className={`flex items-center justify-center space-x-2 w-full px-4 py-3 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                      theme === 'dark'
                        ? 'border-slate-600 hover:border-slate-500 bg-slate-700 text-slate-200'
                        : 'border-gray-300 hover:border-orange-400 hover:bg-orange-50'
                    }`}
                  >
                    <Upload className="w-5 h-5" />
                    <span>Choisir un logo (max 2MB)</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Favicon */}
            <div>
              <label className="block text-sm font-medium theme-text mb-2">
                Favicon
              </label>
              <div className="space-y-4">
                {faviconPreview && (
                  <div className="flex items-center space-x-4">
                    <img 
                      src={faviconPreview} 
                      alt="Favicon preview" 
                      className="w-8 h-8 object-cover rounded border-2 border-gray-200"
                    />
                    <button
                      onClick={removeFavicon}
                      className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <X className="w-4 h-4" />
                      <span>Supprimer</span>
                    </button>
                  </div>
                )}
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFaviconUpload}
                    className="hidden"
                    id="favicon-upload"
                  />
                  <label
                    htmlFor="favicon-upload"
                    className={`flex items-center justify-center space-x-2 w-full px-4 py-3 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                      theme === 'dark'
                        ? 'border-slate-600 hover:border-slate-500 bg-slate-700 text-slate-200'
                        : 'border-gray-300 hover:border-orange-400 hover:bg-orange-50'
                    }`}
                  >
                    <Upload className="w-5 h-5" />
                    <span>Choisir un favicon (max 512KB)</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mots-clés SEO */}
        <div className="admin-card p-6">
          <h2 className="text-2xl font-bold theme-text mb-6">
            Mots-clés SEO
          </h2>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {localSettings.keywords.map((keyword, index) => (
                <span
                  key={index}
                  className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
                    theme === 'senegalais'
                      ? 'bg-orange-100 text-orange-800'
                      : theme === 'dark'
                        ? 'bg-slate-700 text-slate-200'
                        : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <span>{keyword}</span>
                  <button
                    onClick={() => removeKeyword(index)}
                    className="hover:text-red-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div>
              <input
                type="text"
                placeholder="Ajouter un mot-clé (Entrée pour valider)"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addKeyword(e.currentTarget.value)
                    e.currentTarget.value = ''
                  }
                }}
                className={`w-full px-4 py-3 border rounded-xl outline-none transition-all ${
                  theme === 'dark'
                    ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500'
                    : 'border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Informations */}
      <div className={`admin-card p-6 border-l-4 border-yellow-500 ${
        theme === 'dark' ? 'bg-yellow-900/20' : 'bg-yellow-50'
      }`}>
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className={`font-bold mb-2 ${
              theme === 'dark' ? 'text-yellow-400' : 'text-yellow-900'
            }`}>
              Informations importantes
            </h3>
            <ul className={`text-sm space-y-1 ${
              theme === 'dark' ? 'text-yellow-300' : 'text-yellow-800'
            }`}>
              <li>• Les modifications sont appliquées immédiatement après sauvegarde</li>
              <li>• Le logo apparaîtra dans la hero section et l'en-tête du site</li>
              <li>• Le favicon est l'icône qui apparaît dans l'onglet du navigateur</li>
              <li>• Les mots-clés améliorent le référencement SEO de votre site</li>
              <li>• Utilisez l'aperçu pour visualiser vos modifications</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}