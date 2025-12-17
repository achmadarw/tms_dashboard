import React, { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { useUpdateShipment } from '@/hooks/useShipments';
import { Shipment } from '@/hooks/useShipments';
import { useVehicles } from '@/hooks/useVehicles';
import { useDrivers } from '@/hooks/useDrivers';
import {
    CheckCircle,
    Clock,
    Package,
    Truck,
    XCircle,
    User,
    Calendar,
} from 'lucide-react';

interface UpdateStatusModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    shipment: Shipment;
}

const statusOptions = [
    {
        value: 'PENDING',
        label: 'Pending',
        icon: Clock,
        color: 'text-yellow-600',
    },
    {
        value: 'ASSIGNED',
        label: 'Assigned',
        icon: Package,
        color: 'text-indigo-600',
    },
    {
        value: 'PICKED_UP',
        label: 'Picked Up',
        icon: Package,
        color: 'text-blue-600',
    },
    {
        value: 'IN_TRANSIT',
        label: 'In Transit',
        icon: Truck,
        color: 'text-purple-600',
    },
    {
        value: 'OUT_FOR_DELIVERY',
        label: 'Out for Delivery',
        icon: Truck,
        color: 'text-orange-600',
    },
    {
        value: 'DELIVERED',
        label: 'Delivered',
        icon: CheckCircle,
        color: 'text-green-600',
    },
    {
        value: 'FAILED',
        label: 'Failed',
        icon: XCircle,
        color: 'text-red-600',
    },
    {
        value: 'CANCELLED',
        label: 'Cancelled',
        icon: XCircle,
        color: 'text-gray-600',
    },
];

