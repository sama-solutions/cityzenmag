import React from 'react'
import { Link } from 'react-router-dom'
import { 
  MessageCircle, 
  MapPin, 
  User, 
  Eye, 
  Heart, 
  Calendar,
  Star,
  Tag,
  Shield,
  Clock,
  AlertCircle,
  CheckCircle,
  Image as ImageIcon,
  FileText
} from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import type { Testimonial } from '../../types/testimonials'

interface TestimonialCardProps {
  testimonial: Testimonial
  compact?: boolean
  showModerationStatus?: boolean
}

export function TestimonialCard({ testimonial, compact = false, showModerationStatus = false }: TestimonialCardProps) {
  const { theme } = useTheme()

  const getCategoryColor = (category: string) => {
    const colors = {
      experience: theme === 'senegalais' ? 'bg-blue-100 text-blue-800' : 'bg-blue-50 text-blue-700',
      proposition: theme === 'senegalais' ? 'bg-green-100 text-green-800' : 'bg-green-50 text-green-700',
      temoignage: theme === 'senegalais' ? 'bg-purple-100 text-purple-800' : 'bg-purple-50 text-purple-700',
      question: theme === 'senegalais' ? 'bg-yellow-100 text-yellow-800' : 'bg-yellow-50 text-yellow-700',
      plainte: theme === 'senegalais' ? 'bg-red-100 text-red-800' : 'bg-red-50 text-red-700',
      suggestion: theme === 'senegalais' ? 'bg-cyan-100 text-cyan-800' : 'bg-cyan-50 text-cyan-700',
      denonciation: theme === 'senegalais' ? 'bg-orange-100 text-orange-800' : 'bg-orange-50 text-orange-700',
      felicitation: theme === 'senegalais' ? 'bg-emerald-100 text-emerald-800' : 'bg-emerald-50 text-emerald-700'
    }
    return colors[category as keyof typeof colors] || colors.temoignage
  }

  const getModerationStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      needs_review: 'bg-orange-100 text-orange-800',
      flagged: 'bg-red-100 text-red-800'
    }
    return colors[status as keyof typeof colors] || colors.pending
  }

  const getModerationIcon = (status: string) => {
    switch (status) {
      case 'approved': return CheckCircle
      case 'rejected': return AlertCircle
      case 'flagged': return AlertCircle
      case 'needs_review': return Clock
      default: return Clock
    }
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-gray-100 text-gray-600',
      medium: 'bg-blue-100 text-blue-600',
      high: 'bg-orange-100 text-orange-600',
      urgent: 'bg-red-100 text-red-600'
    }
    return colors[priority as keyof typeof colors] || colors.medium
  }

  if (compact) {
    return (
      <Link
        to={`/temoignage/${testimonial.id}`}
        className={`block p-4 rounded-xl border transition-all hover:shadow-md ${
          theme === 'senegalais'
            ? 'bg-white border-orange-200 hover:border-orange-300'
            : 'bg-white border-gray-200 hover:border-gray-300'
        }`}
      >
        <div className="flex items-start space-x-4">
          {/* Avatar ou icône */}
          <div className="flex-shrink-0">
            {testimonial.author.photo && !testimonial.author.anonymous ? (
              <img
                src={testimonial.author.photo}
                alt={testimonial.author.name}
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
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-gray-900 line-clamp-2 flex-1">
                {testimonial.title}
              </h3>
              {showModerationStatus && (
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getModerationStatusColor(testimonial.moderationStatus)}`}>
                  {testimonial.moderationStatus}
                </span>
              )}
            </div>
            
            <p className="text-gray-600 line-clamp-2 mb-2 text-sm">
              {testimonial.content}
            </p>
            
            <div className="flex items-center space-x-2 text-xs text-gray-500 mb-2">
              <span className="flex items-center space-x-1">
                <User className="w-3 h-3" />
                <span>{testimonial.author.anonymous ? 'Anonyme' : testimonial.author.name}</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <MapPin className="w-3 h-3" />
                <span>{testimonial.author.location}</span>
              </span>
            </div>
            
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span className="flex items-center space-x-1">
                <Eye className="w-3 h-3" />
                <span>{testimonial.viewCount}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Heart className="w-3 h-3" />
                <span>{testimonial.likes}</span>
              </span>
              {testimonial.responses && testimonial.responses.length > 0 && (
                <span className="flex items-center space-x-1">
                  <MessageCircle className="w-3 h-3" />
                  <span>{testimonial.responses.length}</span>
                </span>
              )}
            </div>
          </div>

          {/* Badge catégorie */}
          <div className="flex-shrink-0">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(testimonial.category)}`}>
              {testimonial.category}
            </span>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link
      to={`/temoignage/${testimonial.id}`}
      className={`block group overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
        theme === 'senegalais'
          ? 'bg-white border-orange-200 hover:border-orange-300'
          : 'bg-white border-gray-200 hover:border-gray-300'
      }`}
    >
      {/* Header avec badges */}
      <div className={`p-4 border-b ${
        theme === 'senegalais' ? 'border-orange-100' : 'border-gray-100'
      }`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(testimonial.category)}`}>
              {testimonial.category}
            </span>
            
            {testimonial.verified && (
              <div className="flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                <Shield className="w-3 h-3" />
                <span>Vérifié</span>
              </div>
            )}
            
            {testimonial.featured && (
              <div className={`p-1 rounded-full ${
                theme === 'senegalais' ? 'bg-yellow-400' : 'bg-yellow-100'
              }`}>
                <Star className={`w-3 h-3 ${
                  theme === 'senegalais' ? 'text-orange-900' : 'text-yellow-600'
                }`} />
              </div>
            )}
          </div>

          {showModerationStatus && (
            <div className="flex items-center space-x-1">
              {React.createElement(getModerationIcon(testimonial.moderationStatus), {
                className: "w-4 h-4"
              })}
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getModerationStatusColor(testimonial.moderationStatus)}`}>
                {testimonial.moderationStatus}
              </span>
            </div>
          )}
        </div>

        <h3 className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors">
          {testimonial.title}
        </h3>
      </div>

      {/* Contenu */}
      <div className="p-6 space-y-4">
        {/* Extrait du contenu */}
        <p className="text-gray-600 line-clamp-3 leading-relaxed">
          {testimonial.content}
        </p>

        {/* Média */}
        {testimonial.media && testimonial.media.length > 0 && (
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <ImageIcon className="w-4 h-4" />
            <span>{testimonial.media.length} fichier(s) joint(s)</span>
          </div>
        )}

        {/* Auteur */}
        <div className="flex items-center space-x-3">
          {testimonial.author.photo && !testimonial.author.anonymous ? (
            <img
              src={testimonial.author.photo}
              alt={testimonial.author.name}
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
            <p className="font-medium text-gray-900">
              {testimonial.author.anonymous ? 'Témoignage anonyme' : testimonial.author.name}
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <MapPin className="w-3 h-3" />
              <span>{testimonial.author.location}</span>
              {testimonial.author.age && (
                <>
                  <span>•</span>
                  <span>{testimonial.author.age} ans</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Tags */}
        {testimonial.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {testimonial.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                theme === 'senegalais'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-700'
              }`}>
                <Tag className="w-3 h-3" />
                <span>{tag}</span>
              </span>
            ))}
            {testimonial.tags.length > 3 && (
              <span className="text-xs text-gray-500">+{testimonial.tags.length - 3} autres</span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>
                {new Date(testimonial.createdAt).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </span>
            </span>
            <span className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>{testimonial.viewCount}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Heart className="w-4 h-4" />
              <span>{testimonial.likes}</span>
            </span>
            {testimonial.responses && testimonial.responses.length > 0 && (
              <span className="flex items-center space-x-1">
                <MessageCircle className="w-4 h-4" />
                <span>{testimonial.responses.length}</span>
              </span>
            )}
          </div>

          <div className={`text-sm font-medium ${
            theme === 'senegalais' ? 'text-orange-600' : 'text-gray-900'
          }`}>
            Lire →
          </div>
        </div>
      </div>
    </Link>
  )
}