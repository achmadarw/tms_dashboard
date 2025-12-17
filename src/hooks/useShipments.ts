import { useApi, useApiMutation } from './useApi';

export interface Shipment {
    id: string;
    shipmentNumber: string;
    orderId: string;
    order?: {
        orderNumber: string;
        customerName: string;
    };
    vehicleId: string | null;
    vehicle?: {
        vehicleNumber: string;
        licensePlate: string;
    };
    driverId: string | null;
    driver?: {
        user: {
            firstName: string;
            lastName: string;
            phone: string;
        };
    };
    pickupAddress: string;
    pickupLat: number;
    pickupLng: number;
    deliveryAddress: string;
    deliveryLat: number;
    deliveryLng: number;
    pickupScheduled: string;
    deliveryScheduled: string;
    actualPickupTime: string | null;
    actualDeliveryTime: string | null;
    status:
        | 'PENDING'
        | 'ASSIGNED'
        | 'PICKUP'
        | 'IN_TRANSIT'
        | 'DELIVERED'
        | 'CANCELLED';
    totalWeight: number;
    totalVolume: number;
    totalCost: number;
    actualCost: number | null;
    specialInstructions: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface CreateShipmentDto {
    orderId: string;
    vehicleId?: string;
    driverId?: string;
    origin: string;
    destination: string;
    pickupDate: string;
    deliveryDate: string;
    estimatedCost: number;
    notes?: string;
}

export interface UpdateShipmentDto {
    vehicleId?: string;
    driverId?: string;
    status?:
        | 'PENDING'
        | 'ASSIGNED'
        | 'PICKUP'
        | 'IN_TRANSIT'
        | 'DELIVERED'
        | 'CANCELLED';
    actualDeliveryDate?: string;
    actualCost?: number;
    notes?: string;
}

export function useShipments() {
    const { data, loading, error, refetch } = useApi<Shipment[]>('/shipments');

    return {
        shipments: data || [],
        loading,
        error,
        refetch,
    };
}

export function useShipment(id: number) {
    const { data, loading, error, refetch } = useApi<Shipment>(
        `/shipments/${id}`
    );

    return {
        shipment: data,
        loading,
        error,
        refetch,
    };
}

export function useCreateShipment() {
    const { mutate, loading, error } = useApiMutation<
        Shipment,
        CreateShipmentDto
    >();

    const createShipment = async (data: CreateShipmentDto) => {
        return await mutate('/shipments', 'POST', data);
    };

    return {
        createShipment,
        loading,
        error,
    };
}

export function useUpdateShipment() {
    const { mutate, loading, error } = useApiMutation<
        Shipment,
        UpdateShipmentDto
    >();

    const updateShipment = async (id: number, data: UpdateShipmentDto) => {
        return await mutate(`/shipments/${id}`, 'PATCH', data);
    };

    return {
        updateShipment,
        loading,
        error,
    };
}

export function useDeleteShipment() {
    const { mutate, loading, error } = useApiMutation<void, void>();

    const deleteShipment = async (id: number) => {
        return await mutate(`/shipments/${id}`, 'DELETE');
    };

    return {
        deleteShipment,
        loading,
        error,
    };
}
