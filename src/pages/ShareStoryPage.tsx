import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  ArrowLeft, 
  Heart, 
  MessageCircle, 
  Share2, 
  Upload, 
  Image as ImageIcon, 
  Video, 
  Mic,
  Send,
  Eye,
  Clock,
  User,
  MapPin,
  Tag
} from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

interface Story {
  id: string
  title: string
  content: string
  author: string
  location: string
  category: string
  tags: string[]
  mediaType: 'text' | 'image' | 'video' | 'audio'
  mediaUrl?: string
  publishedAt: string
  likes: number
  comments: number
  views: number
  isVerified: boolean
}

export function ShareStoryPage() {
  const { theme } = useTheme()
  const [showForm, setShowForm] = useState(false)
  const [stories, setStories] = useState<Story[]>([
    {
      id: '1',
      title: 'Comment j\\'ai obtenu mon acte de naissance en 24h grâce à la nouvelle loi',
      content: 'Avant, il fallait des semaines pour obtenir un simple acte de naissance. Grâce aux nouvelles procédures de transparence, j\\'ai pu suivre ma demande en ligne et l\\'obtenir en une journée. Voici comment...',
      author: 'Aminata Diop',
      location: 'Dakar, Sénégal',
      category: 'administration',
      tags: ['état-civil', 'digitalisation', 'efficacité'],
      mediaType: 'text',
      publishedAt: '2025-01-10T14:30:00Z',
      likes: 24,
      comments: 8,
      views: 156,
      isVerified: true
    },
    {
      id: '2',
      title: 'Témoignage : Quand la transparence a sauvé notre projet communautaire',
      content: 'Notre association avait des difficultés avec l\\'administration locale. En utilisant la loi sur l\\'accès à l\\'information, nous avons pu débloquer notre projet de puits dans le village...',
      author: 'Moussa Sarr',
      location: 'Thiès, Sénégal',
      category: 'communaute',
      tags: ['transparence', 'développement-local', 'eau'],
      mediaType: 'image',
      mediaUrl: '/images/puits-village.jpg',
      publishedAt: '2025-01-08T09:15:00Z',
      likes: 67,
      comments: 15,
      views: 234,
      isVerified: true
    },
    {
      id: '3',
      title: 'Mon expérience avec le nouveau système de plaintes en ligne',
      content: 'J\\'ai testé le nouveau portail de réclamations citoyennes. Voici mon retour d\\'expérience et les améliorations que j\\'ai constatées...',
      author: 'Fatou Ndiaye',
      location: 'Saint-Louis, Sénégal',
      category: 'numerique',
      tags: ['e-gouvernement', 'réclamations', 'innovation'],
      mediaType: 'video',
      mediaUrl: '/videos/temoignage-portail.mp4',
      publishedAt: '2025-01-05T16:45:00Z',
      likes: 43,
      comments: 12,
      views: 189,
      isVerified: false
    }
  ])

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    location: '',
    category: 'administration',
    tags: '',
    mediaType: 'text' as 'text' | 'image' | 'video' | 'audio',
    mediaFile: null as File | null
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newStory: Story = {
      id: Date.now().toString(),
      title: formData.title,
      content: formData.content,
      author: formData.author,
      location: formData.location,
      category: formData.category,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      mediaType: formData.mediaType,
      mediaUrl: formData.mediaFile ? URL.createObjectURL(formData.mediaFile) : undefined,
      publishedAt: new Date().toISOString(),
      likes: 0,
      comments: 0,
      views: 0,
      isVerified: false
    }
    
    setStories(prev => [newStory, ...prev])
    setShowForm(false)
    setFormData({
      title: '',
      content: '',
      author: '',
      location: '',
      category: 'administration',
      tags: '',
      mediaType: 'text',
      mediaFile: null
    })
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'administration':
        return theme === 'senegalais' ? 'bg-blue-900 text-yellow-400' : 'bg-blue-600 text-white'
      case 'communaute':
        return theme === 'senegalais' ? 'bg-orange-600 text-white' : 'bg-orange-500 text-white'
      case 'numerique':
        return theme === 'senegalais' ? 'bg-yellow-600 text-blue-900' : 'bg-green-600 text-white'
      case 'justice':
        return theme === 'senegalais' ? 'bg-red-600 text-white' : 'bg-red-500 text-white'
      default:
        return 'bg-gray-600 text-white'
    }
  }

  const getMediaIcon = (mediaType: string) => {
    switch (mediaType) {
      case 'image': return <ImageIcon className=\"w-4 h-4\" />
      case 'video': return <Video className=\"w-4 h-4\" />
      case 'audio': return <Mic className=\"w-4 h-4\" />
      default: return null
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className=\"min-h-screen theme-bg\">
      {/* Header */}
      <div className={`${
        theme === 'senegalais' 
          ? 'bg-gradient-to-r from-orange-600 via-blue-900 to-yellow-600' 
          : 'bg-gray-900'
      } text-white`}>
        <div className=\"max-w-7xl mx-auto px-4 py-12\">
          <Link 
            to=\"/\" 
            className=\"inline-flex items-center space-x-2 text-white/80 hover:text-white mb-6\"
          >
            <ArrowLeft className=\"w-4 h-4\" />
            <span>Retour à l'accueil</span>
          </Link>
          
          <div className=\"text-center\">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
              theme === 'senegalais' ? 'bg-yellow-400' : 'bg-white'
            }`}>
              <Heart className={`w-10 h-10 ${
                theme === 'senegalais' ? 'text-blue-900' : 'text-gray-900'
              }`} />
            </div>
            <h1 className=\"text-4xl font-bold mb-4\">Partagez votre Histoire</h1>
            <p className=\"text-xl text-white/90 max-w-3xl mx-auto\">
              Racontez votre expérience avec l'administration sénégalaise et inspirez d'autres citoyens
            </p>
          </div>
        </div>
      </div>

      <div className=\"max-w-4xl mx-auto px-4 py-8\">
        {/* Actions */}
        <div className=\"flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8\">
          <div>
            <h2 className=\"text-2xl font-bold theme-text mb-2\">Témoignages Citoyens</h2>
            <p className=\"theme-text-muted\">Découvrez les expériences d'autres citoyens et partagez la vôtre</p>
          </div>
          
          <button
            onClick={() => setShowForm(true)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold transition-all ${
              theme === 'senegalais'
                ? 'bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white'
                : 'bg-black hover:bg-gray-800 text-white'
            }`}
          >
            <Send className=\"w-5 h-5\" />
            <span>Partager mon histoire</span>
          </button>
        </div>

        {/* Formulaire de partage */}
        {showForm && (
          <div className=\"bg-white rounded-2xl shadow-lg border p-6 mb-8\">
            <h3 className=\"text-xl font-bold mb-4\">Racontez votre expérience</h3>
            
            <form onSubmit={handleSubmit} className=\"space-y-6\">
              <div>
                <label className=\"block text-sm font-medium mb-2\">Titre de votre histoire</label>
                <input
                  type=\"text\"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className=\"w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500\"
                  placeholder=\"Ex: Comment j'ai résolu mon problème administratif\"
                  required
                />
              </div>
              
              <div>
                <label className=\"block text-sm font-medium mb-2\">Votre témoignage</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  className=\"w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500\"
                  rows={6}
                  placeholder=\"Racontez votre expérience en détail. Qu'est-ce qui s'est passé ? Comment avez-vous procédé ? Quels conseils donneriez-vous ?\"
                  required
                />
              </div>
              
              <div className=\"grid grid-cols-1 md:grid-cols-2 gap-4\">
                <div>
                  <label className=\"block text-sm font-medium mb-2\">Votre nom (ou pseudonyme)</label>
                  <input
                    type=\"text\"
                    value={formData.author}
                    onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                    className=\"w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500\"
                    placeholder=\"Ex: Aminata D.\"
                    required
                  />
                </div>
                
                <div>
                  <label className=\"block text-sm font-medium mb-2\">Localisation</label>
                  <input
                    type=\"text\"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className=\"w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500\"
                    placeholder=\"Ex: Dakar, Sénégal\"
                    required
                  />
                </div>
              </div>
              
              <div className=\"grid grid-cols-1 md:grid-cols-2 gap-4\">
                <div>
                  <label className=\"block text-sm font-medium mb-2\">Catégorie</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className=\"w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500\"
                  >
                    <option value=\"administration\">Administration</option>
                    <option value=\"communaute\">Communauté</option>
                    <option value=\"numerique\">Numérique</option>
                    <option value=\"justice\">Justice</option>
                    <option value=\"sante\">Santé</option>
                    <option value=\"education\">Éducation</option>
                  </select>
                </div>
                
                <div>
                  <label className=\"block text-sm font-medium mb-2\">Type de média</label>
                  <select
                    value={formData.mediaType}
                    onChange={(e) => setFormData(prev => ({ ...prev, mediaType: e.target.value as any }))}
                    className=\"w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500\"
                  >
                    <option value=\"text\">Texte seulement</option>
                    <option value=\"image\">Avec image</option>
                    <option value=\"video\">Avec vidéo</option>
                    <option value=\"audio\">Avec audio</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className=\"block text-sm font-medium mb-2\">Mots-clés (séparés par des virgules)</label>
                <input
                  type=\"text\"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  className=\"w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500\"
                  placeholder=\"Ex: état-civil, digitalisation, efficacité\"
                />
              </div>
              
              {formData.mediaType !== 'text' && (
                <div>
                  <label className=\"block text-sm font-medium mb-2\">
                    Fichier {formData.mediaType === 'image' ? 'image' : formData.mediaType === 'video' ? 'vidéo' : 'audio'}
                  </label>
                  <div className=\"border-2 border-dashed border-gray-300 rounded-xl p-6 text-center\">
                    <Upload className=\"w-8 h-8 mx-auto text-gray-400 mb-2\" />
                    <input
                      type=\"file\"
                      accept={
                        formData.mediaType === 'image' ? 'image/*' : 
                        formData.mediaType === 'video' ? 'video/*' : 'audio/*'
                      }
                      onChange={(e) => setFormData(prev => ({ ...prev, mediaFile: e.target.files?.[0] || null }))}
                      className=\"hidden\"
                      id=\"media-upload\"
                    />
                    <label htmlFor=\"media-upload\" className=\"cursor-pointer text-orange-600 hover:text-orange-700 font-medium\">
                      Cliquez pour sélectionner un fichier
                    </label>
                    <p className=\"text-sm text-gray-500 mt-1\">
                      {formData.mediaType === 'image' && 'JPG, PNG, GIF jusqu\\'à 10MB'}
                      {formData.mediaType === 'video' && 'MP4, MOV, AVI jusqu\\'à 100MB'}
                      {formData.mediaType === 'audio' && 'MP3, WAV, M4A jusqu\\'à 50MB'}
                    </p>
                  </div>
                </div>
              )}
              
              <div className=\"flex items-center space-x-4\">
                <button
                  type=\"submit\"
                  className=\"flex items-center space-x-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold transition-all\"
                >
                  <Send className=\"w-4 h-4\" />
                  <span>Publier mon histoire</span>
                </button>
                
                <button
                  type=\"button\"
                  onClick={() => setShowForm(false)}
                  className=\"px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all\"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Liste des histoires */}
        <div className=\"space-y-6\">
          {stories.map((story) => (
            <article key={story.id} className=\"bg-white rounded-2xl shadow-lg border overflow-hidden\">
              {/* Header */}
              <div className=\"p-6 border-b\">
                <div className=\"flex items-start justify-between mb-4\">
                  <div className=\"flex-1\">
                    <div className=\"flex items-center space-x-3 mb-3\">
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${getCategoryColor(story.category)}`}>
                        {story.category}
                      </span>
                      {story.mediaType !== 'text' && (
                        <span className=\"flex items-center space-x-1 text-gray-600 bg-gray-100 px-2 py-1 rounded-full text-sm\">
                          {getMediaIcon(story.mediaType)}
                          <span>{story.mediaType}</span>
                        </span>
                      )}
                      {story.isVerified && (
                        <span className=\"flex items-center space-x-1 text-green-600 bg-green-100 px-2 py-1 rounded-full text-sm font-medium\">
                          <div className=\"w-2 h-2 bg-green-600 rounded-full\"></div>
                          <span>Vérifié</span>
                        </span>
                      )}
                    </div>
                    <h2 className=\"text-xl font-bold text-gray-900 mb-3\">{story.title}</h2>
                    <p className=\"text-gray-700 leading-relaxed\">{story.content}</p>
                  </div>
                </div>
                
                {/* Métadonnées auteur */}
                <div className=\"flex items-center justify-between text-sm text-gray-500\">
                  <div className=\"flex items-center space-x-4\">
                    <div className=\"flex items-center space-x-1\">
                      <User className=\"w-4 h-4\" />
                      <span>{story.author}</span>
                    </div>
                    <div className=\"flex items-center space-x-1\">
                      <MapPin className=\"w-4 h-4\" />
                      <span>{story.location}</span>
                    </div>
                    <div className=\"flex items-center space-x-1\">
                      <Clock className=\"w-4 h-4\" />
                      <span>{formatDate(story.publishedAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Tags */}
              {story.tags.length > 0 && (
                <div className=\"px-6 py-3 bg-gray-50 border-b\">
                  <div className=\"flex items-center space-x-2\">
                    <Tag className=\"w-4 h-4 text-gray-500\" />
                    <div className=\"flex flex-wrap gap-2\">
                      {story.tags.map((tag, index) => (
                        <span key={index} className=\"px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-full\">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Actions */}
              <div className=\"p-6 bg-gray-50\">
                <div className=\"flex items-center justify-between\">
                  <div className=\"flex items-center space-x-6 text-sm text-gray-500\">
                    <div className=\"flex items-center space-x-1\">
                      <Eye className=\"w-4 h-4\" />
                      <span>{story.views}</span>
                    </div>
                    <button className=\"flex items-center space-x-1 hover:text-red-600 transition-colors\">
                      <Heart className=\"w-4 h-4\" />
                      <span>{story.likes}</span>
                    </button>
                    <button className=\"flex items-center space-x-1 hover:text-blue-600 transition-colors\">
                      <MessageCircle className=\"w-4 h-4\" />
                      <span>{story.comments}</span>
                    </button>
                  </div>
                  
                  <button className=\"flex items-center space-x-1 text-gray-500 hover:text-gray-700 transition-colors\">
                    <Share2 className=\"w-4 h-4\" />
                    <span>Partager</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Message si aucune histoire */}
        {stories.length === 0 && (
          <div className=\"text-center py-12\">
            <Heart className=\"w-16 h-16 mx-auto text-gray-300 mb-4\" />
            <h3 className=\"text-xl font-bold text-gray-900 mb-2\">Aucune histoire partagée</h3>
            <p className=\"text-gray-600 mb-6\">Soyez le premier à partager votre expérience !</p>
            <button
              onClick={() => setShowForm(true)}
              className=\"px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold transition-all\"
            >
              Partager mon histoire
            </button>
          </div>
        )}
      </div>
    </div>
  )
}