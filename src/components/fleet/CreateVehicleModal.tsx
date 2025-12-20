import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { Truck, FileText, Fuel } from 'lucide-react';
const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
interface CreateVehicleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CreateVehicleModal({
    isOpen,
    onClose,
    onSuccess,
}: CreateVehicleModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [formData, setFormData] = useState({
        vehicleNumber: '',
        licensePlate: '',
        vehicleType: 'TRUCK',
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        capacity: '',
        volumeCapacity: '',
        fuelType: 'Diesel',
        fuelConsumption: '',
        status: 'AVAILABLE',
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const payload = {
                ...formData,
                year: parseInt(formData.year.toString()),
                capacity: parseFloat(formData.capacity),
                volumeCapacity: formData.volumeCapacity
                    ? parseFloat(formData.volumeCapacity)
                    : null,
                fuelConsumption: formData.fuelConsumption
                    ? parseFloat(formData.fuelConsumption)
                    : null,
                currentOdometer: 0,
                isActive: true,
            };

            const response = await fetch(`${API_BASE_URL}/fleet/vehicles`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to create vehicle');
            }

            onSuccess();
            onClose();
            // Reset form
            setFormData({
                vehicleNumber: '',
                licensePlate: '',
                vehicleType: 'TRUCK',
                brand: '',
                model: '',
                year: new Date().getFullYear(),
                capacity: '',
                volumeCapacity: '',
                fuelType: 'Diesel',
                fuelConsumption: '',
                status: 'AVAILABLE',
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
            title='Add New Vehicle'
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
                                Vehicle Number *
                            </label>
                            <input
                                type='text'
                                name='vehicleNumber'
                                value={formData.vehicleNumber}
                                onChange={handleChange}
                                required
                                placeholder='VEH-001'
                                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                            />
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                License Plate *
                            </label>
                            <input
                                type='text'
                                name='licensePlate'
                                value={formData.licensePlate}
                                onChange={handleChange}
                                required
                                placeholder='B-1234-ABC'
                                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                            />
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Vehicle Type *
                            </label>
                            <select
                                name='vehicleType'
                                value={formData.vehicleType}
                                onChange={handleChange}
                                required
                                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                            >
                                <option value='TRUCK'>Truck</option>
                                <option value='VAN'>Van</option>
                                <option value='PICKUP'>Pickup</option>
                                <option value='CONTAINER'>Container</option>
                                <option value='MOTORCYCLE'>Motorcycle</option>
                            </select>
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Status *
                            </label>
                            <select
                                name='status'
                                value={formData.status}
                                onChange={handleChange}
                                required
                                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                            >
                                <option value='AVAILABLE'>Available</option>
                                <option value='IN_USE'>In Use</option>
                                <option value='MAINTENANCE'>Maintenance</option>
                                <option value='OUT_OF_SERVICE'>
                                    Out of Service
                                </option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Vehicle Details */}
                <div>
                    <h3 className='text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2'>
                        <Truck className='h-5 w-5' />
                        Vehicle Details
                    </h3>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Brand
                            </label>
                            <input
                                type='text'
                                name='brand'
                                value={formData.brand}
                                onChange={handleChange}
                                placeholder='Toyota, Mitsubishi, etc'
                                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                            />
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Model
                            </label>
                            <input
                                type='text'
                                name='model'
                                value={formData.model}
                                onChange={handleChange}
                                placeholder='Hiace, Colt Diesel, etc'
                                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                            />
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Year
                            </label>
                            <input
                                type='number'
                                name='year'
                                value={formData.year}
                                onChange={handleChange}
                                min='1900'
                                max={new Date().getFullYear() + 1}
                                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                            />
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Capacity (kg) *
                            </label>
                            <input
                                type='number'
                                name='capacity'
                                value={formData.capacity}
                                onChange={handleChange}
                                required
                                step='0.01'
                                min='0'
                                placeholder='5000'
                                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                            />
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Volume Capacity (m³)
                            </label>
                            <input
                                type='number'
                                name='volumeCapacity'
                                value={formData.volumeCapacity}
                                onChange={handleChange}
                                step='0.01'
                                min='0'
                                placeholder='15'
                                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                            />
                        </div>
                    </div>
                </div>

                {/* Fuel Information */}
                <div>
                    <h3 className='text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2'>
                        <Fuel className='h-5 w-5' />
                        Fuel Information
                    </h3>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Fuel Type
                            </label>
                            <select
                                name='fuelType'
                                value={formData.fuelType}
                                onChange={handleChange}
                                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                            >
                                <option value='Diesel'>Diesel</option>
                                <option value='Petrol'>Petrol</option>
                                <option value='Electric'>Electric</option>
                                <option value='Hybrid'>Hybrid</option>
                            </select>
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Fuel Consumption (L/100km)
                            </label>
                            <input
                                type='number'
                                name='fuelConsumption'
                                value={formData.fuelConsumption}
                                onChange={handleChange}
                                step='0.1'
                                min='0'
                                placeholder='8.5'
                                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                            />
                        </div>
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
                    <Button variant='primary' icon={Truck} loading={loading}>
                        Create Vehicle
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
