'use client';

import React, { useEffect, useRef } from 'react';
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    Polyline,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface ShipmentMapProps {
    origin: string;
    destination: string;
    currentLocation?: string;
    status: string;
}

// Mock geocoding - In production, use real geocoding API
const geocodeAddress = (address: string): [number, number] => {
    // Handle empty/undefined address
    if (!address || address.trim().length === 0) {
        // Return default Jakarta coordinates
        return [-6.2, 106.8];
    }

    // Simple hash function to generate consistent coordinates from address
    let hash = 0;
    for (let i = 0; i < address.length; i++) {
        hash = (hash << 5) - hash + address.charCodeAt(i);
        hash = hash & hash;
    }

    // Generate coordinates around Jakarta, Indonesia (-6.2, 106.8)
    const latBase = -6.2;
    const lngBase = 106.8;
    const latOffset = (hash % 100) / 1000; // +/- 0.1 degrees
    const lngOffset = ((hash >> 8) % 100) / 1000;

    return [latBase + latOffset, lngBase + lngOffset];
};

export default function ShipmentMap({
    origin,
    destination,
    currentLocation,
    status,
}: ShipmentMapProps) {
    const mapRef = useRef<any>(null);

    const originCoords = geocodeAddress(origin);
    const destCoords = geocodeAddress(destination);
    const currentCoords = currentLocation
        ? geocodeAddress(currentLocation)
        : null;

    // Calculate center point and zoom
    const centerLat = (originCoords[0] + destCoords[0]) / 2;
    const centerLng = (originCoords[1] + destCoords[1]) / 2;
    const center: [number, number] = [centerLat, centerLng];

    useEffect(() => {
        // Fit bounds to show all markers
        if (mapRef.current) {
            const bounds = L.latLngBounds([originCoords, destCoords]);
            if (currentCoords) {
                bounds.extend(currentCoords);
            }
            mapRef.current.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [originCoords, destCoords, currentCoords]);

    // Custom icons
    const originIcon = new L.Icon({
        iconUrl:
            'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl:
            'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    });

    const destIcon = new L.Icon({
        iconUrl:
            'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl:
            'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    });

    const currentIcon = new L.Icon({
        iconUrl:
            'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
        shadowUrl:
            'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    });

    // Route line coordinates
    const routeCoords: [number, number][] = currentCoords
        ? [originCoords, currentCoords, destCoords]
        : [originCoords, destCoords];

    return (
        <div className='relative w-full h-[400px] rounded-lg overflow-hidden border-2 border-gray-300'>
            <MapContainer
                center={center}
                zoom={12}
                className='w-full h-full'
                ref={mapRef}
                scrollWheelZoom={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                />

                {/* Origin Marker */}
                <Marker position={originCoords} icon={originIcon}>
                    <Popup>
                        <div className='text-sm'>
                            <p className='font-semibold text-green-600'>
                                📍 Origin
                            </p>
                            <p>{origin}</p>
                        </div>
                    </Popup>
                </Marker>

                {/* Destination Marker */}
                <Marker position={destCoords} icon={destIcon}>
                    <Popup>
                        <div className='text-sm'>
                            <p className='font-semibold text-red-600'>
                                🎯 Destination
                            </p>
                            <p>{destination}</p>
                        </div>
                    </Popup>
                </Marker>

                {/* Current Location Marker (if in transit) */}
                {currentCoords && status === 'IN_TRANSIT' && (
                    <Marker position={currentCoords} icon={currentIcon}>
                        <Popup>
                            <div className='text-sm'>
                                <p className='font-semibold text-blue-600'>
                                    🚛 Current Location
                                </p>
                                <p>{currentLocation}</p>
                            </div>
                        </Popup>
                    </Marker>
                )}

                {/* Route Line */}
                <Polyline
                    positions={routeCoords}
                    pathOptions={{
                        color: status === 'DELIVERED' ? '#10b981' : '#3b82f6',
                        weight: 3,
                        opacity: 0.7,
                        dashArray: status === 'PENDING' ? '10, 10' : undefined,
                    }}
                />
            </MapContainer>

            {/* Map Legend */}
            <div className='absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-3 text-xs z-[1000]'>
                <p className='font-semibold mb-2'>Legend</p>
                <div className='space-y-1'>
                    <div className='flex items-center gap-2'>
                        <span className='w-3 h-3 bg-green-500 rounded-full'></span>
                        <span>Origin</span>
                    </div>
                    <div className='flex items-center gap-2'>
                        <span className='w-3 h-3 bg-red-500 rounded-full'></span>
                        <span>Destination</span>
                    </div>
                    {status === 'IN_TRANSIT' && (
                        <div className='flex items-center gap-2'>
                            <span className='w-3 h-3 bg-blue-500 rounded-full'></span>
                            <span>Current Position</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
