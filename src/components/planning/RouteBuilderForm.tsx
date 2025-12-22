'use client';
import { useState } from 'react';
import {
    MapPin,
    Plus,
    Trash2,
    Navigation,
    MoveVertical,
    X,
    Check,
} from 'lucide-react';

interface Waypoint {
    id: string;
    address: string;
    lat: number;
    lng: number;
}

interface RouteBuilderFormProps {
    onRouteChange: (data: {
        origin: Waypoint | null;
        destination: Waypoint | null;
        waypoints: Waypoint[];
    }) => void;
}

export default function RouteBuilderForm({
    onRouteChange,
}: RouteBuilderFormProps) {
    const [origin, setOrigin] = useState<Waypoint | null>(null);
    const [destination, setDestination] = useState<Waypoint | null>(null);
    const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
    const [tempOrigin, setTempOrigin] = useState('');
    const [tempDestination, setTempDestination] = useState('');
    const [tempWaypoint, setTempWaypoint] = useState('');
    const [editingOrigin, setEditingOrigin] = useState(false);
    const [editingDestination, setEditingDestination] = useState(false);

    // Mock geocoding - in production, use Google Maps Geocoding API
    const geocodeAddress = async (
        address: string
    ): Promise<{ lat: number; lng: number }> => {
        // Simplified mock - return Jakarta coordinates with slight variations
        const baseLatJkt = -6.2088;
        const baseLngJkt = 106.8456;
        const randomOffset = () => (Math.random() - 0.5) * 0.5;

        return {
            lat: baseLatJkt + randomOffset(),
            lng: baseLngJkt + randomOffset(),
        };
    };

    const handleSetOrigin = async () => {
        if (tempOrigin.trim()) {
            const coords = await geocodeAddress(tempOrigin);
            const newOrigin = {
                id: 'origin',
                address: tempOrigin,
                ...coords,
            };
            setOrigin(newOrigin);
            setEditingOrigin(false);
            onRouteChange({ origin: newOrigin, destination, waypoints });
        }
    };

    const handleSetDestination = async () => {
        if (tempDestination.trim()) {
            const coords = await geocodeAddress(tempDestination);
            const newDestination = {
                id: 'destination',
                address: tempDestination,
                ...coords,
            };
            setDestination(newDestination);
            setEditingDestination(false);
            onRouteChange({ origin, destination: newDestination, waypoints });
        }
    };

    const handleAddWaypoint = async () => {
        if (tempWaypoint.trim()) {
            const coords = await geocodeAddress(tempWaypoint);
            const newWaypoint = {
                id: `waypoint-${Date.now()}`,
                address: tempWaypoint,
                ...coords,
            };
            const newWaypoints = [...waypoints, newWaypoint];
            setWaypoints(newWaypoints);
            setTempWaypoint('');
            onRouteChange({ origin, destination, waypoints: newWaypoints });
        }
    };

    const handleRemoveWaypoint = (id: string) => {
        const newWaypoints = waypoints.filter((w) => w.id !== id);
        setWaypoints(newWaypoints);
        onRouteChange({ origin, destination, waypoints: newWaypoints });
    };

    const handleClearOrigin = () => {
        setOrigin(null);
        setTempOrigin('');
        setEditingOrigin(false);
        onRouteChange({ origin: null, destination, waypoints });
    };

    const handleClearDestination = () => {
        setDestination(null);
        setTempDestination('');
        setEditingDestination(false);
        onRouteChange({ origin, destination: null, waypoints });
    };

    return (
        <div className='relative'>
            {/* Visual Connection Line */}
            <div className='absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-400 via-blue-400 to-red-400 opacity-20' />

            <div className='relative space-y-3'>
                {/* Origin */}
                <div className='relative'>
                    {!origin || editingOrigin ? (
                        <div className='pl-14'>
                            <label className='text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block'>
                                Starting Point
                            </label>
                            <div className='flex gap-2'>
                                <input
                                    type='text'
                                    placeholder='Enter pickup location...'
                                    value={tempOrigin}
                                    onChange={(e) =>
                                        setTempOrigin(e.target.value)
                                    }
                                    onKeyPress={(e) =>
                                        e.key === 'Enter' && handleSetOrigin()
                                    }
                                    className='flex-1 px-4 py-2.5 border-2 border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all'
                                    autoFocus={editingOrigin}
                                />
                                <button
                                    onClick={handleSetOrigin}
                                    disabled={!tempOrigin.trim()}
                                    className='px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed'
                                >
                                    <Check size={18} />
                                </button>
                                {editingOrigin && (
                                    <button
                                        onClick={() => {
                                            setEditingOrigin(false);
                                            setTempOrigin('');
                                        }}
                                        className='px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition'
                                    >
                                        <X size={18} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className='group flex items-center gap-3'>
                            <div className='flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-md'>
                                <MapPin size={24} className='text-white' />
                            </div>
                            <div className='flex-1 bg-gradient-to-r from-green-50 to-green-50/50 border-2 border-green-200 rounded-lg p-3 transition-all group-hover:border-green-300 group-hover:shadow-sm'>
                                <div className='flex items-start justify-between'>
                                    <div className='flex-1'>
                                        <div className='text-xs font-semibold text-green-700 uppercase tracking-wide mb-1'>
                                            Origin
                                        </div>
                                        <div className='text-sm font-medium text-gray-900'>
                                            {origin.address}
                                        </div>
                                    </div>
                                    <div className='flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
                                        <button
                                            onClick={() => {
                                                setTempOrigin(origin.address);
                                                setEditingOrigin(true);
                                            }}
                                            className='p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-100 rounded transition'
                                            title='Edit origin'
                                        >
                                            <Navigation size={14} />
                                        </button>
                                        <button
                                            onClick={handleClearOrigin}
                                            className='p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-100 rounded transition'
                                            title='Clear origin'
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Connection Indicator */}
                {origin && (
                    <div className='flex items-center gap-3 pl-14 py-1'>
                        <MoveVertical size={16} className='text-gray-400' />
                        <span className='text-xs text-gray-500'>
                            {waypoints.length === 0
                                ? 'Direct route'
                                : `${waypoints.length} stop(s)`}
                        </span>
                    </div>
                )}
                {/* Connection Indicator */}
                {origin && (
                    <div className='flex items-center gap-3 pl-14 py-1'>
                        <MoveVertical size={16} className='text-gray-400' />
                        <span className='text-xs text-gray-500'>
                            {waypoints.length === 0
                                ? 'Direct route'
                                : `${waypoints.length} stop(s)`}
                        </span>
                    </div>
                )}

                {/* Waypoints */}
                {waypoints.map((waypoint, index) => (
                    <div key={waypoint.id} className='relative'>
                        <div className='group flex items-center gap-3'>
                            <div className='flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md relative'>
                                <Navigation size={20} className='text-white' />
                                <div className='absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center text-xs font-bold text-blue-600 border-2 border-blue-600'>
                                    {index + 1}
                                </div>
                            </div>
                            <div className='flex-1 bg-gradient-to-r from-blue-50 to-blue-50/50 border-2 border-blue-200 rounded-lg p-3 transition-all group-hover:border-blue-300 group-hover:shadow-sm'>
                                <div className='flex items-start justify-between'>
                                    <div className='flex-1'>
                                        <div className='text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1'>
                                            Stop {index + 1}
                                        </div>
                                        <div className='text-sm font-medium text-gray-900'>
                                            {waypoint.address}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() =>
                                            handleRemoveWaypoint(waypoint.id)
                                        }
                                        className='p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-100 rounded transition opacity-0 group-hover:opacity-100'
                                        title='Remove stop'
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                        {index < waypoints.length - 1 && (
                            <div className='flex items-center gap-3 pl-14 py-1'>
                                <MoveVertical
                                    size={16}
                                    className='text-gray-400'
                                />
                            </div>
                        )}
                    </div>
                ))}

                {/* Add Waypoint */}
                {origin && destination && (
                    <div className='pl-14'>
                        <div className='flex gap-2'>
                            <input
                                type='text'
                                placeholder='Add intermediate stop (optional)...'
                                value={tempWaypoint}
                                onChange={(e) =>
                                    setTempWaypoint(e.target.value)
                                }
                                onKeyPress={(e) =>
                                    e.key === 'Enter' && handleAddWaypoint()
                                }
                                className='flex-1 px-4 py-2.5 border-2 border-blue-200 border-dashed rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:border-solid transition-all'
                            />
                            <button
                                onClick={handleAddWaypoint}
                                disabled={!tempWaypoint.trim()}
                                className='px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2'
                            >
                                <Plus size={18} />
                                Add
                            </button>
                        </div>
                    </div>
                )}

                {/* Connection Indicator */}
                {destination && origin && (
                    <div className='flex items-center gap-3 pl-14 py-1'>
                        <MoveVertical size={16} className='text-gray-400' />
                    </div>
                )}

                {/* Destination */}
                <div className='relative'>
                    {!destination || editingDestination ? (
                        <div className='pl-14'>
                            <label className='text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block'>
                                Destination Point
                            </label>
                            <div className='flex gap-2'>
                                <input
                                    type='text'
                                    placeholder='Enter delivery location...'
                                    value={tempDestination}
                                    onChange={(e) =>
                                        setTempDestination(e.target.value)
                                    }
                                    onKeyPress={(e) =>
                                        e.key === 'Enter' &&
                                        handleSetDestination()
                                    }
                                    className='flex-1 px-4 py-2.5 border-2 border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all'
                                    autoFocus={editingDestination}
                                />
                                <button
                                    onClick={handleSetDestination}
                                    disabled={!tempDestination.trim()}
                                    className='px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed'
                                >
                                    <Check size={18} />
                                </button>
                                {editingDestination && (
                                    <button
                                        onClick={() => {
                                            setEditingDestination(false);
                                            setTempDestination('');
                                        }}
                                        className='px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition'
                                    >
                                        <X size={18} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className='group flex items-center gap-3'>
                            <div className='flex-shrink-0 w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-md'>
                                <MapPin size={24} className='text-white' />
                            </div>
                            <div className='flex-1 bg-gradient-to-r from-red-50 to-red-50/50 border-2 border-red-200 rounded-lg p-3 transition-all group-hover:border-red-300 group-hover:shadow-sm'>
                                <div className='flex items-start justify-between'>
                                    <div className='flex-1'>
                                        <div className='text-xs font-semibold text-red-700 uppercase tracking-wide mb-1'>
                                            Destination
                                        </div>
                                        <div className='text-sm font-medium text-gray-900'>
                                            {destination.address}
                                        </div>
                                    </div>
                                    <div className='flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
                                        <button
                                            onClick={() => {
                                                setTempDestination(
                                                    destination.address
                                                );
                                                setEditingDestination(true);
                                            }}
                                            className='p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-100 rounded transition'
                                            title='Edit destination'
                                        >
                                            <Navigation size={14} />
                                        </button>
                                        <button
                                            onClick={handleClearDestination}
                                            className='p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-100 rounded transition'
                                            title='Clear destination'
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Route Summary Card */}
                {origin && destination && (
                    <div className='mt-6 p-4 bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl'>
                        <div className='flex items-center justify-between mb-3'>
                            <h4 className='font-semibold text-gray-900 flex items-center gap-2'>
                                <Navigation
                                    size={16}
                                    className='text-gray-600'
                                />
                                Route Summary
                            </h4>
                            <div className='text-xs font-medium text-gray-600 bg-white px-3 py-1 rounded-full'>
                                {2 + waypoints.length} Stops
                            </div>
                        </div>
                        <div className='space-y-2 text-sm'>
                            <div className='flex items-center gap-2 text-gray-700'>
                                <div className='w-2 h-2 rounded-full bg-green-500'></div>
                                <span className='font-medium'>Start:</span>
                                <span className='text-gray-600'>
                                    {origin.address}
                                </span>
                            </div>
                            {waypoints.length > 0 && (
                                <div className='pl-3 border-l-2 border-blue-300 ml-1 space-y-1.5'>
                                    {waypoints.map((wp, idx) => (
                                        <div
                                            key={wp.id}
                                            className='flex items-center gap-2 text-gray-700'
                                        >
                                            <div className='w-2 h-2 rounded-full bg-blue-500'></div>
                                            <span className='font-medium'>
                                                Stop {idx + 1}:
                                            </span>
                                            <span className='text-gray-600'>
                                                {wp.address}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className='flex items-center gap-2 text-gray-700'>
                                <div className='w-2 h-2 rounded-full bg-red-500'></div>
                                <span className='font-medium'>End:</span>
                                <span className='text-gray-600'>
                                    {destination.address}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
