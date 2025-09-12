import type { VideoAnalysis, Speaker } from '../types/videoAnalyses'

// Speakers de démonstration
const mockSpeakers: Speaker[] = [
  {
    id: '1',
    name: 'Dr. Alioune Tine',
    role: 'Expert en Droits Humains',
    bio: 'Ancien directeur d\'Amnesty International Afrique de l\'Ouest, expert reconnu en droits humains et gouvernance démocratique.',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    organization: 'AfrikaJom Center',
    expertise: ['Droits humains', 'Démocratie', 'Gouvernance'],
    social: {
      twitter: '@alioune_tine',
      website: 'afrikajom.org'
    }
  },
  {
    id: '2',
    name: 'Pr. Fatou Sow',
    role: 'Sociologue',
    bio: 'Professeure de sociologie, spécialiste des questions de genre et de développement en Afrique.',
    photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    organization: 'UCAD',
    expertise: ['Sociologie', 'Genre', 'Développement'],
    social: {
      website: 'ucad.sn'
    }
  },
  {
    id: '3',
    name: 'Abdou Latif Coulibaly',
    role: 'Journaliste et Écrivain',
    bio: 'Journaliste d\'investigation, ancien ministre, auteur de plusieurs ouvrages sur la politique sénégalaise.',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    expertise: ['Journalisme', 'Politique', 'Investigation'],
    social: {
      twitter: '@coulibaly_al'
    }
  },
  {
    id: '4',
    name: 'Dr. Cheikh Guèye',
    role: 'Économiste',
    bio: 'Économiste du développement, expert en politiques publiques et finances locales.',
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
    organization: 'CRES',
    expertise: ['Économie', 'Développement', 'Finances publiques'],
    social: {
      website: 'cres-sn.org'
    }
  }
]

