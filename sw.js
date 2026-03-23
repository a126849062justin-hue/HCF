const CACHE_NAME = 'hcf-v2.0';
const SHELL_ASSETS = [
  '/',
  '/index.html',
  '/classes.html',
  '/pricing.html',
  '/team.html',
  '/news.html',
  '/faq.html',
  '/philosophy.html',
  '/offline.html',
  '/manifest.json',
  '/shark_logo.png',
  '/hero1.jpg',
  '/schedule-mobile.png',
  '/schedule-pc.png',
  '/coach_huang.jpg',
  '/coach_allen.jpg',
  '/coach_zhengyu.jpg',
  '/coach_kao.jpg',
  '/coach_hu.jpg',
  '/coach-mi.jpg',
];

// Install: pre-cache shell assets
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_ASSETS))
  );
});

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch: routing strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip external CDN requests (different origin)
  if (url.origin !== self.location.origin) return;

  // Network Only: Netlify Functions / API
  if (url.pathname.startsWith('/.netlify/')) {
    event.respondWith(fetch(request));
    return;
  }

  // Network First: HTML pages (navigation requests)
  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() =>
          caches.match(request).then((cached) => cached || caches.match('/offline.html'))
        )
    );
    return;
  }

  // Cache First: static assets (images, audio, CSS, JS)
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        return response;
      });
    })
  );
});
