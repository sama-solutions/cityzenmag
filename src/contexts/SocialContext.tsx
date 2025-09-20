// Contexte React pour la gestion des réseaux sociaux

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { SocialManager, SocialManagerConfig } from '../services/social/SocialManager';
import { 
  SocialPost, 
  SocialProfile, 
  SocialAnalytics, 
  SocialPlatform,
  SocialSyncStatus,
  PostContent
} from '../services/social/base/types';

interface SocialContextType {
  // Manager
  socialManager: SocialManager | null;
  
  // État
  posts: SocialPost[];
  profiles: Map<SocialPlatform, SocialProfile>;
  analytics: Map<SocialPlatform, SocialAnalytics>;
  syncStatuses: Map<SocialPlatform, SocialSyncStatus>;
  
  // État de chargement
  loading: boolean;
  error: string | null;
  lastUpdate: Date | null;
  
  // Actions
  initializeSocial: (config: SocialManagerConfig) => void;
  refreshData: () => Promise<void>;
  syncAll: () => Promise<void>;
  publishPost: (platforms: SocialPlatform[], content: PostContent) => Promise<Map<SocialPlatform, any>>;
  
  // Utilitaires
  getPostsByPlatform: (platform: SocialPlatform) => SocialPost[];
  getEnabledPlatforms: () => SocialPlatform[];
  isConnected: (platform: SocialPlatform) => boolean;
}

const SocialContext = createContext<SocialContextType | undefined>(undefined);

interface SocialProviderProps {
  children: ReactNode;
  config?: SocialManagerConfig;
  autoSync?: boolean;
  syncInterval?: number; // en millisecondes
}

