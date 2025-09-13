#!/usr/bin/env node

console.log('🔍 Test Données Médias - CityzenMag')
console.log('=' .repeat(60))

console.log('\n📋 Vérifications à effectuer:')
console.log('1. Ouvrir http://localhost:3003/')
console.log('2. Ouvrir DevTools (F12) → Console')
console.log('3. Chercher les logs "🖼️ TweetCard media debug:"')

console.log('\n🔍 Analyse des logs:')
console.log('✓ Si tweetMediaFiles: 0 pour tous les tweets:')
console.log('  → Problème de données dans Supabase')
console.log('  → Vérifier la table media_files')
console.log('  → Vérifier les tweet_id correspondants')

console.log('\n✓ Si totalMediaFiles: 0:')
console.log('  → Aucun média récupéré de la base')
console.log('  → Problème de requête dans useThreadWithTweets')

console.log('\n✓ Si totalMediaFiles > 0 mais tweetMediaFiles: 0:')
console.log('  → Problème de filtrage par tweet_id')
console.log('  → Vérifier la correspondance des IDs')

console.log('\n🔧 Solutions possibles:')
console.log('1. Données manquantes:')
console.log('   - Synchroniser Twitter avec le bouton Sync')
console.log('   - Vérifier la connexion Supabase')
console.log('   - Contrôler les tables threads, tweets, media_files')

console.log('\n2. Problème de filtrage:')
console.log('   - Vérifier que media.tweet_id === tweet.tweet_id')
console.log('   - Contrôler les types de données (string vs number)')
console.log('   - Vérifier la casse des IDs')

console.log('\n3. Problème de requête:')
console.log('   - Vérifier useThreadWithTweets dans useData.ts')
console.log('   - Contrôler la requête media_files')
console.log('   - Vérifier les permissions Supabase')

console.log('\n📊 Structure attendue:')
console.log('- Thread → Tweets → MediaFiles')
console.log('- Chaque MediaFile a un tweet_id')
console.log('- Le filtrage associe les médias aux tweets')

console.log('\n🌐 URLs utiles:')
console.log('- Application: http://localhost:3003/')
console.log('- Supabase Dashboard: https://supabase.com/dashboard')

console.log('\n💡 Test rapide:')
console.log('1. Aller sur un thread')
console.log('2. Regarder les logs de debug')
console.log('3. Noter les valeurs de tweetMediaFiles')
console.log('4. Si 0 partout → problème de données')
console.log('5. Si > 0 quelque part → problème de filtrage')

process.exit(0)