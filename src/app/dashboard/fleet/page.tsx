'use client';
import { useState } from 'react';
import DataTable from '@/components/DataTable';
import Card from '@/components/Card';
import { Truck, Plus, Wrench, Fuel } from 'lucide-react';

export default function FleetPage() {
    const columns = [
        { key: 'vehicleNumber', label: 'Vehicle #' },
        { key: 'type', label: 'Type' },
        { key: 'driver', label: 'Current Driver' },
        { key: 'status', label: 'Status' },
        { key: 'fuelLevel', label: 'Fuel' },
        { key: 'lastMaintenance', label: 'Last Service' },
        { key: 'nextMaintenance', label: 'Next Service' },
    ];

    const mockVehicles = [
        {
            vehicleNumber: 'VH-1234',
            type: 'Box Truck',
            driver: 'John Doe',
            status: 'Active',
            fuelLevel: '85%',
            lastMaintenance: '2024-11-15',
            nextMaintenance: '2025-01-15',
        },
        {
            vehicleNumber: 'VH-5678',
            type: 'Van',
            driver: 'Jane Smith',
            status: 'Active',
            fuelLevel: '60%',
            lastMaintenance: '2024-11-20',
            nextMaintenance: '2025-01-20',
        },
        {
            vehicleNumber: 'VH-9012',
            type: 'Pickup',
            driver: 'Unassigned',
            status: 'Available',
            fuelLevel: '100%',
            lastMaintenance: '2024-12-01',
            nextMaintenance: '2025-02-01',
        },
        {
            vehicleNumber: 'VH-3456',
            type: 'Box Truck',
            driver: 'Bob Wilson',
            status: 'Maintenance',
            fuelLevel: '20%',
            lastMaintenance: '2024-10-10',
            nextMaintenance: '2024-12-10',
        },
    ];

    return (
        <div className='space-y-6'>
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='text-3xl font-bold text-gray-900 flex items-center gap-2'>
                        <Truck className='text-blue-600' /> Fleet Management
                    </h1>
                    <p className='text-gray-600 mt-1'>
                        Monitor vehicles, drivers, and maintenance schedules
                    </p>
                </div>
                <button className='bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition'>
                    <Plus size={20} /> Add Vehicle
                </button>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                <Card
                    title='Total Vehicles'
                    value={78}
                    icon={<Truck className='text-blue-600' size={32} />}
                />
                <Card
                    title='Active'
                    value={45}
                    icon={<Truck className='text-green-600' size={32} />}
                />
                <Card
                    title='Available'
                    value={28}
                    icon={<Truck className='text-gray-600' size={32} />}
                />
                <Card
                    title='Maintenance'
                    value={5}
                    icon={<Wrench className='text-orange-600' size={32} />}
                />
            </div>

            <div className='bg-white rounded-xl shadow overflow-hidden'>
                <DataTable columns={columns} data={mockVehicles} />
            </div>
        </div>
    );
}
