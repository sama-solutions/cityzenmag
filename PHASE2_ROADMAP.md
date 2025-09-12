# 🚀 Phase 2 - Roadmap de Développement CityzenMag

## 📋 État Actuel - Phase 1 Complète ✅

### Fonctionnalités Opérationnelles
- ✅ **Extraction automatique des titres** depuis Twitter
- ✅ **Article le plus récent** intégré dans Hero section
- ✅ **Page Débats** avec Jitsi Meet
- ✅ **Page Partage d'histoires** citoyennes
- ✅ **Interface française** complète
- ✅ **Thèmes dynamiques** (sénégalais/minimaliste)
- ✅ **Design responsive** mobile/desktop
- ✅ **Navigation complète** et intuitive

### Métriques Actuelles
- **8 threads** actifs dans la base
- **72 tweets** analysés
- **72 médias** indexés
- **Build size** : 792KB optimisé
- **Performance** : Compilation < 7s

## 🎯 Phase 2 - Objectifs Prioritaires

### 1. 📊 **Layouts Avancés** (Priorité Haute)

#### A. Layout en Colonnes Thématiques
```
┌─────────────┬─────────────┬─────────────┐
│ Transparence│ Modernisation│ Démocratie │
│ - Articles  │ - Articles   │ - Articles  │
│ - Hashtags  │ - Hashtags   │ - Hashtags  │
│ - Stats     │ - Stats      │ - Stats     │
└─────────────┴─────────────┴─────────────┘
```

**Fonctionnalités** :
- Colonnes automatiques par catégorie
- Filtrage en temps réel
- Stats par colonne
- Navigation inter-colonnes

#### B. Layout Mosaïque Dynamique
```
┌─────┬───────────┬─────┐
│  A  │     B     │  C  │
├─────┼─────┬─────┼─────┤
│  D  │  E  │  F  │  G  │
├─────┴─────┼─────┴─────┤
│     H     │     I     │
└───────────┴───────────┘
```

**Fonctionnalités** :
- Tailles variables selon importance
- Algorithme de placement intelligent
- Animations fluides
- Responsive adaptatif

#### C. Layout Focus + Sidebar
```
┌─────────────────┬─────────┐
│                 │ Nav     │
│   Article       │ - Cat   │
│   Principal     │ - Tags  │
│   (Focus)       │ - Stats │
│                 │ - Reco  │
├─────────────────┼─────────┤
│ Articles liés   │ Widgets │
└─────────────────┴─────────┘
```

**Fonctionnalités** :
- Article principal mis en avant
- Sidebar contextuelle
- Recommandations intelligentes
- Widgets interactifs

### 2. 📝 **Nouveaux Types de Contenus** (Priorité Haute)

#### A. Interviews Citoyennes
```typescript
interface Interview {
  id: string
  title: string
  interviewee: {
    name: string
    role: string
    photo: string
    bio: string
  }
  questions: Question[]
  category: string
  duration: number
  publishedAt: string
  featured: boolean
}

interface Question {
  question: string
  answer: string
  timestamp?: number
  media?: MediaFile[]
}
```

**Fonctionnalités** :
- Format Q&A structuré
- Profils d'interviewés
- Catégorisation thématique
- Player audio/vidéo intégré
- Transcriptions automatiques

#### B. Reportages Photo
```typescript
interface PhotoReport {
  id: string
  title: string
  description: string
  location: {
    name: string
    coordinates: [number, number]
  }
  photographer: string
  images: ReportImage[]
  publishedAt: string
  tags: string[]
}

interface ReportImage {
  url: string
  caption: string
  order: number
  metadata: {
    camera?: string
    settings?: string
    timestamp: string
  }
}
```

**Fonctionnalités** :
- Galeries d'images immersives
- Géolocalisation interactive
- Métadonnées photographiques
- Mode plein écran
- Partage social optimisé

#### C. Vidéos Analyses
```typescript
interface VideoAnalysis {
  id: string
  title: string
  description: string
  videoUrl: string
  thumbnail: string
  duration: number
  transcript: string
  chapters: Chapter[]
  category: string
  publishedAt: string
}

interface Chapter {
  title: string
  startTime: number
  endTime: number
  description: string
}
```

**Fonctionnalités** :
- Player vidéo avancé
- Chapitres navigables
- Transcriptions synchronisées
- Annotations temporelles
- Vitesse de lecture variable

### 3. 🗄️ **Extensions Base de Données** (Priorité Moyenne)

