// Service Worker pour CityzenMag PWA
const CACHE_NAME = 'cityzenmag-v1.0.0'
const STATIC_CACHE = 'cityzenmag-static-v1'
const DYNAMIC_CACHE = 'cityzenmag-dynamic-v1'
const API_CACHE = 'cityzenmag-api-v1'

// Ressources à mettre en cache immédiatement
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
]

// URLs des API à mettre en cache
const API_URLS = [
  'https://ghpptudzucrnygrozpht.supabase.co/rest/v1/threads',
  'https://ghpptudzucrnygrozpht.supabase.co/rest/v1/tweets',
  'https://ghpptudzucrnygrozpht.supabase.co/rest/v1/media_files'
]

// Installation du Service Worker
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker: Installation')
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('📦 Service Worker: Mise en cache des ressources statiques')
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        console.log('✅ Service Worker: Installation terminée')
        return self.skipWaiting()
      })
      .catch((error) => {
        console.error('❌ Service Worker: Erreur installation:', error)
      })
  )
})

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker: Activation')
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE && 
                cacheName !== API_CACHE) {
              console.log('🗑️ Service Worker: Suppression ancien cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        console.log('✅ Service Worker: Activation terminée')
        return self.clients.claim()
      })
  )
})

// Interception des requêtes
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)
  
  // Stratégie pour les ressources statiques
  if (STATIC_ASSETS.some(asset => request.url.includes(asset))) {
    event.respondWith(
      caches.match(request)
        .then((response) => {
          return response || fetch(request)
        })
    )
    return
  }
  
  // Stratégie pour les API Supabase (Cache First avec fallback)
  if (url.hostname.includes('supabase.co')) {
    event.respondWith(
      caches.open(API_CACHE)
        .then((cache) => {
          return cache.match(request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                // Retourner la réponse en cache et mettre à jour en arrière-plan
                fetch(request)
                  .then((fetchResponse) => {
                    if (fetchResponse.ok) {
                      cache.put(request, fetchResponse.clone())
                    }
                  })
                  .catch(() => {
                    // Ignorer les erreurs de mise à jour en arrière-plan
                  })
                return cachedResponse
              } else {
                // Pas de cache, essayer de récupérer et mettre en cache
                return fetch(request)
                  .then((fetchResponse) => {
                    if (fetchResponse.ok) {
                      cache.put(request, fetchResponse.clone())
                    }
                    return fetchResponse
                  })
                  .catch(() => {
                    // En cas d'erreur, retourner une réponse par défaut
                    return new Response(
                      JSON.stringify({ 
                        error: 'Données non disponibles hors ligne',
                        offline: true 
                      }),
                      {
                        status: 200,
                        headers: { 'Content-Type': 'application/json' }
                      }
                    )
                  })
              }
            })
        })
    )
    return
  }
  
  // Stratégie pour les autres ressources (Network First avec cache fallback)
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Si la réponse est OK, la mettre en cache
        if (response.ok) {
          const responseClone = response.clone()
          caches.open(DYNAMIC_CACHE)
            .then((cache) => {
              cache.put(request, responseClone)
            })
        }
        return response
      })
      .catch(() => {
        // En cas d'échec réseau, chercher en cache
        return caches.match(request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse
            }
            
            // Si c'est une navigation, retourner la page d'accueil en cache
            if (request.mode === 'navigate') {
              return caches.match('/')
            }
            
            // Sinon, retourner une réponse d'erreur
            return new Response(
              'Contenu non disponible hors ligne',
              {
                status: 503,
                statusText: 'Service Unavailable',
                headers: { 'Content-Type': 'text/plain' }
              }
            )
          })
      })
  )
})

// Gestion des messages du client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME })
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => caches.delete(cacheName))
      )
    }).then(() => {
      event.ports[0].postMessage({ success: true })
    })
  }
})

// Synchronisation en arrière-plan
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('🔄 Service Worker: Synchronisation en arrière-plan')
    event.waitUntil(
      // Ici on pourrait synchroniser les données avec Supabase
      Promise.resolve()
    )
  }
})

// Notifications push (pour plus tard)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json()
    const options = {
      body: data.body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey
      },
      actions: [
        {
          action: 'explore',
          title: 'Lire l\'article',
          icon: '/icons/icon-96x96.png'
        },
        {
          action: 'close',
          title: 'Fermer',
          icon: '/icons/icon-96x96.png'
        }
      ]
    }
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    )
  }
})

// Gestion des clics sur notifications
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    )
  }
})

console.log('🎉 Service Worker CityzenMag chargé avec succès')