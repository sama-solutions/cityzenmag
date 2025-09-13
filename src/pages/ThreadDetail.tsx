import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Calendar, Hash, CheckCircle, Clock, ExternalLink, AlertCircle, Presentation, Monitor } from 'lucide-react'
import { useThreadWithTweets } from '../hooks/useData'
import { TweetCard } from '../components/TweetCard'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { useState } from 'react'

export function ThreadDetail() {
  const { id } = useParams<{ id: string }>()
  const { threadData, loading, error } = useThreadWithTweets(id)
  const [presentationMode, setPresentationMode] = useState(false)

  if (loading) return <LoadingSpinner />
  if (error) return (
    <div className="text-center py-12">
      <div className="text-red-600 mb-4">
        <AlertCircle className="w-12 h-12 mx-auto mb-3" />
        <p className="text-lg font-semibold">Erreur de chargement</p>
        <p className="text-sm text-gray-600">{error}</p>
      </div>
      <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium">
        ← Retour à l'accueil
      </Link>
    </div>
  )
  if (!threadData) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getThemeColor = (theme?: string) => {
    if (!theme) return 'bg-gray-100 text-gray-800'
    
    if (theme.includes('transparence') || theme.includes('Transparence')) {
      return 'bg-blue-100 text-blue-800'
    }
    if (theme.includes('modernisation') || theme.includes('Modernisation')) {
      return 'bg-green-100 text-green-800'
    }
    if (theme.includes('constructive') || theme.includes('Constructive')) {
      return 'bg-purple-100 text-purple-800'
    }
    return 'bg-gray-100 text-gray-800'
  }

  // Sort tweets by position (1/9, 2/9, etc.)
  const sortedTweets = [...threadData.tweets].sort((a, b) => {
    const getPositionNumber = (position: string) => {
      const match = position.match(/^(\d+)\//)
      return match ? parseInt(match[1]) : 0
    }
    return getPositionNumber(a.position) - getPositionNumber(b.position)
  })

  return (
    <div className={`${presentationMode ? 'max-w-7xl' : 'max-w-4xl'} mx-auto space-y-6`}>
      {/* Navigation and Controls */}
      <div className="flex items-center justify-between">
        <Link 
          to="/" 
          className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour aux threads</span>
        </Link>
        
        {/* Presentation Mode Toggle */}
        <button
          onClick={() => setPresentationMode(!presentationMode)}
          className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
            presentationMode
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {presentationMode ? (
            <>
              <Monitor className="w-4 h-4" />
              <span>Mode Normal</span>
            </>
          ) : (
            <>
              <Presentation className="w-4 h-4" />
              <span>Mode Présentation</span>
            </>
          )}
        </button>
      </div>

      {/* Thread Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {threadData.title}
            </h1>
            
            {threadData.theme && (
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium mb-4 ${getThemeColor(threadData.theme)}`}>
                {threadData.theme}
              </span>
            )}
            
            {threadData.description && (
              <p className="text-gray-600 text-lg leading-relaxed mb-4">
                {threadData.description}
              </p>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {threadData.complete ? (
              <div className="flex items-center space-x-2 text-green-600 bg-green-50 px-4 py-2 rounded-full">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Thread complet</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-orange-600 bg-orange-50 px-4 py-2 rounded-full">
                <Clock className="w-5 h-5" />
                <span className="font-medium">Thread partiel</span>
              </div>
            )}
          </div>
        </div>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-6">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>Publié le {formatDate(threadData.date_created)}</span>
          </div>
          <div>
            <span className="font-medium">{threadData.tweets.length} tweets récupérés</span>
            {threadData.total_tweets !== threadData.tweets.length && (
              <span className="text-orange-600 ml-1">
                (sur {threadData.total_tweets} au total)
              </span>
            )}
          </div>
        </div>

        {/* Hashtags */}
        {threadData.hashtags && threadData.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {threadData.hashtags.map((hashtag, index) => (
              <span 
                key={index} 
                className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full"
              >
                <Hash className="w-3 h-3" />
                <span>{hashtag.replace('#', '')}</span>
              </span>
            ))}
          </div>
        )}

        {/* External Link */}
        <a 
          href={`https://twitter.com/loi200812`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium"
        >
          <ExternalLink className="w-4 h-4" />
          <span>Voir sur Twitter</span>
        </a>
      </div>

      {/* Tweets */}
      <div className={presentationMode ? 'space-y-8' : 'space-y-1'}>
        <div className="flex items-center justify-between">
          <h2 className={`font-semibold text-gray-900 mb-4 ${
            presentationMode ? 'text-2xl' : 'text-xl'
          }`}>
            Thread complet ({sortedTweets.length} tweets)
          </h2>
          
          {presentationMode && (
            <div className="text-sm text-gray-500 bg-blue-50 px-3 py-1 rounded-full">
              Mode Présentation Activé
            </div>
          )}
        </div>
        
        {sortedTweets.length > 0 ? (
          <div className={presentationMode ? 'space-y-8' : 'space-y-0'}>
            {sortedTweets.map((tweet, index) => (
              <div key={tweet.id} className="relative">
                {/* Connection Line - Hidden in presentation mode */}
                {!presentationMode && index < sortedTweets.length - 1 && (
                  <div className="absolute left-6 top-full w-0.5 h-4 bg-gray-200 z-10" />
                )}
                
                <TweetCard 
                  tweet={tweet} 
                  mediaFiles={threadData.media_files}
                  showBorder={presentationMode || index === 0 || index === sortedTweets.length - 1}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">
              Aucun tweet récupéré pour ce thread. La synchronisation pourrait être en cours.
            </p>
          </div>
        )}
      </div>
      
      {/* Incomplete Warning */}
      {!threadData.complete && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <Clock className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-orange-900 mb-2">Thread incomplet</h3>
              <p className="text-orange-800 text-sm leading-relaxed">
                Ce thread contient normalement {threadData.total_tweets} tweets, mais seulement {threadData.tweets.length} ont été récupérés. 
                Les tweets manquants seront ajoutés lors des prochaines synchronisations automatiques.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}