const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
// DISABLED: localStorage for data - All data is now public/shared via API
// Only user preferences (pin, order, columns) remain in localStorage
const USE_LOCALSTORAGE = false;

// Enable secondary localStorage cache for faster cold starts (in addition to memory cache)
const USE_PERSISTENT_CACHE = true;
const PERSISTENT_CACHE_KEY_PREFIX = 'cache_v1_';

// Enhanced in-memory cache with expiration and versioning
const cache = {
    routes: { data: null, timestamp: null, etag: null },
    locations: { data: null, timestamp: null, etag: null },
    routeLocations: {} // Cache locations per route: { routeId: { data, timestamp, etag } }
};

// Different cache durations for different data types
const CACHE_DURATION = {
    routes: 10 * 60 * 1000,      // 10 minutes - routes change less frequently
    locations: 5 * 60 * 1000,     // 5 minutes - locations change more often
    routeLocations: 8 * 60 * 1000 // 8 minutes - per-route data
};

// Persistent cache duration (localStorage) - longer duration for offline support
const PERSISTENT_CACHE_DURATION = {
    routes: 60 * 60 * 1000,      // 1 hour
    locations: 30 * 60 * 1000,    // 30 minutes
    routeLocations: 45 * 60 * 1000 // 45 minutes
};

// Request deduplication - prevent multiple simultaneous requests
const pendingRequests = new Map();

// Cache statistics for monitoring performance
const cacheStats = {
    hits: 0,
    misses: 0,
    invalidations: 0,
    size: 0
};

// Reset stats daily
setInterval(() => {
    if (cacheStats.hits + cacheStats.misses > 0) {
        const hitRate = ((cacheStats.hits / (cacheStats.hits + cacheStats.misses)) * 100).toFixed(2);
        console.log(`📊 Daily Cache Stats - Hit Rate: ${hitRate}% (Hits: ${cacheStats.hits}, Misses: ${cacheStats.misses})`);
    }
    cacheStats.hits = 0;
    cacheStats.misses = 0;
    cacheStats.invalidations = 0;
}, 24 * 60 * 60 * 1000);

// Simple compression functions for localStorage optimization
const compressData = (data) => {
    try {
        const json = JSON.stringify(data);
        // Use base64 encoding as simple compression alternative
        return btoa(json);
    } catch (e) {
        return JSON.stringify(data);
    }
};

const decompressData = (compressed) => {
    try {
        return JSON.parse(atob(compressed));
    } catch (e) {
        return JSON.parse(compressed);
    }
};

// Persistent cache helper functions
const getPersistentCache = (key, type = 'locations') => {
    if (!USE_PERSISTENT_CACHE) return null;
    
    try {
        const cacheKey = `${PERSISTENT_CACHE_KEY_PREFIX}${key}`;
        const cached = localStorage.getItem(cacheKey);
        if (!cached) {
            cacheStats.misses++;
            return null;
        }
        
        const cacheEntry = JSON.parse(cached);
        const { data: compressedData, timestamp, size } = cacheEntry;
        const duration = PERSISTENT_CACHE_DURATION[type] || PERSISTENT_CACHE_DURATION.locations;
        
        if (Date.now() - timestamp < duration) {
            const decompressed = decompressData(compressedData);
            cacheStats.hits++;
            const ageSeconds = Math.round((Date.now() - timestamp) / 1000);
            console.log(`💾 Using persistent cache for ${key} (age: ${ageSeconds}s, size: ${size}B)`);
            return decompressed;
        }
        
        // Cache expired, remove it
        localStorage.removeItem(cacheKey);
        cacheStats.invalidations++;
        return null;
    } catch (error) {
        console.error('Error reading persistent cache:', error);
        cacheStats.misses++;
        return null;
    }
};

const setPersistentCache = (key, data) => {
    if (!USE_PERSISTENT_CACHE) return;
    
    try {
        const cacheKey = `${PERSISTENT_CACHE_KEY_PREFIX}${key}`;
        const compressed = compressData(data);
        const cacheEntry = {
            data: compressed,
            timestamp: Date.now(),
            size: compressed.length
        };
        localStorage.setItem(cacheKey, JSON.stringify(cacheEntry));
        cacheStats.size += compressed.length;
    } catch (error) {
        // Quota exceeded or other localStorage error
        console.warn('Failed to set persistent cache:', error);
        // Try to clear old caches to free space
        clearOldPersistentCaches();
    }
};

