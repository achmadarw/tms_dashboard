import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { Filter, X } from 'lucide-react';

interface AdvancedFiltersModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApply: (filters: FilterValues) => void;
    currentFilters: FilterValues;
}

export interface FilterValues {
    status: string;
    priority: string;
    dateFrom: string;
    dateTo: string;
    minWeight: string;
    maxWeight: string;
    minVolume: string;
    maxVolume: string;
    hasShipment: string;
}

export default function AdvancedFiltersModal({
    isOpen,
    onClose,
    onApply,
    currentFilters,
}: AdvancedFiltersModalProps) {
    const [filters, setFilters] = useState<FilterValues>(currentFilters);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value,
        });
    };

    const handleApply = () => {
        onApply(filters);
        onClose();
    };

    const handleReset = () => {
        const resetFilters: FilterValues = {
            status: 'all',
            priority: 'all',
            dateFrom: '',
            dateTo: '',
            minWeight: '',
            maxWeight: '',
            minVolume: '',
            maxVolume: '',
            hasShipment: 'all',
        };
        setFilters(resetFilters);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title='Advanced Filters'
            size='lg'
        >
            <div className='space-y-6'>
                {/* Status & Priority */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Status
                        </label>
                        <select
                            name='status'
                            value={filters.status}
                            onChange={handleChange}
                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                        >
                            <option value='all'>All Status</option>
                            <option value='PENDING'>Pending</option>
                            <option value='CONFIRMED'>Confirmed</option>
                            <option value='IN_TRANSIT'>In Transit</option>
                            <option value='DELIVERED'>Delivered</option>
                            <option value='CANCELLED'>Cancelled</option>
                        </select>
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Priority
                        </label>
                        <select
                            name='priority'
                            value={filters.priority}
                            onChange={handleChange}
                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                        >
                            <option value='all'>All Priorities</option>
                            <option value='LOW'>Low</option>
                            <option value='NORMAL'>Normal</option>
                            <option value='HIGH'>High</option>
                            <option value='URGENT'>Urgent</option>
                        </select>
                    </div>
                </div>

                {/* Date Range */}
                <div className='bg-gray-50 border border-gray-200 rounded-lg p-4'>
                    <h3 className='text-sm font-semibold text-gray-700 mb-3'>
                        Requested Date Range
                    </h3>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                From Date
                            </label>
                            <input
                                type='date'
                                name='dateFrom'
                                value={filters.dateFrom}
                                onChange={handleChange}
                                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                            />
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                To Date
                            </label>
                            <input
                                type='date'
                                name='dateTo'
                                value={filters.dateTo}
                                onChange={handleChange}
                                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                            />
                        </div>
                    </div>
                </div>

                {/* Weight Range */}
                <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
                    <h3 className='text-sm font-semibold text-gray-700 mb-3'>
                        Total Weight Range (kg)
                    </h3>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Min Weight
                            </label>
                            <input
                                type='number'
                                name='minWeight'
                                value={filters.minWeight}
                                onChange={handleChange}
                                min='0'
                                step='0.01'
                                placeholder='0.00'
                                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                            />
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Max Weight
                            </label>
                            <input
                                type='number'
                                name='maxWeight'
                                value={filters.maxWeight}
                                onChange={handleChange}
                                min='0'
                                step='0.01'
                                placeholder='999.99'
                                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                            />
                        </div>
                    </div>
                </div>

                {/* Volume Range */}
                <div className='bg-green-50 border border-green-200 rounded-lg p-4'>
                    <h3 className='text-sm font-semibold text-gray-700 mb-3'>
                        Total Volume Range (m³)
                    </h3>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Min Volume
                            </label>
                            <input
                                type='number'
                                name='minVolume'
                                value={filters.minVolume}
                                onChange={handleChange}
                                min='0'
                                step='0.01'
                                placeholder='0.00'
                                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                            />
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Max Volume
                            </label>
                            <input
                                type='number'
                                name='maxVolume'
                                value={filters.maxVolume}
                                onChange={handleChange}
                                min='0'
                                step='0.01'
                                placeholder='999.99'
                                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                            />
                        </div>
                    </div>
                </div>

                {/* Shipment Status */}
                <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Shipment Status
                    </label>
                    <select
                        name='hasShipment'
                        value={filters.hasShipment}
                        onChange={handleChange}
                        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                    >
                        <option value='all'>All Orders</option>
                        <option value='yes'>With Shipment</option>
                        <option value='no'>Without Shipment</option>
                    </select>
                </div>

                {/* Actions */}
                <div className='flex items-center justify-between gap-3 pt-4 border-t border-gray-200'>
                    <Button
                        variant='outline'
                        size='sm'
                        icon={X}
                        onClick={handleReset}
                    >
                        Reset All
                    </Button>
                    <div className='flex items-center gap-3'>
                        <Button variant='ghost' onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            variant='primary'
                            icon={Filter}
                            onClick={handleApply}
                        >
                            Apply Filters
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
