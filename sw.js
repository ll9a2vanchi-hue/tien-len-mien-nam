// Service worker: cache toàn bộ để chơi offline
const CACHE='tlmn-v17-9880b20245';
const ASSETS=['./','index.html','manifest.webmanifest','cloud-config.js','vendor/supabase.js','favicon.svg','icons/icon.svg','icons/icon-192.png','icons/icon-512.png','icons/maskable-512.png','icons/apple-touch-icon.png','icons/favicon-32.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('tlmn-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==location.origin)return; // API Supabase đi thẳng mạng
 if(e.request.mode==='navigate'){e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(CACHE).then(c=>c.put('index.html',cp));return r;}).catch(()=>caches.match('index.html',{ignoreSearch:true})));return;}
 e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(r=>r||fetch(e.request).then(n=>{if(n.ok){const cp=n.clone();caches.open(CACHE).then(c=>c.put(e.request,cp));}return n;})));});
