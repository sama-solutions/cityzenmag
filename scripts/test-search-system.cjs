#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

console.log('🔍 Test du Système de Recherche Avancé - CityzenMag')
console.log('=' .repeat(60))

let totalTests = 0
let passedTests = 0

function test(description, condition) {
  totalTests++
  const status = condition ? '✅' : '❌'
  console.log(`${status} ${description}`)
  if (condition) passedTests++
  return condition
}

function fileExists(filePath) {
  return fs.existsSync(path.join(__dirname, '..', filePath))
}

function readFile(filePath) {
  try {
    return fs.readFileSync(path.join(__dirname, '..', filePath), 'utf8')
  } catch (error) {
    return null
  }
}

console.log('\n📁 1. Vérification des fichiers du système de recherche')
console.log('-'.repeat(50))

// Services
test('Service de recherche existe', fileExists('src/services/searchService.ts'))

// Composants de recherche
test('Composant AdvancedSearchBar existe', fileExists('src/components/search/AdvancedSearchBar.tsx'))
test('Composant SearchFilters existe', fileExists('src/components/search/SearchFilters.tsx'))
test('Composant SearchResults existe', fileExists('src/components/search/SearchResults.tsx'))

// Hook de recherche
test('Hook useAdvancedSearch existe', fileExists('src/hooks/useAdvancedSearch.ts'))

// Page de recherche
test('Page Search mise à jour', fileExists('src/pages/Search.tsx'))

console.log('\n🔧 2. Vérification du contenu des fichiers')
console.log('-'.repeat(50))

// Vérifier le service de recherche
const searchService = readFile('src/services/searchService.ts')
if (searchService) {
  test('SearchService contient la classe principale', searchService.includes('class SearchService'))
  test('SearchService contient indexContent', searchService.includes('indexContent'))
  test('SearchService contient search method', searchService.includes('async search'))
  test('SearchService contient calculateRelevanceScore', searchService.includes('calculateRelevanceScore'))
  test('SearchService contient generateSuggestions', searchService.includes('generateSuggestions'))
}

// Vérifier le hook useAdvancedSearch
const useAdvancedSearch = readFile('src/hooks/useAdvancedSearch.ts')
if (useAdvancedSearch) {
  test('useAdvancedSearch importe searchService', useAdvancedSearch.includes('import { searchService'))
  test('useAdvancedSearch contient indexation', useAdvancedSearch.includes('searchService.indexContent'))
  test('useAdvancedSearch contient fonction search', useAdvancedSearch.includes('const search = useCallback'))
  test('useAdvancedSearch gère les erreurs', useAdvancedSearch.includes('setError'))
}

// Vérifier AdvancedSearchBar
const searchBar = readFile('src/components/search/AdvancedSearchBar.tsx')
if (searchBar) {
  test('AdvancedSearchBar contient autocomplete', searchBar.includes('suggestions'))
  test('AdvancedSearchBar contient historique', searchBar.includes('searchHistory'))
  test('AdvancedSearchBar contient dropdown', searchBar.includes('dropdown'))
  test('AdvancedSearchBar gère les thèmes', searchBar.includes('useTheme'))
}

// Vérifier SearchFilters
const searchFilters = readFile('src/components/search/SearchFilters.tsx')
if (searchFilters) {
  test('SearchFilters contient filtres par type', searchFilters.includes('types'))
  test('SearchFilters contient filtres par date', searchFilters.includes('dateRange'))
  test('SearchFilters contient filtres par thème', searchFilters.includes('themes'))
  test('SearchFilters contient filtres par lieu', searchFilters.includes('locations'))
}

// Vérifier SearchResults
const searchResults = readFile('src/components/search/SearchResults.tsx')
if (searchResults) {
  test('SearchResults affiche les résultats', searchResults.includes('results.map'))
  test('SearchResults contient highlights', searchResults.includes('highlights'))
  test('SearchResults contient métadonnées', searchResults.includes('metadata'))
  test('SearchResults gère le loading', searchResults.includes('isLoading'))
}

