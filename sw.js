const CACHE='electrical-simu-ckt-v47-cache-coil-fix';
const ASSETS=[
  './',
  './index.html',
  './styles.css?v=47-cache-coil-fix',
  './app.js?v=47-cache-coil-fix',
  './manifest.webmanifest'
];
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys
        .filter(key => key !== CACHE && (
          key.startsWith('electrical-simu-ckt-') ||
          key.startsWith('esc-pwa-')
        ))
        .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith(
    caches.open(CACHE).then(async cache => {
      const cached = await cache.match(event.request);
      if (cached) return cached;
      try {
        const response = await fetch(event.request);
        if (response && response.ok) cache.put(event.request, response.clone());
        return response;
      } catch (error) {
        const fallback = await cache.match('./index.html');
        if (fallback) return fallback;
        throw error;
      }
    })
  );
});
