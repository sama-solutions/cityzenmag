import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon, Link as LinkIcon, Check, AlertCircle } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'

interface ImageUploaderProps {
  value: string
  onChange: (value: string) => void
  label?: string
  placeholder?: string
  className?: string
  accept?: string
  maxSize?: number // en MB
}

export function ImageUploader({ 
  value, 
  onChange, 
  label = "Image de couverture",
  placeholder = "Glissez une image ici ou cliquez pour sélectionner",
  className = "",
  accept = "image/*",
  maxSize = 5 // 5MB par défaut
}: ImageUploaderProps) {
  const { theme } = useTheme()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [uploadMode, setUploadMode] = useState<'upload' | 'url'>('upload')

  // Simulation d'upload - dans un vrai projet, ceci ferait appel à une API
  const simulateUpload = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      // Vérification de la taille
      if (file.size > maxSize * 1024 * 1024) {
        reject(new Error(`Le fichier est trop volumineux. Taille maximum: ${maxSize}MB`))
        return
      }

      // Vérification du type
      if (!file.type.startsWith('image/')) {
        reject(new Error('Le fichier doit être une image'))
        return
      }

      // Simulation d'upload avec FileReader pour créer une URL locale
      const reader = new FileReader()
      reader.onload = () => {
        // Dans un vrai projet, ici on uploadrait vers un serveur
        // et on recevrait une URL permanente
        setTimeout(() => {
          resolve(reader.result as string)
        }, 1000) // Simulation délai upload
      }
      reader.onerror = () => {
        reject(new Error('Erreur lors de la lecture du fichier'))
      }
      reader.readAsDataURL(file)
    })
  }

  const handleFileSelect = async (file: File) => {
    setIsUploading(true)
    setUploadError('')

    try {
      const imageUrl = await simulateUpload(file)
      onChange(imageUrl)
    } catch (error: any) {
      setUploadError(error.message)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleUrlSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const url = formData.get('imageUrl') as string
    if (url.trim()) {
      onChange(url.trim())
    }
  }

  const clearImage = () => {
    onChange('')
    setUploadError('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className={className}>
      <label className="block text-sm font-medium theme-text mb-2">
        {label}
      </label>

      {/* Toggle entre Upload et URL */}
      <div className="flex items-center space-x-2 mb-4">
        <button
          type="button"
          onClick={() => setUploadMode('upload')}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
            uploadMode === 'upload'
              ? theme === 'senegalais'
                ? 'bg-orange-100 text-orange-800 border border-orange-200'
                : 'bg-gray-100 text-gray-800 border border-gray-200'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>Upload</span>
        </button>
        <button
          type="button"
          onClick={() => setUploadMode('url')}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
            uploadMode === 'url'
              ? theme === 'senegalais'
                ? 'bg-orange-100 text-orange-800 border border-orange-200'
                : 'bg-gray-100 text-gray-800 border border-gray-200'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <LinkIcon className="w-4 h-4" />
          <span>URL</span>
        </button>
      </div>

      {uploadMode === 'upload' ? (
        /* Mode Upload */
        <div>
          {!value ? (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                isDragging
                  ? theme === 'senegalais'
                    ? 'border-orange-400 bg-orange-50'
                    : 'border-gray-400 bg-gray-50'
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              } ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept={accept}
                onChange={handleFileInputChange}
                className="hidden"
              />

              {isUploading ? (
                <div className="space-y-3">
                  <div className={`w-12 h-12 rounded-full border-4 border-t-transparent animate-spin mx-auto ${
                    theme === 'senegalais' ? 'border-orange-600' : 'border-gray-600'
                  }`}></div>
                  <p className="text-sm theme-text-muted">Upload en cours...</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto ${
                    theme === 'senegalais' ? 'bg-orange-100' : 'bg-gray-100'
                  }`}>
                    <Upload className={`w-6 h-6 ${
                      theme === 'senegalais' ? 'text-orange-600' : 'text-gray-600'
                    }`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium theme-text">{placeholder}</p>
                    <p className="text-xs theme-text-muted mt-1">
                      PNG, JPG, GIF jusqu'à {maxSize}MB
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Aperçu de l'image uploadée */
            <div className="relative">
              <img
                src={value}
                alt="Aperçu"
                className="w-full h-48 object-cover rounded-xl border border-gray-200"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vbiBkaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg=='
                }}
              />
              <button
                type="button"
                onClick={clearImage}
                className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-2 left-2 right-2">
                <div className="bg-black/50 text-white text-xs px-2 py-1 rounded flex items-center space-x-1">
                  <Check className="w-3 h-3" />
                  <span>Image uploadée</span>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Mode URL */
        <form onSubmit={handleUrlSubmit} className="space-y-3">
          <div className="flex space-x-2">
            <input
              name="imageUrl"
              type="url"
              defaultValue={value}
              placeholder="https://example.com/image.jpg"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500/50 focus:border-transparent outline-none"
            />
            <button
              type="submit"
              className={`px-4 py-2 rounded-lg font-medium text-white transition-all ${
                theme === 'senegalais'
                  ? 'bg-orange-600 hover:bg-orange-700'
                  : 'bg-gray-600 hover:bg-gray-700'
              }`}
            >
              Ajouter
            </button>
          </div>
          
          {value && (
            <div className="relative">
              <img
                src={value}
                alt="Aperçu"
                className="w-full h-48 object-cover rounded-xl border border-gray-200"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vbiBkaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg=='
                }}
              />
              <button
                type="button"
                onClick={clearImage}
                className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </form>
      )}

      {/* Erreur d'upload */}
      {uploadError && (
        <div className="mt-3 flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-700">{uploadError}</p>
        </div>
      )}

      {/* Aide */}
      <p className="text-xs theme-text-muted mt-2">
        {uploadMode === 'upload' 
          ? `Glissez-déposez une image ou cliquez pour sélectionner. Taille maximum: ${maxSize}MB`
          : 'Entrez l\'URL d\'une image accessible publiquement'
        }
      </p>
    </div>
  )
}