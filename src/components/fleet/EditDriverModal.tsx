import React, { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { User, Save } from 'lucide-react';

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface Driver {
    id: string;
    licenseNumber: string;
    name: string;
    phone: string;
    email: string | null;
    address: string | null;
    dateOfBirth: string | null;
    licenseExpiry: string | null;
    rating: number | null;
    isAvailable: boolean;
    isActive: boolean;
}

interface EditDriverModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    driver: Driver | null;
}

export default function EditDriverModal({
    isOpen,
    onClose,
    onSuccess,
    driver,
}: EditDriverModalProps) {
    const [formData, setFormData] = useState({
        licenseNumber: '',
        name: '',
        phone: '',
        email: '',
        address: '',
        dateOfBirth: '',
        licenseExpiry: '',
        rating: '5.0',
        isAvailable: true,
        isActive: true,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (driver) {
            const formatDateForInput = (dateString: string | null) => {
                if (!dateString) return '';
                return new Date(dateString).toISOString().split('T')[0];
            };

            setFormData({
                licenseNumber: driver.licenseNumber,
                name: driver.name,
                phone: driver.phone,
                email: driver.email || '',
                address: driver.address || '',
                dateOfBirth: formatDateForInput(driver.dateOfBirth),
                licenseExpiry: formatDateForInput(driver.licenseExpiry),
                rating: driver.rating?.toString() || '5.0',
                isAvailable: driver.isAvailable,
                isActive: driver.isActive,
            });
        }
    }, [driver]);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData((prev) => ({
                ...prev,
                [name]: checked,
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!driver) return;

        setLoading(true);
        setError(null);

        try {
            const payload = {
                licenseNumber: formData.licenseNumber,
                name: formData.name,
                phone: formData.phone,
                email: formData.email || null,
                address: formData.address || null,
                dateOfBirth: formData.dateOfBirth
                    ? new Date(formData.dateOfBirth).toISOString()
                    : null,
                licenseExpiry: formData.licenseExpiry
                    ? new Date(formData.licenseExpiry).toISOString()
                    : null,
                rating: parseFloat(formData.rating),
                isAvailable: formData.isAvailable,
                isActive: formData.isActive,
            };

            const response = await fetch(
                `${API_BASE_URL}/fleet/drivers/${driver.id}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                }
            );

            if (!response.ok) {
                throw new Error('Failed to update driver');
            }

            onSuccess();
            onClose();
        } catch (err) {
            console.error('Error updating driver:', err);
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    };

    if (!driver) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title='Edit Driver' size='lg'>
            <form onSubmit={handleSubmit} className='space-y-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                            License Number *
                        </label>
                        <input
                            type='text'
                            name='licenseNumber'
                            value={formData.licenseNumber}
                            onChange={handleChange}
                            required
                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        />
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Full Name *
                        </label>
                        <input
                            type='text'
                            name='name'
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        />
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Phone Number *
                        </label>
                        <input
                            type='tel'
                            name='phone'
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        />
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Email Address
                        </label>
                        <input
                            type='email'
                            name='email'
                            value={formData.email}
                            onChange={handleChange}
                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        />
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Date of Birth
                        </label>
                        <input
                            type='date'
                            name='dateOfBirth'
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        />
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                            License Expiry
                        </label>
                        <input
                            type='date'
                            name='licenseExpiry'
                            value={formData.licenseExpiry}
                            onChange={handleChange}
                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        />
                    </div>
                    <div className='md:col-span-2'>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Address
                        </label>
                        <textarea
                            name='address'
                            value={formData.address}
                            onChange={handleChange}
                            rows={3}
                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        />
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Rating (1-5)
                        </label>
                        <input
                            type='number'
                            name='rating'
                            value={formData.rating}
                            onChange={handleChange}
                            min='1'
                            max='5'
                            step='0.1'
                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        />
                    </div>
                    <div className='flex flex-col gap-3'>
                        <div className='flex items-center gap-2'>
                            <input
                                type='checkbox'
                                name='isAvailable'
                                id='isAvailable'
                                checked={formData.isAvailable}
                                onChange={handleChange}
                                className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
                            />
                            <label
                                htmlFor='isAvailable'
                                className='text-sm font-medium text-gray-700'
                            >
                                Available for assignment
                            </label>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input
                                type='checkbox'
                                name='isActive'
                                id='isActive'
                                checked={formData.isActive}
                                onChange={handleChange}
                                className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
                            />
                            <label
                                htmlFor='isActive'
                                className='text-sm font-medium text-gray-700'
                            >
                                Active Driver
                            </label>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm'>
                        {error.message}
                    </div>
                )}

                {/* Actions */}
                <div className='flex items-center justify-end gap-3 pt-4 border-t border-gray-200'>
                    <Button
                        variant='outline'
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button variant='primary' icon={Save} loading={loading}>
                        Save Changes
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
