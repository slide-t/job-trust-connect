const CACHE_NAME = 'jobtrust-connect-cache-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/job-apllicationform.html',
  '/jobs-available.html',
  '/faqs.html',
  '/footer.html',
  '/blog.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
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
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});
