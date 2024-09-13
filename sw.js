const CACHE_NAME = 'audio2video-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/app.js',
    'https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.10.0/dist/ffmpeg.min.js'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
