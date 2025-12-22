'use client';

import React, { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import CoverageAreaSelector from './CoverageAreaSelector';
import {
    Users,
    Mail,
    Phone,
    MapPin,
    FileText,
    Truck,
    Ship,
    Plane,
    Train,
} from 'lucide-react';

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface Carrier {
    id: string;
    companyName: string;
    contactPerson: string;
    email: string;
    phone: string;
    address: string;
    taxNumber: string | null;
    serviceTypes: string[];
    coverage: string[];
    coverageAreas?: Array<{
        coverageId: string;
    }>;
}

interface EditCarrierModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    carrier: Carrier;
}

export default function EditCarrierModal({
    isOpen,
    onClose,
    onSuccess,
    carrier,
}: EditCarrierModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        companyName: carrier.companyName,
        contactPerson: carrier.contactPerson,
        email: carrier.email,
        phone: carrier.phone,
        address: carrier.address,
        taxNumber: carrier.taxNumber || '',
        serviceTypes: carrier.serviceTypes,
    });
    const [selectedCoverageIds, setSelectedCoverageIds] = useState<string[]>(
        []
    );

    useEffect(() => {
        // Initialize with existing coverage area IDs
        if (carrier.coverageAreas) {
            setSelectedCoverageIds(
                carrier.coverageAreas.map((ca) => ca.coverageId)
            );
        }
    }, [carrier]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleServiceTypeToggle = (type: string) => {
        setFormData({
            ...formData,
            serviceTypes: formData.serviceTypes.includes(type)
                ? formData.serviceTypes.filter((t) => t !== type)
                : [...formData.serviceTypes, type],
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `${API_BASE_URL}/carriers/${carrier.id}`,
                {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...formData,
                        coverageAreaIds: selectedCoverageIds,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error('Failed to update carrier');
            }

            onSuccess();
        } catch (err) {
            setError(
                err instanceof Error ? err.message : 'Failed to update carrier'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title='Edit Carrier' size='lg'>
            <form onSubmit={handleSubmit} className='space-y-6'>
                {error && (
                    <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg'>
                        {error}
                    </div>
                )}

                <div className='space-y-4'>
                    <h3 className='text-lg font-semibold text-gray-900 flex items-center gap-2'>
                        <Users className='h-5 w-5 text-blue-600' />
                        Company Information
                    </h3>

                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Company Name *
                            </label>
                            <input
                                type='text'
                                name='companyName'
                                value={formData.companyName}
                                onChange={handleChange}
                                required
                                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                            />
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Contact Person *
                            </label>
                            <input
                                type='text'
                                name='contactPerson'
                                value={formData.contactPerson}
                                onChange={handleChange}
                                required
                                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                            />
                        </div>
                    </div>

                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                <Mail className='h-4 w-4 inline mr-1' />
                                Email *
                            </label>
                            <input
                                type='email'
                                name='email'
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                            />
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                <Phone className='h-4 w-4 inline mr-1' />
                                Phone *
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
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                            <MapPin className='h-4 w-4 inline mr-1' />
                            Address *
                        </label>
                        <textarea
                            name='address'
                            value={formData.address}
                            onChange={handleChange}
                            required
                            rows={2}
                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        />
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                            <FileText className='h-4 w-4 inline mr-1' />
                            Tax Number (NPWP)
                        </label>
                        <input
                            type='text'
                            name='taxNumber'
                            value={formData.taxNumber}
                            onChange={handleChange}
                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        />
                    </div>
                </div>

                <div className='space-y-4'>
                    <h3 className='text-lg font-semibold text-gray-900'>
                        Service Types *
                    </h3>
                    <div className='grid grid-cols-2 gap-3'>
                        {[
                            {
                                type: 'ROAD',
                                icon: Truck,
                                label: 'Road Transport',
                            },
                            { type: 'SEA', icon: Ship, label: 'Sea Freight' },
                            { type: 'AIR', icon: Plane, label: 'Air Cargo' },
                            {
                                type: 'RAIL',
                                icon: Train,
                                label: 'Rail Transport',
                            },
                        ].map(({ type, icon: Icon, label }) => (
                            <label
                                key={type}
                                className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                                    formData.serviceTypes.includes(type)
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-300 hover:border-blue-300'
                                }`}
                            >
                                <input
                                    type='checkbox'
                                    checked={formData.serviceTypes.includes(
                                        type
                                    )}
                                    onChange={() =>
                                        handleServiceTypeToggle(type)
                                    }
                                    className='w-4 h-4 text-blue-600 rounded focus:ring-blue-500'
                                />
                                <Icon className='h-5 w-5 text-gray-600' />
                                <span className='font-medium text-gray-900'>
                                    {label}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className='space-y-4'>
                    <CoverageAreaSelector
                        selectedIds={selectedCoverageIds}
                        onChange={setSelectedCoverageIds}
                        label='Coverage Areas *'
                        placeholder='Select coverage areas...'
                    />
                </div>

                <div className='flex justify-end gap-3 pt-4 border-t border-gray-200'>
                    <Button
                        variant='outline'
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button variant='primary' disabled={loading}>
                        {loading ? 'Updating...' : 'Update Carrier'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
