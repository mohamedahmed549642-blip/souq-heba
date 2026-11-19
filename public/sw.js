/**
 * Souq Heba Service Worker - Progressive Web App (PWA) & Push Notifications
 */

const CACHE_NAME = 'souq-heba-admin-v2';
const STATIC_ASSETS = [
  '/',
  '/admin',
  '/index.html',
  '/manifest.json',
  '/logo.png'
];

// Install: Cache critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Network-first for dynamic API routes, cache-first for static assets
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Do not cache API calls, supabase, or non-GET requests
  if (event.request.method !== 'GET' || url.pathname.startsWith('/api') || url.hostname.includes('supabase')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached and refresh in background
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse.clone()));
          }
        }).catch(() => {});
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
        }
        return networkResponse;
      }).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('/');
        }
      });
    })
  );
});

// Push Notifications: Triggered when background message arrives from server or realtime
self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = {
      title: 'سوق هبة | إشعار جديد',
      body: event.data ? event.data.text() : 'لديك إشعار جديد في سوق هبة'
    };
  }

  const title = data.title || '🚨 سوق هبة - طلب شراء جديد!';
  const options = {
    body: data.body || 'اضغط هنا لفتح ومعاينة تفاصيل الطلب بالكامل.',
    icon: '/logo.png',
    badge: '/logo.png',
    vibrate: [250, 100, 250, 100, 400],
    tag: data.tag || 'souq-heba-order',
    data: {
      url: data.url || '/admin'
    },
    actions: [
      { action: 'open', title: 'معاينة الطلب' }
    ]
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Notification Click: Focus existing open window or open new window
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
