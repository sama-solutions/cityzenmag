import type { Testimonial, TestimonialAuthor, Location } from '../types/testimonials'

// Lieux de démonstration
const mockLocations: Location[] = [
  {
    id: '1',
    name: 'Dakar',
    region: 'Dakar',
    coordinates: [-17.4441, 14.6928],
    type: 'ville'
  },
  {
    id: '2',
    name: 'Thiès',
    region: 'Thiès',
    coordinates: [-16.9262, 14.7886],
    type: 'ville'
  },
  {
    id: '3',
    name: 'Saint-Louis',
    region: 'Saint-Louis',
    coordinates: [-16.4889, 16.0199],
    type: 'ville'
  },
  {
    id: '4',
    name: 'Kaolack',
    region: 'Kaolack',
    coordinates: [-16.0728, 14.1593],
    type: 'ville'
  },
  {
    id: '5',
    name: 'Ziguinchor',
    region: 'Ziguinchor',
    coordinates: [-16.2719, 12.5681],
    type: 'ville'
  }
]

// Auteurs de démonstration
const mockAuthors: TestimonialAuthor[] = [
  {
    id: '1',
    name: 'Aminata Diop',
    age: 34,
    location: 'Dakar',
    occupation: 'Enseignante',
    photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    email: 'aminata.diop@email.com',
    anonymous: false,
    verified: true,
    consent: {
      publication: true,
      contact: true,
      followUp: true
    }
  },
  {
    id: '2',
    name: 'Citoyen Anonyme',
    age: 28,
    location: 'Thiès',
    occupation: 'Commerçant',
    anonymous: true,
    verified: false,
    consent: {
      publication: true,
      contact: false,
      followUp: false
    }
  },
  {
    id: '3',
    name: 'Ousmane Sall',
    age: 45,
    location: 'Saint-Louis',
    occupation: 'Pêcheur',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    email: 'ousmane.sall@email.com',
    anonymous: false,
    verified: true,
    consent: {
      publication: true,
      contact: true,
      followUp: true
    }
  },
  {
    id: '4',
    name: 'Fatou Mbaye',
    age: 29,
    location: 'Kaolack',
    occupation: 'Infirmière',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    email: 'fatou.mbaye@email.com',
    anonymous: false,
    verified: true,
    consent: {
      publication: true,
      contact: true,
      followUp: false
    }
  },
  {
    id: '5',
    name: 'Témoin Anonyme',
    location: 'Ziguinchor',
    occupation: 'Agriculteur',
    anonymous: true,
    verified: false,
    consent: {
      publication: true,
      contact: false,
      followUp: false
    }
  },
  {
    id: '6',
    name: 'Mamadou Diallo',
    age: 52,
    location: 'Dakar',
    occupation: 'Chauffeur de taxi',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    email: 'mamadou.diallo@email.com',
    anonymous: false,
    verified: true,
    consent: {
      publication: true,
      contact: true,
      followUp: true
    }
  }
]

