const staticCacheName = 'site-static-v1'
const assets = [
  '/',
  '/index.html',
  '/js/app.js',
  '/js/ui.js',
  '/js/materialize.min.js',
  '/css/styles.css',
  '/css/materialize.min.css',
  '/img/dish.png',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://fonts.gstatic.com/s/materialicons/v47/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2'
];


// install service worker
self.addEventListener('install', (event) => {
  // wait until makes the `install` step not terminate until async caching is complete.
  event.waitUntil(
    caches.open(staticCacheName).then(cache => {
      // cache.add() adds a single resource
      // cache.addAll() adds an array of resources
      console.log('caching shell assets')
      cache.addAll(assets)
    })
  )
})

// watch for activate service worker 
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      // console.log(keys); 
      return Promise.all(keys
        .filter(key => key !== staticCacheName)
        .map(key => caches.delete(key))
      )
    })
  )

})

// fetch event
self.addEventListener('fetch', event => {
  // console.log('fetch event', event)
  event.respondWith(
    caches.match(event.request).then(cacheResponse => {
      return cacheResponse || fetch(event.request)
    })
  )
})