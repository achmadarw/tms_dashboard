import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { AlertTriangle } from 'lucide-react';

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface Vehicle {
    id: string;
    vehicleNumber: string;
    licensePlate: string;
}

interface DeleteVehicleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    vehicle: Vehicle | null;
}

export default function DeleteVehicleModal({
    isOpen,
    onClose,
    onSuccess,
    vehicle,
}: DeleteVehicleModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const handleDelete = async () => {
        if (!vehicle) return;

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `${API_BASE_URL}/fleet/vehicles/${vehicle.id}`,
                {
                    method: 'DELETE',
                }
            );

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to delete vehicle');
            }

            onSuccess();
            onClose();
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    };

    if (!vehicle) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title='Delete Vehicle'
            size='md'
        >
            <div className='space-y-4'>
                {/* Warning Icon */}
                <div className='flex items-center justify-center'>
                    <div className='bg-red-100 rounded-full p-3'>
                        <AlertTriangle className='h-8 w-8 text-red-600' />
                    </div>
                </div>

                {/* Content */}
                <div className='text-center space-y-3'>
                    <h3 className='text-lg font-semibold text-gray-900'>
                        Are you sure?
                    </h3>
                    <p className='text-sm text-gray-600'>
                        You are about to delete vehicle{' '}
                        <span className='font-medium text-gray-900'>
                            {vehicle.vehicleNumber}
                        </span>{' '}
                        with license plate{' '}
                        <span className='font-medium text-gray-900'>
                            {vehicle.licensePlate}
                        </span>
                        .
                    </p>
                    <p className='text-sm text-red-600 font-medium'>
                        This action cannot be undone.
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm'>
                        {error.message}
                    </div>
                )}

                {/* Actions */}
                <div className='flex items-center justify-end gap-3'>
                    <Button
                        variant='outline'
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant='danger'
                        onClick={handleDelete}
                        loading={loading}
                    >
                        Delete Vehicle
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
