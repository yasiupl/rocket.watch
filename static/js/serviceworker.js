var shell = [
  '/data/sources.json',
  '/css/style.min.css',
  '/js/app.min.js',
  '/js/Chart.js',
  '/js/materialize.min.js',
  '/js/fontawesome.min.js',
  '/manifest.json',
  '/index.html',
  '/'
];

self.onerror = function(message) {
  console.log(message);
};

caches.open('rocketwatch').then(function(cache) {
  fetch('/js/app.min.js').then(function(networkResponse) {
    cache.put('/js/app.min.js', networkResponse);
  });
});

self.addEventListener('activate', function(event) {
  event.waitUntil(function() {
    self.clients.claim();
    console.log('[ServiceWorker] Purging cache');
    caches.delete('rocketwatch')
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
  // leave out api caching for localStorage
  if (event.request.url.match("rocket.watch/") && !event.request.url.match("api.rocket.watch/")) {
    event.respondWith(
      caches.open('rocketwatch').then(function(cache) {
        return cache.match(event.request).then(function(response) {
          var fetchPromise = fetch(event.request).then(function(networkResponse) {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          })
          return response || fetchPromise;
        })
      })
    );
  }
});
