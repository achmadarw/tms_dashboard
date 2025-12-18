import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { AlertTriangle } from 'lucide-react';

interface DeleteOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: {
        id: string;
        orderNumber: string;
        customerName: string;
        shipment?: {
            id: string;
            shipmentNumber: string;
        };
    } | null;
    onSuccess: () => void;
}

export default function DeleteOrderModal({
    isOpen,
    onClose,
    order,
    onSuccess,
}: DeleteOrderModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const handleDelete = async () => {
        if (!order) return;

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/orders/${order.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to delete order');
            }

            onSuccess();
            onClose();
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    };

    if (!order) return null;

    // Check if order has shipment
    const hasShipment = !!order.shipment;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title='Delete Order' size='md'>
            <div className='space-y-4'>
                {/* Warning Icon */}
                <div className='flex items-center justify-center'>
                    <div className='bg-red-100 rounded-full p-3'>
                        <AlertTriangle className='h-8 w-8 text-red-600' />
                    </div>
                </div>

                {/* Conditional Content */}
                {hasShipment ? (
                    <div className='text-center space-y-3'>
                        <h3 className='text-lg font-semibold text-gray-900'>
                            Cannot Delete Order
                        </h3>
                        <p className='text-sm text-gray-600'>
                            This order{' '}
                            <span className='font-medium text-gray-900'>
                                {order.orderNumber}
                            </span>{' '}
                            has an associated shipment{' '}
                            <span className='font-medium text-blue-600'>
                                {order.shipment?.shipmentNumber}
                            </span>
                            .
                        </p>
                        <p className='text-sm text-gray-600'>
                            Please delete or cancel the shipment first before
                            deleting this order.
                        </p>
                    </div>
                ) : (
                    <div className='text-center space-y-3'>
                        <h3 className='text-lg font-semibold text-gray-900'>
                            Are you sure?
                        </h3>
                        <p className='text-sm text-gray-600'>
                            You are about to delete order{' '}
                            <span className='font-medium text-gray-900'>
                                {order.orderNumber}
                            </span>{' '}
                            for customer{' '}
                            <span className='font-medium text-gray-900'>
                                {order.customerName}
                            </span>
                            .
                        </p>
                        <p className='text-sm text-red-600 font-medium'>
                            This action cannot be undone.
                        </p>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm'>
                        {error.message}
                    </div>
                )}

                {/* Actions */}
                <div className='flex items-center justify-end gap-3 pt-4 border-t border-gray-200'>
                    <Button
                        variant='ghost'
                        onClick={onClose}
                        disabled={loading}
                    >
                        {hasShipment ? 'Close' : 'Cancel'}
                    </Button>
                    {!hasShipment && (
                        <Button
                            variant='danger'
                            onClick={handleDelete}
                            disabled={loading}
                        >
                            {loading ? 'Deleting...' : 'Delete Order'}
                        </Button>
                    )}
                </div>
            </div>
        </Modal>
    );
}
