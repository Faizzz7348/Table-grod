export const CustomerService = {
    getData() {
        return [
            {
                id: 1,
                route: 'KL 7',
                shift: 'PM',
                warehouse: '3AVK04'
            },
            {
                id: 2,
                route: 'KL 8',
                shift: 'AM',
                warehouse: '3AVK05'
            },
            {
                id: 3,
                route: 'SG 1',
                shift: 'PM',
                warehouse: '2BVK01'
            }
        ];
    },

    getDetailData() {
        return Promise.resolve([
            { 
                id: 1, 
                no: 1,
                code: '34', 
                location: 'Wisma Cimb', 
                delivery: 'Daily',
                images: ['https://picsum.photos/200/150?random=1', 'https://picsum.photos/200/150?random=2'],
                powerMode: 'Daily'
            },
            { 
                id: 2, 
                no: 2,
                code: '42', 
                location: 'Plaza Rakyat', 
                delivery: 'Weekly',
                images: ['https://picsum.photos/200/150?random=3'],
                powerMode: 'Alt 1'
            },
            { 
                id: 3, 
                no: 3,
                code: '51', 
                location: 'KLCC Tower', 
                delivery: 'Daily',
                images: ['https://picsum.photos/200/150?random=4', 'https://picsum.photos/200/150?random=5'],
                powerMode: 'Alt 2'
            },
            { 
                id: 4, 
                no: 4,
                code: '67', 
                location: 'Menara TM', 
                delivery: 'Monthly',
                images: ['https://picsum.photos/200/150?random=6'],
                powerMode: 'Weekday'
            },
            { 
                id: 5, 
                no: 5,
                code: '89', 
                location: 'Pavilion KL', 
                delivery: 'Daily',
                images: ['https://picsum.photos/200/150?random=7', 'https://picsum.photos/200/150?random=8'],
                powerMode: 'Daily'
            },
            { 
                id: 6, 
                no: 6,
                code: '23', 
                location: 'Suria KLCC', 
                delivery: 'Weekly',
                images: ['https://picsum.photos/200/150?random=9'],
                powerMode: 'Alt 1'
            },
            { 
                id: 7, 
                no: 7,
                code: '76', 
                location: 'Mid Valley', 
                delivery: 'Daily',
                images: ['https://picsum.photos/200/150?random=10'],
                powerMode: 'Alt 2'
            },
            { 
                id: 8, 
                no: 8,
                code: '94', 
                location: 'Bangsar Village', 
                delivery: 'Weekly',
                images: ['https://picsum.photos/200/150?random=11', 'https://picsum.photos/200/150?random=12'],
                powerMode: 'Weekday'
            },
            { 
                id: 9, 
                no: 9,
                code: '31', 
                location: 'Nu Sentral', 
                delivery: 'Daily',
                images: ['https://picsum.photos/200/150?random=13'],
                powerMode: 'Daily'
            },
            { 
                id: 10, 
                no: 10,
                code: '58', 
                location: 'One Utama', 
                delivery: 'Monthly',
                images: ['https://picsum.photos/200/150?random=14'],
                powerMode: 'Alt 1'
            }
        ]);
    },

    getRoutes() {
        return Promise.resolve(this.getData());
    },

    getCustomersMedium() {
        return Promise.resolve(this.getData());
    }
};
