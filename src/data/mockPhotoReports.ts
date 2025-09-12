import type { PhotoReport, Photographer, Location } from '../types/photoReports'

// Photographes de démonstration
const mockPhotographers: Photographer[] = [
  {
    id: '1',
    name: 'Ousmane Diallo',
    bio: 'Photographe documentaire spécialisé dans les questions sociales et urbaines au Sénégal.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    portfolio: 'https://ousmane-diallo.com',
    social: {
      instagram: '@ousmane_photo',
      website: 'ousmane-diallo.com'
    },
    specialties: ['Documentaire', 'Social', 'Portrait']
  },
  {
    id: '2',
    name: 'Awa Thiam',
    bio: 'Photojournaliste indépendante, lauréate du Prix de la photographie africaine 2023.',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    portfolio: 'https://awa-thiam.photo',
    social: {
      instagram: '@awa_captures',
      twitter: '@awa_photo'
    },
    specialties: ['Photojournalisme', 'Politique', 'Investigation']
  },
  {
    id: '3',
    name: 'Mamadou Seck',
    bio: 'Photographe culturel passionné par la préservation du patrimoine sénégalais.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    social: {
      instagram: '@mamadou_heritage'
    },
    specialties: ['Culture', 'Patrimoine', 'Événement']
  },
  {
    id: '4',
    name: 'Fatima Ba',
    bio: 'Photographe environnementale engagée dans la sensibilisation aux enjeux climatiques.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    social: {
      website: 'fatima-ba.eco'
    },
    specialties: ['Environnement', 'Nature', 'Climat']
  }
]

// Lieux de démonstration
const mockLocations: Location[] = [
  {
    id: '1',
    name: 'Plateau, Dakar',
    address: 'Centre-ville de Dakar',
    coordinates: [-17.4441, 14.6928],
    region: 'Dakar',
    country: 'Sénégal'
  },
  {
    id: '2',
    name: 'Île de Gorée',
    address: 'Île de Gorée, Dakar',
    coordinates: [-17.4014, 14.6676],
    region: 'Dakar',
    country: 'Sénégal'
  },
  {
    id: '3',
    name: 'Saint-Louis',
    address: 'Centre historique de Saint-Louis',
    coordinates: [-16.4889, 16.0199],
    region: 'Saint-Louis',
    country: 'Sénégal'
  },
  {
    id: '4',
    name: 'Lac Rose',
    address: 'Lac Retba, Rufisque',
    coordinates: [-17.2167, 14.8333],
    region: 'Dakar',
    country: 'Sénégal'
  },
  {
    id: '5',
    name: 'Marché Sandaga',
    address: 'Marché Sandaga, Dakar',
    coordinates: [-17.4467, 14.6719],
    region: 'Dakar',
    country: 'Sénégal'
  }
]

