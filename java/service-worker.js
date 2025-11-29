const cacheName = 'portfolio-risk-v1'; // Change this when you update your app

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(cacheName).then(cache => {
            return cache.addAll([
                '/',
                '/index.html',
                '/imges',
                '/java',
                '/script.js',
                '/styles.css',
                '/manifest.json',
                '/coin.js',
                'Crypto/imges/bitcoin.png' // Include all the files your app needs
            ]);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});
