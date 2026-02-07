const CACHE_NAME = 'surgitech-v2';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './bill.html',
    './quotation.html',
    './manifest.json',
    // Caching images from both locations based on your HTML code
    './surgi.png',
    './img/surgi.png',
    './img/owner.png',
    './img/icon-192.png',
    './img/icon-512.png',
    // External Tools (Tailwind + Fonts)
    'https://cdn.tailwindcss.com',
    'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Hind+Siliguri:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then((cache) => {
            console.log('SurgiTech Cache Opened');
            // We use addAllSettled logic to prevent one missing file from breaking the whole cache
            return Promise.all(
                ASSETS_TO_CACHE.map(url => {
                    return cache.add(url).catch(err => console.warn('Could not cache:', url));
                })
            );
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
        .then((response) => {
            return response || fetch(event.request);
        })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});