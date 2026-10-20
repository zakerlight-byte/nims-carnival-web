const CACHE_NAME = 'nims-winter-carnival-2026-v2';
const CORE = ['./', './index.html', './manifest.webmanifest', './icon.svg', './photos/nims-carnival-2024-crowd.jpg', './photos/nims-carnival-2024-stage-dance.jpg', './photos/nims-carnival-2024-food-stall.jpg', './photos/nims-carnival-2024-game-stall.jpg', './photos/nims-carnival-2024-performance.jpg'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(CORE)));
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))));
  self.clients.claim();
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    if (response.ok) { const copy = response.clone(); caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy)); }
    return response;
  }).catch(() => caches.match('./index.html'))));
});

