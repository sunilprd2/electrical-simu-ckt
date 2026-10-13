const CACHE='electrical-simu-ckt-v97-library-render-guard';
const ASSETS=[
  './',
  './index.html',
  './components/Proximity Sensor/Inductive_Proximity_Sensor.svg',
  './styles.css?v=v97-library-render-guard',
  './app.js?v=v97-library-render-guard',
  './manifest.webmanifest',
  './assets/esc-user-logo.png?v=85-logo-path-fix',
  './assets/esc-user-logo.png',
  './esc-user-logo.png?v=85-logo-path-fix',
  './esc-user-logo.png'
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
