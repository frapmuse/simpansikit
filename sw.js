var V="simpansikit-v18";
var CORE=["./","index.html","manifest.webmanifest","icon-180.png","icon-192.png","icon-512.png"];
self.addEventListener("install",function(e){e.waitUntil(caches.open(V).then(function(c){return c.addAll(CORE)}));self.skipWaiting()});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(x){return x!==V}).map(function(x){return caches.delete(x)}))}));self.clients.claim()});
self.addEventListener("fetch",function(e){
  if(e.request.method!=="GET")return;
  var url=new URL(e.request.url);
  if(e.request.mode==="navigate"){ /* network first so updates arrive, cache when offline */
    e.respondWith(fetch(e.request).then(function(r){var c=r.clone();caches.open(V).then(function(x){x.put("index.html",c)});return r}).catch(function(){return caches.match("index.html")}));return}
  e.respondWith(caches.match(e.request).then(function(hit){return hit||fetch(e.request).then(function(r){if(r.ok&&(url.origin===location.origin||/fonts\.(googleapis|gstatic)\.com$/.test(url.hostname))){var c=r.clone();caches.open(V).then(function(x){x.put(e.request,c)})}return r})}))
});
