'use client';

import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { AlertTriangle } from 'lucide-react';

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface Carrier {
    id: string;
    companyName: string;
}

interface DeleteCarrierModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    carrier: Carrier;
}

export default function DeleteCarrierModal({
    isOpen,
    onClose,
    onSuccess,
    carrier,
}: DeleteCarrierModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDelete = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `${API_BASE_URL}/carriers/${carrier.id}`,
                {
                    method: 'DELETE',
                }
            );

            if (!response.ok) {
                throw new Error('Failed to delete carrier');
            }

            onSuccess();
        } catch (err) {
            setError(
                err instanceof Error ? err.message : 'Failed to delete carrier'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title='Delete Carrier'>
            <div className='space-y-4'>
                {error && (
                    <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg'>
                        {error}
                    </div>
                )}

                <div className='flex items-start gap-4'>
                    <div className='flex-shrink-0'>
                        <div className='w-12 h-12 rounded-full bg-red-100 flex items-center justify-center'>
                            <AlertTriangle className='h-6 w-6 text-red-600' />
                        </div>
                    </div>
                    <div className='flex-1'>
                        <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                            Are you sure you want to delete this carrier?
                        </h3>
                        <p className='text-gray-600 mb-4'>
                            You are about to delete{' '}
                            <strong>{carrier.companyName}</strong>. This action
                            cannot be undone.
                        </p>
                        <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-3'>
                            <p className='text-sm text-yellow-800'>
                                <strong>Warning:</strong> Deleting this carrier
                                will also affect all associated shipments and
                                contracts.
                            </p>
                        </div>
                    </div>
                </div>

                <div className='flex justify-end gap-3 pt-4 border-t border-gray-200'>
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
                        disabled={loading}
                    >
                        {loading ? 'Deleting...' : 'Delete Carrier'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
