import { useApi } from './useApi';

export interface Driver {
    id: string;
    licenseNumber: string;
    isAvailable: boolean;
    rating: number;
    name?: string; // Computed from user.firstName + lastName
    phone?: string; // From user.phone
    user: {
        firstName: string;
        lastName: string;
        phone: string;
        email: string;
    };
}

export function useDrivers() {
    const { data, loading, error, refetch } =
        useApi<Driver[]>('/fleet/drivers');

    // Add computed name field for easier display
    const drivers = (data || []).map((driver) => ({
        ...driver,
        name: `${driver.user.firstName} ${driver.user.lastName}`,
        phone: driver.user.phone,
    }));

    return {
        drivers,
        loading,
        error,
        refetch,
    };
}
