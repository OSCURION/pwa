// nombre de cache
const CACHE_NAME = 'v1_biografia',
    urlsToCache = [
        'estilos.css',
        'script.js',
        'img/bg.jpg',
        'img/bg2.jpg',
        'img/icon256x256.png',
        'img/img1.png',
        'img/img2.png',
        'img/index.jpg'
    ]
//instalacion en cache de activos estaticos
self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => {
            return cache.add(urlsToCache)
                .then(() => self.skipWaiting())
        })
        .catch(err => console.log('fallo registro de cache', err))
    )
})

//se activa y busca los recurso para que funcione sin conexion
self.addEventListener('activate', e => {
    const cacheWhitelist = [CACHE_NAME]

    e.waitUntil(
        caches.keys()
        .then(cachesnames => {
            cacheNames.map(cacheName => {
                //Eliminamos lo que ya no se necesita en cache
                if (cacheWhitelist.indexOf(cacheName) === -1) {
                    return caches.delete(cacheName)
                }
            })
        })
        //lo que indica al SW activar el cache actual
        .then(() => self.clients.claim())
    )
})

//cuando el navegador recupera una url
self.addEventListener('fetch', e => {
    //Responde ya sea con el objeto en caché o continuar y buscar la url real
    e.respondWith(
        caches.match(e.request)
        .then(res => {
            if (res) {
                //recuperar del cache
                return res
            }
            //recuperar de la peticion a la url
            return fetch(e.request)
        })
    )
})