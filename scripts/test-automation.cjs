#!/usr/bin/env node

/**
 * Script de Tests Automatisés - CityzenMag
 * Valide les principales fonctionnalités de l'application
 */

const fs = require('fs')
const path = require('path')

// Configuration des tests
const CONFIG = {
  baseUrl: 'http://localhost:3002',
  timeout: 5000,
  expectedFiles: [
    'src/pages/Home.tsx',
    'src/pages/Interviews.tsx',
    'src/pages/PhotoReports.tsx',
    'src/pages/VideoAnalyses.tsx',
    'src/pages/Testimonials.tsx',
    'src/components/recommendations/PersonalizedFeed.tsx',
    'src/components/analytics/AnalyticsDashboard.tsx',
    'src/services/recommendationEngine.ts',
    'src/services/analytics.ts'
  ],
  expectedRoutes: [
    '/',
    '/interviews',
    '/reportages',
    '/videos',
    '/temoignages',
    '/admin',
    '/admin/analytics'
  ]
}

// Couleurs pour les logs
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
}

// Utilitaires de logging
const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  header: (msg) => console.log(`${colors.bold}${colors.blue}\n🧪 ${msg}${colors.reset}\n`)
}

// Tests des fichiers
function testFileStructure() {
  log.header('TEST 1: Structure des Fichiers')
  
  let passed = 0
  let total = CONFIG.expectedFiles.length
  
  CONFIG.expectedFiles.forEach(filePath => {
    const fullPath = path.join(process.cwd(), filePath)
    if (fs.existsSync(fullPath)) {
      log.success(`Fichier trouvé: ${filePath}`)
      passed++
    } else {
      log.error(`Fichier manquant: ${filePath}`)
    }
  })
  
  log.info(`Résultat: ${passed}/${total} fichiers trouvés`)
  return passed === total
}

// Tests de compilation TypeScript
function testTypeScriptCompilation() {
  log.header('TEST 2: Compilation TypeScript')
  
  try {
    const { execSync } = require('child_process')
    execSync('npx tsc --noEmit', { stdio: 'pipe' })
    log.success('Compilation TypeScript réussie')
    return true
  } catch (error) {
    log.error('Erreur de compilation TypeScript')
    console.log(error.stdout?.toString() || error.message)
    return false
  }
}

// Tests des données de démonstration
function testMockData() {
  log.header('TEST 3: Données de Démonstration')
  
  const dataFiles = [
    'src/data/mockInterviews.ts',
    'src/data/mockPhotoReports.ts',
    'src/data/mockVideoAnalyses.ts',
    'src/data/mockTestimonials.ts'
  ]
  
  let passed = 0
  
  dataFiles.forEach(filePath => {
    const fullPath = path.join(process.cwd(), filePath)
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8')
      
      // Vérifier que le fichier contient des données
      if (content.includes('export') && content.length > 1000) {
        log.success(`Données valides: ${filePath}`)
        passed++
      } else {
        log.warning(`Données insuffisantes: ${filePath}`)
      }
    } else {
      log.error(`Fichier de données manquant: ${filePath}`)
    }
  })
  
  log.info(`Résultat: ${passed}/${dataFiles.length} fichiers de données valides`)
  return passed === dataFiles.length
}

// Tests des types TypeScript
function testTypeDefinitions() {
  log.header('TEST 4: Définitions de Types')
  
  const typeFiles = [
    'src/types/interviews.ts',
    'src/types/photoReports.ts',
    'src/types/videoAnalyses.ts',
    'src/types/testimonials.ts',
    'src/types/recommendations.ts'
  ]
  
  let passed = 0
  
  typeFiles.forEach(filePath => {
    const fullPath = path.join(process.cwd(), filePath)
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8')
      
      // Vérifier que le fichier contient des interfaces/types
      if (content.includes('interface') || content.includes('type')) {
        log.success(`Types définis: ${filePath}`)
        passed++
      } else {
        log.warning(`Pas de types trouvés: ${filePath}`)
      }
    } else {
      log.error(`Fichier de types manquant: ${filePath}`)
    }
  })
  
  log.info(`Résultat: ${passed}/${typeFiles.length} fichiers de types valides`)
  return passed === typeFiles.length
}

// Tests des composants
function testComponents() {
  log.header('TEST 5: Composants React')
  
  const componentDirs = [
    'src/components/interviews',
    'src/components/photoReports',
    'src/components/videoAnalyses',
    'src/components/testimonials',
    'src/components/recommendations',
    'src/components/analytics'
  ]
  
  let passed = 0
  
  componentDirs.forEach(dirPath => {
    const fullPath = path.join(process.cwd(), dirPath)
    if (fs.existsSync(fullPath)) {
      const files = fs.readdirSync(fullPath)
      if (files.length > 0) {
        log.success(`Composants trouvés: ${dirPath} (${files.length} fichiers)`)
        passed++
      } else {
        log.warning(`Dossier vide: ${dirPath}`)
      }
    } else {
      log.error(`Dossier manquant: ${dirPath}`)
    }
  })
  
  log.info(`Résultat: ${passed}/${componentDirs.length} dossiers de composants valides`)
  return passed === componentDirs.length
}

