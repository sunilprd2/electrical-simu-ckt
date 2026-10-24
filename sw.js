const CACHE='electrical-simu-ckt-v151-light-selected-blue';
const ASSETS=[
  './',
  './index.html',
  './styles.css?v=v151-light-selected-blue',
  './app.js?v=v151-light-selected-blue',
  './manifest.webmanifest',
  './assets/esc-user-logo.png?v=85-logo-path-fix',
  './assets/esc-user-logo.png',
  './esc-user-logo.png?v=85-logo-path-fix',
  './esc-user-logo.png'
];
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(ASSETS).catch(() => {}))
  );
});
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys
        .filter(key => key !== CACHE)
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
    fetch(event.request, { cache: 'no-store' })
      .then(response => {
        if (response && response.ok) {
          const clone = response.clone();
          caches.open(CACHE).then(cache => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(async () => {
        const cache = await caches.open(CACHE);
        const cached = await cache.match(event.request);
        if (cached) return cached;
        return cache.match('./index.html');
      })
  );
});
