import { Link } from 'react-router-dom'
import { 
  Play, 
  Clock, 
  User, 
  Eye, 
  Heart, 
  Calendar,
  Star,
  Tag,
  Video,
  BookOpen
} from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import type { VideoAnalysis } from '../../types/videoAnalyses'

interface VideoAnalysisCardProps {
  video: VideoAnalysis
  compact?: boolean
}

export function VideoAnalysisCard({ video, compact = false }: VideoAnalysisCardProps) {
  const { theme } = useTheme()

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      politique: theme === 'senegalais' ? 'bg-blue-100 text-blue-800' : 'bg-blue-50 text-blue-700',
      economique: theme === 'senegalais' ? 'bg-yellow-100 text-yellow-800' : 'bg-yellow-50 text-yellow-700',
      social: theme === 'senegalais' ? 'bg-green-100 text-green-800' : 'bg-green-50 text-green-700',
      juridique: theme === 'senegalais' ? 'bg-purple-100 text-purple-800' : 'bg-purple-50 text-purple-700',
      international: theme === 'senegalais' ? 'bg-indigo-100 text-indigo-800' : 'bg-indigo-50 text-indigo-700',
      education: theme === 'senegalais' ? 'bg-cyan-100 text-cyan-800' : 'bg-cyan-50 text-cyan-700',
      sante: theme === 'senegalais' ? 'bg-red-100 text-red-800' : 'bg-red-50 text-red-700',
      environnement: theme === 'senegalais' ? 'bg-emerald-100 text-emerald-800' : 'bg-emerald-50 text-emerald-700',
      technologie: theme === 'senegalais' ? 'bg-gray-100 text-gray-800' : 'bg-gray-50 text-gray-700',
      culture: theme === 'senegalais' ? 'bg-pink-100 text-pink-800' : 'bg-pink-50 text-pink-700'
    }
    return colors[category as keyof typeof colors] || colors.social
  }

  if (compact) {
    return (
      <Link
        to={`/video/${video.id}`}
        className={`block p-4 rounded-xl border transition-all hover:shadow-md ${
          theme === 'senegalais'
            ? 'bg-white border-orange-200 hover:border-orange-300'
            : 'theme-surface theme-border border hover:shadow-md'
        }`}
      >
        <div className="flex items-start space-x-4">
          {/* Thumbnail */}
          <div className="flex-shrink-0 relative">
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-20 h-12 rounded-lg object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 bg-black/70 rounded-full flex items-center justify-center">
                <Play className="w-3 h-3 text-white fill-current ml-0.5" />
              </div>
            </div>
            <div className="absolute bottom-1 right-1 px-1 py-0.5 bg-black/70 rounded text-white text-xs">
              {formatDuration(video.duration)}
            </div>
          </div>

          {/* Contenu */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold theme-text line-clamp-2 mb-2">
              {video.title}
            </h3>
            <div className="flex items-center space-x-2 text-sm theme-text-muted mb-2">
              <User className="w-3 h-3" />
              <span>{video.speaker.name}</span>
              <span>•</span>
              <span>{video.speaker.role}</span>
            </div>
            <div className="flex items-center space-x-4 text-xs theme-text-muted">
              <span className="flex items-center space-x-1">
                <BookOpen className="w-3 h-3" />
                <span>{video.chapters.length} chapitres</span>
              </span>
              <span className="flex items-center space-x-1">
                <Eye className="w-3 h-3" />
                <span>{video.viewCount}</span>
              </span>
            </div>
          </div>

          {/* Badge catégorie */}
          <div className="flex-shrink-0">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(video.category)}`}>
              {video.category}
            </span>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link
      to={`/video/${video.id}`}
      className={`block group overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
        theme === 'senegalais'
          ? 'bg-white border-orange-200 hover:border-orange-300'
          : 'theme-surface border theme-border hover:shadow-xl'
      }`}
    >
      {/* Thumbnail avec overlay */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Overlay avec badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
            {/* Catégorie */}
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(video.category)}`}>
              {video.category}
            </span>
            
            {/* Featured badge */}
            {video.featured && (
              <div className={`p-2 rounded-full ${
                theme === 'senegalais' ? 'bg-yellow-400' : 'bg-white'
              }`}>
                <Star className={`w-4 h-4 ${
                  theme === 'senegalais' ? 'text-orange-900' : 'text-yellow-500'
                }`} />
              </div>
            )}
          </div>

          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`w-16 h-16 rounded-full backdrop-blur-sm transition-all group-hover:scale-110 flex items-center justify-center ${
              theme === 'senegalais'
                ? 'bg-orange-600/90 hover:bg-orange-700/90'
                : 'bg-black/70 hover:bg-black/80'
            }`}>
              <Play className="w-8 h-8 text-white fill-current ml-1" />
            </div>
          </div>

          {/* Durée */}
          <div className="absolute bottom-4 right-4">
            <div className="px-3 py-1 bg-black/70 rounded-full text-white text-sm font-medium">
              {formatDuration(video.duration)}
            </div>
          </div>

          {/* Nombre de chapitres */}
          <div className="absolute bottom-4 left-4">
            <div className="px-3 py-1 bg-black/70 rounded-full text-white text-sm font-medium flex items-center space-x-1">
              <BookOpen className="w-4 h-4" />
              <span>{video.chapters.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="p-6 space-y-4">
        {/* Titre */}
        <h3 className="text-xl font-bold theme-text line-clamp-2 group-hover:text-orange-600 transition-colors">
          {video.title}
        </h3>

        {/* Description */}
        {video.description && (
          <p className="theme-text-muted line-clamp-2 leading-relaxed">
            {video.description}
          </p>
        )}

        {/* Speaker */}
        <div className="flex items-center space-x-3">
          {video.speaker.photo ? (
            <img
              src={video.speaker.photo}
              alt={video.speaker.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              theme === 'senegalais' ? 'bg-orange-100' : 'bg-gray-100'
            }`}>
              <User className={`w-5 h-5 ${
                theme === 'senegalais' ? 'text-orange-600' : 'text-gray-600'
              }`} />
            </div>
          )}
          <div>
            <p className="font-medium theme-text">{video.speaker.name}</p>
            <p className="text-sm theme-text-muted">{video.speaker.role}</p>
          </div>
        </div>

        {/* Tags */}
        {video.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {video.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                theme === 'senegalais'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-700'
              }`}>
                <Tag className="w-3 h-3" />
                <span>{tag}</span>
              </span>
            ))}
            {video.tags.length > 3 && (
              <span className="text-xs theme-text-muted">+{video.tags.length - 3} autres</span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t theme-border">
          <div className="flex items-center space-x-4 text-sm theme-text-muted">
            <span className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>
                {new Date(video.publishedAt).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </span>
            </span>
            <span className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>{video.viewCount}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Heart className="w-4 h-4" />
              <span>{video.likeCount}</span>
            </span>
          </div>

          <div className={`text-sm font-medium ${
            theme === 'senegalais' ? 'text-orange-600' : 'theme-text'
          }`}>
            Regarder →
          </div>
        </div>
      </div>
    </Link>
  )
}