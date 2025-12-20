import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { User, FileText, Phone, Mail } from 'lucide-react';

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface CreateDriverModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CreateDriverModal({
    isOpen,
    onClose,
    onSuccess,
}: CreateDriverModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [formData, setFormData] = useState({
        licenseNumber: '',
        name: '',
        phone: '',
        email: '',
        address: '',
        dateOfBirth: '',
        licenseExpiry: '',
        isAvailable: true,
    });

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
                isAvailable: formData.isAvailable,
                rating: 5.0,
                isActive: true,
            };

            const response = await fetch(`${API_BASE_URL}/fleet/drivers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to create driver');
            }

            onSuccess();
            onClose();
            // Reset form
            setFormData({
                licenseNumber: '',
                name: '',
                phone: '',
                email: '',
                address: '',
                dateOfBirth: '',
                licenseExpiry: '',
                isAvailable: true,
            });
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title='Add New Driver'
            size='lg'
        >
            <form onSubmit={handleSubmit} className='space-y-6'>
                {/* Basic Information */}
                <div>
                    <h3 className='text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2'>
                        <FileText className='h-5 w-5' />
                        Basic Information
                    </h3>
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
                                placeholder='DRV-001'
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
                                placeholder='John Doe'
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
                    </div>
                </div>

                {/* Contact Information */}
                <div>
                    <h3 className='text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2'>
                        <Phone className='h-5 w-5' />
                        Contact Information
                    </h3>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div>
                            <label className='text-sm font-medium text-gray-700 mb-2 flex items-center gap-1'>
                                <Phone className='h-4 w-4' />
                                Phone Number *
                            </label>
                            <input
                                type='tel'
                                name='phone'
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                placeholder='+62 812 3456 7890'
                                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                            />
                        </div>
                        <div>
                            <label className='text-sm font-medium text-gray-700 mb-2 flex items-center gap-1'>
                                <Mail className='h-4 w-4' />
                                Email Address
                            </label>
                            <input
                                type='email'
                                name='email'
                                value={formData.email}
                                onChange={handleChange}
                                placeholder='driver@example.com'
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
                                placeholder='Enter full address'
                                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                            />
                        </div>
                    </div>
                </div>

                {/* Availability */}
                <div>
                    <h3 className='text-lg font-semibold text-gray-800 mb-4'>
                        Status
                    </h3>
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
                            Driver is available for assignment
                        </label>
                    </div>
                </div>

                {/* Error Message */}
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
                    <Button variant='primary' icon={User} loading={loading}>
                        Create Driver
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
