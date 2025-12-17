import { useApi } from './useApi';

export interface Order {
    id: string;
    orderNumber: string;
    customerName: string; // Backend uses customerName
    customer?: string; // Alias for compatibility
    status: string;
    pickupAddress: string;
    deliveryAddress: string;
    totalWeight: number;
    totalVolume: number;
    shipment?: {
        id: string;
        shipmentNumber: string;
        status: string;
    };
}

export function useOrders() {
    const { data, loading, error, refetch } = useApi<Order[]>('/orders');

    // Map customerName to customer for backward compatibility
    const orders = (data || []).map((order) => ({
        ...order,
        customer: order.customerName,
    }));

    return {
        orders,
        loading,
        error,
        refetch,
    };
}
