'use client';

import React from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { ShipmentWithDisplayData } from '@/utils/shipmentAdapter';
import { AlertCircle, Trash2 } from 'lucide-react';

interface DeleteShipmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    shipment: ShipmentWithDisplayData | null;
    isDeleting?: boolean;
}

export default function DeleteShipmentModal({
    isOpen,
    onClose,
    onConfirm,
    shipment,
    isDeleting = false,
}: DeleteShipmentModalProps) {
    if (!shipment) return null;

    // Check if shipment can be deleted
    const canDelete =
        shipment.status === 'PENDING' ||
        shipment.status === 'CANCELLED' ||
        shipment.status === 'FAILED';
    const hasStarted =
        shipment.status === 'PICKED_UP' ||
        shipment.status === 'IN_TRANSIT' ||
        shipment.status === 'OUT_FOR_DELIVERY' ||
        shipment.status === 'DELIVERED';

    return (
        <Modal isOpen={isOpen} onClose={onClose} title='Delete Shipment'>
            <div className='space-y-6'>
                {/* Warning Icon */}
                <div className='flex justify-center'>
                    <div className='w-16 h-16 rounded-full bg-red-100 flex items-center justify-center'>
                        <Trash2 className='h-8 w-8 text-red-600' />
                    </div>
                </div>

                {/* Shipment Info */}
                <div className='bg-gray-50 rounded-lg p-4 space-y-2'>
                    <div className='flex justify-between'>
                        <span className='text-sm text-gray-600'>
                            Shipment Number:
                        </span>
                        <span className='text-sm font-semibold text-gray-900'>
                            {shipment.shipmentNumber}
                        </span>
                    </div>
                    <div className='flex justify-between'>
                        <span className='text-sm text-gray-600'>Order:</span>
                        <span className='text-sm font-medium text-gray-900'>
                            {shipment.order?.orderNumber || 'N/A'}
                        </span>
                    </div>
                    <div className='flex justify-between'>
                        <span className='text-sm text-gray-600'>Status:</span>
                        <span className='text-sm font-medium text-gray-900'>
                            {shipment.status}
                        </span>
                    </div>
                    <div className='flex justify-between'>
                        <span className='text-sm text-gray-600'>Route:</span>
                        <span className='text-sm font-medium text-gray-900'>
                            {shipment.origin} → {shipment.destination}
                        </span>
                    </div>
                </div>

                {/* Warning or Confirmation Message */}
                {!canDelete ? (
                    <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4'>
                        <div className='flex gap-3'>
                            <AlertCircle className='h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5' />
                            <div className='space-y-1'>
                                <p className='text-sm font-medium text-yellow-900'>
                                    Cannot Delete Shipment
                                </p>
                                {hasStarted ? (
                                    <p className='text-sm text-yellow-700'>
                                        This shipment has already started
                                        delivery process. Please cancel or
                                        complete the shipment first before
                                        deleting.
                                    </p>
                                ) : (
                                    <p className='text-sm text-yellow-700'>
                                        Only shipments with status PENDING,
                                        CANCELLED, or FAILED can be deleted.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
                        <div className='flex gap-3'>
                            <AlertCircle className='h-5 w-5 text-red-600 flex-shrink-0 mt-0.5' />
                            <div className='space-y-1'>
                                <p className='text-sm font-medium text-red-900'>
                                    Confirm Deletion
                                </p>
                                <p className='text-sm text-red-700'>
                                    Are you sure you want to delete this
                                    shipment? This action cannot be undone.
                                </p>
                                <p className='text-sm text-red-700 font-medium mt-2'>
                                    The associated order will remain in the
                                    system.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className='flex gap-3 justify-end pt-4 border-t'>
                    <Button
                        variant='outline'
                        onClick={onClose}
                        disabled={isDeleting}
                    >
                        Cancel
                    </Button>
                    {canDelete && (
                        <Button
                            variant='danger'
                            onClick={onConfirm}
                            loading={isDeleting}
                            icon={Trash2}
                        >
                            {isDeleting ? 'Deleting...' : 'Delete Shipment'}
                        </Button>
                    )}
                </div>
            </div>
        </Modal>
    );
}
