import { useApi } from './useApi';

export interface Order {
    id: string;
    orderNumber: string;
    customer: string;
    status: string;
    pickupAddress: string;
    deliveryAddress: string;
    totalWeight: number;
    totalVolume: number;
}

export function useOrders() {
    const { data, loading, error, refetch } = useApi<Order[]>('/api/orders');

    return {
        orders: data || [],
        loading,
        error,
        refetch,
    };
}
