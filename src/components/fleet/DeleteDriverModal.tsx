import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { AlertTriangle } from 'lucide-react';

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface Driver {
    id: string;
    licenseNumber: string;
    name: string;
}

interface DeleteDriverModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    driver: Driver | null;
}

export default function DeleteDriverModal({
    isOpen,
    onClose,
    onSuccess,
    driver,
}: DeleteDriverModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const handleDelete = async () => {
        if (!driver) return;

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `${API_BASE_URL}/fleet/drivers/${driver.id}`,
                {
                    method: 'DELETE',
                }
            );

            if (!response.ok) {
                throw new Error('Failed to delete driver');
            }

            onSuccess();
            onClose();
        } catch (err) {
            console.error('Error deleting driver:', err);
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    };

    if (!driver) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title='Delete Driver'
            size='md'
        >
            <div className='space-y-6'>
                <div className='flex flex-col items-center text-center'>
                    <div className='bg-red-100 p-3 rounded-full mb-4'>
                        <AlertTriangle className='h-8 w-8 text-red-600' />
                    </div>
                    <div className='bg-red-50 border border-red-200 rounded-lg p-4 mb-4'>
                        <p className='text-red-800 text-sm'>
                            This action cannot be undone. This will permanently
                            delete the driver and remove all associated data.
                        </p>
                    </div>

                    <p className='text-lg font-semibold text-gray-900 mb-2'>
                        Are you sure you want to delete this driver?
                    </p>

                    <div className='bg-red-50 border border-red-200 rounded-lg p-4 mb-4 text-left w-full'>
                        <p className='text-red-800 text-sm'>
                            This action cannot be undone. This will permanently
                            delete the driver and remove all associated data.
                        </p>
                    </div>

                    <div className='bg-gray-50 p-4 rounded-lg border border-gray-200 text-left w-full'>
                        <p className='text-sm text-gray-600'>License Number</p>
                        <p className='font-semibold text-gray-800 mb-2'>
                            {driver.licenseNumber}
                        </p>
                        <p className='text-sm text-gray-600'>Name</p>
                        <p className='font-semibold text-gray-800'>
                            {driver.name}
                        </p>
                    </div>
                </div>

                {error && (
                    <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm'>
                        {error.message}
                    </div>
                )}

                <div className='flex items-center justify-end gap-3 pt-4 border-t'>
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
                        Delete Driver
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
