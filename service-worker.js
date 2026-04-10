// ============================================
// 🛰️ SERVICE WORKER - ŠKOLNÍ ROZVRH PWA
// ============================================
// Autoři: Více Adm. Jiřík 🚀 & Adm. Claude 🤖
// Verze: 1.0.0
// Funkce: Offline podpora, cache, background sync
// ============================================

const CACHE_NAME = 'skolni-rozvrh-v1';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

// ✅ Soubory pro offline cache (přizpůsob cestám svého repozitáře)
const STATIC_FILES = [
    '/skolni-rozvrh-live/',
    '/skolni-rozvrh-live/index.html',
    '/skolni-rozvrh-live/style.css',
    '/skolni-rozvrh-live/script.js',
    '/skolni-rozvrh-live/rozvrh-hodin.js',
    '/skolni-rozvrh-live/countdown-module.js',
    '/skolni-rozvrh-live/debug-module.js',
    '/skolni-rozvrh-live/boot-timeline.js',
    '/skolni-rozvrh-live/countdown.css',
    '/skolni-rozvrh-live/manifest.json',
    '/skolni-rozvrh-live/icons/icon-192.png',
    '/skolni-rozvrh-live/icons/icon-512.png'
];

// ============================================
// 📦 INSTALL EVENT - Uložení statických souborů
// ============================================
self.addEventListener('install', event => {
    console.log('[SW] 📦 Instalace Service Workeru...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('[SW] 📁 Cachování statických souborů...');
                return cache.addAll(STATIC_FILES);
            })
            .then(() => {
                console.log('[SW] ✅ Statické soubory uloženy do cache');
                return self.skipWaiting(); // Okamžitá aktivace
            })
            .catch(err => {
                console.error('[SW] ❌ Chyba při cachování:', err);
            })
    );
});

// ============================================
// 🔄 ACTIVATE EVENT - Čištění starých cachí
// ============================================
self.addEventListener('activate', event => {
    console.log('[SW] 🔄 Aktivace Service Workeru...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames
                        .filter(name => name !== STATIC_CACHE && name !== DYNAMIC_CACHE)
                        .map(name => {
                            console.log(`[SW] 🗑️ Mazání staré cache: ${name}`);
                            return caches.delete(name);
                        })
                );
            })
            .then(() => {
                console.log('[SW] ✅ Service Worker aktivován');
                return self.clients.claim(); // Ovládnutí všech tabů
            })
    );
});

// ============================================
// 🌐 FETCH EVENT - Strategie cache
// ============================================
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    
    // ⏭️ Přeskočit non-GET požadavky a externími URL (jako timeapi.io)
    if (event.request.method !== 'GET') return;
    
    // 🛰️ TimeAPI.io - Network First (chceme živý čas, fallback na cache)
    if (url.hostname === 'timeapi.io') {
        event.respondWith(networkFirst(event.request));
        return;
    }
    
    // 📁 Statické soubory projektu - Cache First
    if (STATIC_FILES.some(file => event.request.url.includes(file.replace('/skolni-rozvrh-live', '')))) {
        event.respondWith(cacheFirst(event.request));
        return;
    }
    
    // 🌐 Ostatní - Stale While Revalidate
    event.respondWith(staleWhileRevalidate(event.request));
});

// ============================================
// 🗂️ CACHE STRATEGIE
// ============================================

// Cache First - Nejdřív cache, pak síť (statické soubory)
async function cacheFirst(request) {
    const cached = await caches.match(request);
    if (cached) {
        return cached;
    }
    
    try {
        const response = await fetch(request);
        if (response.ok) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, response.clone());
        }
        return response;
    } catch (err) {
        console.warn('[SW] ⚠️ Cache First fetch failed:', err);
        return offlineFallback();
    }
}

// Network First - Nejdřív síť, pak cache (API volání)
async function networkFirst(request) {
    try {
        const response = await fetch(request, { timeout: 5000 });
        if (response.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, response.clone());
        }
        return response;
    } catch (err) {
        console.warn('[SW] ⚠️ Network First fallback na cache');
        const cached = await caches.match(request);
        return cached || offlineFallback();
    }
}

// Stale While Revalidate - Vrátí cache a aktualizuje na pozadí
async function staleWhileRevalidate(request) {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cached = await cache.match(request);
    
    const fetchPromise = fetch(request)
        .then(response => {
            if (response.ok) {
                cache.put(request, response.clone());
            }
            return response;
        })
        .catch(() => null);
    
    return cached || fetchPromise || offlineFallback();
}

// ============================================
// 📴 OFFLINE FALLBACK
// ============================================
function offlineFallback() {
    return new Response(
        `<!DOCTYPE html>
        <html lang="cs">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Offline – Školní Rozvrh</title>
            <style>
                body {
                    background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
                    color: white;
                    font-family: 'Segoe UI', sans-serif;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                    text-align: center;
                    flex-direction: column;
                    gap: 20px;
                }
                h1 { color: #00ffff; font-size: 2rem; }
                p { color: #b8b8ff; font-size: 1.1rem; }
                .icon { font-size: 4rem; }
                button {
                    background: rgba(0,255,255,0.15);
                    border: 2px solid #00ffff;
                    color: #00ffff;
                    padding: 12px 24px;
                    border-radius: 10px;
                    font-size: 1rem;
                    cursor: pointer;
                }
                button:hover { background: rgba(0,255,255,0.3); }
            </style>
        </head>
        <body>
            <div class="icon">🛰️</div>
            <h1>Jsi offline, admirále!</h1>
            <p>Připojení ke hvězdné flotile selhalo.<br>Zkontroluj připojení k internetu.</p>
            <button onclick="location.reload()">🔄 Zkusit znovu</button>
        </body>
        </html>`,
        {
            headers: { 'Content-Type': 'text/html; charset=utf-8' },
            status: 200
        }
    );
}

// ============================================
// 📬 MESSAGE EVENT - Komunikace s hlavní app
// ============================================
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        caches.keys().then(keys => {
            keys.forEach(key => caches.delete(key));
        });
        console.log('[SW] 🗑️ Cache vymazána na žádost');
    }
});

// ============================================
// 🔔 PUSH NOTIFICATIONS (připraveno pro budoucnost)
// ============================================
self.addEventListener('push', event => {
    if (!event.data) return;
    
    const data = event.data.json();
    
    event.waitUntil(
        self.registration.showNotification(data.title || 'Školní Rozvrh', {
            body: data.body || 'Nová notifikace',
            icon: '/skolni-rozvrh-live/icons/icon-192.png',
            badge: '/skolni-rozvrh-live/icons/icon-72.png',
            vibrate: [200, 100, 200],
            data: { url: data.url || '/skolni-rozvrh-live/' }
        })
    );
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});

// ============================================
// KONEC SERVICE WORKERU
// ============================================
console.log('[SW] 🚀 Service Worker načten – Warp 9 ready!');
