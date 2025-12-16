import { useApi, useApiMutation } from './useApi';

export interface Shipment {
    id: number;
    shipmentNumber: string;
    orderId: number;
    order?: {
        orderNumber: string;
        customer: string;
    };
    vehicleId: number | null;
    vehicle?: {
        plateNumber: string;
        type: string;
    };
    driverId: number | null;
    driver?: {
        name: string;
        phone: string;
    };
    origin: string;
    destination: string;
    pickupDate: string;
    deliveryDate: string;
    actualDeliveryDate: string | null;
    status: 'PENDING' | 'PICKUP' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';
    distance: number;
    estimatedCost: number;
    actualCost: number | null;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface CreateShipmentDto {
    orderId: number;
    vehicleId?: number;
    driverId?: number;
    origin: string;
    destination: string;
    pickupDate: string;
    deliveryDate: string;
    estimatedCost: number;
    notes?: string;
}

export interface UpdateShipmentDto {
    vehicleId?: number;
    driverId?: number;
    status?: 'PENDING' | 'PICKUP' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';
    actualDeliveryDate?: string;
    actualCost?: number;
    notes?: string;
}

export function useShipments() {
    const { data, loading, error, refetch } =
        useApi<Shipment[]>('/shipments');

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
