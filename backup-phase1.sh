#!/bin/bash

# 💾 Script de Backup CityzenMag - Phase 1 Complète
# ================================================

echo "🚀 Démarrage du backup CityzenMag Phase 1..."
echo "=============================================="

# Variables
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_NAME="cityzenmag-phase1-complete_${TIMESTAMP}"
BACKUP_DIR="../backups"
PROJECT_DIR="."

# Créer le dossier de backup s'il n'existe pas
mkdir -p "$BACKUP_DIR"

echo "📦 Création de l'archive de backup..."

# Créer l'archive tar.gz en excluant les dossiers inutiles
tar -czf "${BACKUP_DIR}/${BACKUP_NAME}.tar.gz" \
    --exclude="node_modules" \
    --exclude="dist" \
    --exclude=".git" \
    --exclude="*.log" \
    --exclude=".env.local" \
    --exclude=".DS_Store" \
    --exclude="coverage" \
    --exclude=".nyc_output" \
    --exclude="*.tmp" \
    --exclude="*.temp" \
    -C .. \
    "$(basename "$PWD")"

# Vérifier la création du backup
if [ -f "${BACKUP_DIR}/${BACKUP_NAME}.tar.gz" ]; then
    BACKUP_SIZE=$(du -h "${BACKUP_DIR}/${BACKUP_NAME}.tar.gz" | cut -f1)
    echo "✅ Backup créé avec succès !"
    echo "📁 Fichier: ${BACKUP_DIR}/${BACKUP_NAME}.tar.gz"
    echo "📊 Taille: ${BACKUP_SIZE}"
    echo ""
    
    # Afficher le contenu du backup
    echo "📋 Contenu du backup:"
    echo "===================="
    tar -tzf "${BACKUP_DIR}/${BACKUP_NAME}.tar.gz" | head -20
    echo "... (et plus)"
    echo ""
    
    # Informations sur le projet
    echo "🎯 État du projet sauvegardé:"
    echo "============================="
    echo "✅ Phase 1 - Fonctionnalités de base complètes"
    echo "✅ Extraction automatique des titres Twitter"
    echo "✅ Article le plus récent intégré dans Hero"
    echo "✅ Pages Débats et Partage d'histoires"
    echo "✅ Interface française complète"
    echo "✅ Thèmes sénégalais/minimaliste"
    echo "✅ Design responsive"
    echo "✅ Documentation complète"
    echo ""
    
    # Commit info
    LAST_COMMIT=$(git log -1 --format="%h - %s")
    echo "📝 Dernier commit: $LAST_COMMIT"
    echo ""
    
    # Instructions de restauration
    echo "🔄 Pour restaurer ce backup:"
    echo "============================"
    echo "cd /path/to/restore/location"
    echo "tar -xzf ${BACKUP_DIR}/${BACKUP_NAME}.tar.gz"
    echo "cd $(basename "$PWD")"
    echo "npm install"
    echo "npm start"
    echo ""
    
    echo "🎉 Backup Phase 1 terminé avec succès !"
    echo "Prêt pour continuer le développement Phase 2"
    
else
    echo "❌ Erreur lors de la création du backup"
    exit 1
fi