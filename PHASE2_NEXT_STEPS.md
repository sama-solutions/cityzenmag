# 🎯 Phase 2 - Prochaines Étapes : Nouveaux Types de Contenus

## ✅ Layouts Avancés - COMPLÉTÉS

### Réalisations Phase 2A
- ✅ **4 Layouts opérationnels** : Grid, Columns, Focus, Mosaic
- ✅ **LayoutSelector** toujours accessible
- ✅ **Responsive design** sur tous layouts
- ✅ **Thèmes cohérents** partout
- ✅ **Performance optimisée** (893KB bundle)

## 🚀 Phase 2B - Nouveaux Types de Contenus

### 1. **Interviews Citoyennes** 🎤

#### Structure de Données
```typescript
interface Interview {
  id: string
  title: string
  interviewee: {
    name: string
    role: string
    photo: string
    bio: string
    social?: {
      twitter?: string
      linkedin?: string
    }
  }
  interviewer: string
  questions: Question[]
  category: 'politique' | 'social' | 'economique' | 'culturel'
  duration: number // en minutes
  audioUrl?: string
  videoUrl?: string
  transcript?: string
  publishedAt: string
  featured: boolean
  tags: string[]
}

interface Question {
  id: string
  question: string
  answer: string
  timestamp?: number // pour audio/vidéo
  media?: MediaFile[]
  highlights?: string[] // phrases importantes
}
```

#### Fonctionnalités
- **Format Q&A** structuré et navigable
- **Profils d'interviewés** avec photos et bios
- **Player audio/vidéo** intégré avec timestamps
- **Transcriptions** synchronisées
- **Highlights** des réponses importantes
- **Catégorisation** thématique
- **Partage** par question individuelle

#### Interface
- **Page dédiée** `/interviews`
- **Détail interview** `/interview/:id`
- **Profil interviewé** `/profile/:id`
- **Player** avec chapitres par question
- **Mode lecture** (transcript) / **Mode écoute** (audio)

### 2. **Reportages Photo** 📸

#### Structure de Données
```typescript
interface PhotoReport {
  id: string
  title: string
  description: string
  photographer: {
    name: string
    bio: string
    portfolio?: string
  }
  location: {
    name: string
    coordinates: [number, number]
    address?: string
  }
  images: ReportImage[]
  category: 'investigation' | 'social' | 'culture' | 'politique'
  publishedAt: string
  featured: boolean
  tags: string[]
}

interface ReportImage {
  id: string
  url: string
  caption: string
  order: number
  metadata: {
    camera?: string
    settings?: string
    timestamp: string
    location?: [number, number]
  }
  alt: string
}
```

#### Fonctionnalités
- **Galeries immersives** avec navigation fluide
- **Mode plein écran** avec diaporama
- **Géolocalisation** interactive (carte)
- **Métadonnées** photographiques détaillées
- **Légendes** contextuelles
- **Zoom** et navigation tactile
- **Partage** par image ou galerie complète

#### Interface
- **Page dédiée** `/reportages`
- **Galerie reportage** `/reportage/:id`
- **Mode plein écran** avec overlay
- **Carte interactive** des lieux
- **Profil photographe** avec portfolio

### 3. **Vidéos Analyses** 🎥

#### Structure de Données
```typescript
interface VideoAnalysis {
  id: string
  title: string
  description: string
  videoUrl: string
  thumbnail: string
  duration: number // en secondes
  transcript: string
  chapters: Chapter[]
  category: 'analyse' | 'debat' | 'interview' | 'reportage'
  speaker: {
    name: string
    role: string
    photo: string
  }
  publishedAt: string
  viewCount: number
  featured: boolean
  tags: string[]
}

interface Chapter {
  id: string
  title: string
  startTime: number
  endTime: number
  description: string
  thumbnail?: string
  keyPoints?: string[]
}
```

#### Fonctionnalités
- **Player vidéo** avancé avec contrôles
- **Chapitres navigables** avec timestamps
- **Transcriptions** synchronisées
- **Points clés** par chapitre
- **Vitesse de lecture** variable
- **Annotations** temporelles
- **Mode PiP** (Picture-in-Picture)

