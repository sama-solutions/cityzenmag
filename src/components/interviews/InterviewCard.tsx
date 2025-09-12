import { Link } from 'react-router-dom'
import { 
  Clock, 
  User, 
  Play, 
  Eye, 
  Heart, 
  Calendar,
  Mic,
  Video,
  Star,
  Tag
} from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import type { Interview } from '../../types/interviews'

interface InterviewCardProps {
  interview: Interview
  compact?: boolean
}

export function InterviewCard({ interview, compact = false }: InterviewCardProps) {
  const { theme } = useTheme()

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}min`
    }
    return `${mins}min`
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      politique: theme === 'senegalais' ? 'bg-blue-100 text-blue-800' : 'bg-blue-50 text-blue-700',
      social: theme === 'senegalais' ? 'bg-green-100 text-green-800' : 'bg-green-50 text-green-700',
      economique: theme === 'senegalais' ? 'bg-yellow-100 text-yellow-800' : 'bg-yellow-50 text-yellow-700',
      culturel: theme === 'senegalais' ? 'bg-purple-100 text-purple-800' : 'bg-purple-50 text-purple-700',
      education: theme === 'senegalais' ? 'bg-indigo-100 text-indigo-800' : 'bg-indigo-50 text-indigo-700',
      sante: theme === 'senegalais' ? 'bg-red-100 text-red-800' : 'bg-red-50 text-red-700',
      environnement: theme === 'senegalais' ? 'bg-emerald-100 text-emerald-800' : 'bg-emerald-50 text-emerald-700',
      justice: theme === 'senegalais' ? 'bg-gray-100 text-gray-800' : 'bg-gray-50 text-gray-700'
    }
    return colors[category as keyof typeof colors] || colors.social
  }

  if (compact) {
    return (
      <Link
        to={`/interview/${interview.id}`}
        className={`block p-4 rounded-xl border transition-all hover:shadow-md ${
          theme === 'senegalais'
            ? 'bg-white border-orange-200 hover:border-orange-300'
            : 'bg-white border-gray-200 hover:border-gray-300'
        }`}
      >
        <div className="flex items-start space-x-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {interview.interviewee.photo ? (
              <img
                src={interview.interviewee.photo}
                alt={interview.interviewee.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                theme === 'senegalais' ? 'bg-orange-100' : 'bg-gray-100'
              }`}>
                <User className={`w-6 h-6 ${
                  theme === 'senegalais' ? 'text-orange-600' : 'text-gray-600'
                }`} />
              </div>
            )}
          </div>

          {/* Contenu */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 line-clamp-2 mb-2">
              {interview.title}
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              avec <span className="font-medium">{interview.interviewee.name}</span>
              {interview.interviewee.role && (
                <span className="text-gray-500"> • {interview.interviewee.role}</span>
              )}
            </p>
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{formatDuration(interview.duration)}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Eye className="w-3 h-3" />
                <span>{interview.viewCount}</span>
              </span>
            </div>
          </div>

          {/* Type indicator */}
          <div className="flex-shrink-0">
            {interview.videoUrl ? (
              <Video className={`w-5 h-5 ${
                theme === 'senegalais' ? 'text-orange-600' : 'text-gray-600'
              }`} />
            ) : (
              <Mic className={`w-5 h-5 ${
                theme === 'senegalais' ? 'text-orange-600' : 'text-gray-600'
              }`} />
            )}
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link
      to={`/interview/${interview.id}`}
      className={`block group overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
        theme === 'senegalais'
          ? 'bg-white border-orange-200 hover:border-orange-300'
          : 'bg-white border-gray-200 hover:border-gray-300'
      }`}
    >
      {/* Header avec thumbnail ou placeholder */}
      <div className="relative h-48 overflow-hidden">
        {interview.thumbnail ? (
          <img
            src={interview.thumbnail}
            alt={interview.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center ${
            theme === 'senegalais'
              ? 'bg-gradient-to-br from-orange-100 to-yellow-100'
              : 'bg-gradient-to-br from-gray-100 to-gray-200'
          }`}>
            <div className="text-center">
              {interview.videoUrl ? (
                <Video className={`w-16 h-16 mx-auto mb-2 ${
                  theme === 'senegalais' ? 'text-orange-600' : 'text-gray-600'
                }`} />
              ) : (
                <Mic className={`w-16 h-16 mx-auto mb-2 ${
                  theme === 'senegalais' ? 'text-orange-600' : 'text-gray-600'
                }`} />
              )}
              <p className={`text-sm font-medium ${
                theme === 'senegalais' ? 'text-orange-800' : 'text-gray-700'
              }`}>
                Interview {interview.videoUrl ? 'Vidéo' : 'Audio'}
              </p>
            </div>
          </div>
        )}

        {/* Overlay avec badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
            {/* Catégorie */}
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(interview.category)}`}>
              {interview.category}
            </span>
            
            {/* Featured badge */}
            {interview.featured && (
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
          <div className="absolute bottom-4 right-4">
            <div className={`p-3 rounded-full backdrop-blur-sm transition-all group-hover:scale-110 ${
              theme === 'senegalais'
                ? 'bg-orange-600/90 hover:bg-orange-700/90'
                : 'bg-black/70 hover:bg-black/80'
            }`}>
              <Play className="w-5 h-5 text-white fill-current" />
            </div>
          </div>

          {/* Duration */}
          <div className="absolute bottom-4 left-4">
            <div className="px-2 py-1 bg-black/70 rounded text-white text-xs font-medium">
              {formatDuration(interview.duration)}
            </div>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="p-6 space-y-4">
        {/* Titre */}
        <h3 className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors">
          {interview.title}
        </h3>

        {/* Description */}
        {interview.description && (
          <p className="text-gray-600 line-clamp-2 leading-relaxed">
            {interview.description}
          </p>
        )}

        {/* Interviewé */}
        <div className="flex items-center space-x-3">
          {interview.interviewee.photo ? (
            <img
              src={interview.interviewee.photo}
              alt={interview.interviewee.name}
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
            <p className="font-medium text-gray-900">{interview.interviewee.name}</p>
            {interview.interviewee.role && (
              <p className="text-sm text-gray-600">{interview.interviewee.role}</p>
            )}
          </div>
        </div>

        {/* Tags */}
        {interview.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {interview.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                theme === 'senegalais'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-700'
              }`}>
                <Tag className="w-3 h-3" />
                <span>{tag}</span>
              </span>
            ))}
            {interview.tags.length > 3 && (
              <span className="text-xs text-gray-500">+{interview.tags.length - 3} autres</span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>
                {new Date(interview.publishedAt).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </span>
            </span>
            <span className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>{interview.viewCount}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Heart className="w-4 h-4" />
              <span>{interview.likeCount}</span>
            </span>
          </div>

          <div className={`text-sm font-medium ${
            theme === 'senegalais' ? 'text-orange-600' : 'text-gray-900'
          }`}>
            Écouter →
          </div>
        </div>
      </div>
    </Link>
  )
}