import { useApi } from './useApi';

export interface Vehicle {
    id: string;
    vehicleNumber: string;
    licensePlate: string;
    vehicleType: string;
    capacity: number;
    status: 'AVAILABLE' | 'IN_USE' | 'MAINTENANCE' | 'OUT_OF_SERVICE';
    brand?: string;
    model?: string;
    // Computed/alias fields for backward compatibility
    plateNumber?: string;
    type?: string;
}

export function useVehicles() {
    const { data, loading, error, refetch } =
        useApi<Vehicle[]>('/fleet/vehicles');

    // Add computed fields for easier display
    const vehicles = (data || []).map((vehicle) => ({
        ...vehicle,
        plateNumber: vehicle.licensePlate,
        type: vehicle.vehicleType,
    }));

    return {
        vehicles,
        loading,
        error,
        refetch,
    };
}