// Vidéos analyses de démonstration
export const mockVideoAnalyses: VideoAnalysis[] = [
  {
    id: '1',
    title: 'Analyse : La loi sur l\'accès à l\'information au Sénégal',
    description: 'Décryptage complet de la loi 2021-28 sur l\'accès à l\'information publique, ses avancées et ses limites.',
    videoUrl: 'https://example.com/video-1.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=640&h=360&fit=crop',
    duration: 1800, // 30 minutes
    transcript: `Bonjour et bienvenue dans cette analyse approfondie de la loi sur l'accès à l'information au Sénégal. 

Aujourd'hui, nous allons décortiquer ensemble la loi 2021-28, promulguée le 12 avril 2021, qui constitue une avancée majeure pour la transparence dans notre pays.

Cette loi, attendue depuis des années par la société civile, établit enfin un cadre juridique pour l'accès aux documents administratifs et aux informations détenues par les institutions publiques.

Mais quelles sont ses véritables portées ? Quelles sont ses limites ? Et surtout, comment peut-elle transformer la relation entre citoyens et administration ?

C'est ce que nous allons voir ensemble dans cette analyse en trois parties...`,
    chapters: [
      {
        id: '1-1',
        title: 'Introduction : Contexte et enjeux',
        startTime: 0,
        endTime: 300,
        description: 'Présentation du contexte de la loi et des enjeux de transparence au Sénégal',
        keyPoints: [
          'Historique des demandes de la société civile',
          'Comparaison avec les standards internationaux',
          'Attentes et espoirs suscités'
        ]
      },
      {
        id: '1-2',
        title: 'Analyse du contenu de la loi',
        startTime: 300,
        endTime: 1200,
        description: 'Décryptage article par article des principales dispositions',
        keyPoints: [
          'Champ d\'application de la loi',
          'Procédures de demande d\'information',
          'Délais de réponse obligatoires',
          'Exceptions et restrictions'
        ]
      },
      {
        id: '1-3',
        title: 'Mise en œuvre et défis',
        startTime: 1200,
        endTime: 1800,
        description: 'Évaluation de l\'application pratique et des obstacles rencontrés',
        keyPoints: [
          'Création de la Commission d\'accès aux documents administratifs',
          'Formation des agents publics',
          'Résistances institutionnelles',
          'Recommandations pour l\'amélioration'
        ]
      }
    ],
    category: 'juridique',
    speaker: mockSpeakers[0],
    publishedAt: '2024-01-20T15:00:00Z',
    createdAt: '2024-01-19T10:00:00Z',
    updatedAt: '2024-01-20T15:00:00Z',
    viewCount: 4560,
    likeCount: 234,
    featured: true,
    tags: ['accès information', 'transparence', 'loi', 'droits citoyens'],
    language: 'fr',
    quality: [
      {
        resolution: '720p',
        url: 'https://example.com/video-1-720p.mp4',
        fileSize: 450000000,
        bitrate: 2500
      },
      {
        resolution: '1080p',
        url: 'https://example.com/video-1-1080p.mp4',
        fileSize: 800000000,
        bitrate: 4500
      }
    ]
  },
  {
    id: '2',
    title: 'Genre et politique au Sénégal : où en sommes-nous ?',
    description: 'État des lieux de la participation politique des femmes au Sénégal et analyse des obstacles persistants.',
    videoUrl: 'https://example.com/video-2.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=640&h=360&fit=crop',
    duration: 2100, // 35 minutes
    transcript: `La question de la parité en politique reste un défi majeur au Sénégal, malgré les avancées législatives...`,
    chapters: [
      {
        id: '2-1',
        title: 'Évolution historique',
        startTime: 0,
        endTime: 600,
        description: 'Retour sur l\'évolution de la participation politique des femmes',
        keyPoints: [
          'Premières femmes en politique',
          'Loi sur la parité de 2010',
          'Résultats des dernières élections'
        ]
      },
      {
        id: '2-2',
        title: 'Obstacles culturels et sociaux',
        startTime: 600,
        endTime: 1400,
        description: 'Analyse des freins à la participation politique féminine',
        keyPoints: [
          'Pesanteurs socioculturelles',
          'Défis économiques',
          'Violence politique de genre'
        ]
      },
      {
        id: '2-3',
        title: 'Perspectives d\'avenir',
        startTime: 1400,
        endTime: 2100,
        description: 'Recommandations pour une meilleure inclusion',
        keyPoints: [
          'Renforcement des capacités',
          'Sensibilisation communautaire',
          'Réformes institutionnelles nécessaires'
        ]
      }
    ],
    category: 'social',
    speaker: mockSpeakers[1],
    publishedAt: '2024-01-18T14:00:00Z',
    createdAt: '2024-01-17T09:00:00Z',
    updatedAt: '2024-01-18T14:00:00Z',
    viewCount: 3240,
    likeCount: 187,
    featured: false,
    tags: ['genre', 'parité', 'politique', 'femmes'],
    language: 'fr',
    quality: [
      {
        resolution: '720p',
        url: 'https://example.com/video-2-720p.mp4',
        fileSize: 520000000,
        bitrate: 2500
      }
    ]
  },
  {
    id: '3',
    title: 'Corruption et gouvernance : les leçons de l\'affaire Petrotim',
    description: 'Analyse approfondie de l\'affaire Petrotim et de ses implications pour la gouvernance pétrolière au Sénégal.',
    videoUrl: 'https://example.com/video-3.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=640&h=360&fit=crop',
    duration: 2700, // 45 minutes
    transcript: `L'affaire Petrotim a marqué un tournant dans la perception de la gouvernance des ressources naturelles au Sénégal...`,
    chapters: [
      {
        id: '3-1',
        title: 'Chronologie de l\'affaire',
        startTime: 0,
        endTime: 900,
        description: 'Retour sur les faits et la chronologie des événements',
        keyPoints: [
          'Découverte des gisements',
          'Attribution des licences',
          'Révélations journalistiques'
        ]
      },
      {
        id: '3-2',
        title: 'Enjeux de gouvernance',
        startTime: 900,
        endTime: 1800,
        description: 'Analyse des défaillances du système de gouvernance',
        keyPoints: [
          'Transparence dans l\'attribution des contrats',
          'Rôle des institutions de contrôle',
          'Conflits d\'intérêts'
        ]
      },
      {
        id: '3-3',
        title: 'Réformes nécessaires',
        startTime: 1800,
        endTime: 2700,
        description: 'Recommandations pour améliorer la gouvernance pétrolière',
        keyPoints: [
          'Renforcement du cadre légal',
          'Transparence des contrats',
          'Participation citoyenne'
        ]
      }
    ],
    category: 'politique',
    speaker: mockSpeakers[2],
    publishedAt: '2024-01-15T16:00:00Z',
    createdAt: '2024-01-14T11:00:00Z',
    updatedAt: '2024-01-15T16:00:00Z',
    viewCount: 5670,
    likeCount: 298,
    featured: true,
    tags: ['corruption', 'pétrole', 'gouvernance', 'petrotim'],
    language: 'fr',
    quality: [
      {
        resolution: '720p',
        url: 'https://example.com/video-3-720p.mp4',
        fileSize: 675000000,
        bitrate: 2500
      },
      {
        resolution: '1080p',
        url: 'https://example.com/video-3-1080p.mp4',
        fileSize: 1200000000,
        bitrate: 4500
      }
    ]
  },
  {
    id: '4',
    title: 'Économie post-COVID : défis et opportunités pour le Sénégal',
    description: 'Analyse des impacts économiques de la pandémie et des stratégies de relance adoptées par le gouvernement.',
    videoUrl: 'https://example.com/video-4.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=640&h=360&fit=crop',
    duration: 2400, // 40 minutes
    transcript: `La pandémie de COVID-19 a profondément impacté l'économie sénégalaise...`,
    chapters: [
      {
        id: '4-1',
        title: 'Impact de la pandémie',
        startTime: 0,
        endTime: 800,
        description: 'Évaluation des impacts économiques de la COVID-19',
        keyPoints: [
          'Secteurs les plus touchés',
          'Perte d\'emplois',
          'Impact sur les finances publiques'
        ]
      },
      {
        id: '4-2',
        title: 'Mesures de riposte',
        startTime: 800,
        endTime: 1600,
        description: 'Analyse des mesures gouvernementales de soutien',
        keyPoints: [
          'Programme de résilience économique',
          'Soutien aux entreprises',
          'Protection sociale'
        ]
      },
      {
        id: '4-3',
        title: 'Perspectives de relance',
        startTime: 1600,
        endTime: 2400,
        description: 'Stratégies pour une relance durable',
        keyPoints: [
          'Diversification économique',
          'Transformation digitale',
          'Développement du capital humain'
        ]
      }
    ],
    category: 'economique',
    speaker: mockSpeakers[3],
    publishedAt: '2024-01-12T13:00:00Z',
    createdAt: '2024-01-11T08:00:00Z',
    updatedAt: '2024-01-12T13:00:00Z',
    viewCount: 2890,
    likeCount: 156,
    featured: false,
    tags: ['économie', 'covid-19', 'relance', 'développement'],
    language: 'fr',
    quality: [
      {
        resolution: '720p',
        url: 'https://example.com/video-4-720p.mp4',
        fileSize: 600000000,
        bitrate: 2500
      }
    ]
  },
  {
    id: '5',
    title: 'Éducation et citoyenneté : former les leaders de demain',
    description: 'Réflexion sur le rôle de l\'éducation civique dans la formation d\'une citoyenneté active et responsable.',
    videoUrl: 'https://example.com/video-5.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=640&h=360&fit=crop',
    duration: 1980, // 33 minutes
    transcript: `L'éducation à la citoyenneté est un enjeu crucial pour l'avenir démocratique du Sénégal...`,
    chapters: [
      {
        id: '5-1',
        title: 'État des lieux de l\'éducation civique',
        startTime: 0,
        endTime: 660,
        description: 'Diagnostic de l\'enseignement civique dans le système éducatif',
        keyPoints: [
          'Place dans les curricula',
          'Formation des enseignants',
          'Ressources pédagogiques'
        ]
      },
      {
        id: '5-2',
        title: 'Défis et innovations',
        startTime: 660,
        endTime: 1320,
        description: 'Nouveaux défis et approches innovantes',
        keyPoints: [
          'Éducation numérique',
          'Participation des jeunes',
          'Partenariats société civile'
        ]
      },
      {
        id: '5-3',
        title: 'Vision pour l\'avenir',
        startTime: 1320,
        endTime: 1980,
        description: 'Recommandations pour une éducation civique renforcée',
        keyPoints: [
          'Réforme des programmes',
          'Formation continue',
          'Évaluation des impacts'
        ]
      }
    ],
    category: 'education',
    speaker: mockSpeakers[1],
    publishedAt: '2024-01-10T11:00:00Z',
    createdAt: '2024-01-09T14:00:00Z',
    updatedAt: '2024-01-10T11:00:00Z',
    viewCount: 1780,
    likeCount: 98,
    featured: false,
    tags: ['éducation', 'citoyenneté', 'jeunesse', 'démocratie'],
    language: 'fr',
    quality: [
      {
        resolution: '720p',
        url: 'https://example.com/video-5-720p.mp4',
        fileSize: 495000000,
        bitrate: 2500
      }
    ]
  }
]

export { mockSpeakers }