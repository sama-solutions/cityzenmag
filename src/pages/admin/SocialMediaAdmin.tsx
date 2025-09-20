// Page d'administration des réseaux sociaux

import React, { useState } from 'react';
import { SocialProvider } from '../../contexts/SocialContext';
import SocialIntegrationPanel from '../../components/admin/SocialIntegrationPanel';
import SocialPublisher from '../../components/admin/SocialPublisher';
import SocialAnalyticsDashboard from '../../components/admin/SocialAnalyticsDashboard';
import SocialFeed from '../../components/social/SocialFeed';
import { getSocialConfig, validateSocialConfig } from '../../lib/socialConfig';
import { 
  Settings, 
  BarChart3, 
  Send, 
  Globe, 
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';

type TabType = 'dashboard' | 'feed' | 'publish' | 'settings';

export function SocialMediaAdmin() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [socialConfig] = useState(() => getSocialConfig());
  const [configValidation] = useState(() => validateSocialConfig(socialConfig));

  const tabs = [
    {
      id: 'dashboard' as TabType,
      name: 'Analytics',
      icon: BarChart3,
      description: 'Statistiques et performances'
    },
    {
      id: 'feed' as TabType,
      name: 'Feed Social',
      icon: Globe,
      description: 'Contenu des réseaux sociaux'
    },
    {
      id: 'publish' as TabType,
      name: 'Publication',
      icon: Send,
      description: 'Publier du contenu'
    },
    {
      id: 'settings' as TabType,
      name: 'Configuration',
      icon: Settings,
      description: 'Paramètres des intégrations'
    }
  ];

  const renderConfigStatus = () => {
    if (!configValidation.valid) {
      return (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h3 className="font-medium text-red-800">Configuration Incomplète</h3>
          </div>
          <ul className="text-sm text-red-700 space-y-1">
            {configValidation.errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
          {configValidation.warnings.length > 0 && (
            <div className="mt-3">
              <h4 className="font-medium text-red-800 mb-1">Avertissements:</h4>
              <ul className="text-sm text-red-600 space-y-1">
                {configValidation.warnings.map((warning, index) => (
                  <li key={index}>• {warning}</li>
                ))}
              </ul>
            </div>
          )}
          <p className="text-sm text-red-600 mt-3">
            Allez dans l'onglet Configuration pour configurer vos intégrations.
          </p>
        </div>
      );
    }

    if (configValidation.warnings.length > 0) {
      return (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Info className="w-5 h-5 text-yellow-500" />
            <h3 className="font-medium text-yellow-800">Configuration Partielle</h3>
          </div>
          <ul className="text-sm text-yellow-700 space-y-1">
            {configValidation.warnings.map((warning, index) => (
              <li key={index}>• {warning}</li>
            ))}
          </ul>
        </div>
      );
    }

    return (
      <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <h3 className="font-medium text-green-800">Configuration Complète</h3>
        </div>
        <p className="text-sm text-green-700 mt-1">
          Toutes les intégrations sont correctement configurées.
        </p>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <SocialAnalyticsDashboard />;
      
      case 'feed':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Feed Social Multi-Réseaux
              </h2>
              <p className="text-gray-600 mb-6">
                Visualisez et gérez le contenu de tous vos réseaux sociaux en un seul endroit.
              </p>
            </div>
            <SocialFeed 
              posts={[]} 
              layout="unified"
              showFilters={true}
              showSearch={true}
            />
          </div>
        );
      
      case 'publish':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Publication Multi-Plateformes
              </h2>
              <p className="text-gray-600 mb-6">
                Créez et publiez du contenu sur plusieurs réseaux sociaux simultanément.
              </p>
            </div>
            <SocialPublisher />
          </div>
        );
      
      case 'settings':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Configuration des Intégrations
              </h2>
              <p className="text-gray-600 mb-6">
                Configurez vos comptes de réseaux sociaux et gérez les paramètres d'intégration.
              </p>
            </div>
            <SocialIntegrationPanel />
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <SocialProvider config={socialConfig} autoSync={true} syncInterval={10 * 60 * 1000}>
      <div className="min-h-screen bg-gray-50">
        {/* En-tête */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Administration des Réseaux Sociaux
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Gérez vos intégrations Twitter, YouTube et Facebook
                  </p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-500">
                    CityzenMag Social Hub
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation par onglets */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon className="w-5 h-5" />
                      <span>{tab.name}</span>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Statut de configuration */}
          {renderConfigStatus()}
          
          {/* Contenu de l'onglet actif */}
          {renderTabContent()}
        </div>

        {/* Aide et documentation */}
        <div className="bg-white border-t border-gray-200 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Documentation</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>
                    <a href="https://developer.twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                      Twitter Developer Portal
                    </a>
                  </li>
                  <li>
                    <a href="https://developers.google.com/youtube/v3" target="_blank" rel="noopener noreferrer" className="hover:text-red-600">
                      YouTube Data API
                    </a>
                  </li>
                  <li>
                    <a href="https://developers.facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                      Facebook for Developers
                    </a>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Fonctionnalités</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Synchronisation automatique des contenus</li>
                  <li>• Publication multi-plateformes</li>
                  <li>• Analytics et métriques détaillées</li>
                  <li>• Gestion centralisée des hashtags</li>
                  <li>• Programmation de publications</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Support</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Configuration des API keys</li>
                  <li>• Résolution des problèmes de connexion</li>
                  <li>• Optimisation des performances</li>
                  <li>• Bonnes pratiques de publication</li>
                  <li>• Gestion des limites de taux</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SocialProvider>
  );
}

export default SocialMediaAdmin;