#### Interface
- **Page dédiée** `/videos`
- **Player vidéo** `/video/:id`
- **Chapitres** en sidebar
- **Transcript** synchronisé
- **Commentaires** par timestamp

### 4. **Témoignages Citoyens** 💬

#### Structure de Données
```typescript
interface Testimonial {
  id: string
  title: string
  content: string
  author: {
    name: string
    age?: number
    location: string
    occupation?: string
    photo?: string
    anonymous: boolean
  }
  category: 'experience' | 'proposition' | 'temoignage' | 'question'
  media?: MediaFile[]
  verified: boolean
  publishedAt: string
  likes: number
  responses?: Response[]
  tags: string[]
}

interface Response {
  id: string
  content: string
  author: string
  publishedAt: string
  verified: boolean
}
```

#### Fonctionnalités
- **Soumission citoyenne** avec formulaire
- **Modération** avant publication
- **Anonymisation** optionnelle
- **Vérification** des témoignages
- **Réponses** et discussions
- **Géolocalisation** (optionnelle)
- **Catégorisation** thématique

#### Interface
- **Page dédiée** `/temoignages`
- **Formulaire soumission** `/partager-temoignage`
- **Détail témoignage** `/temoignage/:id`
- **Modération admin** `/admin/temoignages`

## 🗄️ Extensions Base de Données

### Nouvelles Tables Supabase
```sql
-- Interviews
CREATE TABLE interviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  interviewee_name TEXT NOT NULL,
  interviewee_role TEXT,
  interviewee_photo TEXT,
  interviewee_bio TEXT,
  interviewer TEXT NOT NULL,
  questions JSONB NOT NULL,
  category TEXT NOT NULL,
  duration INTEGER,
  audio_url TEXT,
  video_url TEXT,
  transcript TEXT,
  featured BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  tags TEXT[] DEFAULT '{}'
);

-- Reportages Photo
CREATE TABLE photo_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  photographer_name TEXT NOT NULL,
  photographer_bio TEXT,
  location_name TEXT,
  location_coordinates POINT,
  images JSONB NOT NULL,
  category TEXT NOT NULL,
  featured BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  tags TEXT[] DEFAULT '{}'
);

-- Vidéos Analyses
CREATE TABLE video_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail TEXT,
  duration INTEGER NOT NULL,
  transcript TEXT,
  chapters JSONB DEFAULT '[]',
  category TEXT NOT NULL,
  speaker_name TEXT,
  speaker_role TEXT,
  speaker_photo TEXT,
  view_count INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  tags TEXT[] DEFAULT '{}'
);

-- Témoignages
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_name TEXT,
  author_age INTEGER,
  author_location TEXT,
  author_occupation TEXT,
  author_photo TEXT,
  anonymous BOOLEAN DEFAULT false,
  category TEXT NOT NULL,
  media JSONB DEFAULT '[]',
  verified BOOLEAN DEFAULT false,
  likes INTEGER DEFAULT 0,
  responses JSONB DEFAULT '[]',
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  tags TEXT[] DEFAULT '{}'
);

-- Index pour performance
CREATE INDEX idx_interviews_category ON interviews(category);
CREATE INDEX idx_interviews_published ON interviews(published_at DESC);
CREATE INDEX idx_photo_reports_location ON photo_reports USING GIST(location_coordinates);
CREATE INDEX idx_video_analyses_category ON video_analyses(category);
CREATE INDEX idx_testimonials_category ON testimonials(category);
CREATE INDEX idx_testimonials_verified ON testimonials(verified);
```

## 🎨 Interface Utilisateur

### Navigation Étendue
```typescript
// Nouveau menu principal
const menuItems = [
  { path: '/', label: 'Accueil', icon: Home },
  { path: '/articles', label: 'Articles', icon: FileText },
  { path: '/interviews', label: 'Interviews', icon: Mic },
  { path: '/reportages', label: 'Reportages', icon: Camera },
  { path: '/videos', label: 'Vidéos', icon: Video },
  { path: '/temoignages', label: 'Témoignages', icon: MessageCircle },
  { path: '/debats', label: 'Débats', icon: Users },
  { path: '/partager', label: 'Partager', icon: Plus }
]
```

