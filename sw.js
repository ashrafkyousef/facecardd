const CACHE = 'facecard-ashraf-v1';
const PREFIX = 'facecard-ashraf-';
const ASSETS = ["./", "./index.html", "./manifest.webmanifest", "./pwa.js", "./assets/profile-page.png", "./assets/portrait.jpg", "./assets/dubai.png", "./assets/face-logo.jpg", "./assets/icons/icon-192.png", "./assets/icons/icon-512.png", "./assets/icons/apple-touch-icon.png"].map(path => new URL(path, self.location.href).href);
const ALLOWED = new Set(ASSETS);
self.addEventListener('install', event => {event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate', event => {event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith(PREFIX)&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch', event => {
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);url.hash='';url.search='';
  if(!ALLOWED.has(url.href))return;
  event.respondWith((async()=>{
    const cache=await caches.open(CACHE);
    try {
      const response=await fetch(event.request);
      if(response.ok)await cache.put(url.href,response.clone());
      return response;
    } catch(error) {
      const cached=await cache.match(url.href);
      if(cached)return cached;
      return Response.error();
    }
  })());
});
