'use client';

import React, { useMemo } from 'react';
import { Shipment } from '@/hooks/useShipments';

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
function calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number {
    // Handle invalid coordinates
    if (
        !lat1 ||
        !lon1 ||
        !lat2 ||
        !lon2 ||
        lat1 === 0 ||
        lon1 === 0 ||
        lat2 === 0 ||
        lon2 === 0
    ) {
        return 0;
    }

    const R = 6371; // Radius of the Earth in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return Math.round(distance * 100) / 100; // Round to 2 decimal places
}

// Extended Shipment interface with computed fields for backward compatibility
export interface ShipmentWithDisplayData extends Shipment {
    // Computed display fields
    origin: string;
    destination: string;
    pickupDate: string;
    deliveryDate: string;
    estimatedCost: number;
    actualDeliveryDate: string | null;
    distance: number;
    notes: string | null;
    // Transformed relations
    order:
        | {
              orderNumber: string;
              customer: string;
          }
        | undefined;
    vehicle:
        | {
              plateNumber: string;
              type: string;
          }
        | undefined;
    driver:
        | {
              name: string;
              phone: string;
          }
        | undefined;
}

/**
 * Transform backend Shipment to include display-friendly fields
 */
export function transformShipment(shipment: Shipment): ShipmentWithDisplayData {
    // Calculate distance from coordinates
    const distance = calculateDistance(
        shipment.pickupLat || 0,
        shipment.pickupLng || 0,
        shipment.deliveryLat || 0,
        shipment.deliveryLng || 0
    );

    return {
        ...shipment,
        // Map backend fields to expected frontend fields
        // Prioritize order addresses if available (real-time data)
        origin: shipment.order?.pickupAddress || shipment.pickupAddress || '',
        destination:
            shipment.order?.deliveryAddress || shipment.deliveryAddress || '',
        pickupDate: shipment.pickupScheduled,
        deliveryDate: shipment.deliveryScheduled,
        estimatedCost: shipment.totalCost || 0,
        actualDeliveryDate: shipment.actualDeliveryTime,
        distance: distance,
        notes: shipment.specialInstructions,
        // Transform order relation
        order: shipment.order
            ? {
                  orderNumber: shipment.order.orderNumber,
                  customer: shipment.order.customerName,
              }
            : undefined,
        // Transform vehicle relation
        vehicle: shipment.vehicle
            ? {
                  plateNumber: shipment.vehicle.licensePlate,
                  type: shipment.vehicle.vehicleNumber, // Use vehicleNumber as type for now
              }
            : undefined,
        // Transform driver relation
        driver: shipment.driver
            ? {
                  name: `${shipment.driver.user.firstName} ${shipment.driver.user.lastName}`,
                  phone: shipment.driver.user.phone,
              }
            : undefined,
    };
}

/**
 * Hook to transform shipments array
 */
export function useTransformedShipments(
    shipments: Shipment[]
): ShipmentWithDisplayData[] {
    return useMemo(() => {
        return shipments.map(transformShipment);
    }, [shipments]);
}