### Pages Dédiées
- **`/interviews`** : Liste des interviews avec filtres
- **`/reportages`** : Galerie des reportages photo
- **`/videos`** : Bibliothèque vidéo avec player
- **`/temoignages`** : Témoignages citoyens
- **`/partager-interview`** : Proposer une interview
- **`/partager-reportage`** : Soumettre un reportage
- **`/partager-temoignage`** : Partager son témoignage

### Composants Spécialisés
- **`InterviewPlayer`** : Player audio/vidéo avec chapitres
- **`PhotoGallery`** : Galerie immersive responsive
- **`VideoPlayer`** : Player vidéo avec transcript
- **`TestimonialCard`** : Card témoignage avec modération
- **`MediaUploader`** : Upload multi-fichiers
- **`LocationPicker`** : Sélecteur géographique

## 🔧 Hooks et Services

### Nouveaux Hooks
```typescript
// Gestion des interviews
export const useInterviews = () => {
  // CRUD interviews + player state
}

// Gestion des reportages
export const usePhotoReports = () => {
  // CRUD reportages + galerie state
}

// Gestion des vidéos
export const useVideoAnalyses = () => {
  // CRUD vidéos + player state
}

// Gestion des témoignages
export const useTestimonials = () => {
  // CRUD témoignages + modération
}

// Upload de médias
export const useMediaUpload = () => {
  // Upload Supabase Storage + progress
}
```

### Services API
```typescript
// Services pour chaque type de contenu
export const interviewService = {
  getAll, getById, create, update, delete,
  getByCategory, getFeatured, search
}

export const photoReportService = {
  getAll, getById, create, update, delete,
  getByLocation, getByPhotographer
}

export const videoAnalysisService = {
  getAll, getById, create, update, delete,
  incrementViewCount, getChapters
}

export const testimonialService = {
  getAll, getById, create, update, delete,
  moderate, verify, addResponse
}
```

## 📱 Interface Admin Étendue

### Dashboard Multi-Contenus
- **Vue d'ensemble** : Stats tous contenus
- **Gestion interviews** : CRUD + player preview
- **Gestion reportages** : Upload + galerie
- **Gestion vidéos** : Upload + chapitrage
- **Modération témoignages** : Validation + réponses

### Outils d'Édition
- **Éditeur interview** : Q&A structuré
- **Éditeur reportage** : Upload batch + métadonnées
- **Éditeur vidéo** : Chapitrage + transcript
- **Modérateur témoignages** : Validation + anonymisation

## 📊 Timeline de Développement

### Semaine 1-2 : Interviews
- [ ] Structure de données + API
- [ ] Interface liste + détail
- [ ] Player audio/vidéo
- [ ] Admin CRUD

### Semaine 3-4 : Reportages Photo
- [ ] Structure + géolocalisation
- [ ] Galerie immersive
- [ ] Upload multi-images
- [ ] Métadonnées EXIF

### Semaine 5-6 : Vidéos Analyses
- [ ] Player avancé + chapitres
- [ ] Transcript synchronisé
- [ ] Analytics viewing
- [ ] Optimisation streaming

### Semaine 7-8 : Témoignages
- [ ] Formulaire soumission
- [ ] Système modération
- [ ] Interface publique
- [ ] Notifications

### Semaine 9-10 : Intégration
- [ ] Navigation unifiée
- [ ] Recherche globale
- [ ] Analytics cross-content
- [ ] Tests finaux

## 🎯 Objectifs Phase 2B

### Engagement
- **+60%** temps passé (contenus variés)
- **+40%** pages vues (navigation enrichie)
- **+50%** interactions (témoignages, commentaires)

### Contenu
- **20+ interviews** publiées
- **10+ reportages** photo
- **15+ vidéos** analyses
- **50+ témoignages** modérés

### Technique
- **<3s** temps de chargement
- **>95** score Lighthouse
- **PWA** features complètes
- **SEO** optimisé multi-contenus

---

**Phase 2A** : ✅ **LAYOUTS COMPLÉTÉS**  
**Phase 2B** : 🚀 **PRÊT À DÉMARRER**  
**Focus** : Nouveaux types de contenus  
**Durée** : 10 semaines  
**Objectif** : Plateforme média complète

La **Phase 2B** va transformer CityzenMag en **plateforme média complète** avec interviews, reportages, vidéos et témoignages ! 🎉