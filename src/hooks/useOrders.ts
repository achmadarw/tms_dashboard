import { useApi } from './useApi';

export interface Order {
    id: string;
    orderNumber: string;
    customerName: string;
    customer?: string; // Alias for compatibility
    customerEmail: string;
    customerPhone: string;
    status: 'PENDING' | 'CONFIRMED' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';
    priority: string; // LOW, NORMAL, HIGH, URGENT
    pickupAddress: string;
    pickupLat?: number;
    pickupLng?: number;
    deliveryAddress: string;
    deliveryLat?: number;
    deliveryLng?: number;
    totalWeight: number;
    totalVolume?: number;
    totalQty: number;
    requestedDate: string;
    estimatedDelivery?: string;
    actualDelivery?: string;
    specialNotes?: string;
    createdAt: string;
    updatedAt: string;
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
