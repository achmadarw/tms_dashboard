import React from 'react';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import { Shipment } from '@/hooks/useShipments';
import {
    Package,
    Truck,
    MapPin,
    Calendar,
    DollarSign,
    User,
    FileText,
    Clock,
    CheckCircle,
    XCircle,
} from 'lucide-react';

interface ViewDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    shipment: Shipment;
}

const statusConfig = {
    PENDING: { label: 'Pending', variant: 'warning' as const, icon: Clock },
    PICKUP: { label: 'Pickup', variant: 'info' as const, icon: Package },
    IN_TRANSIT: { label: 'In Transit', variant: 'info' as const, icon: Truck },
    DELIVERED: {
        label: 'Delivered',
        variant: 'success' as const,
        icon: CheckCircle,
    },
    CANCELLED: {
        label: 'Cancelled',
        variant: 'danger' as const,
        icon: XCircle,
    },
};

export default function ViewDetailsModal({
    isOpen,
    onClose,
    shipment,
}: ViewDetailsModalProps) {
    const statusInfo = statusConfig[shipment.status] || statusConfig.PENDING;
    const StatusIcon = statusInfo.icon;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatDistance = (distance: number) => {
        return distance >= 1
            ? `${distance} km`
            : `${(distance * 1000).toFixed(0)} m`;
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title='Shipment Details'
            size='lg'
        >
            <div className='space-y-6'>
                {/* Header Info */}
                <div className='bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white'>
                    <div className='flex items-start justify-between'>
                        <div>
                            <h3 className='text-2xl font-bold mb-1'>
                                {shipment.shipmentNumber}
                            </h3>
                            <p className='text-purple-100'>
                                Order: {shipment.order?.orderNumber || 'N/A'}
                            </p>
                        </div>
                        <Badge variant={statusInfo.variant}>
                            <StatusIcon className='h-4 w-4 mr-1' />
                            {statusInfo.label}
                        </Badge>
                    </div>
                </div>

                {/* Customer Info */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div className='bg-gray-50 rounded-lg p-4'>
                        <div className='flex items-center gap-2 mb-2'>
                            <User className='h-5 w-5 text-gray-600' />
                            <span className='font-semibold text-gray-700'>
                                Customer
                            </span>
                        </div>
                        <p className='text-lg'>
                            {shipment.order?.customer || 'Unknown'}
                        </p>
                    </div>

                    <div className='bg-gray-50 rounded-lg p-4'>
                        <div className='flex items-center gap-2 mb-2'>
                            <DollarSign className='h-5 w-5 text-gray-600' />
                            <span className='font-semibold text-gray-700'>
                                Cost
                            </span>
                        </div>
                        <p className='text-lg font-semibold text-green-600'>
                            ${(shipment.estimatedCost || 0).toLocaleString()}
                        </p>
                        {shipment.actualCost && (
                            <p className='text-sm text-gray-600'>
                                Actual: ${shipment.actualCost.toLocaleString()}
                            </p>
                        )}
                    </div>
                </div>

                {/* Route Information */}
                <div className='border border-gray-200 rounded-lg p-4'>
                    <div className='flex items-center gap-2 mb-4'>
                        <MapPin className='h-5 w-5 text-purple-600' />
                        <span className='font-semibold text-gray-700'>
                            Route Information
                        </span>
                    </div>
                    <div className='space-y-3'>
                        <div className='flex items-start gap-3'>
                            <MapPin className='h-5 w-5 text-green-500 mt-1' />
                            <div>
                                <div className='text-sm text-gray-600'>
                                    Origin
                                </div>
                                <div className='font-medium'>
                                    {shipment.origin}
                                </div>
                            </div>
                        </div>
                        <div className='pl-7 border-l-2 border-dashed border-gray-300 ml-2 py-2'>
                            <div className='text-sm text-gray-600'>
                                Distance:{' '}
                                {formatDistance(shipment.distance || 0)}
                            </div>
                        </div>
                        <div className='flex items-start gap-3'>
                            <MapPin className='h-5 w-5 text-red-500 mt-1' />
                            <div>
                                <div className='text-sm text-gray-600'>
                                    Destination
                                </div>
                                <div className='font-medium'>
                                    {shipment.destination}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Schedule */}
                <div className='border border-gray-200 rounded-lg p-4'>
                    <div className='flex items-center gap-2 mb-4'>
                        <Calendar className='h-5 w-5 text-purple-600' />
                        <span className='font-semibold text-gray-700'>
                            Schedule
                        </span>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div>
                            <div className='text-sm text-gray-600 mb-1'>
                                Pickup Date
                            </div>
                            <div className='font-medium'>
                                {formatDate(shipment.pickupDate)}
                            </div>
                        </div>
                        <div>
                            <div className='text-sm text-gray-600 mb-1'>
                                Delivery Date
                            </div>
                            <div className='font-medium'>
                                {formatDate(shipment.deliveryDate)}
                            </div>
                        </div>
                        {shipment.actualDeliveryDate && (
                            <div className='md:col-span-2 bg-green-50 border border-green-200 rounded p-3'>
                                <div className='text-sm text-green-700 mb-1'>
                                    Actual Delivery
                                </div>
                                <div className='font-medium text-green-800'>
                                    {formatDate(shipment.actualDeliveryDate)}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Driver & Vehicle */}
                <div className='border border-gray-200 rounded-lg p-4'>
                    <div className='flex items-center gap-2 mb-4'>
                        <Truck className='h-5 w-5 text-purple-600' />
                        <span className='font-semibold text-gray-700'>
                            Assignment
                        </span>
                    </div>
                    {shipment.driver && shipment.vehicle ? (
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div>
                                <div className='text-sm text-gray-600 mb-1'>
                                    Driver
                                </div>
                                <div className='font-medium'>
                                    {shipment.driver.name}
                                </div>
                                <div className='text-sm text-gray-500'>
                                    {shipment.driver.phone}
                                </div>
                            </div>
                            <div>
                                <div className='text-sm text-gray-600 mb-1'>
                                    Vehicle
                                </div>
                                <div className='font-medium'>
                                    {shipment.vehicle.plateNumber}
                                </div>
                                <div className='text-sm text-gray-500'>
                                    {shipment.vehicle.type}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className='bg-yellow-50 border border-yellow-200 rounded p-3 text-center'>
                            <Badge variant='warning'>Unassigned</Badge>
                            <p className='text-sm text-gray-600 mt-2'>
                                No driver or vehicle assigned yet
                            </p>
                        </div>
                    )}
                </div>

                {/* Notes */}
                {shipment.notes && (
                    <div className='border border-gray-200 rounded-lg p-4'>
                        <div className='flex items-center gap-2 mb-2'>
                            <FileText className='h-5 w-5 text-purple-600' />
                            <span className='font-semibold text-gray-700'>
                                Notes
                            </span>
                        </div>
                        <p className='text-gray-700 whitespace-pre-wrap'>
                            {shipment.notes}
                        </p>
                    </div>
                )}

                {/* Timestamps */}
                <div className='text-xs text-gray-500 pt-4 border-t border-gray-200'>
                    <div>Created: {formatDate(shipment.createdAt)}</div>
                    <div>Last Updated: {formatDate(shipment.updatedAt)}</div>
                </div>
            </div>
        </Modal>
    );
}
