'use client';
import { useState } from 'react';
import MapView from '@/components/MapView';
import StatusBadge from '@/components/StatusBadge';
import Input from '@/components/Form/Input';
import { MapPin, Search, Navigation } from 'lucide-react';

export default function TrackingPage() {
    const [trackingNumber, setTrackingNumber] = useState('');
    const [trackingResult, setTrackingResult] = useState(null);

    function handleTrack() {
        // Mock tracking result
        setTrackingResult({
            shipmentNumber: trackingNumber || 'SHP-001',
            status: 'in_progress',
            currentLocation: 'Jakarta Toll Road, KM 45',
            lastUpdate: '5 minutes ago',
            estimatedArrival: '2h 30m',
            history: [
                {
                    time: '08:00 AM',
                    location: 'Warehouse Jakarta',
                    event: 'Shipment departed',
                },
                {
                    time: '10:30 AM',
                    location: 'Toll Gate Cikampek',
                    event: 'Checkpoint passed',
                },
                {
                    time: '01:15 PM',
                    location: 'Jakarta Toll Road, KM 45',
                    event: 'In transit',
                },
            ],
        });
    }

    return (
        <div className='space-y-6'>
            <div>
                <h1 className='text-3xl font-bold text-gray-900 flex items-center gap-2'>
                    <MapPin className='text-blue-600' /> Real-Time Tracking
                </h1>
                <p className='text-gray-600 mt-1'>
                    Track shipments with GPS real-time visibility
                </p>
            </div>

            <div className='bg-white rounded-xl shadow p-6'>
                <div className='flex gap-4'>
                    <div className='flex-1'>
                        <Input
                            label='Track Shipment'
                            placeholder='Enter shipment number...'
                            value={trackingNumber}
                            onChange={(e) => setTrackingNumber(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={handleTrack}
                        className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition mt-6'
                    >
                        <Search size={20} />
                    </button>
                </div>
            </div>

            {trackingResult && (
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                    <div className='lg:col-span-2 bg-white rounded-xl shadow p-4'>
                        <h3 className='font-semibold text-gray-900 mb-4 flex items-center gap-2'>
                            <Navigation size={20} className='text-blue-600' />{' '}
                            Live Location
                        </h3>
                        <MapView locations={[]} />
                    </div>

                    <div className='bg-white rounded-xl shadow p-6'>
                        <h3 className='font-semibold text-gray-900 mb-4'>
                            Tracking Details
                        </h3>
                        <div className='space-y-4'>
                            <div>
                                <div className='text-sm text-gray-600'>
                                    Shipment #
                                </div>
                                <div className='font-semibold'>
                                    {trackingResult.shipmentNumber}
                                </div>
                            </div>
                            <div>
                                <div className='text-sm text-gray-600'>
                                    Status
                                </div>
                                <StatusBadge status={trackingResult.status} />
                            </div>
                            <div>
                                <div className='text-sm text-gray-600'>
                                    Current Location
                                </div>
                                <div className='font-semibold'>
                                    {trackingResult.currentLocation}
                                </div>
                            </div>
                            <div>
                                <div className='text-sm text-gray-600'>
                                    Last Update
                                </div>
                                <div className='text-sm'>
                                    {trackingResult.lastUpdate}
                                </div>
                            </div>
                            <div>
                                <div className='text-sm text-gray-600'>ETA</div>
                                <div className='font-semibold text-blue-600'>
                                    {trackingResult.estimatedArrival}
                                </div>
                            </div>
                        </div>

                        <div className='mt-6 pt-6 border-t'>
                            <h4 className='font-semibold text-gray-900 mb-3'>
                                Tracking History
                            </h4>
                            <div className='space-y-3'>
                                {trackingResult.history.map((item, i) => (
                                    <div
                                        key={i}
                                        className='border-l-2 border-blue-600 pl-3'
                                    >
                                        <div className='text-xs text-gray-600'>
                                            {item.time}
                                        </div>
                                        <div className='text-sm font-semibold'>
                                            {item.event}
                                        </div>
                                        <div className='text-xs text-gray-500'>
                                            {item.location}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
