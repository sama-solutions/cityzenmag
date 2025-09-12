import type { Interview, Interviewee } from '../types/interviews'

// Interviewés de démonstration
const mockInterviewees: Interviewee[] = [
  {
    id: '1',
    name: 'Dr. Aminata Touré',
    role: 'Ancienne Première Ministre',
    bio: 'Femme politique sénégalaise, ancienne Première Ministre et Ministre de la Justice. Militante pour la transparence et la bonne gouvernance.',
    photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    organization: 'Gouvernement du Sénégal',
    social: {
      twitter: '@aminata_toure',
      linkedin: 'aminata-toure'
    }
  },
  {
    id: '2',
    name: 'Pr. Moussa Diop',
    role: 'Économiste',
    bio: 'Professeur d\'économie à l\'Université Cheikh Anta Diop, spécialiste des politiques publiques et du développement économique.',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    organization: 'UCAD',
    social: {
      twitter: '@moussa_diop_eco'
    }
  },
  {
    id: '3',
    name: 'Fatou Kiné Camara',
    role: 'Journaliste d\'investigation',
    bio: 'Journaliste spécialisée dans l\'investigation et la lutte contre la corruption. Prix du journalisme d\'investigation 2023.',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    organization: 'Le Quotidien',
    social: {
      twitter: '@fatou_camara',
      website: 'fatoucamara.com'
    }
  },
  {
    id: '4',
    name: 'Mamadou Lamine Diallo',
    role: 'Député',
    bio: 'Député à l\'Assemblée nationale, président de la commission des finances. Militant pour la transparence budgétaire.',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    organization: 'Assemblée Nationale',
    social: {
      twitter: '@ml_diallo'
    }
  },
  {
    id: '5',
    name: 'Aïssatou Sow',
    role: 'Militante société civile',
    bio: 'Présidente de l\'ONG Transparence Citoyenne, militante pour l\'accès à l\'information et la participation citoyenne.',
    photo: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face',
    organization: 'Transparence Citoyenne',
    social: {
      twitter: '@aissatou_sow',
      website: 'transparence-citoyenne.org'
    }
  }
]

