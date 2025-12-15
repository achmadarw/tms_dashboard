'use client';
import { useState } from 'react';
import Card from '@/components/Card';
import MapView from '@/components/MapView';
import Input from '@/components/Form/Input';
import Select from '@/components/Form/Select';
import { Settings, MapPin, Route, Calendar } from 'lucide-react';

export default function PlanningPage() {
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [transportMode, setTransportMode] = useState('ground');
    const [optimizedRoute, setOptimizedRoute] = useState(null);

    function handleOptimize() {
        // Mock route optimization
        setOptimizedRoute({
            distance: '450 km',
            duration: '6h 30m',
            cost: '$420',
            fuel: '45L',
        });
    }

    return (
        <div className='space-y-6'>
            <div>
                <h1 className='text-3xl font-bold text-gray-900 flex items-center gap-2'>
                    <Settings className='text-blue-600' /> Transportation
                    Planning
                </h1>
                <p className='text-gray-600 mt-1'>
                    Optimize routes and plan transportation schedules
                </p>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                <div className='lg:col-span-2 bg-white rounded-xl shadow p-6'>
                    <h3 className='font-semibold text-gray-900 mb-4 flex items-center gap-2'>
                        <Route size={20} className='text-blue-600' /> Route
                        Planning
                    </h3>
                    <div className='space-y-4'>
                        <Input
                            label='Origin'
                            placeholder='Enter origin location'
                            value={origin}
                            onChange={(e) => setOrigin(e.target.value)}
                        />
                        <Input
                            label='Destination'
                            placeholder='Enter destination'
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                        />
                        <Select
                            label='Transport Mode'
                            options={[
                                { value: 'ground', label: 'Ground Transport' },
                                { value: 'sea', label: 'Sea Freight' },
                                { value: 'air', label: 'Air Cargo' },
                                { value: 'rail', label: 'Rail Transport' },
                            ]}
                            value={transportMode}
                            onChange={(e) => setTransportMode(e.target.value)}
                        />
                        <button
                            onClick={handleOptimize}
                            className='w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition'
                        >
                            Optimize Route
                        </button>
                    </div>
                    {optimizedRoute && (
                        <div className='mt-6 p-4 bg-blue-50 rounded-lg'>
                            <h4 className='font-semibold text-blue-900 mb-2'>
                                Optimized Route
                            </h4>
                            <div className='grid grid-cols-2 gap-2 text-sm'>
                                <div>
                                    <span className='text-gray-600'>
                                        Distance:
                                    </span>{' '}
                                    <span className='font-semibold'>
                                        {optimizedRoute.distance}
                                    </span>
                                </div>
                                <div>
                                    <span className='text-gray-600'>
                                        Duration:
                                    </span>{' '}
                                    <span className='font-semibold'>
                                        {optimizedRoute.duration}
                                    </span>
                                </div>
                                <div>
                                    <span className='text-gray-600'>
                                        Est. Cost:
                                    </span>{' '}
                                    <span className='font-semibold'>
                                        {optimizedRoute.cost}
                                    </span>
                                </div>
                                <div>
                                    <span className='text-gray-600'>Fuel:</span>{' '}
                                    <span className='font-semibold'>
                                        {optimizedRoute.fuel}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className='bg-white rounded-xl shadow p-6'>
                    <h3 className='font-semibold text-gray-900 mb-4 flex items-center gap-2'>
                        <Calendar size={20} className='text-blue-600' />{' '}
                        Schedule
                    </h3>
                    <div className='space-y-3'>
                        <div className='p-3 bg-gray-50 rounded'>
                            <div className='text-sm font-semibold'>SHP-001</div>
                            <div className='text-xs text-gray-600'>
                                Jakarta → Surabaya
                            </div>
                            <div className='text-xs text-blue-600 mt-1'>
                                Today, 08:00 AM
                            </div>
                        </div>
                        <div className='p-3 bg-gray-50 rounded'>
                            <div className='text-sm font-semibold'>SHP-002</div>
                            <div className='text-xs text-gray-600'>
                                Bandung → Semarang
                            </div>
                            <div className='text-xs text-blue-600 mt-1'>
                                Today, 10:30 AM
                            </div>
                        </div>
                        <div className='p-3 bg-gray-50 rounded'>
                            <div className='text-sm font-semibold'>SHP-003</div>
                            <div className='text-xs text-gray-600'>
                                Yogyakarta → Solo
                            </div>
                            <div className='text-xs text-blue-600 mt-1'>
                                Today, 02:00 PM
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='bg-white rounded-xl shadow p-4'>
                <h3 className='font-semibold text-gray-900 mb-4'>Route Map</h3>
                <MapView locations={[]} />
            </div>
        </div>
    );
}
