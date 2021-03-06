const staticCacheName = 'site-static-v3'
const dynamicCache = 'site-dynamic-v3'
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
  'https://fonts.gstatic.com/s/materialicons/v47/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',
  '/pages/fallback.html'
];

// cache size limit
const limitCacheSize = (name, size) => {
  caches.open(name).then(cache => {
    cache.keys().then(keys => {
      if(keys.length > size) {
        cache.delete(keys[0]).then(limitCacheSize(name, size))
      }
    })
  })
}


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
        .filter(key => key !== staticCacheName && key !== dynamicCache)
        .map(key => caches.delete(key))
      )
    })
  )

})

// fetch event
self.addEventListener('fetch', event => {
  if(event.request.url.indexOf('firestore.googleapis.com') === -1){
    event.respondWith(
      caches.match(event.request).then(cacheResponse => {
        return cacheResponse || fetch(event.request).then(fetchResponse => {
          return caches.open(dynamicCache).then(cache => {
            cache.put(event.request.url, fetchResponse.clone())
            limitCacheSize(dynamicCache, 15)
            return fetchResponse
          })
        })
      }).catch(() => {
        // if we fail to fetch an html pager, replace with fallback. Don't replace images / css etc.
        if(event.request.url.indexOf('.html')) {
          caches.match('/pages/fallback.html')
        }
      })
    )
  }
})