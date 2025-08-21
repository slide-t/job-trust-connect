const CACHE_NAME = 'jobtrust-connect-cache';
const urlsToCache = [
  '/',
  '/index.html',
  '/job-apllicationform.html',
  '/job-apllicationform.js',
  '/job-apllicationform.json',
  '/jobs-available.html',
  '/jobs-available.json',
  '/faqs.html',
  '/footer.html',
  '/blog.html',
  'posts.json',
  'post.html',
  'requestform.html',
  '/feedback.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// Install and cache essential assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting(); // activate immediately
});

// Activate and clean up old caches automatically
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => name !== CACHE_NAME)
                  .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim(); // take control without reload
});

// Stale-while-revalidate strategy
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          // Update cache with latest version in background
          if (networkResponse && networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => cachedResponse); // fallback to cache if offline

        // Return cached version immediately, update in background
        return cachedResponse || fetchPromise;
      });
    })
  );
});
