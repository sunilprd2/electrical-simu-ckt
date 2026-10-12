const CACHE='electrical-simu-ckt-v46-colorful-coils';
const ASSETS=['./','./index.html','./styles.css?v=46-colorful-coils','./app.js?v=46-colorful-coils','./manifest.webmanifest'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>(k.startsWith('electrical-simu-ckt-')||k.startsWith('esc-pwa-'))&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET')return;
 e.respondWith(caches.open(CACHE).then(cache=>cache.match(e.request).then(hit=>hit||fetch(e.request).then(r=>{
   if(r.ok&&new URL(e.request.url).origin===location.origin){cache.put(e.request,r.clone());}
   return r;
 }).catch(()=>cache.match('./index.html')))));
});
