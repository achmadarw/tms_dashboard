'use client';
import { useState } from 'react';
import DataTable from '@/components/DataTable';
import Card from '@/components/Card';
import { Users, Plus, Star, TrendingUp } from 'lucide-react';

export default function CarriersPage() {
    const columns = [
        { key: 'name', label: 'Carrier Name' },
        { key: 'type', label: 'Type' },
        { key: 'rating', label: 'Rating' },
        { key: 'onTimeRate', label: 'On-Time Rate' },
        { key: 'totalShipments', label: 'Shipments' },
        { key: 'avgCost', label: 'Avg Cost' },
        { key: 'status', label: 'Status' },
    ];

    const mockCarriers = [
        {
            name: 'Express Logistics',
            type: 'Ground',
            rating: '4.8/5',
            onTimeRate: '96%',
            totalShipments: 320,
            avgCost: '$450',
            status: 'Active',
        },
        {
            name: 'Ocean Freight Co',
            type: 'Sea',
            rating: '4.5/5',
            onTimeRate: '92%',
            totalShipments: 180,
            avgCost: '$1200',
            status: 'Active',
        },
        {
            name: 'Air Cargo Plus',
            type: 'Air',
            rating: '4.9/5',
            onTimeRate: '98%',
            totalShipments: 95,
            avgCost: '$3200',
            status: 'Active',
        },
        {
            name: 'Rail Transport',
            type: 'Rail',
            rating: '4.3/5',
            onTimeRate: '88%',
            totalShipments: 150,
            avgCost: '$800',
            status: 'Inactive',
        },
    ];

    return (
        <div className='space-y-6'>
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='text-3xl font-bold text-gray-900 flex items-center gap-2'>
                        <Users className='text-blue-600' /> Carriers & Vendors
                    </h1>
                    <p className='text-gray-600 mt-1'>
                        Manage carrier partnerships and evaluate performance
                    </p>
                </div>
                <button className='bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition'>
                    <Plus size={20} /> Add Carrier
                </button>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                <Card
                    title='Total Carriers'
                    value={24}
                    icon={<Users className='text-blue-600' size={32} />}
                />
                <Card
                    title='Active'
                    value={18}
                    icon={<Users className='text-green-600' size={32} />}
                />
                <Card
                    title='Avg Rating'
                    value='4.6/5'
                    icon={<Star className='text-yellow-600' size={32} />}
                />
                <Card
                    title='On-Time Rate'
                    value='94%'
                    icon={<TrendingUp className='text-purple-600' size={32} />}
                />
            </div>

            <div className='bg-white rounded-xl shadow overflow-hidden'>
                <DataTable columns={columns} data={mockCarriers} />
            </div>
        </div>
    );
}
