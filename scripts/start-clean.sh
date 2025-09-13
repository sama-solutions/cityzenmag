#!/bin/bash

# Script pour démarrer l'application en arrêtant d'abord les processus existants
# Usage: npm run start:clean

PORT=3002
APP_NAME="CityzenMag"

echo "🔧 Démarrage propre de $APP_NAME sur le port $PORT"
echo "=" $(printf '=%.0s' {1..60})

# Fonction pour arrêter les processus sur le port
stop_port_processes() {
    echo "🔍 Vérification du port $PORT..."
    
    # Trouver les processus utilisant le port
    PIDS=$(lsof -ti :$PORT 2>/dev/null)
    
    if [ -z "$PIDS" ]; then
        echo "✅ Port $PORT libre"
        return 0
    fi
    
    echo "⚠️  Processus détectés sur le port $PORT:"
    lsof -i :$PORT
    
    echo "🛑 Arrêt des processus..."
    for PID in $PIDS; do
        echo "   Arrêt du processus $PID"
        kill $PID 2>/dev/null
        
        # Attendre un peu pour l'arrêt gracieux
        sleep 1
        
        # Vérifier si le processus est toujours actif
        if kill -0 $PID 2>/dev/null; then
            echo "   Force l'arrêt du processus $PID"
            kill -9 $PID 2>/dev/null
        fi
    done
    
    # Attendre que le port se libère
    echo "⏳ Attente de la libération du port..."
    sleep 2
    
    # Vérification finale
    REMAINING=$(lsof -ti :$PORT 2>/dev/null)
    if [ -z "$REMAINING" ]; then
        echo "✅ Port $PORT libéré avec succès"
    else
        echo "❌ Certains processus persistent sur le port $PORT"
        lsof -i :$PORT
        return 1
    fi
}

# Fonction pour démarrer l'application
start_application() {
    echo "🚀 Démarrage de l'application..."
    echo "📱 URL: http://localhost:$PORT/"
    echo "🔧 Pour arrêter: Ctrl+C"
    echo ""
    
    # Démarrer avec npm
    npm start
}

# Exécution principale
main() {
    # Arrêter les processus existants
    stop_port_processes
    
    if [ $? -eq 0 ]; then
        # Démarrer l'application
        start_application
    else
        echo "❌ Impossible de libérer le port $PORT"
        echo "💡 Essayez manuellement: sudo lsof -ti :$PORT | xargs kill -9"
        exit 1
    fi
}

# Gestion des signaux pour arrêt propre
trap 'echo ""; echo "🛑 Arrêt de l'\''application..."; exit 0' INT TERM

# Lancer le script principal
main