// Configuration des réseaux sociaux à partir des variables d'environnement

import { SocialManagerConfig } from '../services/social/SocialManager';

// Configuration par défaut pour les réseaux sociaux
export const getSocialConfig = (): SocialManagerConfig => {
  const config: SocialManagerConfig = {};

  // Configuration Twitter
  const twitterApiKey = import.meta.env.VITE_TWITTER_API_KEY;
  const twitterApiSecret = import.meta.env.VITE_TWITTER_API_SECRET;
  const twitterBearerToken = import.meta.env.VITE_TWITTER_BEARER_TOKEN;
  const twitterAccessToken = import.meta.env.VITE_TWITTER_ACCESS_TOKEN;
  const twitterAccessTokenSecret = import.meta.env.VITE_TWITTER_ACCESS_TOKEN_SECRET;

  if (twitterBearerToken || (twitterApiKey && twitterApiSecret)) {
    config.twitter = {
      platform: 'twitter',
      enabled: true,
      rateLimits: {
        requestsPerHour: 300,
        requestsPerDay: 500
      },
      twitter: {
        apiKey: twitterApiKey || '',
        apiSecret: twitterApiSecret || '',
        bearerToken: twitterBearerToken || '',
        accessToken: twitterAccessToken || '',
        accessTokenSecret: twitterAccessTokenSecret || ''
      }
    };
  }

  // Configuration YouTube
  const youtubeApiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
  const youtubeChannelId = import.meta.env.VITE_YOUTUBE_CHANNEL_ID;

  if (youtubeApiKey) {
    config.youtube = {
      platform: 'youtube',
      enabled: true,
      rateLimits: {
        requestsPerHour: 10000,
        requestsPerDay: 1000000
      },
      youtube: {
        apiKey: youtubeApiKey,
        channelId: youtubeChannelId || ''
      }
    };
  }

  // Configuration Facebook
  const facebookAppId = import.meta.env.VITE_FACEBOOK_APP_ID;
  const facebookAppSecret = import.meta.env.VITE_FACEBOOK_APP_SECRET;
  const facebookAccessToken = import.meta.env.VITE_FACEBOOK_ACCESS_TOKEN;
  const facebookPageId = import.meta.env.VITE_FACEBOOK_PAGE_ID;

  if (facebookAppId && facebookAccessToken) {
    config.facebook = {
      platform: 'facebook',
      enabled: true,
      rateLimits: {
        requestsPerHour: 200,
        requestsPerDay: 4800
      },
      facebook: {
        appId: facebookAppId,
        appSecret: facebookAppSecret || '',
        accessToken: facebookAccessToken,
        pageId: facebookPageId || '',
        version: 'v18.0'
      }
    };
  }

  return config;
};

// Configuration de développement avec des données de test
export const getDevSocialConfig = (): SocialManagerConfig => {
  return {
    twitter: {
      platform: 'twitter',
      enabled: false, // Désactivé par défaut en dev
      rateLimits: {
        requestsPerHour: 300,
        requestsPerDay: 500
      },
      twitter: {
        apiKey: 'dev_api_key',
        apiSecret: 'dev_api_secret',
        bearerToken: 'dev_bearer_token',
        accessToken: 'dev_access_token',
        accessTokenSecret: 'dev_access_token_secret'
      }
    },
    youtube: {
      platform: 'youtube',
      enabled: false, // Désactivé par défaut en dev
      rateLimits: {
        requestsPerHour: 10000,
        requestsPerDay: 1000000
      },
      youtube: {
        apiKey: 'dev_youtube_api_key',
        channelId: 'dev_channel_id'
      }
    },
    facebook: {
      platform: 'facebook',
      enabled: false, // Désactivé par défaut en dev
      rateLimits: {
        requestsPerHour: 200,
        requestsPerDay: 4800
      },
      facebook: {
        appId: 'dev_app_id',
        appSecret: 'dev_app_secret',
        accessToken: 'dev_access_token',
        pageId: 'dev_page_id',
        version: 'v18.0'
      }
    }
  };
};