// Témoignages de démonstration
export const mockTestimonials: Testimonial[] = [
  {
    id: '1',
    title: 'Difficultés d\'accès aux documents administratifs à la mairie',
    content: `Je me suis rendu à la mairie de mon quartier pour obtenir un certificat de résidence. Malgré la nouvelle loi sur l'accès à l'information, j'ai attendu plus de 3 semaines pour recevoir ce document pourtant simple.

L'agent m'a d'abord dit qu'il fallait revenir dans une semaine, puis deux semaines. Quand j'ai mentionné la loi sur l'accès à l'information, il m'a regardé avec surprise comme s'il ne savait pas de quoi je parlais.

Je pense qu'il faut vraiment former les agents publics sur cette nouvelle loi. Les citoyens ont le droit d'accéder rapidement aux documents qui les concernent.`,
    author: mockAuthors[0],
    category: 'experience',
    verified: true,
    moderated: true,
    moderationStatus: 'approved',
    publishedAt: '2024-01-22T14:30:00Z',
    createdAt: '2024-01-20T09:15:00Z',
    updatedAt: '2024-01-22T14:30:00Z',
    likes: 23,
    responses: [
      {
        id: '1-1',
        content: 'Merci pour ce témoignage. Nous allons transmettre votre expérience aux autorités compétentes pour améliorer la formation des agents.',
        author: 'Équipe CityzenMag',
        authorRole: 'admin',
        publishedAt: '2024-01-22T16:00:00Z',
        verified: true,
        likes: 5
      }
    ],
    tags: ['mairie', 'documents administratifs', 'accès information', 'formation agents'],
    priority: 'medium',
    featured: true,
    viewCount: 156,
    location: mockLocations[0]
  },
  {
    id: '2',
    title: 'Proposition pour améliorer la transparence budgétaire locale',
    content: `En tant que citoyen de Thiès, je propose que notre commune publie chaque trimestre un rapport simplifié sur l'utilisation du budget municipal.

Actuellement, il est très difficile de savoir comment nos impôts locaux sont utilisés. Un document simple avec des graphiques et des explications claires permettrait aux citoyens de mieux comprendre et de s'impliquer davantage.

Je suggère aussi d'organiser des séances publiques trimestrielles où le maire présenterait ces rapports et répondrait aux questions des citoyens.`,
    author: mockAuthors[1],
    category: 'proposition',
    verified: false,
    moderated: true,
    moderationStatus: 'approved',
    publishedAt: '2024-01-20T11:00:00Z',
    createdAt: '2024-01-19T16:45:00Z',
    updatedAt: '2024-01-20T11:00:00Z',
    likes: 34,
    responses: [],
    tags: ['budget municipal', 'transparence', 'participation citoyenne', 'thiès'],
    priority: 'high',
    featured: false,
    viewCount: 89,
    location: mockLocations[1]
  },
  {
    id: '3',
    title: 'Témoignage sur l\'impact de la pêche illégale à Saint-Louis',
    content: `Je suis pêcheur à Saint-Louis depuis plus de 20 ans. Ces dernières années, nous voyons de plus en plus de bateaux étrangers qui pêchent dans nos eaux sans autorisation.

Cela affecte directement nos revenus et la survie de nos familles. Nous avons signalé plusieurs fois ces activités aux autorités, mais les réponses sont lentes.

Il faut plus de transparence sur les licences de pêche accordées et un meilleur contrôle des eaux territoriales. Nos ressources halieutiques sont en danger.`,
    author: mockAuthors[2],
    category: 'denonciation',
    verified: true,
    moderated: true,
    moderationStatus: 'approved',
    publishedAt: '2024-01-18T08:30:00Z',
    createdAt: '2024-01-17T14:20:00Z',
    updatedAt: '2024-01-18T08:30:00Z',
    likes: 67,
    responses: [
      {
        id: '3-1',
        content: 'Votre témoignage est important. Nous encourageons les citoyens à documenter ces activités et à les signaler aux autorités compétentes.',
        author: 'Expert Pêche',
        authorRole: 'expert',
        publishedAt: '2024-01-18T10:15:00Z',
        verified: true,
        likes: 12
      }
    ],
    tags: ['pêche illégale', 'saint-louis', 'ressources halieutiques', 'contrôle territorial'],
    priority: 'high',
    featured: true,
    viewCount: 234,
    location: mockLocations[2]
  },
  {
    id: '4',
    title: 'Amélioration des services de santé grâce à la transparence',
    content: `Je travaille comme infirmière à l'hôpital de Kaolack. Récemment, notre direction a commencé à publier des rapports mensuels sur la disponibilité des médicaments et l'état des équipements.

Cette transparence a eu un impact positif énorme. Les patients sont mieux informés, les familles comprennent mieux les délais, et nous, le personnel, nous sentons plus soutenus.

Je félicite cette initiative et j'encourage d'autres établissements de santé à faire de même. La transparence améliore vraiment la qualité des soins.`,
    author: mockAuthors[3],
    category: 'felicitation',
    verified: true,
    moderated: true,
    moderationStatus: 'approved',
    publishedAt: '2024-01-16T13:45:00Z',
    createdAt: '2024-01-15T11:30:00Z',
    updatedAt: '2024-01-16T13:45:00Z',
    likes: 45,
    responses: [],
    tags: ['santé', 'transparence', 'hôpital', 'kaolack', 'amélioration'],
    priority: 'medium',
    featured: false,
    viewCount: 123,
    location: mockLocations[3]
  },
  {
    id: '5',
    title: 'Question sur l\'accès aux informations sur les projets de développement',
    content: `Il y a des travaux qui ont commencé dans notre quartier à Ziguinchor, mais personne ne sait exactement de quoi il s'agit. Nous aimerions avoir des informations claires sur :

- Quel est le projet exactement ?
- Combien coûte-t-il ?
- Qui le finance ?
- Quand sera-t-il terminé ?
- Comment cela va-t-il améliorer notre quotidien ?

Est-ce que nous avons le droit de demander ces informations ? Comment faire pour les obtenir ?`,
    author: mockAuthors[4],
    category: 'question',
    verified: false,
    moderated: true,
    moderationStatus: 'approved',
    publishedAt: '2024-01-14T10:20:00Z',
    createdAt: '2024-01-13T15:10:00Z',
    updatedAt: '2024-01-14T10:20:00Z',
    likes: 28,
    responses: [
      {
        id: '5-1',
        content: 'Vous avez tout à fait le droit de demander ces informations. Nous vous conseillons de vous adresser à la mairie avec une demande écrite en citant la loi sur l\'accès à l\'information.',
        author: 'Conseiller Juridique',
        authorRole: 'expert',
        publishedAt: '2024-01-14T14:30:00Z',
        verified: true,
        likes: 8
      }
    ],
    tags: ['projets développement', 'ziguinchor', 'accès information', 'travaux publics'],
    priority: 'medium',
    featured: false,
    viewCount: 98,
    location: mockLocations[4]
  },
  {
    id: '6',
    title: 'Plainte concernant le manque de transparence dans l\'attribution des marchés publics',
    content: `Je suis chauffeur de taxi à Dakar et j'ai remarqué que les mêmes entreprises remportent toujours les marchés publics de transport pour les événements officiels.

Il n'y a jamais d'appels d'offres publics ou d'informations sur les critères de sélection. Comment les petits transporteurs comme nous peuvent-ils avoir une chance équitable ?

Je demande plus de transparence dans l'attribution de ces marchés. Nous payons nos impôts et nous méritons les mêmes opportunités.`,
    author: mockAuthors[5],
    category: 'plainte',
    verified: true,
    moderated: true,
    moderationStatus: 'needs_review',
    moderationNotes: 'Vérifier les allégations concernant les marchés publics',
    createdAt: '2024-01-12T09:45:00Z',
    updatedAt: '2024-01-12T09:45:00Z',
    likes: 19,
    responses: [],
    tags: ['marchés publics', 'transport', 'dakar', 'équité', 'appels offres'],
    priority: 'high',
    featured: false,
    viewCount: 76,
    location: mockLocations[0]
  },
  {
    id: '7',
    title: 'Suggestion pour créer un portail numérique de transparence',
    content: `Je suggère la création d'un portail web unique où tous les citoyens sénégalais pourraient :

1. Consulter les budgets de leur commune
2. Suivre l'avancement des projets publics
3. Accéder aux documents administratifs
4. Poser des questions aux élus
5. Signaler des problèmes

Ce portail pourrait être géré conjointement par l'État et les collectivités locales. Cela révolutionnerait la relation entre citoyens et administration.

D'autres pays africains l'ont fait avec succès. Pourquoi pas le Sénégal ?`,
    author: mockAuthors[0],
    category: 'suggestion',
    verified: true,
    moderated: true,
    moderationStatus: 'approved',
    publishedAt: '2024-01-10T16:00:00Z',
    createdAt: '2024-01-09T12:30:00Z',
    updatedAt: '2024-01-10T16:00:00Z',
    likes: 52,
    responses: [
      {
        id: '7-1',
        content: 'Excellente suggestion ! Nous allons la transmettre aux autorités compétentes. Un tel portail serait effectivement un grand pas vers plus de transparence.',
        author: 'Équipe CityzenMag',
        authorRole: 'admin',
        publishedAt: '2024-01-10T18:30:00Z',
        verified: true,
        likes: 15
      }
    ],
    tags: ['portail numérique', 'transparence', 'administration', 'innovation', 'e-gouvernement'],
    priority: 'high',
    featured: true,
    viewCount: 187,
    location: mockLocations[0]
  }
]

export { mockAuthors, mockLocations }