export function SocialProvider({ 
  children, 
  config,
  autoSync = true,
  syncInterval = 10 * 60 * 1000 // 10 minutes par défaut
}: SocialProviderProps) {
  const [socialManager, setSocialManager] = useState<SocialManager | null>(null);
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [profiles, setProfiles] = useState<Map<SocialPlatform, SocialProfile>>(new Map());
  const [analytics, setAnalytics] = useState<Map<SocialPlatform, SocialAnalytics>>(new Map());
  const [syncStatuses, setSyncStatuses] = useState<Map<SocialPlatform, SocialSyncStatus>>(new Map());
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Initialisation du manager social
  const initializeSocial = (managerConfig: SocialManagerConfig) => {
    try {
      const manager = new SocialManager(managerConfig);
      setSocialManager(manager);
      setError(null);
      
      // Authentification automatique
      manager.authenticateAll().then((results) => {
        console.log('Authentication results:', results);
        updateSyncStatuses(manager);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize social manager');
    }
  };

  // Mise à jour des statuts de synchronisation
  const updateSyncStatuses = (manager: SocialManager) => {
    const statuses = manager.getSyncStatus() as Map<SocialPlatform, SocialSyncStatus>;
    setSyncStatuses(new Map(statuses));
  };

  // Rafraîchissement des données
  const refreshData = async () => {
    if (!socialManager) return;

    setLoading(true);
    setError(null);

    try {
      // Récupérer les posts
      const postsData = await socialManager.fetchAggregatedPosts({ limit: 50 });
      setPosts(postsData);

      // Récupérer les profils
      const profilesData = await socialManager.fetchAllProfiles();
      setProfiles(profilesData);

      // Récupérer les analytics
      const analyticsData = await socialManager.getAllAnalytics('week');
      setAnalytics(analyticsData);

      // Mettre à jour les statuts
      updateSyncStatuses(socialManager);

      setLastUpdate(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh data');
    } finally {
      setLoading(false);
    }
  };

  // Synchronisation complète
  const syncAll = async () => {
    if (!socialManager) return;

    setLoading(true);
    setError(null);

    try {
      await socialManager.syncAll({ limit: 50 });
      await refreshData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sync failed');
    } finally {
      setLoading(false);
    }
  };

  // Publication de post
  const publishPost = async (platforms: SocialPlatform[], content: PostContent) => {
    if (!socialManager) {
      throw new Error('Social manager not initialized');
    }

    return await socialManager.publishToMultiplePlatforms(platforms, content);
  };

  // Utilitaires
  const getPostsByPlatform = (platform: SocialPlatform): SocialPost[] => {
    return posts.filter(post => post.platform === platform);
  };

  const getEnabledPlatforms = (): SocialPlatform[] => {
    return socialManager?.getEnabledPlatforms() || [];
  };

  const isConnected = (platform: SocialPlatform): boolean => {
    const status = syncStatuses.get(platform);
    return status?.status === 'success';
  };

  // Initialisation automatique avec la config fournie
  useEffect(() => {
    if (config && !socialManager) {
      initializeSocial(config);
    }
  }, [config, socialManager]);

  // Synchronisation automatique
  useEffect(() => {
    if (!autoSync || !socialManager || !syncInterval) return;

    const interval = setInterval(() => {
      refreshData();
    }, syncInterval);

    return () => clearInterval(interval);
  }, [autoSync, socialManager, syncInterval]);

  // Rafraîchissement initial après initialisation
  useEffect(() => {
    if (socialManager && posts.length === 0) {
      refreshData();
    }
  }, [socialManager]);

  const contextValue: SocialContextType = {
    // Manager
    socialManager,
    
    // État
    posts,
    profiles,
    analytics,
    syncStatuses,
    
    // État de chargement
    loading,
    error,
    lastUpdate,
    
    // Actions
    initializeSocial,
    refreshData,
    syncAll,
    publishPost,
    
    // Utilitaires
    getPostsByPlatform,
    getEnabledPlatforms,
    isConnected
  };

  return (
    <SocialContext.Provider value={contextValue}>
      {children}
    </SocialContext.Provider>
  );
}

// Hook pour utiliser le contexte social
export function useSocial() {
  const context = useContext(SocialContext);
  if (context === undefined) {
    throw new Error('useSocial must be used within a SocialProvider');
  }
  return context;
}

// Hook pour les posts d'une plateforme spécifique
export function usePlatformPosts(platform: SocialPlatform) {
  const { posts, loading, error } = useSocial();
  
  const platformPosts = posts.filter(post => post.platform === platform);
  
  return {
    posts: platformPosts,
    loading,
    error,
    count: platformPosts.length
  };
}

// Hook pour les analytics agrégées
export function useAggregatedAnalytics() {
  const { socialManager, analytics, loading } = useSocial();
  const [aggregatedAnalytics, setAggregatedAnalytics] = useState<any>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  useEffect(() => {
    if (!socialManager) return;

    const fetchAggregated = async () => {
      setAnalyticsLoading(true);
      try {
        const aggregated = await socialManager.getAggregatedAnalytics('week');
        setAggregatedAnalytics(aggregated);
      } catch (error) {
        console.error('Failed to fetch aggregated analytics:', error);
      } finally {
        setAnalyticsLoading(false);
      }
    };

    fetchAggregated();
  }, [socialManager, analytics]);

  return {
    analytics: aggregatedAnalytics,
    loading: analyticsLoading || loading
  };
}

// Hook pour la publication multi-plateformes
export function useSocialPublishing() {
  const { socialManager } = useSocial();
  const [publishing, setPublishing] = useState(false);
  const [publishResults, setPublishResults] = useState<Map<SocialPlatform, any> | null>(null);
  const [publishError, setPublishError] = useState<string | null>(null);

  const publish = async (platforms: SocialPlatform[], content: PostContent) => {
    if (!socialManager) {
      setPublishError('Social manager not initialized');
      return;
    }

    setPublishing(true);
    setPublishError(null);
    setPublishResults(null);

    try {
      const results = await socialManager.publishToMultiplePlatforms(platforms, content);
      setPublishResults(results);
    } catch (error) {
      setPublishError(error instanceof Error ? error.message : 'Publishing failed');
    } finally {
      setPublishing(false);
    }
  };

  const publishToAll = async (content: PostContent) => {
    if (!socialManager) {
      setPublishError('Social manager not initialized');
      return;
    }

    const enabledPlatforms = socialManager.getEnabledPlatforms();
    await publish(enabledPlatforms, content);
  };

  return {
    publish,
    publishToAll,
    publishing,
    publishResults,
    publishError,
    clearResults: () => {
      setPublishResults(null);
      setPublishError(null);
    }
  };
}

export default SocialContext;