// Utilitaires pour vérifier la configuration
export const validateSocialConfig = (config: SocialManagerConfig): { 
  valid: boolean; 
  errors: string[]; 
  warnings: string[] 
} => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validation Twitter
  if (config.twitter?.enabled) {
    const twitter = config.twitter.twitter;
    if (!twitter.bearerToken && (!twitter.apiKey || !twitter.apiSecret)) {
      errors.push('Twitter: Bearer Token ou API Key/Secret requis');
    }
    if (!twitter.bearerToken && twitter.apiKey && !twitter.apiSecret) {
      errors.push('Twitter: API Secret requis avec API Key');
    }
  }

  // Validation YouTube
  if (config.youtube?.enabled) {
    const youtube = config.youtube.youtube;
    if (!youtube.apiKey) {
      errors.push('YouTube: API Key requis');
    }
    if (!youtube.channelId) {
      warnings.push('YouTube: Channel ID recommandé pour récupérer les vidéos');
    }
  }

  // Validation Facebook
  if (config.facebook?.enabled) {
    const facebook = config.facebook.facebook;
    if (!facebook.appId) {
      errors.push('Facebook: App ID requis');
    }
    if (!facebook.accessToken) {
      errors.push('Facebook: Access Token requis');
    }
    if (!facebook.pageId) {
      warnings.push('Facebook: Page ID recommandé pour publier sur une page');
    }
  }

  // Vérifier qu'au moins une plateforme est activée
  const enabledPlatforms = Object.values(config).filter(c => c?.enabled).length;
  if (enabledPlatforms === 0) {
    warnings.push('Aucune plateforme sociale n\'est activée');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
};

// Configuration des limites de taux par défaut
export const DEFAULT_RATE_LIMITS = {
  twitter: {
    requestsPerHour: 300,
    requestsPerDay: 500
  },
  youtube: {
    requestsPerHour: 10000,
    requestsPerDay: 1000000
  },
  facebook: {
    requestsPerHour: 200,
    requestsPerDay: 4800
  }
};

// URLs de documentation pour chaque plateforme
export const PLATFORM_DOCS = {
  twitter: {
    name: 'Twitter Developer Portal',
    url: 'https://developer.twitter.com/en/docs',
    setup: 'https://developer.twitter.com/en/docs/twitter-api/getting-started/getting-access-to-the-twitter-api'
  },
  youtube: {
    name: 'YouTube Data API',
    url: 'https://developers.google.com/youtube/v3',
    setup: 'https://developers.google.com/youtube/v3/getting-started'
  },
  facebook: {
    name: 'Facebook for Developers',
    url: 'https://developers.facebook.com/docs',
    setup: 'https://developers.facebook.com/docs/facebook-login/access-tokens'
  }
};

// Types d'erreurs communes
export const COMMON_ERRORS = {
  AUTHENTICATION_FAILED: 'Échec de l\'authentification',
  RATE_LIMIT_EXCEEDED: 'Limite de taux dépassée',
  INVALID_CREDENTIALS: 'Identifiants invalides',
  NETWORK_ERROR: 'Erreur réseau',
  API_ERROR: 'Erreur de l\'API',
  PERMISSION_DENIED: 'Permission refusée',
  RESOURCE_NOT_FOUND: 'Ressource non trouvée'
};

// Messages d'aide pour la configuration
export const SETUP_HELP = {
  twitter: {
    title: 'Configuration Twitter/X',
    steps: [
      'Créez un compte développeur sur developer.twitter.com',
      'Créez une nouvelle application',
      'Générez vos clés API et Bearer Token',
      'Configurez les permissions appropriées (lecture/écriture)',
      'Ajoutez les clés dans les variables d\'environnement'
    ],
    envVars: [
      'VITE_TWITTER_API_KEY',
      'VITE_TWITTER_API_SECRET',
      'VITE_TWITTER_BEARER_TOKEN',
      'VITE_TWITTER_ACCESS_TOKEN (optionnel)',
      'VITE_TWITTER_ACCESS_TOKEN_SECRET (optionnel)'
    ]
  },
  youtube: {
    title: 'Configuration YouTube',
    steps: [
      'Allez sur Google Cloud Console',
      'Créez un nouveau projet ou sélectionnez un existant',
      'Activez l\'API YouTube Data v3',
      'Créez des identifiants (clé API)',
      'Ajoutez la clé dans les variables d\'environnement'
    ],
    envVars: [
      'VITE_YOUTUBE_API_KEY',
      'VITE_YOUTUBE_CHANNEL_ID (optionnel)'
    ]
  },
  facebook: {
    title: 'Configuration Facebook',
    steps: [
      'Créez une application sur developers.facebook.com',
      'Ajoutez le produit "Facebook Login"',
      'Générez un token d\'accès pour votre page',
      'Configurez les permissions appropriées',
      'Ajoutez les identifiants dans les variables d\'environnement'
    ],
    envVars: [
      'VITE_FACEBOOK_APP_ID',
      'VITE_FACEBOOK_APP_SECRET',
      'VITE_FACEBOOK_ACCESS_TOKEN',
      'VITE_FACEBOOK_PAGE_ID (optionnel)'
    ]
  }
};