import React from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import {
    Package,
    MapPin,
    Calendar,
    User,
    Phone,
    Mail,
    FileText,
    Truck,
    Edit,
    Trash2,
} from 'lucide-react';

interface Order {
    id: string;
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    pickupAddress: string;
    deliveryAddress: string;
    requestedDate: string;
    estimatedDelivery?: string;
    actualDelivery?: string;
    totalWeight: number;
    totalVolume?: number;
    totalQty: number;
    priority: string;
    status: string;
    specialNotes?: string;
    shipment?: {
        id: string;
        shipmentNumber: string;
        status: string;
    };
    items?: Array<{
        itemName: string;
        itemSKU: string;
        quantity: number;
        weight: number;
        volume: number;
        description: string;
    }>;
    createdAt: string;
    updatedAt: string;
}

interface ViewOrderDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: Order | null;
    onEdit?: (order: Order) => void;
    onDelete?: (order: Order) => void;
    onCreateShipment?: (order: Order) => void;
}

const statusConfig = {
    PENDING: { label: 'Pending', color: 'text-gray-600', bg: 'bg-gray-100' },
    CONFIRMED: {
        label: 'Confirmed',
        color: 'text-blue-600',
        bg: 'bg-blue-100',
    },
    IN_TRANSIT: {
        label: 'In Transit',
        color: 'text-purple-600',
        bg: 'bg-purple-100',
    },
    DELIVERED: {
        label: 'Delivered',
        color: 'text-green-600',
        bg: 'bg-green-100',
    },
    CANCELLED: {
        label: 'Cancelled',
        color: 'text-red-600',
        bg: 'bg-red-100',
    },
};

const priorityConfig = {
    LOW: { label: 'Low', color: 'text-gray-600', bg: 'bg-gray-100' },
    NORMAL: { label: 'Normal', color: 'text-blue-600', bg: 'bg-blue-100' },
    HIGH: { label: 'High', color: 'text-orange-600', bg: 'bg-orange-100' },
    URGENT: { label: 'Urgent', color: 'text-red-600', bg: 'bg-red-100' },
};

