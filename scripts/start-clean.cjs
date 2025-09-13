#!/usr/bin/env node

const { execSync, spawn } = require('child_process')
const process = require('process')

const PORT = 3002
const APP_NAME = 'CityzenMag'

console.log(`🔧 Démarrage propre de ${APP_NAME} sur le port ${PORT}`)
console.log('=' .repeat(60))

// Fonction pour arrêter les processus sur le port
function stopPortProcesses() {
  console.log(`🔍 Vérification du port ${PORT}...`)
  
  try {
    // Trouver les processus utilisant le port
    const output = execSync(`lsof -ti :${PORT}`, { encoding: 'utf8', stdio: 'pipe' })
    const pids = output.trim().split('\n').filter(pid => pid)
    
    if (pids.length === 0) {
      console.log(`✅ Port ${PORT} libre`)
      return true
    }
    
    console.log(`⚠️  Processus détectés sur le port ${PORT}:`)
    try {
      const details = execSync(`lsof -i :${PORT}`, { encoding: 'utf8' })
      console.log(details)
    } catch (e) {
      // Ignore si lsof échoue pour les détails
    }
    
    console.log('🛑 Arrêt des processus...')
    pids.forEach(pid => {
      if (pid) {
        console.log(`   Arrêt du processus ${pid}`)
        try {
          execSync(`kill ${pid}`, { stdio: 'pipe' })
        } catch (e) {
          // Le processus était peut-être déjà arrêté
        }
      }
    })
    
    // Attendre un peu pour l'arrêt gracieux
    console.log('⏳ Attente de la libération du port...')
    setTimeout(() => {}, 2000) // Pause de 2 secondes
    
    // Vérification finale
    try {
      const remaining = execSync(`lsof -ti :${PORT}`, { encoding: 'utf8', stdio: 'pipe' })
      if (remaining.trim()) {
        console.log(`❌ Certains processus persistent sur le port ${PORT}`)
        console.log('💡 Essayez manuellement: sudo lsof -ti :3002 | xargs kill -9')
        return false
      }
    } catch (e) {
      // Pas de processus restant, c'est bon
    }
    
    console.log(`✅ Port ${PORT} libéré avec succès`)
    return true
    
  } catch (error) {
    // Aucun processus sur le port
    console.log(`✅ Port ${PORT} libre`)
    return true
  }
}

// Fonction pour démarrer l'application
function startApplication() {
  console.log('🚀 Démarrage de l\'application...')
  console.log(`📱 URL: http://localhost:${PORT}/`)
  console.log('🔧 Pour arrêter: Ctrl+C')
  console.log('')
  
  // Démarrer avec npm start
  const child = spawn('npm', ['start'], {
    stdio: 'inherit',
    shell: true
  })
  
  // Gestion de l'arrêt propre
  process.on('SIGINT', () => {
    console.log('\n🛑 Arrêt de l\'application...')
    child.kill('SIGINT')
    process.exit(0)
  })
  
  process.on('SIGTERM', () => {
    console.log('\n🛑 Arrêt de l\'application...')
    child.kill('SIGTERM')
    process.exit(0)
  })
  
  child.on('close', (code) => {
    console.log(`\n📊 Application fermée avec le code ${code}`)
    process.exit(code)
  })
}

// Exécution principale
function main() {
  // Arrêter les processus existants
  const success = stopPortProcesses()
  
  if (success) {
    // Petite pause avant de démarrer
    setTimeout(() => {
      startApplication()
    }, 1000)
  } else {
    console.log(`❌ Impossible de libérer le port ${PORT}`)
    console.log('💡 Essayez manuellement: sudo lsof -ti :3002 | xargs kill -9')
    process.exit(1)
  }
}

// Lancer le script principal
main()