#### Nouvelles Tables
```sql
-- Interviews
CREATE TABLE interviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  interviewee_name TEXT NOT NULL,
  interviewee_role TEXT,
  interviewee_photo TEXT,
  interviewee_bio TEXT,
  questions JSONB NOT NULL,
  category TEXT NOT NULL,
  duration INTEGER,
  audio_url TEXT,
  video_url TEXT,
  transcript TEXT,
  featured BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reportages Photo
CREATE TABLE photo_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  location_name TEXT,
  location_coordinates POINT,
  photographer TEXT NOT NULL,
  images JSONB NOT NULL,
  tags TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vidéos Analyses
CREATE TABLE video_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail TEXT,
  duration INTEGER,
  transcript TEXT,
  chapters JSONB DEFAULT '[]',
  category TEXT NOT NULL,
  view_count INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour performance
CREATE INDEX idx_interviews_category ON interviews(category);
CREATE INDEX idx_interviews_published ON interviews(published_at DESC);
CREATE INDEX idx_photo_reports_location ON photo_reports USING GIST(location_coordinates);
CREATE INDEX idx_video_analyses_category ON video_analyses(category);
```

### 4. 🎨 **Interface Admin Étendue** (Priorité Moyenne)

#### Gestion Multi-Contenus
- **Dashboard unifié** pour tous types de contenus
- **Éditeur WYSIWYG** pour interviews
- **Upload multiple** pour reportages photo
- **Intégration vidéo** avec preview
- **Planification** de publication
- **Modération** des contenus utilisateur

#### Analytics Avancées
- **Métriques d'engagement** par type de contenu
- **Heatmaps** de lecture
- **Parcours utilisateur** détaillés
- **A/B testing** des layouts
- **Rapports automatisés**

### 5. 🔍 **Fonctionnalités Interactives** (Priorité Moyenne)

#### Système de Sondages
```typescript
interface Poll {
  id: string
  question: string
  options: PollOption[]
  type: 'single' | 'multiple' | 'rating'
  endDate: string
  results: PollResults
}

interface PollOption {
  id: string
  text: string
  votes: number
}
```

#### Commentaires Modérés
- **Système de commentaires** avec modération
- **Réponses imbriquées** (threads)
- **Votes** positifs/négatifs
- **Signalement** de contenu
- **Profils utilisateur** basiques

#### Notifications Push
- **Nouveaux articles** par catégorie
- **Débats en direct** disponibles
- **Réponses** aux commentaires
- **Sondages** ouverts

### 6. 📱 **Optimisations Avancées** (Priorité Basse)

#### Performance
- **Code splitting** par route
- **Lazy loading** des images
- **Service Worker** pour cache
- **PWA** avec installation
- **Optimisation** bundle size

#### SEO & Partage
- **Métadonnées** dynamiques
- **Open Graph** optimisé
- **Schema.org** structured data
- **Sitemap** automatique
- **RSS feeds** par catégorie

## 📅 Timeline Suggérée

### Semaine 1-2 : Layouts Avancés
- [ ] Layout colonnes thématiques
- [ ] Layout mosaïque dynamique
- [ ] Layout focus + sidebar
- [ ] Tests responsive

### Semaine 3-4 : Nouveaux Contenus
- [ ] Structure interviews
- [ ] Structure reportages photo
- [ ] Structure vidéos analyses
- [ ] Interface admin étendue

### Semaine 5-6 : Base de Données
- [ ] Migration nouvelles tables
- [ ] API endpoints
- [ ] Hooks React
- [ ] Tests d'intégration

### Semaine 7-8 : Interactivité
- [ ] Système de sondages
- [ ] Commentaires modérés
- [ ] Notifications
- [ ] Analytics

### Semaine 9-10 : Optimisations
- [ ] Performance tuning
- [ ] SEO avancé
- [ ] PWA features
- [ ] Tests finaux

## 🎯 Métriques de Succès Phase 2

### Engagement
- **+50%** temps passé sur le site
- **+30%** pages vues par session
- **+25%** taux de retour

### Contenu
- **3 types** de contenus actifs
- **20+ interviews** publiées
- **10+ reportages** photo
- **5+ vidéos** analyses

### Technique
- **<2s** temps de chargement
- **>90** score Lighthouse
- **<500KB** bundle principal
- **100%** responsive

## 🚀 Prochaines Étapes Immédiates

1. **Choisir le premier layout** à implémenter
2. **Créer les composants** de base
3. **Tester** sur données existantes
4. **Itérer** selon feedback
5. **Documenter** le processus

---

**Phase 1** : ✅ Complète  
**Phase 2** : 🚀 Prête à démarrer  
**Backup** : ✅ Sauvegardé  
**Commit** : 713b093