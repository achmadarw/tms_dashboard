import { useApi } from './useApi';

export interface Vehicle {
    id: string;
    vehicleNumber: string;
    licensePlate: string; // Changed from plateNumber
    vehicleType: string; // Changed from type
    capacity: number;
    status: 'AVAILABLE' | 'IN_USE' | 'MAINTENANCE' | 'OUT_OF_SERVICE';
    brand?: string;
    model?: string;
}

export function useVehicles() {
    const { data, loading, error, refetch } =
        useApi<Vehicle[]>('/fleet/vehicles');

    return {
        vehicles: data || [],
        loading,
        error,
        refetch,
    };
}
