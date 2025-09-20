import { useState, useRef, useEffect } from 'react'
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Link,
  Image,
  Video,
  Code,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  Eye,
  Edit3,
  Youtube,
  ExternalLink,
  Upload
} from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'

interface WysiwygEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

interface EmbedModalProps {
  isOpen: boolean
  onClose: () => void
  onEmbed: (embedCode: string) => void
  type: 'youtube' | 'video' | 'link' | 'image' | 'upload'
}

function EmbedModal({ isOpen, onClose, onEmbed, type }: EmbedModalProps) {
  const { theme } = useTheme()
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [width, setWidth] = useState('560')
  const [height, setHeight] = useState('315')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    let embedCode = ''
    
    switch (type) {
      case 'youtube':
        const youtubeId = extractYouTubeId(url)
        if (youtubeId) {
          embedCode = `<div class="video-embed youtube-embed">
  <iframe 
    width="${width}" 
    height="${height}" 
    src="https://www.youtube.com/embed/${youtubeId}" 
    title="${title || 'Vidéo YouTube'}"
    frameborder="0" 
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
    allowfullscreen>
  </iframe>
</div>`
        }
        break
      
      case 'video':
        embedCode = `<div class="video-embed">
  <video width="${width}" height="${height}" controls>
    <source src="${url}" type="video/mp4">
    Votre navigateur ne supporte pas la lecture de vidéos.
  </video>
</div>`
        break
      
      case 'image':
        embedCode = `<div class="image-embed">
  <img src="${url}" alt="${title || 'Image'}" style="max-width: 100%; height: auto;" />
  ${title ? `<p class="image-caption">${title}</p>` : ''}
</div>`
        break
      
      case 'link':
        embedCode = `<a href="${url}" target="_blank" rel="noopener noreferrer" class="external-link">
  ${title || url}
</a>`
        break
      
      case 'upload':
        // Pour l'upload, l'URL est déjà générée par l'upload
        embedCode = `<div class="image-embed">
  <img src="${url}" alt="${title || 'Image uploadée'}" style="max-width: 100%; height: auto;" />
  ${title ? `<p class="image-caption">${title}</p>` : ''}
</div>`
        break
    }
    
    if (embedCode) {
      onEmbed(embedCode)
      setUrl('')
      setTitle('')
      onClose()
    }
  }

  const extractYouTubeId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
  }

  const handleFileUpload = async (file: File) => {
    setIsUploading(true)
    setUploadError('')

    try {
      // Vérification de la taille (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Le fichier est trop volumineux. Taille maximum: 5MB')
      }

      // Vérification du type
      if (!file.type.startsWith('image/')) {
        throw new Error('Le fichier doit être une image')
      }

      // Simulation d'upload avec FileReader
      const reader = new FileReader()
      reader.onload = () => {
        setUrl(reader.result as string)
      }
      reader.onerror = () => {
        setUploadError('Erreur lors de la lecture du fichier')
      }
      reader.readAsDataURL(file)
    } catch (error: any) {
      setUploadError(error.message)
    } finally {
      setIsUploading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
        <h3 className="text-xl font-bold mb-4">
          {type === 'youtube' && 'Intégrer une vidéo YouTube'}
          {type === 'video' && 'Intégrer une vidéo'}
          {type === 'image' && 'Intégrer une image'}
          {type === 'upload' && 'Upload d\'image'}
          {type === 'link' && 'Ajouter un lien'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {type === 'upload' ? (
            /* Zone d'upload pour les images */
            <div>
              <label className="block text-sm font-medium mb-2">Sélectionner une image</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleFileUpload(file)
                  }}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    {isUploading ? 'Upload en cours...' : 'Cliquez pour sélectionner une image'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF jusqu'à 5MB</p>
                </label>
              </div>
              {uploadError && (
                <p className="text-sm text-red-600 mt-2">{uploadError}</p>
              )}
              {url && (
                <div className="mt-3">
                  <img src={url} alt="Aperçu" className="w-full h-32 object-cover rounded-lg" />
                </div>
              )}
            </div>
          ) : (
            /* Champ URL pour les autres types */
            <div>
              <label className="block text-sm font-medium mb-2">
                {type === 'youtube' ? 'URL YouTube' : type === 'link' ? 'URL du lien' : 'URL'}
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500/50 focus:border-transparent outline-none"
                placeholder={
                  type === 'youtube' ? 'https://www.youtube.com/watch?v=...' :
                  type === 'link' ? 'https://example.com' :
                  'https://example.com/media.jpg'
                }
                required
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium mb-2">
              {type === 'image' || type === 'upload' ? 'Légende (optionnel)' : 'Titre (optionnel)'}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500/50 focus:border-transparent outline-none"
              placeholder={type === 'image' || type === 'upload' ? 'Légende de l\'image' : 'Titre du contenu'}
            />
          </div>
          
          {(type === 'youtube' || type === 'video') && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Largeur</label>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500/50 focus:border-transparent outline-none"
                  min="200"
                  max="1200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Hauteur</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500/50 focus:border-transparent outline-none"
                  min="150"
                  max="800"
                />
              </div>
            </div>
          )}
          
          <div className="flex items-center space-x-3 pt-4">
            <button
              type="submit"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-white transition-all ${
                theme === 'senegalais'
                  ? 'bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800'
                  : 'bg-black hover:bg-gray-800'
              }`}
            >
              <span>Intégrer</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function WysiwygEditor({ value, onChange, placeholder = "Rédigez votre contenu...", className = "" }: WysiwygEditorProps) {
  const { theme } = useTheme()
  const editorRef = useRef<HTMLDivElement>(null)
  const [isPreview, setIsPreview] = useState(false)
  const [embedModal, setEmbedModal] = useState<{ isOpen: boolean; type: 'youtube' | 'video' | 'link' | 'image' | 'upload' | null }>({
    isOpen: false,
    type: null
  })

  // Synchroniser le contenu de l'éditeur avec la valeur
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value
    }
  }, [value])

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
    handleInput()
  }

  const insertHTML = (html: string) => {
    if (editorRef.current) {
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        range.deleteContents()
        const div = document.createElement('div')
        div.innerHTML = html
        const fragment = document.createDocumentFragment()
        while (div.firstChild) {
          fragment.appendChild(div.firstChild)
        }
        range.insertNode(fragment)
        selection.removeAllRanges()
      } else {
        editorRef.current.innerHTML += html
      }
      handleInput()
    }
  }

  const handleEmbedSubmit = (embedCode: string) => {
    insertHTML(embedCode)
  }

  const toolbarButtons = [
    { icon: Bold, command: 'bold', title: 'Gras' },
    { icon: Italic, command: 'italic', title: 'Italique' },
    { icon: Underline, command: 'underline', title: 'Souligné' },
    { icon: Heading1, command: 'formatBlock', value: 'h1', title: 'Titre 1' },
    { icon: Heading2, command: 'formatBlock', value: 'h2', title: 'Titre 2' },
    { icon: Heading3, command: 'formatBlock', value: 'h3', title: 'Titre 3' },
    { icon: List, command: 'insertUnorderedList', title: 'Liste à puces' },
    { icon: ListOrdered, command: 'insertOrderedList', title: 'Liste numérotée' },
    { icon: Quote, command: 'formatBlock', value: 'blockquote', title: 'Citation' },
    { icon: AlignLeft, command: 'justifyLeft', title: 'Aligner à gauche' },
    { icon: AlignCenter, command: 'justifyCenter', title: 'Centrer' },
    { icon: AlignRight, command: 'justifyRight', title: 'Aligner à droite' },
    { icon: Code, command: 'formatBlock', value: 'pre', title: 'Code' },
    { icon: Undo, command: 'undo', title: 'Annuler' },
    { icon: Redo, command: 'redo', title: 'Refaire' }
  ]

  const embedButtons = [
    { icon: Youtube, type: 'youtube' as const, title: 'Vidéo YouTube' },
    { icon: Video, type: 'video' as const, title: 'Vidéo' },
    { icon: Image, type: 'image' as const, title: 'Image (URL)' },
    { icon: Upload, type: 'upload' as const, title: 'Upload Image' },
    { icon: ExternalLink, type: 'link' as const, title: 'Lien externe' }
  ]

  return (
    <div className={`border border-gray-300 rounded-xl overflow-hidden ${className}`}>
      {/* Barre d'outils */}
      <div className="border-b border-gray-200 p-3 bg-gray-50">
        <div className="flex items-center space-x-1 flex-wrap gap-2">
          {/* Boutons de formatage */}
          {toolbarButtons.map((button, index) => {
            const Icon = button.icon
            return (
              <button
                key={index}
                type="button"
                onClick={() => execCommand(button.command, button.value)}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                title={button.title}
              >
                <Icon className="w-4 h-4" />
              </button>
            )
          })}
          
          {/* Séparateur */}
          <div className="w-px h-6 bg-gray-300 mx-2" />
          
          {/* Boutons d'embedding */}
          {embedButtons.map((button, index) => {
            const Icon = button.icon
            return (
              <button
                key={index}
                type="button"
                onClick={() => setEmbedModal({ isOpen: true, type: button.type })}
                className={`p-2 hover:bg-gray-200 rounded-lg transition-colors ${
                  button.type === 'youtube' ? 'text-red-600' : ''
                }`}
                title={button.title}
              >
                <Icon className="w-4 h-4" />
              </button>
            )
          })}
          
          {/* Séparateur */}
          <div className="w-px h-6 bg-gray-300 mx-2" />
          
          {/* Bouton Aperçu */}
          <button
            type="button"
            onClick={() => setIsPreview(!isPreview)}
            className={`p-2 rounded-lg transition-colors ${
              isPreview 
                ? theme === 'senegalais' 
                  ? 'bg-orange-100 text-orange-600' 
                  : 'bg-gray-200 text-gray-800'
                : 'hover:bg-gray-200'
            }`}
            title={isPreview ? 'Mode édition' : 'Aperçu'}
          >
            {isPreview ? <Edit3 className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Zone d'édition */}
      <div className="min-h-[400px]">
        {isPreview ? (
          <div 
            className="p-4 prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: value }}
            style={{
              fontFamily: 'inherit'
            }}
          />
        ) : (
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            className="p-4 min-h-[400px] outline-none focus:ring-2 focus:ring-orange-500/20 prose prose-lg max-w-none"
            style={{
              fontFamily: 'inherit'
            }}
            data-placeholder={placeholder}
            suppressContentEditableWarning={true}
          />
        )}
      </div>

      {/* Modal d'embedding */}
      <EmbedModal
        isOpen={embedModal.isOpen}
        onClose={() => setEmbedModal({ isOpen: false, type: null })}
        onEmbed={handleEmbedSubmit}
        type={embedModal.type!}
      />

      {/* Styles pour l'éditeur */}
      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
        
        .video-embed {
          margin: 1rem 0;
          text-align: center;
        }
        
        .video-embed iframe,
        .video-embed video {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
        }
        
        .image-embed {
          margin: 1rem 0;
          text-align: center;
        }
        
        .image-embed img {
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        .image-caption {
          margin-top: 0.5rem;
          font-size: 0.875rem;
          color: #6b7280;
          font-style: italic;
        }
        
        .external-link {
          color: #2563eb;
          text-decoration: underline;
        }
        
        .external-link:hover {
          color: #1d4ed8;
        }
        
        /* Styles pour le contenu de l'éditeur */
        .prose h1 {
          font-size: 2rem;
          font-weight: bold;
          margin: 1rem 0;
        }
        
        .prose h2 {
          font-size: 1.5rem;
          font-weight: bold;
          margin: 1rem 0;
        }
        
        .prose h3 {
          font-size: 1.25rem;
          font-weight: bold;
          margin: 1rem 0;
        }
        
        .prose blockquote {
          border-left: 4px solid #d1d5db;
          padding-left: 1rem;
          margin: 1rem 0;
          font-style: italic;
          color: #6b7280;
        }
        
        .prose pre {
          background-color: #f3f4f6;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          font-family: 'Courier New', monospace;
        }
        
        .prose ul, .prose ol {
          margin: 1rem 0;
          padding-left: 2rem;
        }
        
        .prose li {
          margin: 0.5rem 0;
        }
      `}</style>
    </div>
  )
}