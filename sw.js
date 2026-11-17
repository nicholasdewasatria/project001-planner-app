/* Service worker project001-Planner.
 * Halaman: ambil dari jaringan dulu (selalu versi terbaru saat online), jatuh ke cache saat offline.
 * Ikon dan manifest: dari cache dulu. Nama cache berganti tiap build yang isinya berubah. */
const CACHE = 'p001-5cea673c6a';
const ASSETS = ['./', './index.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './icons/icon-maskable-512.png', './icons/apple-touch-icon.png', './icons/favicon-32.png', './fonts/inter-latin-300.woff2', './fonts/inter-latin-400.woff2', './fonts/inter-latin-500.woff2', './fonts/inter-latin-600.woff2', './fonts/inter-latin-700.woff2'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(res => {
      const copy = res.clone(); caches.open(CACHE).then(c => c.put('./index.html', copy));
      return res;
    }).catch(() => caches.match('./index.html')));
    return;
  }
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => {
    const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy));
    return res;
  })));
});
