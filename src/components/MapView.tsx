import React from 'react';
import { MapPin } from 'lucide-react';

// Placeholder for Mapbox integration
export default function MapView({
    locations,
}: {
    locations: { lat: number; lng: number; label?: string }[];
}) {
    return (
        <div className='bg-gradient-to-br from-white to-green-50 rounded-xl shadow-lg p-6 border border-green-100'>
            <div className='flex items-center gap-3 mb-4'>
                <div className='bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-3 shadow-lg'>
                    <MapPin className='h-5 w-5 text-white' />
                </div>
                <h3 className='text-lg font-semibold text-gray-800'>
                    Live Tracking Map
                </h3>
            </div>
            <div className='bg-gradient-to-br from-gray-100 to-gray-50 rounded-lg h-64 flex flex-col items-center justify-center border-2 border-dashed border-gray-300'>
                <MapPin className='h-16 w-16 text-gray-400 mb-3' />
                <p className='text-gray-500 font-medium'>Map View</p>
                <p className='text-sm text-gray-400'>
                    Mapbox integration coming soon
                </p>
            </div>
        </div>
    );
}
