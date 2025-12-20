import React from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Truck, Calendar, Gauge, Fuel, Package, FileText } from 'lucide-react';

interface Vehicle {
    id: string;
    vehicleNumber: string;
    licensePlate: string;
    vehicleType: string;
    brand: string | null;
    model: string | null;
    year: number | null;
    capacity: number;
    volumeCapacity: number | null;
    fuelType: string | null;
    fuelConsumption: number | null;
    currentOdometer: number | null;
    status: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

interface ViewVehicleModalProps {
    isOpen: boolean;
    onClose: () => void;
    vehicle: Vehicle | null;
}

export default function ViewVehicleModal({
    isOpen,
    onClose,
    vehicle,
}: ViewVehicleModalProps) {
    if (!vehicle) return null;

    const getStatusVariant = (
        status: string
    ): 'success' | 'info' | 'warning' | 'danger' | 'default' => {
        const configs: Record<
            string,
            'success' | 'info' | 'warning' | 'danger' | 'default'
        > = {
            AVAILABLE: 'success',
            IN_USE: 'info',
            MAINTENANCE: 'warning',
            OUT_OF_SERVICE: 'danger',
        };
        return configs[status] || 'default';
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title='Vehicle Details'
            size='lg'
        >
            <div className='space-y-6'>
                {/* Header Section */}
                <div className='bg-gradient-to-r from-blue-50 to-indigo-50 -m-6 mb-6 p-6 border-b border-gray-200'>
                    <div className='flex items-center gap-4'>
                        <div className='bg-white p-3 rounded-lg shadow-sm'>
                            <Truck className='h-8 w-8 text-blue-600' />
                        </div>
                        <div>
                            <h2 className='text-2xl font-bold text-gray-900'>
                                {vehicle.vehicleNumber}
                            </h2>
                            <p className='text-gray-600 text-sm mt-1'>
                                {vehicle.licensePlate}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Status */}
                <div className='flex items-center justify-between pb-4 border-b border-gray-200'>
                    <div>
                        <p className='text-sm text-gray-600 mb-2'>
                            Current Status
                        </p>
                        <Badge variant={getStatusVariant(vehicle.status)}>
                            {vehicle.status.replace(/_/g, ' ')}
                        </Badge>
                    </div>
                    <div className='text-right'>
                        <p className='text-sm text-gray-600 mb-2'>
                            Active Status
                        </p>
                        <Badge
                            variant={vehicle.isActive ? 'success' : 'danger'}
                        >
                            {vehicle.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                    </div>
                </div>

                {/* Basic Information */}
                <div>
                    <h3 className='text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2'>
                        <FileText className='h-5 w-5 text-blue-600' />
                        Basic Information
                    </h3>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div className='bg-gray-50 p-4 rounded-lg'>
                            <p className='text-sm text-gray-600 mb-1'>
                                Vehicle Type
                            </p>
                            <p className='font-semibold text-gray-800'>
                                {vehicle.vehicleType}
                            </p>
                        </div>
                        <div className='bg-gray-50 p-4 rounded-lg'>
                            <p className='text-sm text-gray-600 mb-1'>Brand</p>
                            <p className='font-semibold text-gray-800'>
                                {vehicle.brand || '-'}
                            </p>
                        </div>
                        <div className='bg-gray-50 p-4 rounded-lg'>
                            <p className='text-sm text-gray-600 mb-1'>Model</p>
                            <p className='font-semibold text-gray-800'>
                                {vehicle.model || '-'}
                            </p>
                        </div>
                        <div className='bg-gray-50 p-4 rounded-lg'>
                            <p className='text-sm text-gray-600 mb-1 flex items-center gap-1'>
                                <Calendar className='h-4 w-4' />
                                Year
                            </p>
                            <p className='font-semibold text-gray-800'>
                                {vehicle.year || '-'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Capacity */}
                <div>
                    <h3 className='text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2'>
                        <Package className='h-5 w-5 text-blue-600' />
                        Capacity
                    </h3>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div className='bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100'>
                            <p className='text-sm text-blue-700 mb-1'>
                                Weight Capacity
                            </p>
                            <p className='text-2xl font-bold text-blue-900'>
                                {vehicle.capacity.toLocaleString()} kg
                            </p>
                        </div>
                        <div className='bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-100'>
                            <p className='text-sm text-purple-700 mb-1'>
                                Volume Capacity
                            </p>
                            <p className='text-2xl font-bold text-purple-900'>
                                {vehicle.volumeCapacity
                                    ? `${vehicle.volumeCapacity} m³`
                                    : 'N/A'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Fuel & Mileage */}
                <div>
                    <h3 className='text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2'>
                        <Fuel className='h-5 w-5 text-blue-600' />
                        Fuel & Mileage
                    </h3>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                        <div className='bg-gray-50 p-4 rounded-lg'>
                            <p className='text-sm text-gray-600 mb-1'>
                                Fuel Type
                            </p>
                            <p className='font-semibold text-gray-800'>
                                {vehicle.fuelType || 'N/A'}
                            </p>
                        </div>
                        <div className='bg-gray-50 p-4 rounded-lg'>
                            <p className='text-sm text-gray-600 mb-1'>
                                Consumption
                            </p>
                            <p className='font-semibold text-gray-800'>
                                {vehicle.fuelConsumption
                                    ? `${vehicle.fuelConsumption} L/100km`
                                    : 'N/A'}
                            </p>
                        </div>
                        <div className='bg-gray-50 p-4 rounded-lg'>
                            <p className='text-sm text-gray-600 mb-1 flex items-center gap-1'>
                                <Gauge className='h-4 w-4' />
                                Odometer
                            </p>
                            <p className='font-semibold text-gray-800'>
                                {vehicle.currentOdometer
                                    ? `${vehicle.currentOdometer.toLocaleString()} km`
                                    : '0 km'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Timestamps */}
                <div className='pt-4 border-t border-gray-200'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
                        <div>
                            <p className='text-gray-600 mb-1'>Created At</p>
                            <p className='text-gray-800 font-medium'>
                                {formatDate(vehicle.createdAt)}
                            </p>
                        </div>
                        <div>
                            <p className='text-gray-600 mb-1'>Last Updated</p>
                            <p className='text-gray-800 font-medium'>
                                {formatDate(vehicle.updatedAt)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className='flex justify-end gap-3 pt-4 border-t'>
                    <Button variant='outline' onClick={onClose}>
                        Close
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