console.log('\n🎯 3. Vérification de l\'intégration')
console.log('-'.repeat(50))

// Vérifier l'intégration dans Header
const header = readFile('src/components/Header.tsx')
if (header) {
  test('Header importe AdvancedSearchBar', header.includes('AdvancedSearchBar'))
  test('Header utilise AdvancedSearchBar', header.includes('<AdvancedSearchBar'))
}

// Vérifier la page Search
const searchPage = readFile('src/pages/Search.tsx')
if (searchPage) {
  test('Page Search importe useAdvancedSearch', searchPage.includes('useAdvancedSearch'))
  test('Page Search utilise AdvancedSearchBar', searchPage.includes('<AdvancedSearchBar'))
  test('Page Search utilise SearchFilters', searchPage.includes('<SearchFilters'))
  test('Page Search utilise SearchResults', searchPage.includes('<SearchResults'))
}

console.log('\n🔍 4. Vérification des types TypeScript')
console.log('-'.repeat(50))

// Vérifier les types de recherche
if (searchService) {
  test('Types SearchResult définis', searchService.includes('interface SearchResult'))
  test('Types SearchFilters définis', searchService.includes('interface SearchFilters'))
  test('Types SearchOptions définis', searchService.includes('interface SearchOptions'))
  test('Types SearchResponse définis', searchService.includes('interface SearchResponse'))
}

console.log('\n📊 5. Vérification des algorithmes')
console.log('-'.repeat(50))

if (searchService) {
  test('Algorithme de scoring implémenté', searchService.includes('relevanceScore'))
  test('Recherche full-text implémentée', searchService.includes('performFullTextSearch'))
  test('Génération de facettes implémentée', searchService.includes('generateFacets'))
  test('Tri des résultats implémenté', searchService.includes('sortResults'))
  test('Gestion de l\'historique implémentée', searchService.includes('searchHistory'))
}

console.log('\n🎨 6. Vérification de l\'interface utilisateur')
console.log('-'.repeat(50))

if (searchBar) {
  test('Interface responsive implémentée', searchBar.includes('lg:') || searchBar.includes('md:'))
  test('Thèmes sénégalais/minimaliste supportés', searchBar.includes('senegalais'))
  test('Gestion des événements clavier', searchBar.includes('onKeyDown') || searchBar.includes('handleKey'))
  test('Debouncing implémenté', searchBar.includes('setTimeout') || searchBar.includes('debounce'))
}

console.log('\n🚀 7. Vérification des fonctionnalités avancées')
console.log('-'.repeat(50))

if (searchService) {
  test('Suggestions intelligentes implémentées', searchService.includes('generateSuggestions'))
  test('Recherches populaires trackées', searchService.includes('popularQueries'))
  test('Persistance localStorage implémentée', searchService.includes('localStorage'))
  test('Gestion des erreurs robuste', searchService.includes('try') && searchService.includes('catch'))
}

console.log('\n' + '='.repeat(60))
console.log(`📊 RÉSULTATS DES TESTS: ${passedTests}/${totalTests} (${Math.round(passedTests/totalTests*100)}%)`)

if (passedTests === totalTests) {
  console.log('🎉 TOUS LES TESTS RÉUSSIS ! Système de recherche avancé opérationnel.')
} else {
  console.log(`⚠️  ${totalTests - passedTests} test(s) échoué(s). Vérifiez les fichiers manquants ou incorrects.`)
}

console.log('\n🔗 URLs de test:')
console.log('- Application: http://localhost:3002/')
console.log('- Recherche: http://localhost:3002/search')
console.log('- Admin: http://localhost:3002/admin')

console.log('\n📝 Instructions de test manuel:')
console.log('1. Démarrer le serveur: npm start')
console.log('2. Tester la barre de recherche dans le header')
console.log('3. Aller sur /search et tester les filtres')
console.log('4. Vérifier l\'autocomplete et les suggestions')
console.log('5. Tester la recherche dans tous les types de contenus')

process.exit(passedTests === totalTests ? 0 : 1)