'use client';

import React, { useState } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import {
    Plus,
    Download,
    Filter,
    Search,
    Package,
    Truck,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Eye,
    Edit,
    Trash2,
} from 'lucide-react';

interface Order {
    id: string;
    orderNumber: string;
    customer: string;
    origin: string;
    destination: string;
    status: 'pending' | 'in-transit' | 'delivered' | 'cancelled';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    createdAt: string;
    deliveryDate: string;
    items: number;
    weight: string;
    value: string;
}

const mockOrders: Order[] = [
    {
        id: '1',
        orderNumber: 'ORD-2025-001',
        customer: 'PT Maju Jaya',
        origin: 'Jakarta',
        destination: 'Surabaya',
        status: 'in-transit',
        priority: 'high',
        createdAt: '2025-12-15',
        deliveryDate: '2025-12-17',
        items: 50,
        weight: '2,500 kg',
        value: '$12,500',
    },
    {
        id: '2',
        orderNumber: 'ORD-2025-002',
        customer: 'CV Sejahtera',
        origin: 'Bandung',
        destination: 'Medan',
        status: 'pending',
        priority: 'medium',
        createdAt: '2025-12-15',
        deliveryDate: '2025-12-20',
        items: 30,
        weight: '1,200 kg',
        value: '$8,400',
    },
    {
        id: '3',
        orderNumber: 'ORD-2025-003',
        customer: 'PT Global Logistics',
        origin: 'Surabaya',
        destination: 'Bali',
        status: 'delivered',
        priority: 'low',
        createdAt: '2025-12-14',
        deliveryDate: '2025-12-15',
        items: 25,
        weight: '800 kg',
        value: '$5,600',
    },
    {
        id: '4',
        orderNumber: 'ORD-2025-004',
        customer: 'UD Sentosa',
        origin: 'Jakarta',
        destination: 'Yogyakarta',
        status: 'in-transit',
        priority: 'urgent',
        createdAt: '2025-12-15',
        deliveryDate: '2025-12-16',
        items: 75,
        weight: '3,800 kg',
        value: '$22,100',
    },
    {
        id: '5',
        orderNumber: 'ORD-2025-005',
        customer: 'PT Mitra Abadi',
        origin: 'Semarang',
        destination: 'Jakarta',
        status: 'cancelled',
        priority: 'medium',
        createdAt: '2025-12-14',
        deliveryDate: '2025-12-18',
        items: 40,
        weight: '1,600 kg',
        value: '$9,200',
    },
];

const statusConfig = {
    pending: {
        label: 'Pending',
        variant: 'warning' as const,
        icon: Clock,
        color: 'text-yellow-600',
    },
    'in-transit': {
        label: 'In Transit',
        variant: 'info' as const,
        icon: Truck,
        color: 'text-blue-600',
    },
    delivered: {
        label: 'Delivered',
        variant: 'success' as const,
        icon: CheckCircle,
        color: 'text-green-600',
    },
    cancelled: {
        label: 'Cancelled',
        variant: 'danger' as const,
        icon: XCircle,
        color: 'text-red-600',
    },
};

const priorityConfig = {
    low: { label: 'Low', variant: 'default' as const },
    medium: { label: 'Medium', variant: 'info' as const },
    high: { label: 'High', variant: 'warning' as const },
    urgent: { label: 'Urgent', variant: 'danger' as const },
};

