#!/bin/bash

# Script de sauvegarde CityzenMag
# Usage: ./backup.sh

echo "🔄 Création de la sauvegarde CityzenMag..."
echo "========================================"

# Variables
PROJECT_NAME="cityzenmag-loi200812-blog"
BACKUP_DIR="../backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_NAME="${PROJECT_NAME}_${TIMESTAMP}"
CURRENT_DIR=$(pwd)

# Créer le dossier de sauvegarde s'il n'existe pas
mkdir -p "$BACKUP_DIR"

echo "📁 Dossier de sauvegarde: $BACKUP_DIR"
echo "📦 Nom de sauvegarde: $BACKUP_NAME"

# Créer l'archive tar.gz en excluant node_modules et autres fichiers temporaires
echo "🗜️ Création de l'archive..."
tar -czf "$BACKUP_DIR/${BACKUP_NAME}.tar.gz" \
    --exclude='node_modules' \
    --exclude='.git' \
    --exclude='dist' \
    --exclude='build' \
    --exclude='.vite' \
    --exclude='.tmp' \
    --exclude='*.log' \
    --exclude='*.tsbuildinfo' \
    --exclude='.env.local' \
    --exclude='diagnostic-*' \
    --exclude='test-*' \
    --exclude='debug-*' \
    --exclude='verification-*' \
    -C .. \
    "$(basename "$CURRENT_DIR")"

# Vérifier que l'archive a été créée
if [ -f "$BACKUP_DIR/${BACKUP_NAME}.tar.gz" ]; then
    BACKUP_SIZE=$(du -h "$BACKUP_DIR/${BACKUP_NAME}.tar.gz" | cut -f1)
    echo "✅ Sauvegarde créée avec succès!"
    echo "📍 Emplacement: $BACKUP_DIR/${BACKUP_NAME}.tar.gz"
    echo "📏 Taille: $BACKUP_SIZE"
    
    # Créer un fichier de métadonnées
    cat > "$BACKUP_DIR/${BACKUP_NAME}_info.txt" << EOF
CityzenMag Blog - Sauvegarde
============================

Date de création: $(date)
Version: 1.0.1
Commit: $(git rev-parse HEAD 2>/dev/null || echo "Non disponible")
Taille: $BACKUP_SIZE

État du projet:
- ✅ Articles affichés (8 threads)
- ✅ Pages de détail fonctionnelles
- ✅ Navigation et filtres opérationnels
- ✅ Thèmes sénégalais/minimaliste
- ✅ Base Supabase connectée (72 tweets, 72 médias)

Stack technique:
- React 18 + TypeScript + Vite
- Supabase (PostgreSQL + Edge Functions)
- Tailwind CSS + Radix UI
- React Router v6

Prochaines étapes:
- Phase 1: Nouveaux types de contenus
- Phase 2: Layouts avancés
- Phase 3: Fonctionnalités interactives

Pour restaurer:
1. Extraire: tar -xzf ${BACKUP_NAME}.tar.gz
2. Installer: npm install
3. Démarrer: npm start
EOF

    echo "📝 Fichier d'informations créé: ${BACKUP_NAME}_info.txt"
    
    # Lister les sauvegardes existantes
    echo ""
    echo "📋 Sauvegardes disponibles:"
    ls -lh "$BACKUP_DIR"/*.tar.gz 2>/dev/null | tail -5 || echo "Aucune sauvegarde précédente"
    
else
    echo "❌ Erreur lors de la création de la sauvegarde"
    exit 1
fi

echo ""
echo "🎉 Sauvegarde terminée avec succès!"
echo "💡 Pour restaurer: tar -xzf $BACKUP_DIR/${BACKUP_NAME}.tar.gz"