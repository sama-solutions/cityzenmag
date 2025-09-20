import { useState, useEffect } from 'react'
import { 
  Database, 
  Wifi, 
  WifiOff, 
  Settings, 
  Key, 
  Globe, 
  CheckCircle, 
  XCircle,
  RefreshCw,
  AlertTriangle,
  Info
} from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'

interface SupabaseConfig {
  url: string
  anonKey: string
  serviceRoleKey: string
}

interface ConnectionStatus {
  connected: boolean
  lastChecked: Date | null
  error: string | null
  latency: number | null
}

export function AdminSupabase() {
  const { theme } = useTheme()
  const [config, setConfig] = useState<SupabaseConfig>({
    url: '',
    anonKey: '',
    serviceRoleKey: ''
  })
  const [status, setStatus] = useState<ConnectionStatus>({
    connected: false,
    lastChecked: null,
    error: null,
    latency: null
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showKeys, setShowKeys] = useState(false)

  // Charger la configuration depuis localStorage
  useEffect(() => {
    const savedConfig = localStorage.getItem('cityzenmag-supabase-config')
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig)
        setConfig(parsed)
        // Tester la connexion automatiquement si config existe
        testConnection(parsed)
      } catch (error) {
        console.error('Erreur lors du chargement de la config Supabase:', error)
      }
    }
  }, [])

  const testConnection = async (configToTest = config) => {
    if (!configToTest.url || !configToTest.anonKey) {
      setStatus({
        connected: false,
        lastChecked: new Date(),
        error: 'URL et clé anonyme requis',
        latency: null
      })
      return
    }

    setIsLoading(true)
    const startTime = Date.now()

    try {
      // Test simple de connexion à Supabase
      const response = await fetch(`${configToTest.url}/rest/v1/`, {
        headers: {
          'apikey': configToTest.anonKey,
          'Authorization': `Bearer ${configToTest.anonKey}`
        }
      })

      const latency = Date.now() - startTime

      if (response.ok) {
        setStatus({
          connected: true,
          lastChecked: new Date(),
          error: null,
          latency
        })
      } else {
        setStatus({
          connected: false,
          lastChecked: new Date(),
          error: `Erreur HTTP: ${response.status}`,
          latency
        })
      }
    } catch (error: any) {
      setStatus({
        connected: false,
        lastChecked: new Date(),
        error: error.message || 'Erreur de connexion',
        latency: null
      })
    } finally {
      setIsLoading(false)
    }
  }

  const saveConfig = () => {
    localStorage.setItem('cityzenmag-supabase-config', JSON.stringify(config))
    testConnection()
  }

  const clearConfig = () => {
    setConfig({ url: '', anonKey: '', serviceRoleKey: '' })
    localStorage.removeItem('cityzenmag-supabase-config')
    setStatus({
      connected: false,
      lastChecked: null,
      error: null,
      latency: null
    })
  }

  const maskKey = (key: string) => {
    if (!key || key.length < 8) return key
    return key.substring(0, 8) + '•'.repeat(key.length - 16) + key.substring(key.length - 8)
  }

  return (
    <div className="space-y-8 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold theme-text mb-2">Configuration Supabase</h1>
          <p className="theme-text-muted text-lg">Gérez la connexion à votre base de données</p>
        </div>
        <div className={`p-4 rounded-2xl ${
          theme === 'senegalais' 
            ? 'bg-gradient-to-br from-blue-600 to-indigo-600' 
            : 'bg-gray-900'
        }`}>
          <Database className="w-8 h-8 text-white" />
        </div>
      </div>

      {/* Status de connexion */}
      <div className={`admin-card p-6 border-l-4 ${
        status.connected 
          ? 'border-green-500 bg-green-50' 
          : status.error 
            ? 'border-red-500 bg-red-50'
            : 'border-gray-300'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {status.connected ? (
              <Wifi className="w-6 h-6 text-green-600" />
            ) : (
              <WifiOff className="w-6 h-6 text-red-600" />
            )}
            <h2 className="text-xl font-bold">
              {status.connected ? 'Connecté' : 'Déconnecté'}
            </h2>
          </div>
          <button
            onClick={() => testConnection()}
            disabled={isLoading}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
              theme === 'senegalais'
                ? 'bg-orange-600 hover:bg-orange-700 text-white'
                : 'bg-gray-600 hover:bg-gray-700 text-white'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Tester</span>
          </button>
        </div>

        {status.lastChecked && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium">Dernière vérification:</span>
              <br />
              {status.lastChecked.toLocaleString('fr-FR')}
            </div>
            {status.latency && (
              <div>
                <span className="font-medium">Latence:</span>
                <br />
                {status.latency}ms
              </div>
            )}
            {status.error && (
              <div className="text-red-600">
                <span className="font-medium">Erreur:</span>
                <br />
                {status.error}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Configuration */}
      <div className="admin-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold theme-text">Configuration</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowKeys(!showKeys)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                theme === 'senegalais'
                  ? 'bg-orange-100 text-orange-800 hover:bg-orange-200'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              <Key className="w-4 h-4" />
              <span>{showKeys ? 'Masquer' : 'Afficher'} clés</span>
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* URL Supabase */}
          <div>
            <label className="block text-sm font-medium theme-text mb-2">
              URL du projet Supabase
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 theme-text-muted" />
              <input
                type="url"
                value={config.url}
                onChange={(e) => setConfig(prev => ({ ...prev, url: e.target.value }))}
                placeholder="https://votre-projet.supabase.co"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Clé anonyme */}
          <div>
            <label className="block text-sm font-medium theme-text mb-2">
              Clé publique (anon)
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 theme-text-muted" />
              <input
                type={showKeys ? "text" : "password"}
                value={config.anonKey}
                onChange={(e) => setConfig(prev => ({ ...prev, anonKey: e.target.value }))}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-transparent outline-none font-mono text-sm"
              />
            </div>
            {!showKeys && config.anonKey && (
              <p className="text-xs text-gray-500 mt-1">
                Clé masquée: {maskKey(config.anonKey)}
              </p>
            )}
          </div>

          {/* Clé service role */}
          <div>
            <label className="block text-sm font-medium theme-text mb-2">
              Clé service role (optionnel)
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 theme-text-muted" />
              <input
                type={showKeys ? "text" : "password"}
                value={config.serviceRoleKey}
                onChange={(e) => setConfig(prev => ({ ...prev, serviceRoleKey: e.target.value }))}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-transparent outline-none font-mono text-sm"
              />
            </div>
            {!showKeys && config.serviceRoleKey && (
              <p className="text-xs text-gray-500 mt-1">
                Clé masquée: {maskKey(config.serviceRoleKey)}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4 pt-4">
            <button
              onClick={saveConfig}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold transition-all ${
                theme === 'senegalais'
                  ? 'bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white'
                  : 'bg-black hover:bg-gray-800 text-white'
              }`}
            >
              <CheckCircle className="w-5 h-5" />
              <span>Sauvegarder et tester</span>
            </button>

            <button
              onClick={clearConfig}
              className="flex items-center space-x-2 px-6 py-3 border border-red-300 text-red-600 rounded-xl font-bold hover:bg-red-50 transition-all"
            >
              <XCircle className="w-5 h-5" />
              <span>Effacer</span>
            </button>
          </div>
        </div>
      </div>

      {/* Informations */}
      <div className={`admin-card p-6 border-l-4 border-blue-500 bg-blue-50`}>
        <div className="flex items-start space-x-3">
          <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-blue-900 mb-2">Informations importantes</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• La clé publique (anon) est requise pour les opérations de lecture</li>
              <li>• La clé service role permet les opérations d'administration</li>
              <li>• Les clés sont stockées localement dans votre navigateur</li>
              <li>• Testez la connexion après chaque modification</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Avertissement sécurité */}
      <div className={`admin-card p-6 border-l-4 border-yellow-500 bg-yellow-50`}>
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-yellow-900 mb-2">Sécurité</h3>
            <p className="text-sm text-yellow-800">
              Ne partagez jamais votre clé service role. Elle donne un accès complet à votre base de données.
              Utilisez uniquement la clé publique (anon) pour les opérations client.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}