const clearPersistentCache = (key = null) => {
    if (!USE_PERSISTENT_CACHE) return;
    
    try {
        if (key) {
            const cacheKey = `${PERSISTENT_CACHE_KEY_PREFIX}${key}`;
            localStorage.removeItem(cacheKey);
        } else {
            // Clear all persistent caches
            const keys = Object.keys(localStorage);
            keys.forEach(k => {
                if (k.startsWith(PERSISTENT_CACHE_KEY_PREFIX)) {
                    localStorage.removeItem(k);
                }
            });
        }
    } catch (error) {
        console.error('Error clearing persistent cache:', error);
    }
};

const clearOldPersistentCaches = () => {
    try {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith(PERSISTENT_CACHE_KEY_PREFIX)) {
                try {
                    const cached = JSON.parse(localStorage.getItem(key));
                    // Remove caches older than 24 hours
                    if (Date.now() - cached.timestamp > 24 * 60 * 60 * 1000) {
                        localStorage.removeItem(key);
                    }
                } catch (e) {
                    // Invalid cache entry, remove it
                    localStorage.removeItem(key);
                }
            }
        });
    } catch (error) {
        console.error('Error clearing old persistent caches:', error);
    }
};

// Cache helper functions
const isCacheValid = (cacheEntry, type = 'locations') => {
    if (!cacheEntry || !cacheEntry.data || !cacheEntry.timestamp) return false;
    const duration = CACHE_DURATION[type] || CACHE_DURATION.locations;
    return (Date.now() - cacheEntry.timestamp) < duration;
};

const setCache = (key, data, etag = null) => {
    if (key.startsWith('route-')) {
        // Cache per-route locations
        cache.routeLocations[key] = { data, timestamp: Date.now(), etag };
    } else {
        cache[key] = { data, timestamp: Date.now(), etag };
    }
    // Also persist to localStorage for faster cold starts
    setPersistentCache(key, data);
    
    // Smart cache invalidation - invalidate related caches when data changes
    invalidateRelatedCaches(key);
};

// Smart cache invalidation - invalidate related caches
const invalidateRelatedCaches = (key) => {
    if (key === 'routes') {
        // When routes change, invalidate all route locations caches
        Object.keys(cache.routeLocations).forEach(routeKey => {
            delete cache.routeLocations[routeKey];
            clearPersistentCache(routeKey);
            cacheStats.invalidations++;
        });
        console.log('🔄 Invalidated all related route locations caches');
    } else if (key === 'locations') {
        // When locations change, invalidate all route-specific caches
        Object.keys(cache.routeLocations).forEach(routeKey => {
            delete cache.routeLocations[routeKey];
            clearPersistentCache(routeKey);
            cacheStats.invalidations++;
        });
        console.log('🔄 Invalidated all related route locations caches');
    } else if (key.startsWith('route-')) {
        // When a specific route's locations change, also invalidate the global locations cache
        cache.locations = { data: null, timestamp: null, etag: null };
        clearPersistentCache('locations');
        cacheStats.invalidations++;
        console.log('🔄 Invalidated global locations cache due to route change');
    }
};

const getCache = (key, type = 'locations') => {
    // Try memory cache first (fastest)
    if (key.startsWith('route-')) {
        const entry = cache.routeLocations[key];
        if (isCacheValid(entry, 'routeLocations')) {
            cacheStats.hits++;
            return entry.data;
        }
        
        // Try persistent cache (slower but still fast)
        const persistentData = getPersistentCache(key, 'routeLocations');
        if (persistentData) {
            // Restore to memory cache
            cache.routeLocations[key] = { data: persistentData, timestamp: Date.now(), etag: null };
            return persistentData;
        }
        cacheStats.misses++;
        return null;
    }
    
    if (isCacheValid(cache[key], type)) {
        cacheStats.hits++;
        return cache[key].data;
    }
    
    // Try persistent cache
    const persistentData = getPersistentCache(key, type);
    if (persistentData) {
        // Restore to memory cache
        cache[key] = { data: persistentData, timestamp: Date.now(), etag: null };
        return persistentData;
    }
    cacheStats.misses++;
    return null;
};