export default function ViewOrderDetailsModal({
    isOpen,
    onClose,
    order,
    onEdit,
    onDelete,
    onCreateShipment,
}: ViewOrderDetailsModalProps) {
    if (!order) return null;

    const statusInfo =
        statusConfig[order.status as keyof typeof statusConfig] ||
        statusConfig.PENDING;
    const priorityInfo =
        priorityConfig[order.priority as keyof typeof priorityConfig] ||
        priorityConfig.NORMAL;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Order Details - ${order.orderNumber}`}
            size='xl'
        >
            <div className='space-y-6'>
                {/* Header with Status & Priority */}
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                        <div
                            className={`px-3 py-1 rounded-full ${statusInfo.bg}`}
                        >
                            <span
                                className={`text-xs font-medium ${statusInfo.color}`}
                            >
                                {statusInfo.label}
                            </span>
                        </div>
                        <div
                            className={`px-3 py-1 rounded-full ${priorityInfo.bg}`}
                        >
                            <span
                                className={`text-xs font-medium ${priorityInfo.color}`}
                            >
                                {priorityInfo.label}
                            </span>
                        </div>
                    </div>
                    <div className='flex items-center gap-2'>
                        {onEdit && (
                            <Button
                                variant='ghost'
                                size='sm'
                                icon={Edit}
                                onClick={() => onEdit(order)}
                            >
                                Edit
                            </Button>
                        )}
                        {onDelete && (
                            <Button
                                variant='ghost'
                                size='sm'
                                icon={Trash2}
                                onClick={() => onDelete(order)}
                                className='text-red-600 hover:text-red-800'
                            >
                                Delete
                            </Button>
                        )}
                    </div>
                </div>

                {/* Customer Information */}
                <div className='bg-gray-50 border border-gray-200 rounded-lg p-4'>
                    <h3 className='text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2'>
                        <User className='h-4 w-4' />
                        Customer Information
                    </h3>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                        <div>
                            <p className='text-xs text-gray-500 mb-1'>Name</p>
                            <p className='text-sm font-medium'>
                                {order.customerName}
                            </p>
                        </div>
                        <div>
                            <p className='text-xs text-gray-500 mb-1 flex items-center gap-1'>
                                <Mail className='h-3 w-3' />
                                Email
                            </p>
                            <p className='text-sm font-medium'>
                                {order.customerEmail}
                            </p>
                        </div>
                        <div>
                            <p className='text-xs text-gray-500 mb-1 flex items-center gap-1'>
                                <Phone className='h-3 w-3' />
                                Phone
                            </p>
                            <p className='text-sm font-medium'>
                                {order.customerPhone}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Route Information */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='bg-green-50 border border-green-200 rounded-lg p-4'>
                        <h3 className='text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2'>
                            <MapPin className='h-4 w-4 text-green-600' />
                            Pickup Address
                        </h3>
                        <p className='text-sm text-gray-700'>
                            {order.pickupAddress}
                        </p>
                    </div>
                    <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
                        <h3 className='text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2'>
                            <MapPin className='h-4 w-4 text-red-600' />
                            Delivery Address
                        </h3>
                        <p className='text-sm text-gray-700'>
                            {order.deliveryAddress}
                        </p>
                    </div>
                </div>

                {/* Dates */}
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <div>
                        <p className='text-xs text-gray-500 mb-1 flex items-center gap-1'>
                            <Calendar className='h-3 w-3' />
                            Requested Date
                        </p>
                        <p className='text-sm font-medium'>
                            {new Date(order.requestedDate).toLocaleString()}
                        </p>
                    </div>
                    {order.estimatedDelivery && (
                        <div>
                            <p className='text-xs text-gray-500 mb-1'>
                                Estimated Delivery
                            </p>
                            <p className='text-sm font-medium'>
                                {new Date(
                                    order.estimatedDelivery
                                ).toLocaleString()}
                            </p>
                        </div>
                    )}
                    {order.actualDelivery && (
                        <div>
                            <p className='text-xs text-gray-500 mb-1'>
                                Actual Delivery
                            </p>
                            <p className='text-sm font-medium text-green-600'>
                                {new Date(
                                    order.actualDelivery
                                ).toLocaleString()}
                            </p>
                        </div>
                    )}
                </div>

                {/* Order Summary */}
                <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
                    <h3 className='text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2'>
                        <Package className='h-4 w-4' />
                        Order Summary
                    </h3>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                        <div>
                            <p className='text-xs text-gray-500 mb-1'>
                                Total Items
                            </p>
                            <p className='text-sm font-medium'>
                                {order.totalQty} items
                            </p>
                        </div>
                        <div>
                            <p className='text-xs text-gray-500 mb-1'>
                                Total Weight
                            </p>
                            <p className='text-sm font-medium'>
                                {order.totalWeight.toFixed(2)} kg
                            </p>
                        </div>
                        {order.totalVolume && (
                            <div>
                                <p className='text-xs text-gray-500 mb-1'>
                                    Total Volume
                                </p>
                                <p className='text-sm font-medium'>
                                    {order.totalVolume.toFixed(2)} m³
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Items List */}
                {order.items && order.items.length > 0 && (
                    <div>
                        <h3 className='text-sm font-semibold text-gray-700 mb-3'>
                            Items
                        </h3>
                        <div className='space-y-2'>
                            {order.items.map((item, index) => (
                                <div
                                    key={index}
                                    className='bg-white border border-gray-200 rounded-lg p-3'
                                >
                                    <div className='flex items-start justify-between'>
                                        <div className='flex-1'>
                                            <p className='text-sm font-medium text-gray-900'>
                                                {item.itemName}
                                            </p>
                                            {item.itemSKU && (
                                                <p className='text-xs text-gray-500'>
                                                    SKU: {item.itemSKU}
                                                </p>
                                            )}
                                            {item.description && (
                                                <p className='text-xs text-gray-600 mt-1'>
                                                    {item.description}
                                                </p>
                                            )}
                                        </div>
                                        <div className='text-right'>
                                            <p className='text-sm font-medium'>
                                                Qty: {item.quantity}
                                            </p>
                                            <p className='text-xs text-gray-500'>
                                                {item.weight} kg
                                            </p>
                                            {item.volume > 0 && (
                                                <p className='text-xs text-gray-500'>
                                                    {item.volume} m³
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Special Notes */}
                {order.specialNotes && (
                    <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4'>
                        <h3 className='text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2'>
                            <FileText className='h-4 w-4' />
                            Special Notes
                        </h3>
                        <p className='text-sm text-gray-700'>
                            {order.specialNotes}
                        </p>
                    </div>
                )}

                {/* Shipment Information */}
                {order.shipment ? (
                    <div className='bg-purple-50 border border-purple-200 rounded-lg p-4'>
                        <h3 className='text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2'>
                            <Truck className='h-4 w-4' />
                            Shipment Information
                        </h3>
                        <div className='flex items-center justify-between'>
                            <div>
                                <p className='text-sm font-medium text-purple-900'>
                                    {order.shipment.shipmentNumber}
                                </p>
                                <p className='text-xs text-gray-600'>
                                    Status: {order.shipment.status}
                                </p>
                            </div>
                            <Button
                                variant='outline'
                                size='sm'
                                onClick={() =>
                                    (window.location.href = `/dashboard/shipments?id=${order.shipment?.id}`)
                                }
                            >
                                View Shipment
                            </Button>
                        </div>
                    </div>
                ) : (
                    onCreateShipment && (
                        <div className='bg-gray-50 border border-gray-200 rounded-lg p-4 text-center'>
                            <p className='text-sm text-gray-600 mb-3'>
                                No shipment created for this order
                            </p>
                            <Button
                                variant='primary'
                                size='sm'
                                icon={Truck}
                                onClick={() => onCreateShipment(order)}
                            >
                                Create Shipment
                            </Button>
                        </div>
                    )
                )}

                {/* Timestamps */}
                <div className='grid grid-cols-2 gap-4 text-xs text-gray-500 pt-4 border-t border-gray-200'>
                    <div>
                        <span className='font-medium'>Created:</span>{' '}
                        {new Date(order.createdAt).toLocaleString()}
                    </div>
                    <div>
                        <span className='font-medium'>Last Updated:</span>{' '}
                        {new Date(order.updatedAt).toLocaleString()}
                    </div>
                </div>

                {/* Actions */}
                <div className='flex items-center justify-end pt-4 border-t border-gray-200'>
                    <Button variant='ghost' onClick={onClose}>
                        Close
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
