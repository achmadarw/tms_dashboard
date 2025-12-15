'use client';
import { useState, useEffect } from 'react';
import DataTable from '@/components/DataTable';
import StatusBadge from '@/components/StatusBadge';
import Input from '@/components/Form/Input';
import Select from '@/components/Form/Select';
import { Package, Plus, Search, Filter } from 'lucide-react';

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        fetchOrders();
    }, []);

    async function fetchOrders() {
        try {
            const res = await fetch('/api/orders');
            const data = await res.json();
            setOrders(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const columns = [
        { key: 'orderNumber', label: 'Order #' },
        { key: 'customer', label: 'Customer' },
        { key: 'items', label: 'Items' },
        { key: 'weight', label: 'Weight (kg)' },
        { key: 'status', label: 'Status' },
        { key: 'createdAt', label: 'Date' },
    ];

    const mockOrders = [
        {
            orderNumber: 'ORD-001',
            customer: 'PT ABC',
            items: 25,
            weight: 1500,
            status: 'pending',
            createdAt: '2024-12-15',
        },
        {
            orderNumber: 'ORD-002',
            customer: 'PT XYZ',
            items: 40,
            weight: 2300,
            status: 'in_progress',
            createdAt: '2024-12-14',
        },
        {
            orderNumber: 'ORD-003',
            customer: 'CV DEF',
            items: 15,
            weight: 800,
            status: 'completed',
            createdAt: '2024-12-13',
        },
    ];

    return (
        <div className='space-y-6'>
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='text-3xl font-bold text-gray-900 flex items-center gap-2'>
                        <Package className='text-blue-600' /> Orders Management
                    </h1>
                    <p className='text-gray-600 mt-1'>
                        Manage all incoming and outgoing orders
                    </p>
                </div>
                <button className='bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition'>
                    <Plus size={20} /> New Order
                </button>
            </div>

            <div className='bg-white rounded-xl shadow p-4'>
                <div className='flex gap-4 items-end'>
                    <div className='flex-1'>
                        <Input
                            label='Search'
                            placeholder='Search by order number or customer...'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Select
                        label='Status'
                        options={[
                            { value: 'all', label: 'All Status' },
                            { value: 'pending', label: 'Pending' },
                            { value: 'in_progress', label: 'In Progress' },
                            { value: 'completed', label: 'Completed' },
                        ]}
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    />
                </div>
            </div>

            <div className='bg-white rounded-xl shadow overflow-hidden'>
                {loading ? (
                    <div className='p-6 text-center text-gray-500'>
                        Loading orders...
                    </div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={mockOrders.map((order) => ({
                            ...order,
                            status: <StatusBadge status={order.status} />,
                        }))}
                    />
                )}
            </div>
        </div>
    );
}
