'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Shipment } from '@/hooks/useShipments';
import {
    MapPin,
    Navigation,
    Clock,
    Truck,
    User,
    Phone,
    Calendar,
    Package,
    CheckCircle,
    AlertCircle,
    Circle,
} from 'lucide-react';

// Dynamic import to avoid SSR issues with Leaflet
const ShipmentMap = dynamic(() => import('@/components/map/ShipmentMap'), {
    ssr: false,
    loading: () => (
        <div className='border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50'>
            <div className='text-center'>
                <div className='animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-3'></div>
                <p className='text-gray-600 font-medium'>Loading Map...</p>
            </div>
        </div>
    ),
});

interface TrackLocationModalProps {
    isOpen: boolean;
    onClose: () => void;
    shipment: Shipment | null;
}

interface LocationUpdate {
    timestamp: string;
    location: string;
    status: string;
    notes?: string;
}

const statusConfig = {
    PENDING: { label: 'Pending', color: 'bg-yellow-500', icon: Clock },
    ASSIGNED: { label: 'Assigned', color: 'bg-indigo-500', icon: Package },
    PICKUP: { label: 'Pickup', color: 'bg-blue-500', icon: Package },
    IN_TRANSIT: { label: 'In Transit', color: 'bg-purple-500', icon: Truck },
    DELIVERED: { label: 'Delivered', color: 'bg-green-500', icon: CheckCircle },
    CANCELLED: { label: 'Cancelled', color: 'bg-red-500', icon: AlertCircle },
};