// Interviews de démonstration
export const mockInterviews: Interview[] = [
  {
    id: '1',
    title: 'La transparence budgétaire au Sénégal : défis et perspectives',
    description: 'Une discussion approfondie sur les enjeux de la transparence dans la gestion des finances publiques sénégalaises.',
    interviewee: mockInterviewees[0],
    interviewer: '@loi200812',
    questions: [
      {
        id: '1-1',
        question: 'Comment évaluez-vous le niveau actuel de transparence budgétaire au Sénégal ?',
        answer: 'Le Sénégal a fait des progrès significatifs ces dernières années, notamment avec la publication du budget citoyen et l\'amélioration de l\'accès aux documents budgétaires. Cependant, il reste encore des défis importants à relever...',
        order: 1,
        timestamp: 120,
        highlights: ['budget citoyen', 'accès aux documents budgétaires']
      },
      {
        id: '1-2',
        question: 'Quels sont les principaux obstacles à une meilleure transparence ?',
        answer: 'Les obstacles sont multiples : résistances institutionnelles, manque de formation des agents publics, insuffisance des outils numériques, et parfois une culture du secret qui persiste dans certaines administrations...',
        order: 2,
        timestamp: 300,
        highlights: ['résistances institutionnelles', 'culture du secret']
      },
      {
        id: '1-3',
        question: 'Quelles recommandations formuleriez-vous pour améliorer la situation ?',
        answer: 'Il faut d\'abord renforcer le cadre légal, notamment la loi sur l\'accès à l\'information. Ensuite, investir massivement dans la formation et la sensibilisation. Enfin, développer des plateformes numériques accessibles au citoyen lambda...',
        order: 3,
        timestamp: 480,
        highlights: ['renforcer le cadre légal', 'plateformes numériques accessibles']
      }
    ],
    category: 'politique',
    duration: 45,
    audioUrl: 'https://example.com/interview-1.mp3',
    publishedAt: '2024-01-15T10:00:00Z',
    createdAt: '2024-01-14T15:30:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    featured: true,
    tags: ['transparence', 'budget', 'gouvernance', 'finances publiques'],
    viewCount: 1250,
    likeCount: 89,
    thumbnail: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=250&fit=crop'
  },
  {
    id: '2',
    title: 'L\'impact économique des réformes de transparence',
    description: 'Analyse des retombées économiques des politiques de transparence sur le développement du Sénégal.',
    interviewee: mockInterviewees[1],
    interviewer: '@loi200812',
    questions: [
      {
        id: '2-1',
        question: 'Quel est l\'impact économique de la transparence sur l\'investissement ?',
        answer: 'La transparence est un facteur clé d\'attractivité pour les investisseurs. Elle réduit les risques perçus et améliore la confiance dans l\'environnement des affaires...',
        order: 1,
        timestamp: 90,
        highlights: ['facteur clé d\'attractivité', 'confiance dans l\'environnement des affaires']
      },
      {
        id: '2-2',
        question: 'Comment mesurer concrètement ces impacts ?',
        answer: 'Nous utilisons plusieurs indicateurs : l\'indice de perception de la corruption, les flux d\'IDE, les notations des agences de rating, et les enquêtes auprès des entreprises...',
        order: 2,
        timestamp: 240,
        highlights: ['indice de perception', 'flux d\'IDE', 'notations des agences']
      }
    ],
    category: 'economique',
    duration: 35,
    videoUrl: 'https://example.com/interview-2.mp4',
    publishedAt: '2024-01-10T14:00:00Z',
    createdAt: '2024-01-09T16:20:00Z',
    updatedAt: '2024-01-10T14:00:00Z',
    featured: false,
    tags: ['économie', 'investissement', 'développement', 'IDE'],
    viewCount: 890,
    likeCount: 67,
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop'
  },
  {
    id: '3',
    title: 'Le journalisme d\'investigation face aux défis de l\'accès à l\'information',
    description: 'Témoignage d\'une journaliste sur les obstacles rencontrés dans l\'exercice du droit d\'accès à l\'information.',
    interviewee: mockInterviewees[2],
    interviewer: '@loi200812',
    questions: [
      {
        id: '3-1',
        question: 'Quelles sont les principales difficultés que vous rencontrez ?',
        answer: 'Les refus d\'accès aux documents sont encore fréquents. Beaucoup d\'administrations invoquent le secret professionnel ou la confidentialité sans justification légale...',
        order: 1,
        timestamp: 60,
        highlights: ['refus d\'accès aux documents', 'secret professionnel']
      },
      {
        id: '3-2',
        question: 'Comment la nouvelle loi a-t-elle changé votre travail ?',
        answer: 'La loi 2021-28 a créé un cadre plus favorable, mais son application reste inégale. Certaines institutions jouent le jeu, d\'autres résistent encore...',
        order: 2,
        timestamp: 180,
        highlights: ['loi 2021-28', 'application reste inégale']
      }
    ],
    category: 'social',
    duration: 28,
    audioUrl: 'https://example.com/interview-3.mp3',
    publishedAt: '2024-01-08T09:30:00Z',
    createdAt: '2024-01-07T11:45:00Z',
    updatedAt: '2024-01-08T09:30:00Z',
    featured: true,
    tags: ['journalisme', 'investigation', 'accès information', 'médias'],
    viewCount: 1450,
    likeCount: 112,
    thumbnail: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=250&fit=crop'
  },
  {
    id: '4',
    title: 'Le contrôle parlementaire des finances publiques',
    description: 'Discussion sur le rôle de l\'Assemblée nationale dans le contrôle de l\'exécution budgétaire.',
    interviewee: mockInterviewees[3],
    interviewer: '@loi200812',
    questions: [
      {
        id: '4-1',
        question: 'Comment s\'exerce le contrôle parlementaire du budget ?',
        answer: 'Nous avons plusieurs outils : l\'examen du projet de loi de finances, les questions au gouvernement, les missions d\'information, et surtout la loi de règlement...',
        order: 1,
        timestamp: 75,
        highlights: ['loi de finances', 'missions d\'information', 'loi de règlement']
      }
    ],
    category: 'politique',
    duration: 40,
    videoUrl: 'https://example.com/interview-4.mp4',
    publishedAt: '2024-01-05T16:00:00Z',
    createdAt: '2024-01-04T14:30:00Z',
    updatedAt: '2024-01-05T16:00:00Z',
    featured: false,
    tags: ['parlement', 'contrôle budgétaire', 'assemblée nationale'],
    viewCount: 720,
    likeCount: 54,
    thumbnail: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=250&fit=crop'
  },
  {
    id: '5',
    title: 'La participation citoyenne dans la gouvernance locale',
    description: 'Retour d\'expérience sur les initiatives de participation citoyenne au niveau des collectivités locales.',
    interviewee: mockInterviewees[4],
    interviewer: '@loi200812',
    questions: [
      {
        id: '5-1',
        question: 'Comment mobiliser les citoyens autour des enjeux de gouvernance ?',
        answer: 'Il faut d\'abord simplifier l\'information et la rendre accessible. Nous organisons des ateliers de formation, des débats publics, et nous utilisons les réseaux sociaux...',
        order: 1,
        timestamp: 45,
        highlights: ['simplifier l\'information', 'ateliers de formation', 'débats publics']
      },
      {
        id: '5-2',
        question: 'Quels sont les résultats concrets de ces actions ?',
        answer: 'Nous avons observé une augmentation de la participation aux conseils municipaux, plus de demandes d\'accès aux documents, et surtout une meilleure appropriation des enjeux locaux...',
        order: 2,
        timestamp: 200,
        highlights: ['augmentation de la participation', 'appropriation des enjeux locaux']
      }
    ],
    category: 'social',
    duration: 32,
    audioUrl: 'https://example.com/interview-5.mp3',
    publishedAt: '2024-01-03T11:00:00Z',
    createdAt: '2024-01-02T09:15:00Z',
    updatedAt: '2024-01-03T11:00:00Z',
    featured: false,
    tags: ['participation citoyenne', 'gouvernance locale', 'société civile'],
    viewCount: 980,
    likeCount: 78,
    thumbnail: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400&h=250&fit=crop'
  }
]

export { mockInterviewees }