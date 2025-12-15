import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const api = axios.create({
    baseURL: `${API_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// API Endpoints
export const apiClient = {
    // Auth
    auth: {
        login: (email: string, password: string) =>
            api.post('/auth/login', { email, password }),
        register: (data: any) => api.post('/auth/register', data),
        getProfile: () => api.get('/auth/profile'),
        logout: () => api.post('/auth/logout'),
    },

    // Orders
    orders: {
        getAll: (params?: any) => api.get('/orders', { params }),
        getById: (id: string) => api.get(`/orders/${id}`),
        create: (data: any) => api.post('/orders', data),
        updateStatus: (id: string, status: string) =>
            api.put(`/orders/${id}/status`, { status }),
        getStatistics: () => api.get('/orders/statistics'),
    },

    // Shipments
    shipments: {
        getAll: (params?: any) => api.get('/shipments', { params }),
        getById: (id: string) => api.get(`/shipments/${id}`),
        create: (data: any) => api.post('/shipments', data),
        updateStatus: (id: string, status: string, location?: any) =>
            api.put(`/shipments/${id}/status`, { status, location }),
        getStatistics: () => api.get('/shipments/statistics'),
    },

    // Fleet
    fleet: {
        getVehicles: (params?: any) => api.get('/fleet/vehicles', { params }),
        getVehicle: (id: string) => api.get(`/fleet/vehicles/${id}`),
        createVehicle: (data: any) => api.post('/fleet/vehicles', data),
        updateVehicleStatus: (id: string, status: string) =>
            api.put(`/fleet/vehicles/${id}/status`, { status }),
        getDrivers: () => api.get('/fleet/drivers'),
        createDriver: (data: any) => api.post('/fleet/drivers', data),
        getStatistics: () => api.get('/fleet/statistics'),
    },

    // Tracking
    tracking: {
        getShipmentTracking: (id: string) =>
            api.get(`/tracking/shipment/${id}`),
        getLiveShipments: () => api.get('/tracking/live'),
        getVehicleLocation: (id: string) =>
            api.get(`/tracking/vehicle/${id}/location`),
        createLog: (data: any) => api.post('/tracking/log', data),
    },

    // Analytics
    analytics: {
        getDashboard: () => api.get('/analytics/dashboard'),
        getKPITrend: (days?: number) =>
            api.get('/analytics/kpi-trend', { params: { days } }),
        getCostAnalysis: (startDate: string, endDate: string) =>
            api.get('/analytics/cost-analysis', {
                params: { startDate, endDate },
            }),
        getPerformance: () => api.get('/analytics/performance'),
    },

    // Carriers
    carriers: {
        getAll: (params?: any) => api.get('/carriers', { params }),
        create: (data: any) => api.post('/carriers', data),
        createRate: (id: string, data: any) =>
            api.post(`/carriers/${id}/rates`, data),
        compareRates: (data: any) => api.post('/carriers/compare-rates', data),
    },

    // Documents
    documents: {
        getShipmentDocuments: (id: string) =>
            api.get(`/documents/shipment/${id}`),
        upload: (data: any) => api.post('/documents', data),
        verify: (id: string, verifiedBy: string) =>
            api.put(`/documents/${id}/verify`, { verifiedBy }),
        getExpiring: (days?: number) =>
            api.get('/documents/expiring', { params: { days } }),
    },

    // Planning
    planning: {
        getAll: (params?: any) => api.get('/planning', { params }),
        getById: (id: string) => api.get(`/planning/${id}`),
        create: (data: any) => api.post('/planning', data),
        update: (id: string, data: any) => api.put(`/planning/${id}`, data),
        optimizeLoad: (id: string) => api.post(`/planning/${id}/optimize-load`),
    },

    // Routes
    routes: {
        getAll: () => api.get('/routes'),
        getById: (id: string) => api.get(`/routes/${id}`),
        create: (data: any) => api.post('/routes', data),
        optimize: (data: any) => api.post('/routes/optimize', data),
        findAlternatives: (data: any) => api.post('/routes/alternatives', data),
        calculateETA: (data: any) => api.post('/routes/eta', data),
    },
};
