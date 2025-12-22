import axios from 'axios';
import { CoverageArea, CoverageHierarchy } from '@/types/coverage-area';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const coverageApi = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests
coverageApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export interface QueryCoverageAreaParams {
    type?: string;
    parentId?: string;
    search?: string;
    isActive?: boolean;
    includeChildren?: boolean;
    includeParent?: boolean;
}

export const coverageAreaApi = {
    getAll: async (params?: QueryCoverageAreaParams) => {
        const response = await coverageApi.get<CoverageArea[]>(
            '/coverage-areas',
            { params }
        );
        return response.data;
    },

    getHierarchy: async () => {
        const response = await coverageApi.get<CoverageHierarchy>(
            '/coverage-areas/hierarchy'
        );
        return response.data;
    },

    getByType: async (type: string) => {
        const response = await coverageApi.get<CoverageArea[]>(
            `/coverage-areas/type/${type}`
        );
        return response.data;
    },

    getById: async (id: string) => {
        const response = await coverageApi.get<CoverageArea>(
            `/coverage-areas/${id}`
        );
        return response.data;
    },

    getChildren: async (id: string) => {
        const response = await coverageApi.get<CoverageArea[]>(
            `/coverage-areas/${id}/children`
        );
        return response.data;
    },

    create: async (data: Partial<CoverageArea>) => {
        const response = await coverageApi.post<CoverageArea>(
            '/coverage-areas',
            data
        );
        return response.data;
    },

    update: async (id: string, data: Partial<CoverageArea>) => {
        const response = await coverageApi.patch<CoverageArea>(
            `/coverage-areas/${id}`,
            data
        );
        return response.data;
    },

    delete: async (id: string) => {
        const response = await coverageApi.delete<CoverageArea>(
            `/coverage-areas/${id}`
        );
        return response.data;
    },
};