const clearCache = (key = null) => {
    if (key) {
        if (key.startsWith('route-')) {
            delete cache.routeLocations[key];
        } else {
            cache[key] = { data: null, timestamp: null, etag: null };
        }
        clearPersistentCache(key);
    } else {
        // Clear all caches
        cache.routes = { data: null, timestamp: null, etag: null };
        cache.locations = { data: null, timestamp: null, etag: null };
        cache.routeLocations = {};
        clearPersistentCache();
    }
};

// Preload cache in background with better error handling
const preloadCache = async () => {
    try {
        console.log('⏳ Starting cache preload...');
        if (!USE_LOCALSTORAGE) {
            // Preload routes and locations in parallel with timeout
            const timeout = 5000; // 5 second timeout
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Preload timeout')), timeout)
            );
            
            const [routes, locations] = await Promise.race([
                Promise.all([
                    fetch(`${API_BASE_URL}/routes`).then(r => r.ok ? r.json() : null),
                    fetch(`${API_BASE_URL}/locations`).then(r => r.ok ? r.json() : null)
                ]),
                timeoutPromise
            ]);
            
            if (routes) {
                setCache('routes', routes);
                console.log(`✅ Preloaded ${routes.length} routes`);
            }
            if (locations) {
                setCache('locations', locations);
                console.log(`✅ Preloaded ${locations.length} locations`);
            }
            console.log('⚡ Cache preloaded successfully');
        }
    } catch (error) {
        console.log('⚠️ Cache preload failed (non-critical):', error.message);
        // Continue without preload - fallback will be used
    }
};

// Request deduplication helper
const dedupedFetch = async (url, key) => {
    // If there's already a pending request for this key, return that promise
    if (pendingRequests.has(key)) {
        console.log('🔄 Reusing pending request for:', key);
        return pendingRequests.get(key);
    }

    // Create new request
    const requestPromise = fetch(url, {
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            return response.json();
        })
        .then(data => {
            // Validate data is an array
            if (!Array.isArray(data)) {
                throw new Error(`Invalid data format: expected array, got ${typeof data}`);
            }
            return data;
        })
        .catch(error => {
            console.error(`❌ Fetch failed for ${key}:`, error.message);
            throw error;
        })
        .finally(() => {
            // Clean up pending request
            pendingRequests.delete(key);
        });

    // Store pending request
    pendingRequests.set(key, requestPromise);
    return requestPromise;
};

