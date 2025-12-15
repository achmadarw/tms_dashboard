'use client';
import { useState, useEffect } from 'react';
import DataTable from '@/components/DataTable';
import StatusBadge from '@/components/StatusBadge';
import MapView from '@/components/MapView';
import { Truck, Plus, MapPin } from 'lucide-react';

export default function ShipmentsPage() {
    const [shipments, setShipments] = useState([]);
    const [selectedShipment, setSelectedShipment] = useState(null);

    const columns = [
        { key: 'shipmentNumber', label: 'Shipment #' },
        { key: 'origin', label: 'Origin' },
        { key: 'destination', label: 'Destination' },
        { key: 'driver', label: 'Driver' },
        { key: 'vehicle', label: 'Vehicle' },
        { key: 'status', label: 'Status' },
        { key: 'eta', label: 'ETA' },
    ];

    const mockShipments = [
        {
            shipmentNumber: 'SHP-001',
            origin: 'Jakarta',
            destination: 'Surabaya',
            driver: 'John Doe',
            vehicle: 'VH-1234',
            status: 'in_progress',
            eta: '2h 30m',
        },
        {
            shipmentNumber: 'SHP-002',
            origin: 'Bandung',
            destination: 'Semarang',
            driver: 'Jane Smith',
            vehicle: 'VH-5678',
            status: 'completed',
            eta: 'Delivered',
        },
        {
            shipmentNumber: 'SHP-003',
            origin: 'Yogyakarta',
            destination: 'Solo',
            driver: 'Bob Wilson',
            vehicle: 'VH-9012',
            status: 'pending',
            eta: 'Not started',
        },
    ];

    return (
        <div className='space-y-6'>
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='text-3xl font-bold text-gray-900 flex items-center gap-2'>
                        <Truck className='text-blue-600' /> Shipments Execution
                    </h1>
                    <p className='text-gray-600 mt-1'>
                        Track and manage shipment deliveries in real-time
                    </p>
                </div>
                <button className='bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition'>
                    <Plus size={20} /> New Shipment
                </button>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                <div className='bg-white rounded-xl shadow p-4'>
                    <h3 className='font-semibold text-gray-900 mb-4 flex items-center gap-2'>
                        <MapPin size={20} className='text-blue-600' /> Live
                        Tracking
                    </h3>
                    <MapView locations={[]} />
                </div>
                <div className='bg-white rounded-xl shadow p-4'>
                    <h3 className='font-semibold text-gray-900 mb-4'>
                        Shipment Summary
                    </h3>
                    <div className='grid grid-cols-3 gap-4'>
                        <div className='text-center'>
                            <div className='text-2xl font-bold text-blue-600'>
                                45
                            </div>
                            <div className='text-sm text-gray-500'>
                                In Transit
                            </div>
                        </div>
                        <div className='text-center'>
                            <div className='text-2xl font-bold text-green-600'>
                                320
                            </div>
                            <div className='text-sm text-gray-500'>
                                Delivered
                            </div>
                        </div>
                        <div className='text-center'>
                            <div className='text-2xl font-bold text-yellow-600'>
                                12
                            </div>
                            <div className='text-sm text-gray-500'>Pending</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='bg-white rounded-xl shadow overflow-hidden'>
                <DataTable
                    columns={columns}
                    data={mockShipments.map((shipment) => ({
                        ...shipment,
                        status: <StatusBadge status={shipment.status} />,
                    }))}
                />
            </div>
        </div>
    );
}