// Reportages photo de démonstration
export const mockPhotoReports: PhotoReport[] = [
  {
    id: '1',
    title: 'Les vendeurs ambulants de Dakar : portraits de la débrouillardise',
    description: 'Un reportage intimiste sur les vendeurs ambulants du centre-ville de Dakar, témoins de l\'économie informelle et de l\'ingéniosité sénégalaise.',
    photographer: mockPhotographers[0],
    location: mockLocations[0],
    images: [
      {
        id: '1-1',
        url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
        caption: 'Vendeur de fruits au coin de l\'avenue Pompidou',
        order: 1,
        metadata: {
          camera: 'Canon EOS R5',
          lens: '24-70mm f/2.8',
          settings: {
            aperture: 'f/4.0',
            shutterSpeed: '1/125s',
            iso: 400,
            focalLength: '50mm'
          },
          timestamp: '2024-01-20T14:30:00Z',
          fileSize: 2048000,
          format: 'JPEG'
        },
        alt: 'Vendeur de fruits dans les rues de Dakar',
        width: 800,
        height: 600
      },
      {
        id: '1-2',
        url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
        caption: 'Préparation des étals matinaux au marché',
        order: 2,
        metadata: {
          camera: 'Canon EOS R5',
          timestamp: '2024-01-20T07:15:00Z',
          fileSize: 1856000,
          format: 'JPEG'
        },
        alt: 'Préparation des étals au marché de Dakar',
        width: 800,
        height: 600
      },
      {
        id: '1-3',
        url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
        caption: 'Portrait de Mamadou, vendeur de journaux depuis 15 ans',
        order: 3,
        metadata: {
          camera: 'Canon EOS R5',
          timestamp: '2024-01-20T16:45:00Z',
          fileSize: 2234000,
          format: 'JPEG'
        },
        alt: 'Portrait d\'un vendeur de journaux',
        width: 800,
        height: 600
      }
    ],
    category: 'social',
    publishedAt: '2024-01-22T10:00:00Z',
    createdAt: '2024-01-20T18:00:00Z',
    updatedAt: '2024-01-22T10:00:00Z',
    featured: true,
    tags: ['économie informelle', 'portraits', 'dakar', 'société'],
    viewCount: 2340,
    likeCount: 156,
    coverImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
  },
  {
    id: '2',
    title: 'Gorée : mémoire et patrimoine en images',
    description: 'Exploration photographique de l\'île de Gorée, entre mémoire de l\'esclavage et préservation du patrimoine architectural.',
    photographer: mockPhotographers[2],
    location: mockLocations[1],
    images: [
      {
        id: '2-1',
        url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
        caption: 'La Maison des Esclaves, symbole de mémoire',
        order: 1,
        metadata: {
          camera: 'Nikon D850',
          timestamp: '2024-01-18T11:20:00Z',
          fileSize: 3456000,
          format: 'RAW'
        },
        alt: 'Maison des Esclaves à Gorée',
        width: 800,
        height: 600
      },
      {
        id: '2-2',
        url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
        caption: 'Architecture coloniale préservée',
        order: 2,
        metadata: {
          camera: 'Nikon D850',
          timestamp: '2024-01-18T14:30:00Z',
          fileSize: 2987000,
          format: 'RAW'
        },
        alt: 'Architecture coloniale de Gorée',
        width: 800,
        height: 600
      }
    ],
    category: 'culture',
    publishedAt: '2024-01-19T15:00:00Z',
    createdAt: '2024-01-18T20:00:00Z',
    updatedAt: '2024-01-19T15:00:00Z',
    featured: false,
    tags: ['patrimoine', 'mémoire', 'gorée', 'architecture'],
    viewCount: 1890,
    likeCount: 134,
    coverImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
  },
  {
    id: '3',
    title: 'Assemblée nationale : dans les coulisses du pouvoir',
    description: 'Reportage exclusif dans les coulisses de l\'Assemblée nationale du Sénégal pendant une session parlementaire.',
    photographer: mockPhotographers[1],
    location: mockLocations[0],
    images: [
      {
        id: '3-1',
        url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=600&fit=crop',
        caption: 'Hémicycle de l\'Assemblée nationale en session',
        order: 1,
        metadata: {
          camera: 'Sony A7R IV',
          timestamp: '2024-01-15T10:00:00Z',
          fileSize: 4123000,
          format: 'RAW'
        },
        alt: 'Hémicycle de l\'Assemblée nationale',
        width: 800,
        height: 600
      }
    ],
    category: 'politique',
    publishedAt: '2024-01-16T09:00:00Z',
    createdAt: '2024-01-15T17:00:00Z',
    updatedAt: '2024-01-16T09:00:00Z',
    featured: true,
    tags: ['politique', 'assemblée', 'démocratie', 'institutions'],
    viewCount: 3120,
    likeCount: 198,
    coverImage: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=300&fit=crop'
  },
  {
    id: '4',
    title: 'Saint-Louis : joyau architectural en péril',
    description: 'Documentation photographique de l\'état du patrimoine architectural de Saint-Louis, entre préservation et dégradation.',
    photographer: mockPhotographers[2],
    location: mockLocations[2],
    images: [
      {
        id: '4-1',
        url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
        caption: 'Maisons coloniales du centre historique',
        order: 1,
        metadata: {
          camera: 'Nikon D850',
          timestamp: '2024-01-12T16:30:00Z',
          fileSize: 3789000,
          format: 'RAW'
        },
        alt: 'Architecture coloniale de Saint-Louis',
        width: 800,
        height: 600
      }
    ],
    category: 'culture',
    publishedAt: '2024-01-14T12:00:00Z',
    createdAt: '2024-01-12T19:00:00Z',
    updatedAt: '2024-01-14T12:00:00Z',
    featured: false,
    tags: ['patrimoine', 'saint-louis', 'architecture', 'unesco'],
    viewCount: 1456,
    likeCount: 89,
    coverImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop'
  },
  {
    id: '5',
    title: 'Lac Rose : quand la nature devient rose',
    description: 'Reportage sur le phénomène naturel du Lac Rose et l\'activité d\'extraction du sel qui s\'y développe.',
    photographer: mockPhotographers[3],
    location: mockLocations[3],
    images: [
      {
        id: '5-1',
        url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
        caption: 'Les eaux roses du lac Retba au coucher du soleil',
        order: 1,
        metadata: {
          camera: 'Canon EOS R6',
          timestamp: '2024-01-10T18:45:00Z',
          fileSize: 2567000,
          format: 'JPEG'
        },
        alt: 'Lac Rose au coucher du soleil',
        width: 800,
        height: 600
      }
    ],
    category: 'environnement',
    publishedAt: '2024-01-11T14:00:00Z',
    createdAt: '2024-01-10T21:00:00Z',
    updatedAt: '2024-01-11T14:00:00Z',
    featured: false,
    tags: ['nature', 'lac rose', 'environnement', 'tourisme'],
    viewCount: 2890,
    likeCount: 234,
    coverImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'
  }
]

export { mockPhotographers, mockLocations }