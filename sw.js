const CACHE_NAME = 'hcf-v5';
const SHELL_ASSETS = [
  '/', '/index.html', '/classes.html', '/pricing.html', '/coaches.html', '/faq.html', '/philosophy.html', '/news.html',
  '/muaythai.html', '/kickboxing.html', '/sanda.html', '/strength.html', '/group-class.html', '/private-class.html', '/team.html', '/offline.html',
  '/output.css', '/main.css', '/main.js', '/manifest.json', '/shark_logo.png', '/ai_mascot.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_ASSETS)));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  if (url.pathname.startsWith('/.netlify/')) {
    event.respondWith(fetch(event.request).catch(() => new Response(JSON.stringify({ error: '目前離線，請稍後再試。' }), { status: 503, headers: { 'Content-Type': 'application/json' } })));
    return;
  }

  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).catch(() => caches.match('/offline.html')));
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
      const clone = response.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
      return response;
    }).catch(() => caches.match('/offline.html')))
  );
});