export default function TrackLocationModal({
    isOpen,
    onClose,
    shipment,
}: TrackLocationModalProps) {
    const [currentLocation, setCurrentLocation] = useState<string>('');
    const [estimatedArrival, setEstimatedArrival] = useState<string>('');
    const [progress, setProgress] = useState<number>(0);

    useEffect(() => {
        if (shipment) {
            // Simulate real-time tracking
            // In production, this would come from GPS/telematics API
            calculateProgress();
            simulateLocation();
        }
    }, [shipment]);

    const calculateProgress = () => {
        if (!shipment) return;

        const now = new Date().getTime();
        const pickup = new Date(shipment.pickupDate).getTime();
        const delivery = new Date(shipment.deliveryDate).getTime();

        if (shipment.status === 'DELIVERED') {
            setProgress(100);
            return;
        }

        if (shipment.status === 'PENDING' || shipment.status === 'CANCELLED') {
            setProgress(0);
            return;
        }

        if (now < pickup) {
            setProgress(0);
        } else if (now > delivery) {
            setProgress(100);
        } else {
            const progressPercent =
                ((now - pickup) / (delivery - pickup)) * 100;
            setProgress(
                Math.round(Math.min(Math.max(progressPercent, 0), 100))
            );
        }
    };

    const simulateLocation = () => {
        if (!shipment) return;

        // Simulate current location based on progress
        if (shipment.status === 'DELIVERED') {
            setCurrentLocation(shipment.deliveryAddress);
            setEstimatedArrival('Sudah diterima');
        } else if (
            shipment.status === 'PENDING' ||
            shipment.status === 'ASSIGNED'
        ) {
            setCurrentLocation(shipment.pickupAddress);
            const eta = new Date(shipment.pickupScheduled);
            setEstimatedArrival(
                eta.toLocaleString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                })
            );
        } else {
            // In transit - simulate intermediate location
            setCurrentLocation('Dalam perjalanan menuju tujuan');
            const eta = new Date(shipment.deliveryScheduled);
            setEstimatedArrival(
                eta.toLocaleString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                })
            );
        }
    };

    // Mock tracking timeline
    const getTrackingTimeline = (): LocationUpdate[] => {
        if (!shipment) return [];

        const timeline: LocationUpdate[] = [];
        const now = new Date();

        // Order created
        timeline.push({
            timestamp: shipment.createdAt,
            location: shipment.origin,
            status: 'Order Created',
            notes: `Shipment ${shipment.shipmentNumber} created`,
        });

        // Pickup
        if (shipment.status !== 'PENDING' && shipment.status !== 'CANCELLED') {
            timeline.push({
                timestamp: shipment.pickupDate,
                location: shipment.origin,
                status: 'Picked Up',
                notes: shipment.driver
                    ? `Picked up by ${shipment.driver.name}`
                    : 'Picked up',
            });
        }

        // In Transit
        if (shipment.status === 'IN_TRANSIT') {
            timeline.push({
                timestamp: now.toISOString(),
                location: currentLocation,
                status: 'In Transit',
                notes: `En route to ${shipment.destination}`,
            });
        }

        // Delivered
        if (shipment.status === 'DELIVERED') {
            timeline.push({
                timestamp: shipment.actualDeliveryDate || shipment.deliveryDate,
                location: shipment.destination,
                status: 'Delivered',
                notes: 'Package delivered successfully',
            });
        }

        // Cancelled
        if (shipment.status === 'CANCELLED') {
            timeline.push({
                timestamp: shipment.updatedAt,
                location: shipment.origin,
                status: 'Cancelled',
                notes: shipment.notes || 'Shipment cancelled',
            });
        }

        return timeline.reverse(); // Latest first
    };

    if (!shipment) return null;

    const statusInfo = statusConfig[shipment.status] || statusConfig.PENDING;
    const StatusIcon = statusInfo.icon;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Track Shipment - ${shipment.shipmentNumber}`}
            size='xl'
        >
            <div className='space-y-6'>
                {/* Status Header */}
                <div className='flex items-center justify-between p-4 bg-gray-50 rounded-lg'>
                    <div className='flex items-center space-x-3'>
                        <div
                            className={`p-2 rounded-lg ${statusInfo.color} text-white`}
                        >
                            <StatusIcon className='h-6 w-6' />
                        </div>
                        <div>
                            <p className='text-sm text-gray-500'>
                                Status Terkini
                            </p>
                            <p className='text-lg font-semibold text-gray-900'>
                                {statusInfo.label}
                            </p>
                        </div>
                    </div>
                    <div className='text-right'>
                        <p className='text-sm text-gray-500'>Progress</p>
                        <p className='text-2xl font-bold text-blue-600'>
                            {progress}%
                        </p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div>
                    <div className='flex justify-between text-sm text-gray-600 mb-2'>
                        <span>{shipment.origin}</span>
                        <span>{shipment.destination}</span>
                    </div>
                    <div className='w-full bg-gray-200 rounded-full h-2.5'>
                        <div
                            className='bg-blue-600 h-2.5 rounded-full transition-all duration-500'
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>

                {/* Current Location & ETA */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='p-4 border rounded-lg'>
                        <div className='flex items-start space-x-3'>
                            <MapPin className='h-5 w-5 text-red-500 mt-0.5' />
                            <div>
                                <p className='text-sm font-medium text-gray-700'>
                                    Lokasi Saat Ini
                                </p>
                                <p className='text-gray-900 mt-1'>
                                    {currentLocation}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className='p-4 border rounded-lg'>
                        <div className='flex items-start space-x-3'>
                            <Clock className='h-5 w-5 text-blue-500 mt-0.5' />
                            <div>
                                <p className='text-sm font-medium text-gray-700'>
                                    Estimasi Tiba
                                </p>
                                <p className='text-gray-900 mt-1'>
                                    {estimatedArrival}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Interactive Map */}
                <ShipmentMap
                    origin={shipment.origin}
                    destination={shipment.destination}
                    currentLocation={currentLocation}
                    status={shipment.status}
                />

                {/* Vehicle & Driver Info */}
                {(shipment.vehicle || shipment.driver) && (
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        {shipment.vehicle && (
                            <div className='p-4 border rounded-lg bg-blue-50'>
                                <div className='flex items-start space-x-3'>
                                    <Truck className='h-5 w-5 text-blue-600 mt-0.5' />
                                    <div className='flex-1'>
                                        <p className='text-sm font-medium text-gray-700'>
                                            Kendaraan
                                        </p>
                                        <p className='text-gray-900 font-semibold'>
                                            {shipment.vehicle.plateNumber}
                                        </p>
                                        <p className='text-sm text-gray-600'>
                                            {shipment.vehicle.type}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                        {shipment.driver && (
                            <div className='p-4 border rounded-lg bg-green-50'>
                                <div className='flex items-start space-x-3'>
                                    <User className='h-5 w-5 text-green-600 mt-0.5' />
                                    <div className='flex-1'>
                                        <p className='text-sm font-medium text-gray-700'>
                                            Driver
                                        </p>
                                        <p className='text-gray-900 font-semibold'>
                                            {shipment.driver.name}
                                        </p>
                                        {shipment.driver.phone && (
                                            <a
                                                href={`tel:${shipment.driver.phone}`}
                                                className='text-sm text-blue-600 hover:underline flex items-center mt-1'
                                            >
                                                <Phone className='h-3 w-3 mr-1' />
                                                {shipment.driver.phone}
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Tracking Timeline */}
                <div className='border-t pt-4'>
                    <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                        Tracking Timeline
                    </h3>
                    <div className='space-y-4'>
                        {getTrackingTimeline().map((update, index) => (
                            <div key={index} className='flex'>
                                <div className='flex flex-col items-center mr-4'>
                                    <div
                                        className={`rounded-full p-1 ${
                                            index === 0
                                                ? 'bg-blue-600'
                                                : 'bg-gray-300'
                                        }`}
                                    >
                                        <Circle
                                            className={`h-3 w-3 ${
                                                index === 0
                                                    ? 'text-blue-600 fill-current'
                                                    : 'text-gray-300'
                                            }`}
                                        />
                                    </div>
                                    {index !==
                                        getTrackingTimeline().length - 1 && (
                                        <div className='w-px h-full bg-gray-300 flex-1 my-1'></div>
                                    )}
                                </div>
                                <div className='flex-1 pb-4'>
                                    <div className='flex items-start justify-between'>
                                        <div>
                                            <p className='font-medium text-gray-900'>
                                                {update.status}
                                            </p>
                                            <p className='text-sm text-gray-600'>
                                                {update.location}
                                            </p>
                                            {update.notes && (
                                                <p className='text-sm text-gray-500 mt-1'>
                                                    {update.notes}
                                                </p>
                                            )}
                                        </div>
                                        <span className='text-xs text-gray-500 whitespace-nowrap ml-4'>
                                            {new Date(
                                                update.timestamp
                                            ).toLocaleString('id-ID', {
                                                day: 'numeric',
                                                month: 'short',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className='flex justify-end space-x-3 pt-4 border-t'>
                    <Button variant='outline' onClick={onClose}>
                        Close
                    </Button>
                    <Button variant='primary'>
                        <Navigation className='h-4 w-4 mr-2' />
                        Refresh Location
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
