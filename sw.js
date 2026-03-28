// WoolFlow Service Worker - Production Grade
// Advanced caching strategies for optimal performance

const CACHE_VERSION = 'v1.0.0';
const CACHE_NAMES = {
    STATIC: `woolflow-static-${CACHE_VERSION}`,
    DYNAMIC: `woolflow-dynamic-${CACHE_VERSION}`,
    IMAGES: `woolflow-images-${CACHE_VERSION}`,
    FONTS: `woolflow-fonts-${CACHE_VERSION}`
};

// Cache expiration times (in milliseconds)
const CACHE_EXPIRATION = {
    STATIC: 30 * 24 * 60 * 60 * 1000, // 30 days
    DYNAMIC: 7 * 24 * 60 * 60 * 1000, // 7 days
    IMAGES: 60 * 24 * 60 * 60 * 1000, // 60 days
    FONTS: 365 * 24 * 60 * 60 * 1000 // 1 year
};

// Resources to cache immediately
const PRECACHE_RESOURCES = [
    '/',
    '/index.html',
    '/products.html',
    '/cart.html',
    '/main.js',
    '/resources/hero-wool.jpg',
    '/resources/product-urban-oat.jpg',
    '/resources/product-urban-sage.jpg',
    '/resources/product-urban-mist.jpg',
    '/resources/product-urban-charcoal.jpg',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
];

// Network-first strategy for API calls
const API_ENDPOINTS = [
    '/api/products',
    '/api/cart',
    '/api/analytics',
    '/api/inventory'
];

// Cache-first strategy for static assets
const STATIC_RESOURCES = [
    /\.(js|css)$/,
    /\.(jpg|jpeg|png|gif|svg|webp)$/,
    /\.(woff|woff2|ttf|eot)$/
];

class CacheManager {
    constructor() {
        this.cacheExpiration = new Map();
    }
    
    async openCache(cacheName) {
        return await caches.open(cacheName);
    }
    
    async cacheResource(request, response, cacheName) {
        const cache = await this.openCache(cacheName);
        await cache.put(request, response.clone());
        
        // Set expiration
        this.cacheExpiration.set(request.url, Date.now() + CACHE_EXPIRATION[cacheName.toUpperCase()]);
    }
    
    async getCachedResource(request, cacheName) {
        const cache = await this.openCache(cacheName);
        const cached = await cache.match(request);
        
        if (cached) {
            // Check expiration
            const expiration = this.cacheExpiration.get(request.url);
            if (!expiration || Date.now() > expiration) {
                await cache.delete(request);
                return null;
            }
            return cached;
        }
        return null;
    }
    
    async clearExpiredCaches() {
        const cacheWhitelist = Object.values(CACHE_NAMES);
        const cacheKeys = await caches.keys();
        
        return Promise.all(
            cacheKeys.map(cacheKey => {
                if (!cacheWhitelist.includes(cacheKey)) {
                    return caches.delete(cacheKey);
                }
            })
        );
    }
}

const cacheManager = new CacheManager();