export default function OrdersPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const filteredOrders = mockOrders.filter((order) => {
        const matchesSearch =
            order.orderNumber
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.destination.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            statusFilter === 'all' || order.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className='space-y-6'>
            <PageHeader
                title='Orders Management'
                subtitle='Manage and track all shipment orders'
                icon={Package}
                actions={
                    <>
                        <Button variant='primary' icon={Plus}>
                            New Order
                        </Button>
                        <Button variant='ghost' icon={Download}>
                            Export
                        </Button>
                    </>
                }
            />

            <div className='bg-white rounded-xl shadow-lg border border-gray-200 p-6'>
                <div className='flex flex-col md:flex-row gap-4 mb-6'>
                    <div className='flex-1 relative'>
                        <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400' />
                        <input
                            type='text'
                            placeholder='Search orders, customer, location...'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className='w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className='px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    >
                        <option value='all'>All Status</option>
                        <option value='pending'>Pending</option>
                        <option value='in-transit'>In Transit</option>
                        <option value='delivered'>Delivered</option>
                        <option value='cancelled'>Cancelled</option>
                    </select>
                    <Button variant='outline' icon={Filter}>
                        More Filters
                    </Button>
                </div>

                <div className='overflow-x-auto'>
                    <table className='w-full'>
                        <thead>
                            <tr className='bg-gradient-to-r from-blue-500 to-blue-600'>
                                <th className='px-4 py-3 text-left text-sm font-semibold text-white'>
                                    Order Number
                                </th>
                                <th className='px-4 py-3 text-left text-sm font-semibold text-white'>
                                    Customer
                                </th>
                                <th className='px-4 py-3 text-left text-sm font-semibold text-white'>
                                    Route
                                </th>
                                <th className='px-4 py-3 text-left text-sm font-semibold text-white'>
                                    Status
                                </th>
                                <th className='px-4 py-3 text-left text-sm font-semibold text-white'>
                                    Priority
                                </th>
                                <th className='px-4 py-3 text-left text-sm font-semibold text-white'>
                                    Delivery Date
                                </th>
                                <th className='px-4 py-3 text-left text-sm font-semibold text-white'>
                                    Items
                                </th>
                                <th className='px-4 py-3 text-left text-sm font-semibold text-white'>
                                    Value
                                </th>
                                <th className='px-4 py-3 text-center text-sm font-semibold text-white'>
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-200'>
                            {filteredOrders.map((order) => {
                                const StatusIcon =
                                    statusConfig[order.status].icon;
                                return (
                                    <tr
                                        key={order.id}
                                        className='hover:bg-gray-50 transition-colors'
                                    >
                                        <td className='px-4 py-4'>
                                            <div className='font-semibold text-gray-800'>
                                                {order.orderNumber}
                                            </div>
                                            <div className='text-xs text-gray-500'>
                                                {order.createdAt}
                                            </div>
                                        </td>
                                        <td className='px-4 py-4'>
                                            <div className='font-medium text-gray-700'>
                                                {order.customer}
                                            </div>
                                        </td>
                                        <td className='px-4 py-4'>
                                            <div className='text-sm'>
                                                <div className='flex items-center gap-1 text-gray-700'>
                                                    <span className='font-medium'>
                                                        {order.origin}
                                                    </span>
                                                </div>
                                                <div className='flex items-center gap-1 text-gray-500 text-xs'>
                                                    <span>→</span>
                                                    <span>
                                                        {order.destination}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className='px-4 py-4'>
                                            <div className='flex items-center gap-2'>
                                                <StatusIcon
                                                    className={`h-4 w-4 ${
                                                        statusConfig[
                                                            order.status
                                                        ].color
                                                    }`}
                                                />
                                                <Badge
                                                    variant={
                                                        statusConfig[
                                                            order.status
                                                        ].variant
                                                    }
                                                >
                                                    {
                                                        statusConfig[
                                                            order.status
                                                        ].label
                                                    }
                                                </Badge>
                                            </div>
                                        </td>
                                        <td className='px-4 py-4'>
                                            <Badge
                                                variant={
                                                    priorityConfig[
                                                        order.priority
                                                    ].variant
                                                }
                                            >
                                                {
                                                    priorityConfig[
                                                        order.priority
                                                    ].label
                                                }
                                            </Badge>
                                        </td>
                                        <td className='px-4 py-4'>
                                            <div className='text-sm text-gray-700'>
                                                {order.deliveryDate}
                                            </div>
                                        </td>
                                        <td className='px-4 py-4'>
                                            <div className='text-sm'>
                                                <div className='font-medium text-gray-700'>
                                                    {order.items} items
                                                </div>
                                                <div className='text-xs text-gray-500'>
                                                    {order.weight}
                                                </div>
                                            </div>
                                        </td>
                                        <td className='px-4 py-4'>
                                            <div className='font-semibold text-green-600'>
                                                {order.value}
                                            </div>
                                        </td>
                                        <td className='px-4 py-4'>
                                            <div className='flex items-center justify-center gap-2'>
                                                <button className='p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors'>
                                                    <Eye className='h-4 w-4' />
                                                </button>
                                                <button className='p-1.5 text-orange-600 hover:bg-orange-50 rounded transition-colors'>
                                                    <Edit className='h-4 w-4' />
                                                </button>
                                                <button className='p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors'>
                                                    <Trash2 className='h-4 w-4' />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    {filteredOrders.length === 0 && (
                        <div className='text-center py-12'>
                            <AlertCircle className='h-12 w-12 text-gray-400 mx-auto mb-3' />
                            <p className='text-gray-600 font-medium'>
                                No orders found
                            </p>
                            <p className='text-sm text-gray-500'>
                                Try adjusting your search or filters
                            </p>
                        </div>
                    )}
                </div>

                <div className='flex items-center justify-between mt-6 pt-4 border-t border-gray-200'>
                    <p className='text-sm text-gray-600'>
                        Showing {filteredOrders.length} of {mockOrders.length}{' '}
                        orders
                    </p>
                    <div className='flex items-center gap-2'>
                        <Button variant='outline' size='sm'>
                            Previous
                        </Button>
                        <div className='flex items-center gap-1'>
                            <button className='px-3 py-1.5 bg-blue-600 text-white rounded text-sm font-medium'>
                                1
                            </button>
                            <button className='px-3 py-1.5 hover:bg-gray-100 text-gray-700 rounded text-sm font-medium'>
                                2
                            </button>
                            <button className='px-3 py-1.5 hover:bg-gray-100 text-gray-700 rounded text-sm font-medium'>
                                3
                            </button>
                        </div>
                        <Button variant='outline' size='sm'>
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
