// Panneau d'administration pour les intégrations sociales

import React, { useState, useEffect } from 'react';
import { useSocial } from '../../contexts/SocialContext';
import { SocialPlatform, SocialConfig } from '../../services/social/base/types';
import { 
  Settings, 
  Check, 
  X, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  Save,
  TestTube,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react';

interface SocialIntegrationPanelProps {
  className?: string;
}

export function SocialIntegrationPanel({ className = '' }: SocialIntegrationPanelProps) {
  const { 
    socialManager, 
    syncStatuses, 
    refreshData, 
    loading,
    getEnabledPlatforms,
    isConnected 
  } = useSocial();

  const [activeTab, setActiveTab] = useState<SocialPlatform>('twitter');
  const [configs, setConfigs] = useState<Record<SocialPlatform, any>>({
    twitter: {
      enabled: false,
      apiKey: '',
      apiSecret: '',
      accessToken: '',
      accessTokenSecret: '',
      bearerToken: ''
    },
    youtube: {
      enabled: false,
      apiKey: '',
      channelId: ''
    },
    facebook: {
      enabled: false,
      appId: '',
      appSecret: '',
      accessToken: '',
      pageId: ''
    }
  });

  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [testResults, setTestResults] = useState<Record<SocialPlatform, boolean | null>>({
    twitter: null,
    youtube: null,
    facebook: null
  });
  const [testing, setTesting] = useState<Record<SocialPlatform, boolean>>({
    twitter: false,
    youtube: false,
    facebook: false
  });

  // Charger les configurations existantes
  useEffect(() => {
    if (socialManager) {
      const enabledPlatforms = getEnabledPlatforms();
      
      // Mettre à jour l'état des plateformes activées
      setConfigs(prev => {
        const updated = { ...prev };
        enabledPlatforms.forEach(platform => {
          updated[platform] = { ...updated[platform], enabled: true };
        });
        return updated;
      });
    }
  }, [socialManager, getEnabledPlatforms]);

  const handleConfigChange = (platform: SocialPlatform, field: string, value: string | boolean) => {
    setConfigs(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        [field]: value
      }
    }));
  };

  const toggleSecretVisibility = (field: string) => {
    setShowSecrets(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const testConnection = async (platform: SocialPlatform) => {
    if (!socialManager) return;

    setTesting(prev => ({ ...prev, [platform]: true }));
    setTestResults(prev => ({ ...prev, [platform]: null }));

    try {
      const service = socialManager.getService(platform);
      if (service) {
        const result = await service.testConnection();
        setTestResults(prev => ({ ...prev, [platform]: result }));
      }
    } catch (error) {
      setTestResults(prev => ({ ...prev, [platform]: false }));
    } finally {
      setTesting(prev => ({ ...prev, [platform]: false }));
    }
  };

  const saveConfiguration = async (platform: SocialPlatform) => {
    if (!socialManager) return;

    try {
      const config = configs[platform];
      socialManager.updateServiceConfig(platform, config);
      
      if (config.enabled) {
        await testConnection(platform);
      }
      
      // Rafraîchir les données si la configuration est activée
      if (config.enabled && testResults[platform]) {
        await refreshData();
      }
    } catch (error) {
      console.error(`Failed to save ${platform} configuration:`, error);
    }
  };

  const getStatusIcon = (platform: SocialPlatform) => {
    const status = syncStatuses.get(platform);
    const connected = isConnected(platform);
    
    if (testing[platform]) {
      return <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />;
    }
    
    if (testResults[platform] === true || connected) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
    
    if (testResults[platform] === false || status?.status === 'error') {
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
    
    if (status?.status === 'pending') {
      return <Clock className="w-4 h-4 text-yellow-500" />;
    }
    
    return <X className="w-4 h-4 text-gray-400" />;
  };

  const getStatusText = (platform: SocialPlatform) => {
    const status = syncStatuses.get(platform);
    const connected = isConnected(platform);
    
    if (testing[platform]) return 'Test en cours...';
    if (testResults[platform] === true || connected) return 'Connecté';
    if (testResults[platform] === false) return 'Échec de connexion';
    if (status?.status === 'error') return 'Erreur';
    if (status?.status === 'pending') return 'En attente';
    if (!configs[platform].enabled) return 'Désactivé';
    
    return 'Non configuré';
  };

  const renderTwitterConfig = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Configuration Twitter/X</h3>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={configs.twitter.enabled}
            onChange={(e) => handleConfigChange('twitter', 'enabled', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">Activé</span>
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            API Key
          </label>
          <div className="relative">
            <input
              type={showSecrets['twitter-apiKey'] ? 'text' : 'password'}
              value={configs.twitter.apiKey}
              onChange={(e) => handleConfigChange('twitter', 'apiKey', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Votre API Key Twitter"
            />
            <button
              type="button"
              onClick={() => toggleSecretVisibility('twitter-apiKey')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showSecrets['twitter-apiKey'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            API Secret
          </label>
          <div className="relative">
            <input
              type={showSecrets['twitter-apiSecret'] ? 'text' : 'password'}
              value={configs.twitter.apiSecret}
              onChange={(e) => handleConfigChange('twitter', 'apiSecret', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Votre API Secret Twitter"
            />
            <button
              type="button"
              onClick={() => toggleSecretVisibility('twitter-apiSecret')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showSecrets['twitter-apiSecret'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bearer Token
          </label>
          <div className="relative">
            <input
              type={showSecrets['twitter-bearerToken'] ? 'text' : 'password'}
              value={configs.twitter.bearerToken}
              onChange={(e) => handleConfigChange('twitter', 'bearerToken', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Votre Bearer Token Twitter"
            />
            <button
              type="button"
              onClick={() => toggleSecretVisibility('twitter-bearerToken')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showSecrets['twitter-bearerToken'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderYouTubeConfig = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Configuration YouTube</h3>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={configs.youtube.enabled}
            onChange={(e) => handleConfigChange('youtube', 'enabled', e.target.checked)}
            className="rounded border-gray-300 text-red-600 focus:ring-red-500"
          />
          <span className="text-sm text-gray-700">Activé</span>
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            API Key
          </label>
          <div className="relative">
            <input
              type={showSecrets['youtube-apiKey'] ? 'text' : 'password'}
              value={configs.youtube.apiKey}
              onChange={(e) => handleConfigChange('youtube', 'apiKey', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Votre API Key YouTube"
            />
            <button
              type="button"
              onClick={() => toggleSecretVisibility('youtube-apiKey')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showSecrets['youtube-apiKey'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Channel ID
          </label>
          <input
            type="text"
            value={configs.youtube.channelId}
            onChange={(e) => handleConfigChange('youtube', 'channelId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="ID de votre chaîne YouTube"
          />
        </div>
      </div>
    </div>
  );

  const renderFacebookConfig = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Configuration Facebook</h3>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={configs.facebook.enabled}
            onChange={(e) => handleConfigChange('facebook', 'enabled', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">Activé</span>
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            App ID
          </label>
          <input
            type="text"
            value={configs.facebook.appId}
            onChange={(e) => handleConfigChange('facebook', 'appId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="ID de votre application Facebook"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            App Secret
          </label>
          <div className="relative">
            <input
              type={showSecrets['facebook-appSecret'] ? 'text' : 'password'}
              value={configs.facebook.appSecret}
              onChange={(e) => handleConfigChange('facebook', 'appSecret', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Secret de votre application Facebook"
            />
            <button
              type="button"
              onClick={() => toggleSecretVisibility('facebook-appSecret')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showSecrets['facebook-appSecret'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Access Token
          </label>
          <div className="relative">
            <input
              type={showSecrets['facebook-accessToken'] ? 'text' : 'password'}
              value={configs.facebook.accessToken}
              onChange={(e) => handleConfigChange('facebook', 'accessToken', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Token d'accès Facebook"
            />
            <button
              type="button"
              onClick={() => toggleSecretVisibility('facebook-accessToken')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showSecrets['facebook-accessToken'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Page ID
          </label>
          <input
            type="text"
            value={configs.facebook.pageId}
            onChange={(e) => handleConfigChange('facebook', 'pageId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="ID de votre page Facebook"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className={`bg-white rounded-lg shadow-md ${className}`}>
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Settings className="w-6 h-6 text-gray-600" />
            <h2 className="text-xl font-bold text-gray-900">
              Intégrations Réseaux Sociaux
            </h2>
          </div>
          
          <button
            onClick={refreshData}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Actualiser</span>
          </button>
        </div>
      </div>

      {/* Onglets */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {(['twitter', 'youtube', 'facebook'] as SocialPlatform[]).map((platform) => (
            <button
              key={platform}
              onClick={() => setActiveTab(platform)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === platform
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className="capitalize">{platform}</span>
                {getStatusIcon(platform)}
              </div>
            </button>
          ))}
        </nav>
      </div>

      {/* Contenu des onglets */}
      <div className="p-6">
        {/* Statut de la plateforme */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getStatusIcon(activeTab)}
              <div>
                <p className="font-medium text-gray-900">
                  Statut: {getStatusText(activeTab)}
                </p>
                {syncStatuses.get(activeTab)?.lastSync && (
                  <p className="text-sm text-gray-500">
                    Dernière sync: {syncStatuses.get(activeTab)?.lastSync.toLocaleString()}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => testConnection(activeTab)}
                disabled={testing[activeTab] || !configs[activeTab].enabled}
                className="flex items-center space-x-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
              >
                <TestTube className="w-4 h-4" />
                <span>Tester</span>
              </button>
              
              <button
                onClick={() => saveConfiguration(activeTab)}
                className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Sauvegarder</span>
              </button>
            </div>
          </div>
        </div>

        {/* Configuration spécifique */}
        {activeTab === 'twitter' && renderTwitterConfig()}
        {activeTab === 'youtube' && renderYouTubeConfig()}
        {activeTab === 'facebook' && renderFacebookConfig()}

        {/* Aide et documentation */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">
            Comment obtenir les clés API pour {activeTab}?
          </h4>
          <div className="text-sm text-blue-800">
            {activeTab === 'twitter' && (
              <div>
                <p>1. Allez sur <a href="https://developer.twitter.com" target="_blank" rel="noopener noreferrer" className="underline">developer.twitter.com</a></p>
                <p>2. Créez une nouvelle application</p>
                <p>3. Générez vos clés API et Bearer Token</p>
                <p>4. Configurez les permissions appropriées</p>
              </div>
            )}
            {activeTab === 'youtube' && (
              <div>
                <p>1. Allez sur <a href="https://console.developers.google.com" target="_blank" rel="noopener noreferrer" className="underline">Google Cloud Console</a></p>
                <p>2. Créez un nouveau projet ou sélectionnez un existant</p>
                <p>3. Activez l'API YouTube Data v3</p>
                <p>4. Créez des identifiants (clé API)</p>
              </div>
            )}
            {activeTab === 'facebook' && (
              <div>
                <p>1. Allez sur <a href="https://developers.facebook.com" target="_blank" rel="noopener noreferrer" className="underline">developers.facebook.com</a></p>
                <p>2. Créez une nouvelle application</p>
                <p>3. Ajoutez le produit "Facebook Login"</p>
                <p>4. Générez un token d'accès pour votre page</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SocialIntegrationPanel;