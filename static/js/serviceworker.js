var shell = [
  '/api/launch/next/4',
  '/api/launch?limit=4&sort=desc&mode=summary&status=3,4,7',
  '/api/agency/121?mode=verbose&format=news',
  '/api/launch?limit=200&mode=summary&sort=desc&name=&lsp=121&format=stats',
  '/api/agency/124?mode=verbose&format=news',
  '/api/launch?limit=200&mode=summary&sort=desc&name=&lsp=124&format=stats',
  '/api/agency/115?mode=verbose&format=news',
  '/api/launch?limit=200&mode=summary&sort=desc&name=&lsp=115&format=stats',
  '/api/agency/63?mode=verbose&format=news',
  '/api/launch?limit=200&mode=summary&sort=desc&name=&lsp=63&format=stats',
  '/api/launch?mode=verbose&limit=20&sort=desc&status=3,4,7&offset=0',
  '/api/launch?mode=verbose&limit=20&status=1,2,5,6&offset=0',
  '/api/location?limit=30&mode=verbose&retired=0&offset=0',
  '/api/agency?limit=30&islsp=1&offset=0',
  '/api/rocket?mode=verbose&limit=30&offset=0',
  '/data/sources.json',
  '/css/style.min.css',
  '/js/app.js',
  '/js/Chart.js',
  '/js/materialize.js',
  '/js/fontawesome.js',
  '/manifest.json',
  '/index.html',
  '/'
];

self.onerror = function(message) {
  console.log(message);
};

self.addEventListener('activate', function(event) {
  event.waitUntil(function() {
    self.clients.claim();
    console.log('[ServiceWorker] Purging cache');
    caches.delete('rocketwatch');
    caches.open('rocketwatch').then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(shell);
    })
  })
});

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open('rocketwatch').then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(shell);
    })
  );
});

self.addEventListener('fetch', function(event) {
  if (event.request.url.match("rocket.watch/")) {
    event.respondWith(
      caches.open('rocketwatch').then(function(cache) {
        return cache.match(event.request).then(function(response) {
          return response || fetch(event.request).then(function(response) {
            cache.put(event.request, response.clone());
            return response;
          });
        });
      })
    );
  }
});
