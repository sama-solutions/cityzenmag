import { Link } from 'react-router-dom'
import { 
  Camera, 
  MapPin, 
  User, 
  Eye, 
  Heart, 
  Calendar,
  Star,
  Tag,
  Image as ImageIcon
} from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import type { PhotoReport } from '../../types/photoReports'

interface PhotoReportCardProps {
  report: PhotoReport
  compact?: boolean
}

export function PhotoReportCard({ report, compact = false }: PhotoReportCardProps) {
  const { theme } = useTheme()

  const getCategoryColor = (category: string) => {
    const colors = {
      investigation: theme === 'senegalais' ? 'bg-red-100 text-red-800' : 'bg-red-50 text-red-700',
      social: theme === 'senegalais' ? 'bg-green-100 text-green-800' : 'bg-green-50 text-green-700',
      culture: theme === 'senegalais' ? 'bg-purple-100 text-purple-800' : 'bg-purple-50 text-purple-700',
      politique: theme === 'senegalais' ? 'bg-blue-100 text-blue-800' : 'bg-blue-50 text-blue-700',
      economique: theme === 'senegalais' ? 'bg-yellow-100 text-yellow-800' : 'bg-yellow-50 text-yellow-700',
      environnement: theme === 'senegalais' ? 'bg-emerald-100 text-emerald-800' : 'bg-emerald-50 text-emerald-700',
      portrait: theme === 'senegalais' ? 'bg-pink-100 text-pink-800' : 'bg-pink-50 text-pink-700',
      evenement: theme === 'senegalais' ? 'bg-indigo-100 text-indigo-800' : 'bg-indigo-50 text-indigo-700'
    }
    return colors[category as keyof typeof colors] || colors.social
  }

  if (compact) {
    return (
      <Link
        to={`/reportage/${report.id}`}
        className={`block p-4 rounded-xl border transition-all hover:shadow-md ${
          theme === 'senegalais'
            ? 'bg-white border-orange-200 hover:border-orange-300'
            : 'theme-surface theme-border border hover:shadow-md'
        }`}
      >
        <div className="flex items-start space-x-4">
          {/* Image de couverture */}
          <div className="flex-shrink-0">
            {report.coverImage ? (
              <img
                src={report.coverImage}
                alt={report.title}
                className="w-16 h-16 rounded-lg object-cover"
              />
            ) : (
              <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${
                theme === 'senegalais' ? 'bg-orange-100' : 'bg-gray-100'
              }`}>
                <Camera className={`w-8 h-8 ${
                  theme === 'senegalais' ? 'text-orange-600' : 'text-gray-600'
                }`} />
              </div>
            )}
          </div>

          {/* Contenu */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold theme-text line-clamp-2 mb-2">
              {report.title}
            </h3>
            <div className="flex items-center space-x-2 text-sm theme-text-muted mb-2">
              <User className="w-3 h-3" />
              <span>{report.photographer.name}</span>
              <span>•</span>
              <MapPin className="w-3 h-3" />
              <span>{report.location.name}</span>
            </div>
            <div className="flex items-center space-x-4 text-xs theme-text-muted">
              <span className="flex items-center space-x-1">
                <ImageIcon className="w-3 h-3" />
                <span>{report.images.length} photos</span>
              </span>
              <span className="flex items-center space-x-1">
                <Eye className="w-3 h-3" />
                <span>{report.viewCount}</span>
              </span>
            </div>
          </div>

          {/* Badge catégorie */}
          <div className="flex-shrink-0">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(report.category)}`}>
              {report.category}
            </span>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link
      to={`/reportage/${report.id}`}
      className={`block group overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
        theme === 'senegalais'
          ? 'bg-white border-orange-200 hover:border-orange-300'
          : 'theme-surface border theme-border hover:shadow-xl'
      }`}
    >
      {/* Image de couverture */}
      <div className="relative h-64 overflow-hidden">
        {report.coverImage ? (
          <img
            src={report.coverImage}
            alt={report.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center ${
            theme === 'senegalais'
              ? 'bg-gradient-to-br from-orange-100 to-yellow-100'
              : 'bg-gradient-to-br from-gray-100 to-gray-200'
          }`}>
            <div className="text-center">
              <Camera className={`w-16 h-16 mx-auto mb-2 ${
                theme === 'senegalais' ? 'text-orange-600' : 'theme-text-muted'
              }`} />
              <p className={`text-sm font-medium ${
                theme === 'senegalais' ? 'text-orange-800' : 'theme-text'
              }`}>
                Reportage Photo
              </p>
            </div>
          </div>
        )}

        {/* Overlay avec badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
            {/* Catégorie */}
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(report.category)}`}>
              {report.category}
            </span>
            
            {/* Featured badge */}
            {report.featured && (
              <div className={`p-2 rounded-full ${
                theme === 'senegalais' ? 'bg-yellow-400' : 'bg-white'
              }`}>
                <Star className={`w-4 h-4 ${
                  theme === 'senegalais' ? 'text-orange-900' : 'text-yellow-500'
                }`} />
              </div>
            )}
          </div>

          {/* Nombre de photos */}
          <div className="absolute bottom-4 right-4">
            <div className="px-3 py-1 bg-black/70 rounded-full text-white text-sm font-medium flex items-center space-x-1">
              <ImageIcon className="w-4 h-4" />
              <span>{report.images.length}</span>
            </div>
          </div>

          {/* Localisation */}
          <div className="absolute bottom-4 left-4">
            <div className="px-3 py-1 bg-black/70 rounded-full text-white text-sm font-medium flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>{report.location.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="p-6 space-y-4">
        {/* Titre */}
        <h3 className="text-xl font-bold theme-text line-clamp-2 group-hover:text-orange-600 transition-colors">
          {report.title}
        </h3>

        {/* Description */}
        {report.description && (
          <p className="theme-text-muted line-clamp-2 leading-relaxed">
            {report.description}
          </p>
        )}

        {/* Photographe */}
        <div className="flex items-center space-x-3">
          {report.photographer.avatar ? (
            <img
              src={report.photographer.avatar}
              alt={report.photographer.name}
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
            <p className="font-medium theme-text">{report.photographer.name}</p>
            {report.photographer.specialties && report.photographer.specialties.length > 0 && (
              <p className="text-sm theme-text-muted">{report.photographer.specialties[0]}</p>
            )}
          </div>
        </div>

        {/* Tags */}
        {report.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {report.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                theme === 'senegalais'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-700'
              }`}>
                <Tag className="w-3 h-3" />
                <span>{tag}</span>
              </span>
            ))}
            {report.tags.length > 3 && (
              <span className="text-xs theme-text-muted">+{report.tags.length - 3} autres</span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t theme-border">
          <div className="flex items-center space-x-4 text-sm theme-text-muted">
            <span className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>
                {new Date(report.publishedAt).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </span>
            </span>
            <span className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>{report.viewCount}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Heart className="w-4 h-4" />
              <span>{report.likeCount}</span>
            </span>
          </div>

          <div className={`text-sm font-medium ${
            theme === 'senegalais' ? 'text-orange-600' : 'theme-text'
          }`}>
            Voir la galerie →
          </div>
        </div>
      </div>
    </Link>
  )
}