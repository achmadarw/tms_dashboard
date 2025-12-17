import { Shipment } from '@/hooks/useShipments';

export interface ShipmentDisplayData {
    origin: string;
    destination: string;
    pickupDate: string;
    deliveryDate: string;
    estimatedCost: number;
    actualCost: number | null;
    distance: number;
    customer: string;
    orderNumber: string;
    vehiclePlate: string | null;
    vehicleNumber: string | null;
    driverName: string | null;
    driverPhone: string | null;
    notes: string | null;
}

export function getShipmentDisplayData(
    shipment: Shipment
): ShipmentDisplayData {
    return {
        origin: shipment.pickupAddress || 'Unknown',
        destination: shipment.deliveryAddress || 'Unknown',
        pickupDate: shipment.pickupScheduled,
        deliveryDate: shipment.deliveryScheduled,
        estimatedCost: shipment.totalCost || 0,
        actualCost: shipment.actualCost,
        distance: 0, // Calculate from coordinates if needed
        customer: shipment.order?.customerName || 'Unknown',
        orderNumber: shipment.order?.orderNumber || 'N/A',
        vehiclePlate: shipment.vehicle?.licensePlate || null,
        vehicleNumber: shipment.vehicle?.vehicleNumber || null,
        driverName: shipment.driver
            ? `${shipment.driver.user.firstName} ${shipment.driver.user.lastName}`
            : null,
        driverPhone: shipment.driver?.user.phone || null,
        notes: shipment.specialInstructions,
    };
}

export function formatShipmentDate(dateString: string): string {
    if (!dateString) return 'N/A';
    try {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    } catch {
        return 'Invalid Date';
    }
}

export function formatShipmentCost(cost: number | null | undefined): string {
    if (!cost && cost !== 0) return '$0';
    return `$${cost.toLocaleString()}`;
}