export const CustomerService = {
    // Initialize localStorage with dummy data if not exists
    initLocalStorage() {
        if (!localStorage.getItem('routes')) {
            localStorage.setItem('routes', JSON.stringify(this.getDummyRoutes()));
        }
        if (!localStorage.getItem('locations')) {
            localStorage.setItem('locations', JSON.stringify(this.getDummyLocations()));
        }
    },

    // Get routes from API or localStorage with caching
    async getRoutes(forceRefresh = false) {
        // Check in-memory cache first (unless force refresh)
        if (!forceRefresh) {
            const cachedData = getCache('routes', 'routes');
            if (cachedData) {
                console.log('⚡ Using cached routes from memory');
                return cachedData;
            }
        }

        if (USE_LOCALSTORAGE) {
            this.initLocalStorage();
            const routes = JSON.parse(localStorage.getItem('routes') || '[]');
            console.log('📦 Loading routes from localStorage:', routes);
            setCache('routes', routes);
            return routes;
        }

        try {
            const routes = await dedupedFetch(`${API_BASE_URL}/routes`, 'routes');
            if (!routes || !Array.isArray(routes)) {
                throw new Error('Invalid routes data received');
            }
            setCache('routes', routes);
            console.log('✅ Routes fetched from API');
            return routes;
        } catch (error) {
            console.error('❌ Error fetching routes:', error.message || error);
            // Try to return stale cache if available
            const staleCache = cache.routes?.data;
            if (staleCache && Array.isArray(staleCache)) {
                console.log('⚠️ Using stale cache due to error');
                return staleCache;
            }
            // Fallback to dummy data
            console.log('⚠️ Using dummy routes data (API unavailable)');
            const dummyRoutes = this.getDummyRoutes();
            setCache('routes', dummyRoutes);
            return dummyRoutes;
        }
    },

    // Get detail locations from API or localStorage with caching
    async getDetailData(routeId = null, forceRefresh = false) {
        const cacheKey = routeId ? `route-${routeId}` : 'locations';
        
        // Check in-memory cache first (unless force refresh)
        if (!forceRefresh) {
            const cachedData = getCache(cacheKey, routeId ? 'routeLocations' : 'locations');
            if (cachedData) {
                console.log(`⚡ Using cached locations from memory (${cacheKey})`);
                return cachedData;
            }
        }

        if (USE_LOCALSTORAGE) {
            this.initLocalStorage();
            const locations = JSON.parse(localStorage.getItem('locations') || '[]');
            console.log('📦 Loading locations from localStorage (all):', locations.length, 'locations');
            // Filter by routeId if provided
            const filteredLocations = routeId ? locations.filter(loc => loc.routeId === routeId) : locations;
            console.log(`📦 Filtered locations for routeId ${routeId}:`, filteredLocations.length, 'locations');
            console.log('📍 Sample location data:', filteredLocations[0]);
            setCache(cacheKey, filteredLocations);
            return filteredLocations;
        }

        try {
            const url = routeId ? `${API_BASE_URL}/locations?routeId=${routeId}` : `${API_BASE_URL}/locations`;
            const locations = await dedupedFetch(url, cacheKey);
            if (!locations || !Array.isArray(locations)) {
                throw new Error('Invalid locations data received');
            }
            setCache(cacheKey, locations);
            console.log(`✅ Locations fetched from API (${cacheKey})`);
            return locations;
        } catch (error) {
            console.error('❌ Error fetching locations:', error.message || error);
            // Try to return stale cache if available
            const staleCache = routeId ? cache.routeLocations[cacheKey]?.data : cache.locations?.data;
            if (staleCache && Array.isArray(staleCache)) {
                console.log('⚠️ Using stale cache due to error');
                return staleCache;
            }
            // Fallback to dummy data and filter by routeId
            console.log(`⚠️ Using dummy locations data (API unavailable)`);
            const dummyLocations = this.getDummyLocations();
            const filteredLocations = routeId ? dummyLocations.filter(loc => loc.routeId === routeId) : dummyLocations;
            setCache(cacheKey, filteredLocations);
            return filteredLocations;
        }
    },

    // Save routes to API or localStorage
    async saveRoutes(routes) {
        if (USE_LOCALSTORAGE) {
            localStorage.setItem('routes', JSON.stringify(routes));
            console.log('💾 Routes saved to localStorage:', routes);
            clearCache('routes'); // Clear cache after save
            return { success: true, message: 'Routes saved to localStorage', count: routes.length };
        }

        try {
            console.log('💾 Saving routes to database:', routes);
            
            // Get existing routes from database
            const existingResponse = await fetch(`${API_BASE_URL}/routes`);
            const existingRoutes = existingResponse.ok ? await existingResponse.json() : [];
            const existingIds = new Set(existingRoutes.map(r => r.id));

            // Separate new routes (to CREATE) from existing routes (to UPDATE)
            // Date.now() returns ~13 digits (e.g., 1734953400000)
            const newRoutes = routes.filter(route => route.id > 1000000000000); // timestamp IDs > 13 digits
            const updatedRoutes = routes.filter(route => route.id <= 1000000000000 && existingIds.has(route.id));
            
            console.log('➕ New routes to create:', newRoutes.length, newRoutes);
            console.log('✏️ Existing routes to update:', updatedRoutes.length, updatedRoutes);

            // Create new routes
            const createPromises = newRoutes.map(route =>
                fetch(`${API_BASE_URL}/routes`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        route: route.route, 
                        shift: route.shift, 
                        warehouse: route.warehouse,
                        description: route.description || null
                    }),
                })
            );

            // Update existing routes
            let updatePromise = Promise.resolve({ ok: true });
            if (updatedRoutes.length > 0) {
                updatePromise = fetch(`${API_BASE_URL}/routes`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ routes: updatedRoutes }),
                });
            }

            // Execute all saves
            const results = await Promise.all([...createPromises, updatePromise]);
            
            // Check if all successful
            const allSuccessful = results.every(r => r.ok);
            if (!allSuccessful) {
                const failedResults = results.filter(r => !r.ok);
                console.error('❌ Failed to save some routes:', failedResults);
                throw new Error(`Failed to save ${failedResults.length} route(s)`);
            }
            
            clearCache('routes'); // Clear cache after successful save
            console.log('✅ Routes saved successfully to database');
            
            return { 
                success: true, 
                message: 'Routes saved successfully', 
                count: routes.length,
                created: newRoutes.length,
                updated: updatedRoutes.length
            };
        } catch (error) {
            console.error('❌ Error saving routes:', error);
            throw error;
        }
    },

    // Save locations to API or localStorage
    async saveLocations(locations) {
        if (USE_LOCALSTORAGE) {
            localStorage.setItem('locations', JSON.stringify(locations));
            console.log('💾 Locations saved to localStorage:', locations);
            clearCache('locations'); // Clear cache after save
            return { success: true, message: 'Locations saved to localStorage', count: locations.length };
        }

        try {
            console.log('💾 Saving locations to database:', locations);
            
            const response = await fetch(`${API_BASE_URL}/locations`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ locations }),
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Failed to save locations:', response.status, errorText);
                throw new Error(`Failed to save locations: ${response.status} ${errorText}`);
            }
            
            clearCache('locations'); // Clear all location caches
            clearCache('routes'); // Clear routes cache too (locationCount might change)
            // Clear per-route caches
            cache.routeLocations = {};
            const result = await response.json();
            console.log('✅ Locations saved successfully to database:', result);
            
            return result;
        } catch (error) {
            console.error('❌ Error saving locations:', error);
            throw error;
        }
    },

    // Delete location
    async deleteLocation(id) {
        if (USE_LOCALSTORAGE) {
            const locations = JSON.parse(localStorage.getItem('locations') || '[]');
            const filtered = locations.filter(loc => loc.id !== id);
            localStorage.setItem('locations', JSON.stringify(filtered));
            console.log('🗑️ Location deleted from localStorage:', id);
            clearCache('locations'); // Clear cache after delete
            return { success: true, message: 'Location deleted from localStorage' };
        }

        try {
            const response = await fetch(`${API_BASE_URL}/locations`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            });
            
            if (!response.ok) {
                throw new Error('Failed to delete location');
            }
            
            clearCache('locations'); // Clear cache after successful delete
            
            return await response.json();
        } catch (error) {
            console.error('Error deleting location:', error);
            throw error;
        }
    },

    // Delete route
    async deleteRoute(id) {
        if (USE_LOCALSTORAGE) {
            const routes = JSON.parse(localStorage.getItem('routes') || '[]');
            const filtered = routes.filter(route => route.id !== id);
            localStorage.setItem('routes', JSON.stringify(filtered));
            console.log('🗑️ Route deleted from localStorage:', id);
            clearCache('routes'); // Clear cache after delete
            return { success: true, message: 'Route deleted from localStorage' };
        }

        try {
            const response = await fetch(`${API_BASE_URL}/routes`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            });
            
            if (!response.ok) {
                throw new Error('Failed to delete route');
            }
            
            clearCache('routes'); // Clear cache after successful delete
            
            return await response.json();
        } catch (error) {
            console.error('Error deleting route:', error);
            throw error;
        }
    },

    // Dummy data fallbacks
    getDummyRoutes() {
        return [
            { id: 1, route: 'KL 7', shift: 'PM', warehouse: '3AVK04' },
            { id: 2, route: 'KL 8', shift: 'AM', warehouse: '3AVK05' },
            { id: 3, route: 'SG 1', shift: 'PM', warehouse: '2BVK01' }
        ];
    },

    getDummyLocations() {
        return [
            // Route 1 (KL 7) locations - routeId: 1
            { id: 1, no: 1, code: '34', location: 'Wisma Cimb', delivery: 'Daily', images: [], powerMode: 'Daily', routeId: 1, qrCodeImageUrl: '', qrCodeDestinationUrl: '', latitude: null, longitude: null, address: '' },
            { id: 2, no: 2, code: '42', location: 'Plaza Rakyat', delivery: 'Weekly', images: [], powerMode: 'Alt 1', routeId: 1, qrCodeImageUrl: '', qrCodeDestinationUrl: '', latitude: null, longitude: null, address: '' },
            { id: 3, no: 3, code: '51', location: 'KLCC Tower', delivery: 'Daily', images: [], powerMode: 'Alt 2', routeId: 1, qrCodeImageUrl: '', qrCodeDestinationUrl: '', latitude: null, longitude: null, address: '' },
            // Route 2 (KL 8) locations - routeId: 2
            { id: 4, no: 1, code: '67', location: 'Menara TM', delivery: 'Monthly', images: [], powerMode: 'Weekday', routeId: 2, qrCodeImageUrl: '', qrCodeDestinationUrl: '', latitude: null, longitude: null, address: '' },
            { id: 5, no: 2, code: '89', location: 'Pavilion KL', delivery: 'Daily', images: [], powerMode: 'Daily', routeId: 2, qrCodeImageUrl: '', qrCodeDestinationUrl: '', latitude: null, longitude: null, address: '' },
            { id: 6, no: 3, code: '23', location: 'Suria KLCC', delivery: 'Weekly', images: [], powerMode: 'Alt 1', routeId: 2, qrCodeImageUrl: '', qrCodeDestinationUrl: '', latitude: null, longitude: null, address: '' },
            // Route 3 (SG 1) locations - routeId: 3
            { id: 7, no: 1, code: '76', location: 'Mid Valley', delivery: 'Daily', images: [], powerMode: 'Alt 2', routeId: 3, qrCodeImageUrl: '', qrCodeDestinationUrl: '', latitude: null, longitude: null, address: '' },
            { id: 8, no: 2, code: '94', location: 'Bangsar Village', delivery: 'Weekly', images: [], powerMode: 'Weekday', routeId: 3, qrCodeImageUrl: '', qrCodeDestinationUrl: '', latitude: null, longitude: null, address: '' },
            { id: 9, no: 3, code: '31', location: 'Nu Sentral', delivery: 'Daily', images: [], powerMode: 'Daily', routeId: 3, qrCodeImageUrl: '', qrCodeDestinationUrl: '', latitude: null, longitude: null, address: '' },
            { id: 10, no: 4, code: '58', location: 'One Utama', delivery: 'Monthly', images: [], powerMode: 'Alt 1', routeId: 3, qrCodeImageUrl: '', qrCodeDestinationUrl: '', latitude: null, longitude: null, address: '' },
            // QL Kitchen location - routeId: 1
            { id: 11, no: 4, code: 'QL01', location: 'QL Kitchen', delivery: 'Daily', images: [], powerMode: 'Daily', routeId: 1, qrCodeImageUrl: '', qrCodeDestinationUrl: '', latitude: 3.0695500, longitude: 101.5469179, address: 'QL Kitchen' }
        ];
    },

    getData() {
        return this.getDummyRoutes();
    },

    getCustomersMedium() {
        return Promise.resolve(this.getDummyRoutes());
    },
    
    // Cache management functions
    preloadCache() {
        return preloadCache();
    },
    
    clearAllCache() {
        clearCache();
        console.log('🗑️ All caches cleared');
    },
    
    getCacheStats() {
        const totalRequests = cacheStats.hits + cacheStats.misses;
        const hitRate = totalRequests > 0 ? ((cacheStats.hits / totalRequests) * 100).toFixed(2) : 0;
        
        // Calculate localStorage usage
        let localStorageSize = 0;
        let cacheEntriesCount = 0;
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(k => {
                if (k.startsWith(PERSISTENT_CACHE_KEY_PREFIX)) {
                    localStorageSize += localStorage.getItem(k).length;
                    cacheEntriesCount++;
                }
            });
        } catch (e) {
            // Ignore errors
        }
        
        const stats = {
            memory: {
                routes: {
                    cached: !!cache.routes?.data,
                    age: cache.routes?.timestamp ? Date.now() - cache.routes.timestamp : null,
                    valid: isCacheValid(cache.routes, 'routes')
                },
                locations: {
                    cached: !!cache.locations?.data,
                    age: cache.locations?.timestamp ? Date.now() - cache.locations.timestamp : null,
                    valid: isCacheValid(cache.locations, 'locations')
                },
                routeLocations: {
                    count: Object.keys(cache.routeLocations).length,
                    keys: Object.keys(cache.routeLocations)
                }
            },
            network: {
                pendingRequests: pendingRequests.size
            },
            performance: {
                hitRate: `${hitRate}%`,
                hits: cacheStats.hits,
                misses: cacheStats.misses,
                totalRequests,
                invalidations: cacheStats.invalidations
            },
            storage: {
                localStorageSizeKB: (localStorageSize / 1024).toFixed(2),
                cacheEntries: cacheEntriesCount
            }
        };
        return stats;
    }
};
