import { useTheme } from '../contexts/ThemeContext'

interface ArticleContentProps {
  content: string
  className?: string
}

export function ArticleContent({ content, className = '' }: ArticleContentProps) {
  const { theme } = useTheme()

  return (
    <div 
      className={`prose prose-lg max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
      style={{
        fontFamily: 'inherit'
      }}
    />
  )
}

// Styles CSS pour le contenu des articles
export const articleStyles = `
  /* Styles pour les vidéos intégrées */
  .video-embed {
    margin: 2rem 0;
    text-align: center;
  }
  
  .video-embed iframe,
  .video-embed video {
    max-width: 100%;
    height: auto;
    border-radius: 12px;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }
  
  .youtube-embed iframe {
    aspect-ratio: 16/9;
    width: 100%;
    max-width: 800px;
    height: auto;
  }
  
  /* Styles pour les images intégrées */
  .image-embed {
    margin: 2rem 0;
    text-align: center;
  }
  
  .image-embed img {
    border-radius: 12px;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    max-width: 100%;
    height: auto;
  }
  
  .image-caption {
    margin-top: 1rem;
    font-size: 0.875rem;
    color: #6b7280;
    font-style: italic;
    text-align: center;
  }
  
  /* Styles pour les liens externes */
  .external-link {
    color: #2563eb;
    text-decoration: underline;
    font-weight: 500;
  }
  
  .external-link:hover {
    color: #1d4ed8;
    text-decoration: none;
  }
  
  /* Styles pour le contenu prose */
  .prose {
    color: #374151;
    line-height: 1.75;
  }
  
  .prose h1 {
    font-size: 2.25rem;
    font-weight: 800;
    margin: 2rem 0 1rem 0;
    color: #111827;
    line-height: 1.2;
  }
  
  .prose h2 {
    font-size: 1.875rem;
    font-weight: 700;
    margin: 1.75rem 0 1rem 0;
    color: #111827;
    line-height: 1.3;
  }
  
  .prose h3 {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 1.5rem 0 0.75rem 0;
    color: #111827;
    line-height: 1.4;
  }
  
  .prose p {
    margin: 1.25rem 0;
    font-size: 1.125rem;
    line-height: 1.75;
  }
  
  .prose blockquote {
    border-left: 4px solid #f59e0b;
    padding-left: 1.5rem;
    margin: 2rem 0;
    font-style: italic;
    color: #6b7280;
    background-color: #fffbeb;
    padding: 1.5rem;
    border-radius: 8px;
    font-size: 1.125rem;
  }
  
  .prose pre {
    background-color: #f3f4f6;
    padding: 1.5rem;
    border-radius: 12px;
    overflow-x: auto;
    font-family: 'Fira Code', 'Courier New', monospace;
    font-size: 0.875rem;
    line-height: 1.5;
    border: 1px solid #e5e7eb;
  }
  
  .prose code {
    background-color: #f3f4f6;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-family: 'Fira Code', 'Courier New', monospace;
    font-size: 0.875rem;
    color: #dc2626;
  }
  
  .prose ul, .prose ol {
    margin: 1.5rem 0;
    padding-left: 2rem;
  }
  
  .prose li {
    margin: 0.75rem 0;
    font-size: 1.125rem;
    line-height: 1.75;
  }
  
  .prose ul li {
    list-style-type: disc;
  }
  
  .prose ol li {
    list-style-type: decimal;
  }
  
  .prose strong {
    font-weight: 700;
    color: #111827;
  }
  
  .prose em {
    font-style: italic;
  }
  
  .prose a {
    color: #2563eb;
    text-decoration: underline;
    font-weight: 500;
  }
  
  .prose a:hover {
    color: #1d4ed8;
    text-decoration: none;
  }
  
  /* Responsive */
  @media (max-width: 768px) {
    .prose h1 {
      font-size: 1.875rem;
    }
    
    .prose h2 {
      font-size: 1.5rem;
    }
    
    .prose h3 {
      font-size: 1.25rem;
    }
    
    .prose p,
    .prose li {
      font-size: 1rem;
    }
    
    .video-embed iframe {
      height: 200px;
    }
    
    .prose blockquote {
      padding: 1rem;
      margin: 1.5rem 0;
    }
  }
  
  /* Thème sénégalais */
  .theme-senegalais .prose h1,
  .theme-senegalais .prose h2,
  .theme-senegalais .prose h3 {
    color: #ea580c;
  }
  
  .theme-senegalais .prose blockquote {
    border-left-color: #ea580c;
    background-color: #fff7ed;
  }
  
  .theme-senegalais .prose a {
    color: #ea580c;
  }
  
  .theme-senegalais .prose a:hover {
    color: #c2410c;
  }
  
  .theme-senegalais .prose strong {
    color: #ea580c;
  }
`