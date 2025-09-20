// Composant pour publier sur plusieurs réseaux sociaux

import React, { useState } from 'react';
import { useSocialPublishing, useSocial } from '../../contexts/SocialContext';
import { SocialPlatform, PostContent } from '../../services/social/base/types';
import { 
  Send, 
  Image, 
  Calendar, 
  Hash, 
  AtSign, 
  X,
  CheckCircle,
  AlertCircle,
  Clock,
  Upload
} from 'lucide-react';

interface SocialPublisherProps {
  className?: string;
  onPublishSuccess?: () => void;
}

export function SocialPublisher({ className = '', onPublishSuccess }: SocialPublisherProps) {
  const { getEnabledPlatforms, isConnected } = useSocial();
  const { publish, publishToAll, publishing, publishResults, publishError, clearResults } = useSocialPublishing();

  const [content, setContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>([]);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [mentions, setMentions] = useState<string[]>([]);
  const [hashtagInput, setHashtagInput] = useState('');
  const [mentionInput, setMentionInput] = useState('');
  const [scheduledAt, setScheduledAt] = useState<Date | null>(null);
  const [media, setMedia] = useState<File[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const enabledPlatforms = getEnabledPlatforms();
  const connectedPlatforms = enabledPlatforms.filter(platform => isConnected(platform));

  const handlePlatformToggle = (platform: SocialPlatform) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const addHashtag = () => {
    if (hashtagInput.trim() && !hashtags.includes(hashtagInput.trim())) {
      setHashtags(prev => [...prev, hashtagInput.trim()]);
      setHashtagInput('');
    }
  };

  const removeHashtag = (tag: string) => {
    setHashtags(prev => prev.filter(t => t !== tag));
  };

  const addMention = () => {
    if (mentionInput.trim() && !mentions.includes(mentionInput.trim())) {
      setMentions(prev => [...prev, mentionInput.trim()]);
      setMentionInput('');
    }
  };

  const removeMention = (mention: string) => {
    setMentions(prev => prev.filter(m => m !== mention));
  };

  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setMedia(prev => [...prev, ...files].slice(0, 4)); // Limite à 4 fichiers
  };

  const removeMedia = (index: number) => {
    setMedia(prev => prev.filter((_, i) => i !== index));
  };

  const handlePublish = async () => {
    if (!content.trim()) return;

    const postContent: PostContent = {
      text: content,
      hashtags,
      mentions,
      media: media.length > 0 ? media : undefined,
      scheduledAt: scheduledAt || undefined
    };

    if (selectedPlatforms.length > 0) {
      await publish(selectedPlatforms, postContent);
    } else {
      await publishToAll(postContent);
    }

    if (onPublishSuccess) {
      onPublishSuccess();
    }
  };

  const resetForm = () => {
    setContent('');
    setSelectedPlatforms([]);
    setHashtags([]);
    setMentions([]);
    setHashtagInput('');
    setMentionInput('');
    setScheduledAt(null);
    setMedia([]);
    clearResults();
  };

  const getCharacterCount = () => {
    let totalLength = content.length;
    totalLength += hashtags.reduce((acc, tag) => acc + tag.length + 1, 0); // +1 pour le #
    totalLength += mentions.reduce((acc, mention) => acc + mention.length + 1, 0); // +1 pour le @
    return totalLength;
  };

  const getCharacterLimit = () => {
    if (selectedPlatforms.includes('twitter')) return 280;
    return 2000; // Limite générique pour autres plateformes
  };

  const isOverLimit = () => getCharacterCount() > getCharacterLimit();

  const getPlatformIcon = (platform: SocialPlatform) => {
    switch (platform) {
      case 'twitter': return '𝕏';
      case 'youtube': return '▶';
      case 'facebook': return 'f';
      default: return '?';
    }
  };

  const getPlatformColor = (platform: SocialPlatform) => {
    switch (platform) {
      case 'twitter': return 'bg-blue-500';
      case 'youtube': return 'bg-red-600';
      case 'facebook': return 'bg-blue-600';
      default: return 'bg-gray-500';
    }
  };

  const getResultIcon = (result: any) => {
    if (result instanceof Error) {
      return <AlertCircle className="w-5 h-5 text-red-500" />;
    }
    return <CheckCircle className="w-5 h-5 text-green-500" />;
  };

  return (
    <div className={`bg-white rounded-lg shadow-md ${className}`}>
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">
          Publier sur les Réseaux Sociaux
        </h2>
        <p className="text-gray-600 mt-1">
          Créez et publiez du contenu sur plusieurs plateformes simultanément
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* Sélection des plateformes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Plateformes cibles
          </label>
          <div className="flex flex-wrap gap-3">
            {connectedPlatforms.map(platform => (
              <label
                key={platform}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedPlatforms.includes(platform)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedPlatforms.includes(platform)}
                  onChange={() => handlePlatformToggle(platform)}
                  className="sr-only"
                />
                <div className={`w-6 h-6 ${getPlatformColor(platform)} rounded-full flex items-center justify-center text-white text-sm font-bold`}>
                  {getPlatformIcon(platform)}
                </div>
                <span className="font-medium capitalize">{platform}</span>
              </label>
            ))}
          </div>
          {selectedPlatforms.length === 0 && (
            <p className="text-sm text-gray-500 mt-2">
              Aucune plateforme sélectionnée - publiera sur toutes les plateformes connectées
            </p>
          )}
        </div>

        {/* Contenu principal */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contenu du post
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Que voulez-vous partager ?"
            rows={4}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
              isOverLimit() ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          <div className="flex justify-between items-center mt-2">
            <div className="text-sm text-gray-500">
              {getCharacterCount()}/{getCharacterLimit()} caractères
            </div>
            {isOverLimit() && (
              <div className="text-sm text-red-500">
                Limite de caractères dépassée
              </div>
            )}
          </div>
        </div>

        {/* Hashtags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hashtags
          </label>
          <div className="flex space-x-2 mb-2">
            <div className="relative flex-1">
              <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={hashtagInput}
                onChange={(e) => setHashtagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHashtag())}
                placeholder="Ajouter un hashtag"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={addHashtag}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ajouter
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {hashtags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center space-x-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
              >
                <span>#{tag}</span>
                <button
                  onClick={() => removeHashtag(tag)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Mentions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mentions
          </label>
          <div className="flex space-x-2 mb-2">
            <div className="relative flex-1">
              <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={mentionInput}
                onChange={(e) => setMentionInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMention())}
                placeholder="Ajouter une mention"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={addMention}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Ajouter
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {mentions.map((mention, index) => (
              <span
                key={index}
                className="inline-flex items-center space-x-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
              >
                <span>@{mention}</span>
                <button
                  onClick={() => removeMention(mention)}
                  className="text-green-600 hover:text-green-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Médias */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Médias (max 4)
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleMediaUpload}
              className="hidden"
              id="media-upload"
            />
            <label
              htmlFor="media-upload"
              className="flex flex-col items-center justify-center cursor-pointer"
            >
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-600">
                Cliquez pour ajouter des images ou vidéos
              </span>
            </label>
          </div>
          
          {media.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {media.map((file, index) => (
                <div key={index} className="relative">
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    {file.type.startsWith('image/') ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Media ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-gray-500 text-sm">Vidéo</span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => removeMedia(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Options avancées */}
        <div>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            {showAdvanced ? 'Masquer' : 'Afficher'} les options avancées
          </button>
          
          {showAdvanced && (
            <div className="mt-4 space-y-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Programmer la publication
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="datetime-local"
                    value={scheduledAt ? scheduledAt.toISOString().slice(0, 16) : ''}
                    onChange={(e) => setScheduledAt(e.target.value ? new Date(e.target.value) : null)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                {scheduledAt && (
                  <p className="text-sm text-gray-500 mt-1">
                    Publication programmée pour le {scheduledAt.toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Résultats de publication */}
        {publishResults && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Résultats de publication</h4>
            <div className="space-y-2">
              {Array.from(publishResults.entries()).map(([platform, result]) => (
                <div key={platform} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-5 h-5 ${getPlatformColor(platform)} rounded-full flex items-center justify-center text-white text-xs font-bold`}>
                      {getPlatformIcon(platform)}
                    </div>
                    <span className="capitalize">{platform}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getResultIcon(result)}
                    <span className={`text-sm ${result instanceof Error ? 'text-red-600' : 'text-green-600'}`}>
                      {result instanceof Error ? 'Échec' : 'Succès'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Erreur de publication */}
        {publishError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-700 font-medium">Erreur de publication</span>
            </div>
            <p className="text-red-600 text-sm mt-1">{publishError}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <button
            onClick={resetForm}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Réinitialiser
          </button>
          
          <div className="flex items-center space-x-3">
            {scheduledAt && (
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>Programmé</span>
              </div>
            )}
            
            <button
              onClick={handlePublish}
              disabled={!content.trim() || isOverLimit() || publishing}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>
                {publishing ? 'Publication...' : scheduledAt ? 'Programmer' : 'Publier'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SocialPublisher;