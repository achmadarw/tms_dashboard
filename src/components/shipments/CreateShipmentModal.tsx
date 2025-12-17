import React, { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { useCreateShipment } from '@/hooks/useShipments';
import { useOrders } from '@/hooks/useOrders';
import { useVehicles } from '@/hooks/useVehicles';
import { useDrivers } from '@/hooks/useDrivers';
import {
    Package,
    MapPin,
    Calendar,
    DollarSign,
    FileText,
    Truck,
    User,
} from 'lucide-react';

interface CreateShipmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CreateShipmentModal({
    isOpen,
    onClose,
    onSuccess,
}: CreateShipmentModalProps) {
    const { createShipment, loading, error } = useCreateShipment();
    const { orders, loading: ordersLoading } = useOrders();
    const { vehicles, loading: vehiclesLoading } = useVehicles();
    const { drivers, loading: driversLoading } = useDrivers();

    // Filter orders that don't have a shipment yet
    const availableOrders = orders.filter((order) => !order.shipment);

    const initialFormData = {
        orderId: '',
        vehicleId: '',
        driverId: '',
        origin: '',
        destination: '',
        pickupDate: '',
        deliveryDate: '',
        estimatedCost: '',
        notes: '',
    };

    const [formData, setFormData] = useState(initialFormData);

    // Reset form when modal is opened
    useEffect(() => {
        if (isOpen) {
            setFormData(initialFormData);
        }
    }, [isOpen]);

    // Auto-fill origin and destination when order is selected
    useEffect(() => {
        if (formData.orderId) {
            const selectedOrder = availableOrders.find(
                (o) => o.id === formData.orderId
            );
            if (selectedOrder) {
                setFormData((prev) => ({
                    ...prev,
                    origin: selectedOrder.pickupAddress,
                    destination: selectedOrder.deliveryAddress,
                }));
            }
        }
    }, [formData.orderId, availableOrders]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const result = await createShipment({
            orderId: formData.orderId, // Keep as string (UUID)
            vehicleId: formData.vehicleId || undefined, // Keep as string (UUID)
            driverId: formData.driverId || undefined, // Keep as string (UUID)
            origin: formData.origin,
            destination: formData.destination,
            pickupDate: formData.pickupDate,
            deliveryDate: formData.deliveryDate,
            estimatedCost: parseFloat(formData.estimatedCost),
            notes: formData.notes || undefined,
        });

        if (result) {
            // Reset form first
            setFormData(initialFormData);
            // Then call success callbacks
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

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title='Create New Shipment'
            size='lg'
        >
            <form onSubmit={handleSubmit} className='space-y-6'>
                {error && (
                    <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg'>
                        {error.message}
                    </div>
                )}

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {/* Order Selection */}
                    <div className='md:col-span-2'>
                        <label className='flex items-center gap-2 text-sm font-medium text-gray-700 mb-2'>
                            <Package className='h-4 w-4' />
                            Select Order *
                        </label>
                        <select
                            name='orderId'
                            value={formData.orderId}
                            onChange={handleChange}
                            required
                            disabled={ordersLoading}
                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500'
                        >
                            <option value=''>
                                {ordersLoading
                                    ? 'Loading orders...'
                                    : 'Select an order'}
                            </option>
                            {availableOrders.map((order) => (
                                <option key={order.id} value={order.id}>
                                    {order.orderNumber} - {order.customer} (
                                    {order.status})
                                </option>
                            ))}
                        </select>
                        {availableOrders.length === 0 && !ordersLoading && (
                            <p className='text-sm text-red-600 mt-1'>
                                {orders.length === 0
                                    ? 'No orders available. Please create an order first.'
                                    : 'All orders already have shipments. Please create a new order.'}
                            </p>
                        )}
                    </div>

                    {/* Vehicle Selection */}
                    <div>
                        <label className='flex items-center gap-2 text-sm font-medium text-gray-700 mb-2'>
                            <Truck className='h-4 w-4' />
                            Select Vehicle (Optional)
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
                                    ? 'Loading vehicles...'
                                    : 'No vehicle assigned'}
                            </option>
                            {vehicles
                                .filter((v) => v.status === 'AVAILABLE')
                                .map((vehicle) => (
                                    <option key={vehicle.id} value={vehicle.id}>
                                        {vehicle.licensePlate} -{' '}
                                        {vehicle.vehicleType} (
                                        {vehicle.capacity}kg)
                                    </option>
                                ))}
                        </select>
                        {vehicles.filter((v) => v.status === 'AVAILABLE')
                            .length === 0 &&
                            !vehiclesLoading && (
                                <p className='text-sm text-amber-600 mt-1'>
                                    No available vehicles. All vehicles are
                                    currently in use.
                                </p>
                            )}
                    </div>

                    {/* Driver Selection */}
                    <div>
                        <label className='flex items-center gap-2 text-sm font-medium text-gray-700 mb-2'>
                            <User className='h-4 w-4' />
                            Select Driver (Optional)
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
                                    ? 'Loading drivers...'
                                    : 'No driver assigned'}
                            </option>
                            {drivers
                                .filter((d) => d.isAvailable)
                                .map((driver) => (
                                    <option key={driver.id} value={driver.id}>
                                        {driver.user.firstName}{' '}
                                        {driver.user.lastName} -{' '}
                                        {driver.user.phone}
                                    </option>
                                ))}
                        </select>
                        {drivers.filter((d) => d.isAvailable).length === 0 &&
                            !driversLoading && (
                                <p className='text-sm text-amber-600 mt-1'>
                                    No available drivers. All drivers are
                                    currently assigned.
                                </p>
                            )}
                    </div>

                    {/* Origin */}
                    <div>
                        <label className='flex items-center gap-2 text-sm font-medium text-gray-700 mb-2'>
                            <MapPin className='h-4 w-4 text-green-500' />
                            Origin *
                        </label>
                        <input
                            type='text'
                            name='origin'
                            value={formData.origin}
                            onChange={handleChange}
                            required
                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500'
                            placeholder='Pickup location'
                        />
                    </div>

                    {/* Destination */}
                    <div>
                        <label className='flex items-center gap-2 text-sm font-medium text-gray-700 mb-2'>
                            <MapPin className='h-4 w-4 text-red-500' />
                            Destination *
                        </label>
                        <input
                            type='text'
                            name='destination'
                            value={formData.destination}
                            onChange={handleChange}
                            required
                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500'
                            placeholder='Delivery location'
                        />
                    </div>

                    {/* Pickup Date */}
                    <div>
                        <label className='flex items-center gap-2 text-sm font-medium text-gray-700 mb-2'>
                            <Calendar className='h-4 w-4 text-green-500' />
                            Pickup Date *
                        </label>
                        <input
                            type='datetime-local'
                            name='pickupDate'
                            value={formData.pickupDate}
                            onChange={handleChange}
                            required
                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500'
                        />
                    </div>

                    {/* Delivery Date */}
                    <div>
                        <label className='flex items-center gap-2 text-sm font-medium text-gray-700 mb-2'>
                            <Calendar className='h-4 w-4 text-red-500' />
                            Delivery Date *
                        </label>
                        <input
                            type='datetime-local'
                            name='deliveryDate'
                            value={formData.deliveryDate}
                            onChange={handleChange}
                            required
                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500'
                        />
                    </div>
                </div>

                {/* Estimated Cost */}
                <div>
                    <label className='flex items-center gap-2 text-sm font-medium text-gray-700 mb-2'>
                        <DollarSign className='h-4 w-4' />
                        Estimated Cost *
                    </label>
                    <input
                        type='number'
                        step='0.01'
                        name='estimatedCost'
                        value={formData.estimatedCost}
                        onChange={handleChange}
                        required
                        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500'
                        placeholder='0.00'
                    />
                </div>

                {/* Notes */}
                <div>
                    <label className='flex items-center gap-2 text-sm font-medium text-gray-700 mb-2'>
                        <FileText className='h-4 w-4' />
                        Notes (Optional)
                    </label>
                    <textarea
                        name='notes'
                        value={formData.notes}
                        onChange={handleChange}
                        rows={3}
                        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500'
                        placeholder='Additional notes...'
                    />
                </div>

                {/* Actions */}
                <div className='flex items-center justify-end gap-3 pt-4 border-t border-gray-200'>
                    <Button
                        variant='outline'
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <button
                        type='submit'
                        disabled={loading}
                        className='px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                    >
                        {loading ? 'Creating...' : 'Create Shipment'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
