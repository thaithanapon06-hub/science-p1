const N='sci1-v1';
self.oninstall=e=>e.waitUntil(caches.open(N).then(c=>c.addAll(['./','index.html','manifest.json'])));
self.onactivate=e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!=N).map(x=>caches.delete(x)))));
self.onfetch=e=>{if(e.request.method!='GET'||new URL(e.request.url).origin!=location.origin)return;e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(N).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request)))};
