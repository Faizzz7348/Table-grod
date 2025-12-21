const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
// Only use localStorage in development mode
const USE_LOCALSTORAGE = import.meta.env.DEV === true;

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

    // Get routes from API or localStorage
    async getRoutes() {
        if (USE_LOCALSTORAGE) {
            this.initLocalStorage();
            const routes = JSON.parse(localStorage.getItem('routes') || '[]');
            console.log('📦 Loading routes from localStorage:', routes);
            return routes;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/routes`);
            if (!response.ok) {
                throw new Error('Failed to fetch routes');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching routes:', error);
            return this.getDummyRoutes();
        }
    },

    // Get detail locations from API or localStorage
    async getDetailData() {
        if (USE_LOCALSTORAGE) {
            this.initLocalStorage();
            const locations = JSON.parse(localStorage.getItem('locations') || '[]');
            console.log('📦 Loading locations from localStorage:', locations);
            return locations;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/locations`);
            if (!response.ok) {
                throw new Error('Failed to fetch locations');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching locations:', error);
            return this.getDummyLocations();
        }
    },

    // Save routes to API or localStorage
    async saveRoutes(routes) {
        if (USE_LOCALSTORAGE) {
            localStorage.setItem('routes', JSON.stringify(routes));
            console.log('💾 Routes saved to localStorage:', routes);
            return { success: true, message: 'Routes saved to localStorage', count: routes.length };
        }

        try {
            const response = await fetch(`${API_BASE_URL}/routes`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ routes }),
            });
            
            if (!response.ok) {
                throw new Error('Failed to save routes');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error saving routes:', error);
            throw error;
        }
    },

    // Save locations to API or localStorage
    async saveLocations(locations) {
        if (USE_LOCALSTORAGE) {
            localStorage.setItem('locations', JSON.stringify(locations));
            console.log('💾 Locations saved to localStorage:', locations);
            return { success: true, message: 'Locations saved to localStorage', count: locations.length };
        }

        try {
            const response = await fetch(`${API_BASE_URL}/locations`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ locations }),
            });
            
            if (!response.ok) {
                throw new Error('Failed to save locations');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error saving locations:', error);
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
            { id: 1, no: 1, code: '34', location: 'Wisma Cimb', delivery: 'Daily', images: [], powerMode: 'Daily' },
            { id: 2, no: 2, code: '42', location: 'Plaza Rakyat', delivery: 'Weekly', images: [], powerMode: 'Alt 1' },
            { id: 3, no: 3, code: '51', location: 'KLCC Tower', delivery: 'Daily', images: [], powerMode: 'Alt 2' },
            { id: 4, no: 4, code: '67', location: 'Menara TM', delivery: 'Monthly', images: [], powerMode: 'Weekday' },
            { id: 5, no: 5, code: '89', location: 'Pavilion KL', delivery: 'Daily', images: [], powerMode: 'Daily' },
            { id: 6, no: 6, code: '23', location: 'Suria KLCC', delivery: 'Weekly', images: [], powerMode: 'Alt 1' },
            { id: 7, no: 7, code: '76', location: 'Mid Valley', delivery: 'Daily', images: [], powerMode: 'Alt 2' },
            { id: 8, no: 8, code: '94', location: 'Bangsar Village', delivery: 'Weekly', images: [], powerMode: 'Weekday' },
            { id: 9, no: 9, code: '31', location: 'Nu Sentral', delivery: 'Daily', images: [], powerMode: 'Daily' },
            { id: 10, no: 10, code: '58', location: 'One Utama', delivery: 'Monthly', images: [], powerMode: 'Alt 1' }
        ];
    },

    getData() {
        return this.getDummyRoutes();
    },

    getCustomersMedium() {
        return Promise.resolve(this.getDummyRoutes());
    }
};
