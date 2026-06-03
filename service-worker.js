const CACHE_NAME = 'analora-store-cache-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/icon.svg',
  '/css/variables.css',
  '/css/base.css',
  '/css/components.css',
  '/css/layout.css',
  '/css/pages.css',
  '/css/responsive.css',
  '/css/animations.css',
  '/js/app.js',
  '/js/cart.js',
  '/js/charts.js',
  '/js/checkout.js',
  '/js/config.js',
  '/js/consumer-dataset.js',
  '/js/data.js',
  '/js/firebase.js',
  '/js/navigation.js',
  '/js/products.js',
  '/js/search.js',
  '/js/theme.js',
  '/js/utils.js',
  '/js/wishlist.js'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then(networkResponse => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      });
    }).catch(() => caches.match('/index.html'))
  );
});
