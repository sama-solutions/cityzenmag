import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Video, 
  Users, 
  Calendar, 
  Clock, 
  ArrowLeft, 
  Play, 
  Square, 
  Mic, 
  MicOff,
  Camera,
  CameraOff,
  Settings,
  Share2,
  MessageCircle
} from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

interface DebateRoom {
  id: string
  title: string
  description: string
  host: string
  participants: number
  maxParticipants: number
  isLive: boolean
  startTime: string
  category: string
  tags: string[]
}

export function DebatePage() {
  const { theme } = useTheme()
  const [activeRooms, setActiveRooms] = useState<DebateRoom[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)
  const [isInMeeting, setIsInMeeting] = useState(false)
  
  // Formulaire de création de débat
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'transparence',
    maxParticipants: 10,
    scheduledTime: ''
  })

  // Données d'exemple des salles de débat
  useEffect(() => {
    setActiveRooms([
      {
        id: 'debate-1',
        title: 'Transparence dans les Marchés Publics',
        description: 'Discussion sur l\'amélioration de la transparence dans l\'attribution des marchés publics au Sénégal',
        host: 'Amadou Diallo',
        participants: 7,
        maxParticipants: 15,
        isLive: true,
        startTime: '2025-01-15T14:00:00Z',
        category: 'transparence',
        tags: ['marchés-publics', 'transparence', 'gouvernance']
      },
      {
        id: 'debate-2',
        title: 'Modernisation de l\'Administration',
        description: 'Comment digitaliser efficacement les services publics sénégalais',
        host: 'Fatou Sow',
        participants: 12,
        maxParticipants: 20,
        isLive: true,
        startTime: '2025-01-15T15:30:00Z',
        category: 'modernisation',
        tags: ['digitalisation', 'services-publics', 'innovation']
      },
      {
        id: 'debate-3',
        title: 'Participation Citoyenne et Démocratie',
        description: 'Renforcer l\'engagement citoyen dans les décisions publiques',
        host: 'Moussa Ba',
        participants: 0,
        maxParticipants: 12,
        isLive: false,
        startTime: '2025-01-15T18:00:00Z',
        category: 'democratie',
        tags: ['participation', 'citoyenneté', 'démocratie']
      }
    ])
  }, [])

  const handleCreateDebate = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newRoom: DebateRoom = {
      id: `debate-${Date.now()}`,
      title: formData.title,
      description: formData.description,
      host: 'Vous', // À remplacer par l'utilisateur connecté
      participants: 0,
      maxParticipants: formData.maxParticipants,
      isLive: false,
      startTime: formData.scheduledTime || new Date().toISOString(),
      category: formData.category,
      tags: []
    }
    
    setActiveRooms(prev => [...prev, newRoom])
    setShowCreateForm(false)
    setFormData({
      title: '',
      description: '',
      category: 'transparence',
      maxParticipants: 10,
      scheduledTime: ''
    })
  }

  const joinDebate = (roomId: string) => {
    setSelectedRoom(roomId)
    setIsInMeeting(true)
    
    // Intégration Jitsi Meet
    const domain = 'meet.jit.si'
    const options = {
      roomName: `CityzenMag_${roomId}`,
      width: '100%',
      height: 600,
      parentNode: document.querySelector('#jitsi-container'),
      configOverwrite: {
        startWithAudioMuted: true,
        startWithVideoMuted: false,
        enableWelcomePage: false,
        prejoinPageEnabled: false,
        disableModeratorIndicator: false,
        startScreenSharing: false,
        enableEmailInStats: false
      },
      interfaceConfigOverwrite: {
        TOOLBAR_BUTTONS: [
          'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
          'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
          'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
          'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
          'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone'
        ],
        SETTINGS_SECTIONS: ['devices', 'language', 'moderator', 'profile', 'calendar'],
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        SHOW_BRAND_WATERMARK: false,
        BRAND_WATERMARK_LINK: '',
        SHOW_POWERED_BY: false,
        DEFAULT_BACKGROUND: '#1a1a1a',
        DISABLE_VIDEO_BACKGROUND: false,
        INITIAL_TOOLBAR_TIMEOUT: 20000,
        TOOLBAR_TIMEOUT: 4000,
        TOOLBAR_ALWAYS_VISIBLE: false,
        DEFAULT_REMOTE_DISPLAY_NAME: 'Participant',
        DEFAULT_LOCAL_DISPLAY_NAME: 'Moi',
        SHOW_CHROME_EXTENSION_BANNER: false
      }
    }

    // @ts-ignore
    const api = new window.JitsiMeetExternalAPI(domain, options)
    
    api.addEventListener('videoConferenceJoined', () => {
      console.log('Débat rejoint avec succès')
    })
    
    api.addEventListener('videoConferenceLeft', () => {
      setIsInMeeting(false)
      setSelectedRoom(null)
    })
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'transparence':
        return theme === 'senegalais' ? 'bg-blue-900 text-yellow-400' : 'bg-blue-600 text-white'
      case 'modernisation':
        return theme === 'senegalais' ? 'bg-orange-600 text-white' : 'bg-orange-500 text-white'
      case 'democratie':
        return theme === 'senegalais' ? 'bg-yellow-600 text-blue-900' : 'bg-green-600 text-white'
      default:
        return 'bg-gray-600 text-white'
    }
  }

  if (isInMeeting) {
    return (
      <div className=\"min-h-screen bg-gray-900\">
        {/* Header du débat */}
        <div className=\"bg-white shadow-sm border-b p-4\">
          <div className=\"max-w-7xl mx-auto flex items-center justify-between\">
            <div className=\"flex items-center space-x-4\">
              <button
                onClick={() => setIsInMeeting(false)}
                className=\"flex items-center space-x-2 text-gray-600 hover:text-gray-800\"
              >
                <ArrowLeft className=\"w-5 h-5\" />
                <span>Quitter le débat</span>
              </button>
              <div>
                <h1 className=\"text-xl font-bold\">
                  {activeRooms.find(r => r.id === selectedRoom)?.title}
                </h1>
                <p className=\"text-sm text-gray-600\">
                  {activeRooms.find(r => r.id === selectedRoom)?.participants} participants
                </p>
              </div>
            </div>
            
            <div className=\"flex items-center space-x-2\">
              <span className=\"flex items-center space-x-1 text-red-600\">
                <div className=\"w-2 h-2 bg-red-600 rounded-full animate-pulse\"></div>
                <span className=\"text-sm font-medium\">EN DIRECT</span>
              </span>
            </div>
          </div>
        </div>
        
        {/* Container Jitsi */}
        <div id=\"jitsi-container\" className=\"w-full\" style={{ height: 'calc(100vh - 80px)' }}></div>
      </div>
    )
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
              <Video className={`w-10 h-10 ${
                theme === 'senegalais' ? 'text-blue-900' : 'text-gray-900'
              }`} />
            </div>
            <h1 className=\"text-4xl font-bold mb-4\">Débats Citoyens</h1>
            <p className=\"text-xl text-white/90 max-w-3xl mx-auto\">
              Participez aux débats en direct sur les enjeux de transparence et de modernisation au Sénégal
            </p>
          </div>
        </div>
      </div>

      <div className=\"max-w-7xl mx-auto px-4 py-8\">
        {/* Actions */}
        <div className=\"flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8\">
          <div>
            <h2 className=\"text-2xl font-bold theme-text mb-2\">Débats en cours et à venir</h2>
            <p className=\"theme-text-muted\">Rejoignez la conversation ou proposez un nouveau sujet</p>
          </div>
          
          <button
            onClick={() => setShowCreateForm(true)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold transition-all ${
              theme === 'senegalais'
                ? 'bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white'
                : 'bg-black hover:bg-gray-800 text-white'
            }`}
          >
            <Play className=\"w-5 h-5\" />
            <span>Proposer un débat</span>
          </button>
        </div>

        {/* Formulaire de création */}
        {showCreateForm && (
          <div className=\"bg-white rounded-2xl shadow-lg border p-6 mb-8\">
            <h3 className=\"text-xl font-bold mb-4\">Créer un nouveau débat</h3>
            
            <form onSubmit={handleCreateDebate} className=\"space-y-4\">
              <div>
                <label className=\"block text-sm font-medium mb-2\">Titre du débat</label>
                <input
                  type=\"text\"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className=\"w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500\"
                  placeholder=\"Ex: Transparence dans les marchés publics\"
                  required
                />
              </div>
              
              <div>
                <label className=\"block text-sm font-medium mb-2\">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className=\"w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500\"
                  rows={3}
                  placeholder=\"Décrivez le sujet et les points à débattre...\"
                  required
                />
              </div>
              
              <div className=\"grid grid-cols-1 md:grid-cols-2 gap-4\">
                <div>
                  <label className=\"block text-sm font-medium mb-2\">Catégorie</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className=\"w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500\"
                  >
                    <option value=\"transparence\">Transparence</option>
                    <option value=\"modernisation\">Modernisation</option>
                    <option value=\"democratie\">Démocratie</option>
                    <option value=\"economie\">Économie</option>
                    <option value=\"social\">Social</option>
                  </select>
                </div>
                
                <div>
                  <label className=\"block text-sm font-medium mb-2\">Participants max</label>
                  <input
                    type=\"number\"
                    value={formData.maxParticipants}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxParticipants: parseInt(e.target.value) }))}
                    className=\"w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500\"
                    min=\"2\"
                    max=\"50\"
                  />
                </div>
              </div>
              
              <div className=\"flex items-center space-x-4\">
                <button
                  type=\"submit\"
                  className=\"flex items-center space-x-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold transition-all\"
                >
                  <Play className=\"w-4 h-4\" />
                  <span>Créer le débat</span>
                </button>
                
                <button
                  type=\"button\"
                  onClick={() => setShowCreateForm(false)}
                  className=\"px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all\"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Liste des débats */}
        <div className=\"grid grid-cols-1 lg:grid-cols-2 gap-6\">
          {activeRooms.map((room) => (
            <div key={room.id} className=\"bg-white rounded-2xl shadow-lg border overflow-hidden\">
              {/* Header de la carte */}
              <div className=\"p-6 border-b\">
                <div className=\"flex items-start justify-between mb-4\">
                  <div className=\"flex-1\">
                    <div className=\"flex items-center space-x-3 mb-2\">
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${getCategoryColor(room.category)}`}>
                        {room.category}
                      </span>
                      {room.isLive && (
                        <span className=\"flex items-center space-x-1 text-red-600\">
                          <div className=\"w-2 h-2 bg-red-600 rounded-full animate-pulse\"></div>
                          <span className=\"text-sm font-medium\">EN DIRECT</span>
                        </span>
                      )}
                    </div>
                    <h3 className=\"text-xl font-bold text-gray-900 mb-2\">{room.title}</h3>
                    <p className=\"text-gray-600 text-sm leading-relaxed\">{room.description}</p>
                  </div>
                </div>
                
                {/* Métadonnées */}
                <div className=\"flex items-center justify-between text-sm text-gray-500\">
                  <div className=\"flex items-center space-x-4\">
                    <div className=\"flex items-center space-x-1\">
                      <Users className=\"w-4 h-4\" />
                      <span>{room.participants}/{room.maxParticipants}</span>
                    </div>
                    <div className=\"flex items-center space-x-1\">
                      <Clock className=\"w-4 h-4\" />
                      <span>{new Date(room.startTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                  <span className=\"text-gray-600\">par {room.host}</span>
                </div>
              </div>
              
              {/* Actions */}
              <div className=\"p-6 bg-gray-50\">
                <div className=\"flex items-center justify-between\">
                  <div className=\"flex items-center space-x-2\">
                    {room.tags.map((tag, index) => (
                      <span key={index} className=\"px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-full\">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className=\"flex items-center space-x-2\">
                    <button className=\"p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-all\">
                      <Share2 className=\"w-4 h-4\" />
                    </button>
                    <button className=\"p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-all\">
                      <MessageCircle className=\"w-4 h-4\" />
                    </button>
                    <button
                      onClick={() => joinDebate(room.id)}
                      disabled={room.participants >= room.maxParticipants}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-bold transition-all ${
                        room.participants >= room.maxParticipants
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : room.isLive
                          ? 'bg-red-600 hover:bg-red-700 text-white'
                          : 'bg-orange-600 hover:bg-orange-700 text-white'
                      }`}
                    >
                      <Video className=\"w-4 h-4\" />
                      <span>{room.isLive ? 'Rejoindre' : 'Programmer'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message si aucun débat */}
        {activeRooms.length === 0 && (
          <div className=\"text-center py-12\">
            <Video className=\"w-16 h-16 mx-auto text-gray-300 mb-4\" />
            <h3 className=\"text-xl font-bold text-gray-900 mb-2\">Aucun débat en cours</h3>
            <p className=\"text-gray-600 mb-6\">Soyez le premier à proposer un débat citoyen !</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className=\"px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold transition-all\"
            >
              Proposer un débat
            </button>
          </div>
        )}
      </div>

      {/* Script Jitsi Meet */}
      <script src=\"https://meet.jit.si/external_api.js\"></script>
    </div>
  )
}