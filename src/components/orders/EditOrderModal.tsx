import React, { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import {
    Package,
    MapPin,
    Calendar,
    User,
    Phone,
    Mail,
    FileText,
    Plus,
    Trash2,
} from 'lucide-react';

interface Order {
    id: string;
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    pickupAddress: string;
    deliveryAddress: string;
    requestedDate: string;
    priority: string;
    specialNotes?: string;
    items?: Array<{
        itemName: string;
        itemSKU: string;
        quantity: number;
        weight: number;
        volume: number;
        description: string;
    }>;
}

interface EditOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: Order | null;
    onSuccess: () => void;
}

interface OrderItem {
    itemName: string;
    itemSKU: string;
    quantity: number;
    weight: number;
    volume: number;
    description: string;
}

export default function EditOrderModal({
    isOpen,
    onClose,
    order,
    onSuccess,
}: EditOrderModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [formData, setFormData] = useState({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        pickupAddress: '',
        deliveryAddress: '',
        requestedDate: '',
        priority: 'NORMAL',
        specialNotes: '',
    });
    const [items, setItems] = useState<OrderItem[]>([
        {
            itemName: '',
            itemSKU: '',
            quantity: 1,
            weight: 0,
            volume: 0,
            description: '',
        },
    ]);

    // Populate form when order changes
    useEffect(() => {
        if (order && isOpen) {
            setFormData({
                customerName: order.customerName || '',
                customerEmail: order.customerEmail || '',
                customerPhone: order.customerPhone || '',
                pickupAddress: order.pickupAddress || '',
                deliveryAddress: order.deliveryAddress || '',
                requestedDate: order.requestedDate
                    ? new Date(order.requestedDate).toISOString().slice(0, 16)
                    : '',
                priority: order.priority || 'NORMAL',
                specialNotes: order.specialNotes || '',
            });
            setItems(
                order.items && order.items.length > 0
                    ? order.items
                    : [
                          {
                              itemName: '',
                              itemSKU: '',
                              quantity: 1,
                              weight: 0,
                              volume: 0,
                              description: '',
                          },
                      ]
            );
        }
    }, [order, isOpen]);

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

    const handleItemChange = (
        index: number,
        field: keyof OrderItem,
        value: string | number
    ) => {
        const newItems = [...items];
        newItems[index] = {
            ...newItems[index],
            [field]: value,
        };
        setItems(newItems);
    };

    const addItem = () => {
        setItems([
            ...items,
            {
                itemName: '',
                itemSKU: '',
                quantity: 1,
                weight: 0,
                volume: 0,
                description: '',
            },
        ]);
    };

    const removeItem = (index: number) => {
        if (items.length > 1) {
            setItems(items.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!order) return;

        setLoading(true);
        setError(null);

        try {
            const totalWeight = items.reduce(
                (sum, item) => sum + item.weight * item.quantity,
                0
            );
            const totalVolume = items.reduce(
                (sum, item) => sum + item.volume * item.quantity,
                0
            );

            const response = await fetch(`/api/orders/${order.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    totalWeight,
                    totalVolume,
                    items,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update order');
            }

            onSuccess();
            onClose();
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    };

    if (!order) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Edit Order - ${order.orderNumber}`}
            size='xl'
        >
            <form onSubmit={handleSubmit} className='space-y-6'>
                {error && (
                    <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg'>
                        {error.message}
                    </div>
                )}

                {/* Customer Information */}
                <div className='bg-gray-50 border border-gray-200 rounded-lg p-4'>
                    <h3 className='text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2'>
                        <User className='h-4 w-4' />
                        Customer Information
                    </h3>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Customer Name *
                            </label>
                            <input
                                type='text'
                                name='customerName'
                                value={formData.customerName}
                                onChange={handleChange}
                                required
                                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                            />
                        </div>
                        <div>
                            <label className='flex items-center gap-2 text-sm font-medium text-gray-700 mb-2'>
                                <Mail className='h-4 w-4' />
                                Email *
                            </label>
                            <input
                                type='email'
                                name='customerEmail'
                                value={formData.customerEmail}
                                onChange={handleChange}
                                required
                                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                            />
                        </div>
                        <div>
                            <label className='flex items-center gap-2 text-sm font-medium text-gray-700 mb-2'>
                                <Phone className='h-4 w-4' />
                                Phone *
                            </label>
                            <input
                                type='tel'
                                name='customerPhone'
                                value={formData.customerPhone}
                                onChange={handleChange}
                                required
                                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                            />
                        </div>
                    </div>
                </div>

                {/* Pickup & Delivery */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                        <label className='flex items-center gap-2 text-sm font-medium text-gray-700 mb-2'>
                            <MapPin className='h-4 w-4 text-green-600' />
                            Pickup Address *
                        </label>
                        <textarea
                            name='pickupAddress'
                            value={formData.pickupAddress}
                            onChange={handleChange}
                            required
                            rows={3}
                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                        />
                    </div>
                    <div>
                        <label className='flex items-center gap-2 text-sm font-medium text-gray-700 mb-2'>
                            <MapPin className='h-4 w-4 text-red-600' />
                            Delivery Address *
                        </label>
                        <textarea
                            name='deliveryAddress'
                            value={formData.deliveryAddress}
                            onChange={handleChange}
                            required
                            rows={3}
                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                        />
                    </div>
                </div>

                {/* Date & Priority */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                        <label className='flex items-center gap-2 text-sm font-medium text-gray-700 mb-2'>
                            <Calendar className='h-4 w-4' />
                            Requested Date *
                        </label>
                        <input
                            type='datetime-local'
                            name='requestedDate'
                            value={formData.requestedDate}
                            onChange={handleChange}
                            required
                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                        />
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Priority *
                        </label>
                        <select
                            name='priority'
                            value={formData.priority}
                            onChange={handleChange}
                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                        >
                            <option value='LOW'>Low</option>
                            <option value='NORMAL'>Normal</option>
                            <option value='HIGH'>High</option>
                            <option value='URGENT'>Urgent</option>
                        </select>
                    </div>
                </div>

                {/* Items */}
                <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
                    <div className='flex items-center justify-between mb-4'>
                        <h3 className='text-sm font-semibold text-gray-700 flex items-center gap-2'>
                            <Package className='h-4 w-4' />
                            Order Items
                        </h3>
                        <Button
                            variant='outline'
                            size='sm'
                            icon={Plus}
                            onClick={addItem}
                        >
                            Add Item
                        </Button>
                    </div>

                    <div className='space-y-4'>
                        {items.map((item, index) => (
                            <div
                                key={index}
                                className='bg-white border border-gray-200 rounded-lg p-4'
                            >
                                <div className='flex items-start justify-between mb-3'>
                                    <span className='text-sm font-medium text-gray-700'>
                                        Item {index + 1}
                                    </span>
                                    {items.length > 1 && (
                                        <button
                                            type='button'
                                            onClick={() => removeItem(index)}
                                            className='text-red-600 hover:text-red-800'
                                        >
                                            <Trash2 className='h-4 w-4' />
                                        </button>
                                    )}
                                </div>

                                <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                                    <div>
                                        <label className='block text-xs font-medium text-gray-600 mb-1'>
                                            Item Name *
                                        </label>
                                        <input
                                            type='text'
                                            value={item.itemName}
                                            onChange={(e) =>
                                                handleItemChange(
                                                    index,
                                                    'itemName',
                                                    e.target.value
                                                )
                                            }
                                            required
                                            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                                        />
                                    </div>
                                    <div>
                                        <label className='block text-xs font-medium text-gray-600 mb-1'>
                                            SKU
                                        </label>
                                        <input
                                            type='text'
                                            value={item.itemSKU}
                                            onChange={(e) =>
                                                handleItemChange(
                                                    index,
                                                    'itemSKU',
                                                    e.target.value
                                                )
                                            }
                                            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                                        />
                                    </div>
                                    <div>
                                        <label className='block text-xs font-medium text-gray-600 mb-1'>
                                            Quantity *
                                        </label>
                                        <input
                                            type='number'
                                            min='1'
                                            value={item.quantity}
                                            onChange={(e) =>
                                                handleItemChange(
                                                    index,
                                                    'quantity',
                                                    parseInt(e.target.value)
                                                )
                                            }
                                            required
                                            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                                        />
                                    </div>
                                    <div>
                                        <label className='block text-xs font-medium text-gray-600 mb-1'>
                                            Weight (kg) *
                                        </label>
                                        <input
                                            type='number'
                                            min='0'
                                            step='0.01'
                                            value={item.weight}
                                            onChange={(e) =>
                                                handleItemChange(
                                                    index,
                                                    'weight',
                                                    parseFloat(e.target.value)
                                                )
                                            }
                                            required
                                            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                                        />
                                    </div>
                                    <div>
                                        <label className='block text-xs font-medium text-gray-600 mb-1'>
                                            Volume (m³)
                                        </label>
                                        <input
                                            type='number'
                                            min='0'
                                            step='0.01'
                                            value={item.volume}
                                            onChange={(e) =>
                                                handleItemChange(
                                                    index,
                                                    'volume',
                                                    parseFloat(e.target.value)
                                                )
                                            }
                                            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                                        />
                                    </div>
                                    <div>
                                        <label className='block text-xs font-medium text-gray-600 mb-1'>
                                            Description
                                        </label>
                                        <input
                                            type='text'
                                            value={item.description}
                                            onChange={(e) =>
                                                handleItemChange(
                                                    index,
                                                    'description',
                                                    e.target.value
                                                )
                                            }
                                            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Special Notes */}
                <div>
                    <label className='flex items-center gap-2 text-sm font-medium text-gray-700 mb-2'>
                        <FileText className='h-4 w-4' />
                        Special Notes (Optional)
                    </label>
                    <textarea
                        name='specialNotes'
                        value={formData.specialNotes}
                        onChange={handleChange}
                        rows={3}
                        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                        placeholder='Any special instructions or notes...'
                    />
                </div>

                {/* Actions */}
                <div className='flex items-center justify-end gap-3 pt-4 border-t border-gray-200'>
                    <Button
                        variant='ghost'
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <button
                        type='submit'
                        disabled={loading}
                        className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors'
                    >
                        {loading ? 'Updating...' : 'Update Order'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