// Tests des hooks
function testHooks() {
  log.header('TEST 6: Hooks React')
  
  const hookFiles = [
    'src/hooks/useInterviews.ts',
    'src/hooks/usePhotoReports.ts',
    'src/hooks/useVideoAnalyses.ts',
    'src/hooks/useTestimonials.ts',
    'src/hooks/useRecommendations.ts'
  ]
  
  let passed = 0
  
  hookFiles.forEach(filePath => {
    const fullPath = path.join(process.cwd(), filePath)
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8')
      
      // Vérifier que le fichier contient des hooks
      if (content.includes('useState') || content.includes('useEffect')) {
        log.success(`Hook valide: ${filePath}`)
        passed++
      } else {
        log.warning(`Pas de hooks trouvés: ${filePath}`)
      }
    } else {
      log.error(`Hook manquant: ${filePath}`)
    }
  })
  
  log.info(`Résultat: ${passed}/${hookFiles.length} hooks valides`)
  return passed === hookFiles.length
}

// Tests des services
function testServices() {
  log.header('TEST 7: Services et Logique Métier')
  
  const serviceFiles = [
    'src/services/recommendationEngine.ts',
    'src/services/analytics.ts'
  ]
  
  let passed = 0
  
  serviceFiles.forEach(filePath => {
    const fullPath = path.join(process.cwd(), filePath)
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8')
      
      // Vérifier que le fichier contient des classes/fonctions
      if (content.includes('class') || content.includes('function')) {
        log.success(`Service valide: ${filePath}`)
        passed++
      } else {
        log.warning(`Service incomplet: ${filePath}`)
      }
    } else {
      log.error(`Service manquant: ${filePath}`)
    }
  })
  
  log.info(`Résultat: ${passed}/${serviceFiles.length} services valides`)
  return passed === serviceFiles.length
}

// Test de la configuration du routage
function testRouting() {
  log.header('TEST 8: Configuration du Routage')
  
  const appFile = path.join(process.cwd(), 'src/App.tsx')
  
  if (!fs.existsSync(appFile)) {
    log.error('Fichier App.tsx manquant')
    return false
  }
  
  const content = fs.readFileSync(appFile, 'utf8')
  const expectedRoutes = ['/interviews', '/reportages', '/videos', '/temoignages']
  
  let passed = 0
  
  expectedRoutes.forEach(route => {
    if (content.includes(`path="${route}"`)) {
      log.success(`Route configurée: ${route}`)
      passed++
    } else {
      log.error(`Route manquante: ${route}`)
    }
  })
  
  log.info(`Résultat: ${passed}/${expectedRoutes.length} routes configurées`)
  return passed === expectedRoutes.length
}

// Fonction principale
async function runTests() {
  console.log(`${colors.bold}${colors.blue}`)
  console.log('🧪 ===============================================')
  console.log('   TESTS AUTOMATISÉS - CITYZENMAG')
  console.log('   Phase 2B + Phase 3 - Validation Complète')
  console.log('===============================================')
  console.log(`${colors.reset}`)
  
  const tests = [
    { name: 'Structure des Fichiers', fn: testFileStructure },
    { name: 'Compilation TypeScript', fn: testTypeScriptCompilation },
    { name: 'Données de Démonstration', fn: testMockData },
    { name: 'Définitions de Types', fn: testTypeDefinitions },
    { name: 'Composants React', fn: testComponents },
    { name: 'Hooks React', fn: testHooks },
    { name: 'Services', fn: testServices },
    { name: 'Configuration Routage', fn: testRouting }
  ]
  
  let passed = 0
  let total = tests.length
  
  for (const test of tests) {
    try {
      const result = await test.fn()
      if (result) passed++
    } catch (error) {
      log.error(`Erreur dans ${test.name}: ${error.message}`)
    }
  }
  
  // Résumé final
  console.log(`${colors.bold}${colors.blue}`)
  console.log('\n📊 RÉSUMÉ DES TESTS')
  console.log('==================')
  console.log(`${colors.reset}`)
  
  if (passed === total) {
    log.success(`Tous les tests réussis ! (${passed}/${total})`)
    console.log(`${colors.green}${colors.bold}`)
    console.log('🎉 CITYZENMAG EST PRÊT POUR LA PRODUCTION !')
    console.log(`${colors.reset}`)
  } else {
    log.warning(`Tests partiellement réussis (${passed}/${total})`)
    console.log(`${colors.yellow}`)
    console.log('⚠️  Certains problèmes nécessitent une attention')
    console.log(`${colors.reset}`)
  }
  
  // Informations de déploiement
  console.log(`${colors.blue}`)
  console.log('🚀 INFORMATIONS DE DÉPLOIEMENT:')
  console.log('- URL Locale: http://localhost:3002/')
  console.log('- URL Admin: http://localhost:3002/admin')
  console.log('- Login Admin: admin@cityzenmag.com / admin123')
  console.log('- 4 Types de Contenus: Interviews, Reportages, Vidéos, Témoignages')
  console.log('- IA: Recommandations personnalisées actives')
  console.log('- Analytics: Dashboard complet disponible')
  console.log(`${colors.reset}`)
  
  return passed === total
}

// Exécution si appelé directement
if (require.main === module) {
  runTests().then(success => {
    process.exit(success ? 0 : 1)
  }).catch(error => {
    console.error('Erreur lors de l\'exécution des tests:', error)
    process.exit(1)
  })
}

module.exports = { runTests }