export default function UpdateStatusModal({
    isOpen,
    onClose,
    onSuccess,
    shipment,
}: UpdateStatusModalProps) {
    const { updateShipment, loading, error } = useUpdateShipment();
    const { vehicles, loading: vehiclesLoading } = useVehicles();
    const { drivers, loading: driversLoading } = useDrivers();

    // Filter available vehicles (AVAILABLE or currently assigned to this shipment)
    const availableVehicles = vehicles.filter(
        (v) => v.status === 'AVAILABLE' || v.id === shipment.vehicleId
    );

    // Filter available drivers (isAvailable or currently assigned to this shipment)
    const availableDrivers = drivers.filter(
        (d) => d.isAvailable || d.id === shipment.driverId
    );

    const [formData, setFormData] = useState({
        status: shipment.status,
        vehicleId: shipment.vehicleId || '',
        driverId: shipment.driverId || '',
        actualDeliveryDate: '',
        actualCost: shipment.actualCost?.toString() || '',
        notes: shipment.notes || '',
    });

    // Reset form when modal opens with new shipment data
    useEffect(() => {
        if (isOpen) {
            setFormData({
                status: shipment.status,
                vehicleId: shipment.vehicleId || '',
                driverId: shipment.driverId || '',
                actualDeliveryDate: '',
                actualCost: shipment.actualCost?.toString() || '',
                notes: shipment.notes || '',
            });
        }
    }, [isOpen, shipment]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const updateData: any = {
            status: formData.status as any,
        };

        if (formData.vehicleId) updateData.vehicleId = formData.vehicleId;
        if (formData.driverId) updateData.driverId = formData.driverId;
        if (formData.actualDeliveryDate)
            updateData.actualDeliveryDate = formData.actualDeliveryDate;
        if (formData.actualCost)
            updateData.actualCost = parseFloat(formData.actualCost);
        if (formData.notes) updateData.notes = formData.notes;

        const result = await updateShipment(shipment.id, updateData);

        if (result) {
            onSuccess();
            onClose();
        }
    };

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const currentStatus = statusOptions.find(
        (s) => s.value === formData.status
    );
    const StatusIcon = currentStatus?.icon || Clock;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title='Update Shipment Status'
            size='md'
        >
            <form onSubmit={handleSubmit} className='space-y-6'>
                {error && (
                    <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg'>
                        {error.message}
                    </div>
                )}

                {/* Current Info */}
                <div className='bg-gray-50 border border-gray-200 rounded-lg p-4'>
                    <div className='text-sm text-gray-600 mb-2'>
                        Current Shipment
                    </div>
                    <div className='font-semibold text-lg'>
                        {shipment.shipmentNumber}
                    </div>
                    <div className='text-sm text-gray-600'>
                        {shipment.origin || 'N/A'} →{' '}
                        {shipment.destination || 'N/A'}
                    </div>
                </div>

                {/* Status Selection */}
                <div>
                    <label className='text-sm font-medium text-gray-700 mb-2 block'>
                        Status *
                    </label>
                    <select
                        name='status'
                        value={formData.status}
                        onChange={handleChange}
                        required
                        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500'
                    >
                        {statusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <div className='mt-2 flex items-center gap-2'>
                        <StatusIcon
                            className={`h-5 w-5 ${currentStatus?.color}`}
                        />
                        <span className='text-sm text-gray-600'>
                            Selected: {currentStatus?.label}
                        </span>
                    </div>
                </div>

                {/* Conditional Fields */}
                {(formData.status === 'PICKED_UP' ||
                    formData.status === 'IN_TRANSIT' ||
                    formData.status === 'OUT_FOR_DELIVERY') && (
                    <div className='space-y-4 bg-blue-50 border border-blue-200 rounded-lg p-4'>
                        <div className='text-sm font-medium text-blue-800 mb-2'>
                            Assignment (Optional)
                        </div>
                        <div className='grid grid-cols-2 gap-4'>
                            <div>
                                <label className='flex items-center gap-2 text-sm font-medium text-gray-700 mb-2'>
                                    <User className='h-4 w-4' />
                                    Driver
                                </label>
                                <select
                                    name='driverId'
                                    value={formData.driverId}
                                    onChange={handleChange}
                                    disabled={driversLoading}
                                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500'
                                >
                                    <option value=''>
                                        {driversLoading
                                            ? 'Loading...'
                                            : 'Select driver'}
                                    </option>
                                    {availableDrivers.map((driver) => (
                                        <option
                                            key={driver.id}
                                            value={driver.id}
                                        >
                                            {driver.name} - {driver.phone}
                                        </option>
                                    ))}
                                </select>
                                {availableDrivers.length === 0 &&
                                    !driversLoading && (
                                        <p className='text-xs text-gray-500 mt-1'>
                                            No available drivers
                                        </p>
                                    )}
                            </div>
                            <div>
                                <label className='flex items-center gap-2 text-sm font-medium text-gray-700 mb-2'>
                                    <Truck className='h-4 w-4' />
                                    Vehicle
                                </label>
                                <select
                                    name='vehicleId'
                                    value={formData.vehicleId}
                                    onChange={handleChange}
                                    disabled={vehiclesLoading}
                                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500'
                                >
                                    <option value=''>
                                        {vehiclesLoading
                                            ? 'Loading...'
                                            : 'Select vehicle'}
                                    </option>
                                    {availableVehicles.map((vehicle) => (
                                        <option
                                            key={vehicle.id}
                                            value={vehicle.id}
                                        >
                                            {vehicle.plateNumber} -{' '}
                                            {vehicle.type} ({vehicle.capacity}
                                            kg)
                                        </option>
                                    ))}
                                </select>
                                {availableVehicles.length === 0 &&
                                    !vehiclesLoading && (
                                        <p className='text-xs text-gray-500 mt-1'>
                                            No available vehicles
                                        </p>
                                    )}
                            </div>
                        </div>
                    </div>
                )}

                {formData.status === 'DELIVERED' && (
                    <div className='space-y-4 bg-green-50 border border-green-200 rounded-lg p-4'>
                        <div className='text-sm font-medium text-green-800 mb-2'>
                            Delivery Completion
                        </div>
                        <div className='grid grid-cols-2 gap-4'>
                            <div>
                                <label className='flex items-center gap-2 text-sm font-medium text-gray-700 mb-2'>
                                    <Calendar className='h-4 w-4' />
                                    Actual Delivery Date
                                </label>
                                <input
                                    type='datetime-local'
                                    name='actualDeliveryDate'
                                    value={formData.actualDeliveryDate}
                                    onChange={handleChange}
                                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500'
                                />
                            </div>
                            <div>
                                <label className='text-sm font-medium text-gray-700 mb-2 block'>
                                    Actual Cost
                                </label>
                                <input
                                    type='number'
                                    step='0.01'
                                    name='actualCost'
                                    value={formData.actualCost}
                                    onChange={handleChange}
                                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500'
                                    placeholder='Final cost'
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Notes */}
                <div>
                    <label className='text-sm font-medium text-gray-700 mb-2 block'>
                        Notes
                    </label>
                    <textarea
                        name='notes'
                        value={formData.notes}
                        onChange={handleChange}
                        rows={3}
                        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500'
                        placeholder='Add notes about status update...'
                    />
                </div>

                {/* Actions */}
                <div className='flex items-center justify-end gap-3 pt-4 border-t border-gray-200'>
                    <Button
                        type='button'
                        variant='outline'
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button type='submit' variant='primary' disabled={loading}>
                        {loading ? 'Updating...' : 'Update Status'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
