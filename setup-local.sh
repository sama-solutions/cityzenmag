#!/bin/bash

echo "🚀 Installation locale de CityzenMag"
echo "===================================="

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez installer Node.js 18+ d'abord."
    exit 1
fi

# Vérifier la version de Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ requis. Version actuelle: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) détecté"

# Installer les dépendances
echo "📦 Installation des dépendances..."
if command -v pnpm &> /dev/null; then
    pnpm install
else
    npm install
fi

# Créer le fichier .env.local s'il n'existe pas
if [ ! -f ".env.local" ]; then
    echo "⚙️  Création du fichier de configuration..."
    cat > .env.local << EOL
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon

# Twitter/X API Configuration
TWITTER_BEARER_TOKEN=votre_bearer_token
TWITTER_ACCESS_TOKEN=votre_access_token
TWITTER_ACCESS_TOKEN_SECRET=votre_access_token_secret
TWITTER_API_KEY=votre_api_key
TWITTER_API_SECRET=votre_api_secret

# Supabase Backend
SUPABASE_ACCESS_TOKEN=votre_access_token_supabase
SUPABASE_PROJECT_ID=votre_project_id
EOL
    echo "📝 Fichier .env.local créé. Veuillez le configurer avec vos clés API."
else
    echo "⚠️  Le fichier .env.local existe déjà."
fi

echo ""
echo "🎉 Installation terminée !"
echo ""
echo "📋 Prochaines étapes :"
echo "1. Configurez vos clés API dans le fichier .env.local"
echo "2. Configurez votre base de données Supabase (voir INSTALLATION_LOCALE.md)"
echo "3. Déployez les Edge Functions Supabase"
echo "4. Lancez l'application avec: npm run dev"
echo ""
echo "📚 Consultez INSTALLATION_LOCALE.md pour le guide complet."