// Install event - precache resources
self.addEventListener('install', (event) => {
    console.log('Service Worker: Install event');
    
    event.waitUntil(
        caches.open(CACHE_NAMES.STATIC)
            .then(cache => {
                return cache.addAll(PRECACHE_RESOURCES);
            })
            .then(() => {
                console.log('Service Worker: Precache complete');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('Service Worker: Precache failed:', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activate event');
    
    event.waitUntil(
        cacheManager.clearExpiredCaches()
            .then(() => {
                console.log('Service Worker: Old caches cleaned');
                return self.clients.claim();
            })
    );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
    const request = event.request;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Skip chrome-extension requests
    if (url.protocol === 'chrome-extension:') {
        return;
    }
    
    // Determine caching strategy
    let strategy = determineCachingStrategy(request);
    
    event.respondWith(
        executeCachingStrategy(request, strategy)
            .catch(error => {
                console.error('Service Worker: Fetch failed:', error);
                
                // Return offline fallback if available
                if (request.destination === 'document') {
                    return caches.match('/offline.html');
                }
                
                // Return generic offline response
                return new Response('Offline', {
                    status: 503,
                    statusText: 'Service Unavailable'
                });
            })
    );
});

function determineCachingStrategy(request) {
    const url = new URL(request.url);
    
    // API endpoints - Network first
    if (API_ENDPOINTS.some(endpoint => url.pathname.includes(endpoint))) {
        return 'network-first';
    }
    
    // Static resources - Cache first
    if (STATIC_RESOURCES.some(regex => regex.test(url.pathname))) {
        if (/\.(jpg|jpeg|png|gif|svg|webp)$/.test(url.pathname)) {
            return 'cache-first-images';
        } else if (/\.(woff|woff2|ttf|eot)$/.test(url.pathname)) {
            return 'cache-first-fonts';
        } else {
            return 'cache-first-static';
        }
    }
    
    // HTML pages - Network first with fallback
    if (request.destination === 'document') {
        return 'network-first';
    }
    
    // Default - Stale while revalidate
    return 'stale-while-revalidate';
}

async function executeCachingStrategy(request, strategy) {
    switch (strategy) {
        case 'network-first':
            return await networkFirstStrategy(request);
            
        case 'cache-first-static':
            return await cacheFirstStrategy(request, CACHE_NAMES.STATIC);
            
        case 'cache-first-images':
            return await cacheFirstStrategy(request, CACHE_NAMES.IMAGES);
            
        case 'cache-first-fonts':
            return await cacheFirstStrategy(request, CACHE_NAMES.FONTS);
            
        case 'stale-while-revalidate':
            return await staleWhileRevalidateStrategy(request);
            
        default:
            return await fetch(request);
    }
}

// Network first strategy - try network, fallback to cache
async function networkFirstStrategy(request) {
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            // Cache successful responses
            const cacheName = request.destination === 'document' ? 
                CACHE_NAMES.DYNAMIC : CACHE_NAMES.STATIC;
            await cacheManager.cacheResource(request, networkResponse, cacheName);
        }
        
        return networkResponse;
    } catch (error) {
        // Fallback to cache
        const cached = await cacheManager.getCachedResource(request, CACHE_NAMES.DYNAMIC) ||
                      await cacheManager.getCachedResource(request, CACHE_NAMES.STATIC);
        
        if (cached) {
            return cached;
        }
        
        throw error;
    }
}

// Cache first strategy - serve from cache, update in background
async function cacheFirstStrategy(request, cacheName) {
    const cached = await cacheManager.getCachedResource(request, cacheName);
    
    if (cached) {
        // Update cache in background if needed
        if (shouldUpdateCache(request)) {
            fetch(request).then(response => {
                if (response.ok) {
                    cacheManager.cacheResource(request, response, cacheName);
                }
            });
        }
        
        return cached;
    }
    
    // Not in cache, fetch from network
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
        await cacheManager.cacheResource(request, networkResponse, cacheName);
    }
    
    return networkResponse;
}

// Stale while revalidate strategy - serve stale, update in background
async function staleWhileRevalidateStrategy(request) {
    const cached = await cacheManager.getCachedResource(request, CACHE_NAMES.DYNAMIC);
    
    const networkResponsePromise = fetch(request).then(response => {
        if (response.ok) {
            cacheManager.cacheResource(request, response, CACHE_NAMES.DYNAMIC);
        }
        return response;
    });
    
    return cached || await networkResponsePromise;
}

function shouldUpdateCache(request) {
    // Update cache for resources older than 1 day
    const lastUpdate = cacheManager.cacheExpiration.get(request.url);
    return !lastUpdate || (Date.now() - lastUpdate) > (24 * 60 * 60 * 1000);
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
    console.log('Service Worker: Background sync', event.tag);
    
    if (event.tag === 'cart-sync') {
        event.waitUntil(syncCartData());
    } else if (event.tag === 'analytics-sync') {
        event.waitUntil(syncAnalyticsData());
    }
});

async function syncCartData() {
    try {
        const cartData = localStorage.getItem('woolflow-cart-secure');
        if (cartData) {
            await fetch('/api/cart/sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: cartData
            });
        }
    } catch (error) {
        console.error('Cart sync failed:', error);
    }
}

async function syncAnalyticsData() {
    try {
        const analyticsData = localStorage.getItem('woolflow-analytics-queue');
        if (analyticsData) {
            await fetch('/api/analytics/sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: analyticsData
            });
            localStorage.removeItem('woolflow-analytics-queue');
        }
    } catch (error) {
        console.error('Analytics sync failed:', error);
    }
}

// Push notifications for engagement
self.addEventListener('push', (event) => {
    console.log('Service Worker: Push event', event);
    
    const options = {
        body: event.data ? event.data.text() : 'New update from WoolFlow!',
        icon: '/resources/icon-192.png',
        badge: '/resources/badge-72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Check it out',
                icon: '/resources/checkmark.png'
            },
            {
                action: 'close',
                title: 'Close notification',
                icon: '/resources/x.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('WoolFlow', options)
    );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
    console.log('Service Worker: Notification click', event);
    
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/products.html')
        );
    }
});

// Message handling from main thread
self.addEventListener('message', (event) => {
    console.log('Service Worker: Message received', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({ version: CACHE_VERSION });
    }
    
    if (event.data && event.data.type === 'CLEAR_CACHES') {
        cacheManager.clearExpiredCaches();
    }
});

console.log('Service Worker: Loaded successfully');