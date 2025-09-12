import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Lock, Mail, AlertCircle, Loader2 } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'

export function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { signIn, isAdmin, user } = useAuth()
  const { theme } = useTheme()

  // Rediriger si déjà connecté en tant qu'admin
  if (isAdmin) {
    return <Navigate to="/admin" replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await signIn(email, password)
      // La redirection se fera automatiquement via AuthContext
    } catch (error: any) {
      setError(error.message || 'Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`min-h-screen flex items-center justify-center ${
      theme === 'senegalais' 
        ? 'bg-gradient-to-br from-orange-800 via-blue-900 to-yellow-600' 
        : 'bg-gray-50'
    }`}>
      <div className="max-w-md w-full mx-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center ${
            theme === 'senegalais'
              ? 'bg-gradient-to-br from-yellow-400 to-orange-600 shadow-2xl'
              : 'bg-black'
          }`}>
            <Lock className="w-10 h-10 text-white" />
          </div>
          <h1 className={`text-3xl font-bold mb-2 ${
            theme === 'senegalais' ? 'text-white' : 'text-gray-900'
          }`}>
            Administration
          </h1>
          <p className={`text-lg ${
            theme === 'senegalais' ? 'text-yellow-200' : 'text-gray-600'
          }`}>
            CityzenMag
          </p>
        </div>

        {/* Formulaire de connexion */}
        <div className={`admin-card p-8 ${
          theme === 'minimaliste' ? 'shadow-lg' : 'shadow-2xl border-2 border-white/20'
        }`}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium theme-text mb-2">
                Adresse email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 theme-text-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all ${
                    theme === 'senegalais'
                      ? 'border-orange-300 focus:ring-orange-500/50 bg-white'
                      : 'border-gray-300 focus:ring-gray-500/50 bg-white'
                  }`}
                  placeholder="admin@cityzenmag.sn"
                  required
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div>
              <label className="block text-sm font-medium theme-text mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 theme-text-muted" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all ${
                    theme === 'senegalais'
                      ? 'border-orange-300 focus:ring-orange-500/50 bg-white'
                      : 'border-gray-300 focus:ring-gray-500/50 bg-white'
                  }`}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Erreur */}
            {error && (
              <div className="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-xl">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Bouton de connexion */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 px-6 rounded-xl font-bold text-white transition-all duration-300 flex items-center justify-center space-x-2 ${
                theme === 'senegalais'
                  ? 'bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 shadow-lg hover:shadow-xl'
                  : 'bg-black hover:bg-gray-800 shadow-lg hover:shadow-xl'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Connexion...</span>
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  <span>Se connecter</span>
                </>
              )}
            </button>
          </form>

          {/* Information */}
          <div className="mt-6 text-center">
            <p className="text-sm theme-text-muted">
              Accès réservé aux administrateurs autorisés
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}