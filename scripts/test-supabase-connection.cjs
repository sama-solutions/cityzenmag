#!/usr/bin/env node

console.log('🔍 Test Connexion Supabase - CityzenMag')
console.log('=' .repeat(60))

console.log('\n📋 Vérifications de connectivité:')
console.log('1. L\'application démarre avec logs activés')
console.log('2. Ouvrir http://localhost:3003/ dans le navigateur')
console.log('3. Ouvrir DevTools (F12) → Console')
console.log('4. Observer les logs de récupération de données')

console.log('\n🔍 Logs Supabase à observer:')
console.log('✓ "🔍 useThreadWithTweets: Récupération du thread [ID]"')
console.log('✓ "✅ useThreadWithTweets: X tweets récupérés"')
console.log('✓ "✅ useThreadWithTweets: X médias récupérés"')

console.log('\n🚨 Problèmes de connexion possibles:')
console.log('❌ Si aucun log n\'apparaît:')
console.log('   → Problème de connexion Supabase')
console.log('   → Vérifier les clés API dans .env')
console.log('   → Contrôler la configuration Supabase')

console.log('\n❌ Si "0 tweets récupérés":')
console.log('   → Base de données vide')
console.log('   → Synchronisation Twitter nécessaire')
console.log('   → Vérifier les permissions de lecture')

console.log('\n❌ Si "0 médias récupérés":')
console.log('   → Pas d\'images dans les tweets')
console.log('   → Problème de synchronisation médias')
console.log('   → Vérifier la table media_files')

console.log('\n🔧 Solutions par problème:')
console.log('1. Connexion Supabase:')
console.log('   - Vérifier VITE_SUPABASE_URL dans .env')
console.log('   - Vérifier VITE_SUPABASE_ANON_KEY dans .env')
console.log('   - Tester la connexion réseau')

console.log('\n2. Données manquantes:')
console.log('   - Cliquer sur le bouton "Sync" dans l\'interface')
console.log('   - Attendre la synchronisation complète')
console.log('   - Rafraîchir la page après sync')

console.log('\n3. Médias manquants:')
console.log('   - Vérifier que les tweets ont des images')
console.log('   - Contrôler la table media_files dans Supabase')
console.log('   - Vérifier les permissions de stockage')

console.log('\n📊 Données attendues:')
console.log('- Au moins 1 thread récupéré')
console.log('- Plusieurs tweets par thread')
console.log('- Quelques médias associés aux tweets')
console.log('- Pas d\'erreurs de connexion')

console.log('\n🌐 URLs importantes:')
console.log('- Application: http://localhost:3003/')
console.log('- Supabase Dashboard: https://supabase.com/dashboard')

console.log('\n💡 Test rapide:')
console.log('1. Aller sur l\'application')
console.log('2. Cliquer sur un thread')
console.log('3. Observer les logs dans la console')
console.log('4. Noter le nombre de médias récupérés')
console.log('5. Si 0 médias → problème de données')
console.log('6. Si > 0 médias → problème d\'affichage')

console.log('\n🔄 Actions de récupération:')
console.log('- Synchroniser: Bouton "Sync" dans l\'interface')
console.log('- Rafraîchir: Ctrl+F5 après synchronisation')
console.log('- Vérifier: DevTools → Network pour les requêtes')
console.log('- Débugger: Console pour les erreurs détaillées')

process.exit(0)