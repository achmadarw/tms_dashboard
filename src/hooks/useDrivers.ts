import { useApi } from './useApi';

export interface Driver {
    id: string;
    licenseNumber: string;
    isAvailable: boolean;
    rating: number;
    user: {
        firstName: string;
        lastName: string;
        phone: string;
        email: string;
    };
}

export function useDrivers() {
    const { data, loading, error, refetch } =
        useApi<Driver[]>('/api/fleet/drivers');

    return {
        drivers: data || [],
        loading,
        error,
        refetch,
    };
}
