const PREFIX='tokyo-trip-2026-';
const CACHE=PREFIX+'map-20261113-v1';
const TILE_CACHE=PREFIX+'maptiles-v1';
const ROOT=new URL('./',self.location.href);
const INDEX=new URL('index.html',ROOT).href;
const ASSETS=['index.html','tour.js','tour.css','manifest.webmanifest','icon.svg','vendor/leaflet.js','vendor/leaflet.css','shops-data.js','tour-geo.js','explorer.js','explorer.css'].map(p=>new URL(p,ROOT).href);
self.addEventListener('install',event=>event.waitUntil((async()=>{const cache=await caches.open(CACHE);await cache.addAll(ASSETS);await self.skipWaiting();})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const k of await caches.keys())if(k.startsWith(PREFIX)&&k!==CACHE&&k!==TILE_CACHE)await caches.delete(k);await self.clients.claim();})()));
self.addEventListener('fetch',event=>{
 const req=event.request,url=new URL(req.url);
 if(req.method!=='GET')return;
 if(url.origin==='https://cyberjapandata.gsi.go.jp'&&url.pathname.startsWith('/xyz/pale/')){
  event.respondWith((async()=>{const cache=await caches.open(TILE_CACHE),hit=await cache.match(req);if(hit)return hit;try{const res=await fetch(req);if(res.ok||res.type==='opaque'){await cache.put(req,res.clone());const keys=await cache.keys();if(keys.length>250)await cache.delete(keys[0]);}return res;}catch(_){return new Response('<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><rect width="256" height="256" fill="#e8ede4"/></svg>',{headers:{'Content-Type':'image/svg+xml'}});}})());return;
 }
 if(url.origin!==ROOT.origin||!url.pathname.startsWith(ROOT.pathname))return;
 if(req.mode==='navigate')event.respondWith((async()=>{const cache=await caches.open(CACHE);try{const response=await fetch(req);if(response.ok)await cache.put(INDEX,response.clone());return response;}catch(e){return(await cache.match(INDEX))||new Response('Please reconnect once to load this travel guide.',{status:503,headers:{'Content-Type':'text/plain;charset=utf-8'}});}})());
 else if(ASSETS.includes(url.href))event.respondWith((async()=>{const cache=await caches.open(CACHE);return(await cache.match(req))||fetch(req);})());
});
