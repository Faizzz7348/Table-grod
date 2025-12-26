const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
// Only use localStorage in development mode
const USE_LOCALSTORAGE = import.meta.env.DEV === true;

// In-memory cache with expiration
const cache = {
    routes: { data: null, timestamp: null },
    locations: { data: null, timestamp: null }
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Cache helper functions
const isCacheValid = (cacheEntry) => {
    if (!cacheEntry.data || !cacheEntry.timestamp) return false;
    return (Date.now() - cacheEntry.timestamp) < CACHE_DURATION;
};

const setCache = (key, data) => {
    cache[key] = { data, timestamp: Date.now() };
};

const getCache = (key) => {
    return isCacheValid(cache[key]) ? cache[key].data : null;
};

const clearCache = (key = null) => {
    if (key) {
        cache[key] = { data: null, timestamp: null };
    } else {
        cache.routes = { data: null, timestamp: null };
        cache.locations = { data: null, timestamp: null };
    }
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
    async getRoutes() {
        // Check in-memory cache first
        const cachedData = getCache('routes');
        if (cachedData) {
            console.log('⚡ Using cached routes from memory');
            return cachedData;
        }

        if (USE_LOCALSTORAGE) {
            this.initLocalStorage();
            const routes = JSON.parse(localStorage.getItem('routes') || '[]');
            console.log('📦 Loading routes from localStorage:', routes);
            setCache('routes', routes);
            return routes;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/routes`);
            if (!response.ok) {
                throw new Error('Failed to fetch routes');
            }
            const routes = await response.json();
            setCache('routes', routes);
            return routes;
        } catch (error) {
            console.error('Error fetching routes:', error);
            const dummyRoutes = this.getDummyRoutes();
            setCache('routes', dummyRoutes);
            return dummyRoutes;
        }
    },

    // Get detail locations from API or localStorage with caching
    async getDetailData(routeId = null) {
        // For specific routeId, always fetch fresh data (don't use cache)
        if (!routeId) {
            const cachedData = getCache('locations');
            if (cachedData) {
                console.log('⚡ Using cached locations from memory');
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
            if (!routeId) setCache('locations', locations);
            return filteredLocations;
        }

        try {
            const url = routeId ? `${API_BASE_URL}/locations?routeId=${routeId}` : `${API_BASE_URL}/locations`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch locations');
            }
            const locations = await response.json();
            if (!routeId) setCache('locations', locations);
            return locations;
        } catch (error) {
            console.error('Error fetching locations:', error);
            // Fallback to dummy data and filter by routeId
            const dummyLocations = this.getDummyLocations();
            const filteredLocations = routeId ? dummyLocations.filter(loc => loc.routeId === routeId) : dummyLocations;
            if (!routeId) setCache('locations', dummyLocations);
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
                        warehouse: route.warehouse 
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
            
            clearCache('locations'); // Clear cache after successful save
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
            { id: 1, no: 1, code: '34', location: 'Wisma Cimb', delivery: 'Daily', images: [], powerMode: 'Daily', routeId: 1, qrCodeImageUrl: '', qrCodeDestinationUrl: '' },
            { id: 2, no: 2, code: '42', location: 'Plaza Rakyat', delivery: 'Weekly', images: [], powerMode: 'Alt 1', routeId: 1, qrCodeImageUrl: '', qrCodeDestinationUrl: '' },
            { id: 3, no: 3, code: '51', location: 'KLCC Tower', delivery: 'Daily', images: [], powerMode: 'Alt 2', routeId: 1, qrCodeImageUrl: '', qrCodeDestinationUrl: '' },
            // Route 2 (KL 8) locations - routeId: 2
            { id: 4, no: 1, code: '67', location: 'Menara TM', delivery: 'Monthly', images: [], powerMode: 'Weekday', routeId: 2, qrCodeImageUrl: '', qrCodeDestinationUrl: '' },
            { id: 5, no: 2, code: '89', location: 'Pavilion KL', delivery: 'Daily', images: [], powerMode: 'Daily', routeId: 2, qrCodeImageUrl: '', qrCodeDestinationUrl: '' },
            { id: 6, no: 3, code: '23', location: 'Suria KLCC', delivery: 'Weekly', images: [], powerMode: 'Alt 1', routeId: 2, qrCodeImageUrl: '', qrCodeDestinationUrl: '' },
            // Route 3 (SG 1) locations - routeId: 3
            { id: 7, no: 1, code: '76', location: 'Mid Valley', delivery: 'Daily', images: [], powerMode: 'Alt 2', routeId: 3, qrCodeImageUrl: '', qrCodeDestinationUrl: '' },
            { id: 8, no: 2, code: '94', location: 'Bangsar Village', delivery: 'Weekly', images: [], powerMode: 'Weekday', routeId: 3, qrCodeImageUrl: '', qrCodeDestinationUrl: '' },
            { id: 9, no: 3, code: '31', location: 'Nu Sentral', delivery: 'Daily', images: [], powerMode: 'Daily', routeId: 3, qrCodeImageUrl: '', qrCodeDestinationUrl: '' },
            { id: 10, no: 4, code: '58', location: 'One Utama', delivery: 'Monthly', images: [], powerMode: 'Alt 1', routeId: 3, qrCodeImageUrl: '', qrCodeDestinationUrl: '' }
        ];
    },

    getData() {
        return this.getDummyRoutes();
    },

    getCustomersMedium() {
        return Promise.resolve(this.getDummyRoutes());
    }
};
