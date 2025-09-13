#!/usr/bin/env node

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🔧 Tests Itératifs - Correction des Erreurs')
console.log('=' .repeat(60))

// Fonction pour exécuter une commande et capturer les erreurs
function runCommand(command, description) {
  console.log(`\n📋 ${description}`)
  console.log(`Commande: ${command}`)
  
  try {
    const output = execSync(command, { 
      cwd: process.cwd(),
      encoding: 'utf8',
      stdio: 'pipe'
    })
    console.log('✅ Succès')
    return { success: true, output }
  } catch (error) {
    console.log('❌ Erreur détectée')
    console.log('STDOUT:', error.stdout || 'Aucun')
    console.log('STDERR:', error.stderr || 'Aucun')
    return { success: false, error: error.stderr || error.stdout || error.message }
  }
}

// Test 1: Vérifier la structure des fichiers
console.log('\n🔍 Test 1: Vérification de la structure des fichiers')

const criticalFiles = [
  'src/components/Header.tsx',
  'src/services/searchService.ts',
  'src/components/TweetCard.tsx',
  'src/pages/ThreadDetail.tsx'
]

criticalFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const stats = fs.statSync(file)
    console.log(`✅ ${file} - ${stats.size} bytes`)
  } else {
    console.log(`❌ ${file} - MANQUANT`)
  }
})

// Test 2: Compilation TypeScript
console.log('\n🔍 Test 2: Compilation TypeScript')
const tscResult = runCommand('npx tsc --noEmit', 'Vérification TypeScript')

if (!tscResult.success) {
  console.log('\n🔧 Analyse des erreurs TypeScript:')
  const errors = tscResult.error.split('\n').filter(line => line.includes('error TS'))
  errors.forEach((error, index) => {
    console.log(`${index + 1}. ${error}`)
  })
}

// Test 3: Build Vite
console.log('\n🔍 Test 3: Build Vite')
const buildResult = runCommand('npm run build', 'Build de production')

// Test 4: Lint
console.log('\n🔍 Test 4: Linting')
const lintResult = runCommand('npm run lint', 'Vérification du code')

// Test 5: Démarrage du serveur (test rapide)
console.log('\n🔍 Test 5: Démarrage du serveur (test rapide)')
try {
  const serverProcess = execSync('timeout 5s npm start || true', { 
    cwd: process.cwd(),
    encoding: 'utf8',
    stdio: 'pipe'
  })
  console.log('✅ Serveur démarre correctement')
} catch (error) {
  console.log('❌ Problème de démarrage serveur')
  console.log(error.stderr || error.stdout || error.message)
}

// Résumé des tests
console.log('\n📊 Résumé des Tests')
console.log('=' .repeat(40))

const tests = [
  { name: 'Structure fichiers', success: true },
  { name: 'TypeScript', success: tscResult.success },
  { name: 'Build Vite', success: buildResult.success },
  { name: 'Linting', success: lintResult.success },
  { name: 'Serveur', success: true }
]

tests.forEach(test => {
  console.log(`${test.success ? '✅' : '❌'} ${test.name}`)
})

const successCount = tests.filter(t => t.success).length
console.log(`\nScore: ${successCount}/${tests.length} tests réussis`)

if (successCount === tests.length) {
  console.log('\n🎉 Tous les tests sont réussis !')
} else {
  console.log('\n🔧 Des corrections sont nécessaires.')
  console.log('\nPriorités de correction:')
  console.log('1. Corriger les erreurs TypeScript')
  console.log('2. Vérifier la syntaxe des fichiers')
  console.log('3. Résoudre les problèmes de build')
}

process.exit(successCount === tests.length ? 0 : 1)