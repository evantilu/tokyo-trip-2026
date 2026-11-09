const PREFIX='tokyo-trip-2026-';
const CACHE=PREFIX+'9d52c01826b9';
const ROOT=new URL('./',self.location.href);
const INDEX=new URL('index.html',ROOT).href;
const ASSETS=['index.html','manifest.webmanifest','icon.svg'].map(p=>new URL(p,ROOT).href);
self.addEventListener('install',event=>event.waitUntil((async()=>{const cache=await caches.open(CACHE);await cache.addAll(ASSETS);await self.skipWaiting();})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const k of await caches.keys())if(k.startsWith(PREFIX)&&k!==CACHE)await caches.delete(k);await self.clients.claim();})()));
self.addEventListener('fetch',event=>{
 const req=event.request,url=new URL(req.url);
 if(req.method!=='GET'||url.origin!==ROOT.origin||!url.pathname.startsWith(ROOT.pathname))return;
 if(req.mode==='navigate')event.respondWith((async()=>{const cache=await caches.open(CACHE);try{const response=await fetch(req);if(response.ok)await cache.put(INDEX,response.clone());return response;}catch(e){return(await cache.match(INDEX))||new Response('Please reconnect once to load this travel guide.',{status:503,headers:{'Content-Type':'text/plain;charset=utf-8'}});}})());
 else if(ASSETS.includes(url.href))event.respondWith((async()=>{const cache=await caches.open(CACHE);return(await cache.match(req))||fetch(req);})());
});
