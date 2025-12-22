'use client';

import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import {
    formatCoverageDisplay,
    getCoverageIcon,
    getCoverageScope,
} from '@/utils/coverage-display';
import { CoverageArea } from '@/types/coverage-area';
import {
    Users,
    Mail,
    Phone,
    MapPin,
    FileText,
    Star,
    TrendingUp,
    CheckCircle,
    Truck,
    Ship,
    Plane,
    Train,
    Calendar,
} from 'lucide-react';

interface Carrier {
    id: string;
    companyName: string;
    contactPerson: string;
    email: string;
    phone: string;
    address: string;
    taxNumber: string | null;
    serviceTypes: string[];
    coverage: string[]; // Legacy field (deprecated)
    coverageAreas?: CoverageArea[]; // New hierarchical coverage
    rating: number;
    totalShipments: number;
    onTimeRate: number;
    isVerified: boolean;
    isActive: boolean;
    createdAt: string;
}

interface ViewCarrierDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    carrier: Carrier;
    onSuccess?: () => void; // Callback setelah verification berhasil
    userRole?: string; // User role untuk check admin access
}

const serviceTypeConfig: Record<
    string,
    { label: string; icon: any; color: string }
> = {
    ROAD: { label: 'Road', icon: Truck, color: 'text-blue-600' },
    SEA: { label: 'Sea', icon: Ship, color: 'text-cyan-600' },
    AIR: { label: 'Air', icon: Plane, color: 'text-purple-600' },
    RAIL: { label: 'Rail', icon: Train, color: 'text-orange-600' },
};

export default function ViewCarrierDetailsModal({
    isOpen,
    onClose,
    carrier,
    onSuccess,
    userRole = 'USER',
}: ViewCarrierDetailsModalProps) {
    const [isVerifying, setIsVerifying] = useState(false);
    const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

    const handleToggleVerification = async () => {
        if (isVerifying) return;

        setIsVerifying(true);
        try {
            const response = await fetch(
                `${API_BASE_URL}/carriers/${carrier.id}/verify`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        isVerified: !carrier.isVerified,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error('Failed to update verification status');
            }

            // Success - close modal and refresh
            if (onSuccess) {
                onSuccess();
            }
            onClose();
        } catch (error) {
            console.error('Error toggling verification:', error);
            alert('Failed to update verification status. Please try again.');
        } finally {
            setIsVerifying(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title='Carrier Details'
            size='lg'
        >
            <div className='space-y-6'>
                {/* Header */}
                <div className='flex items-start justify-between pb-4 border-b border-gray-200'>
                    <div>
                        <h2 className='text-2xl font-bold text-gray-900'>
                            {carrier.companyName}
                        </h2>
                        <p className='text-gray-600 mt-1'>
                            {carrier.contactPerson}
                        </p>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <Badge
                            variant={carrier.isActive ? 'success' : 'danger'}
                        >
                            {carrier.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        {carrier.isVerified && (
                            <Badge variant='info'>
                                <CheckCircle className='h-3 w-3 mr-1' />
                                Verified
                            </Badge>
                        )}
                    </div>
                </div>

                {/* Admin Verification Control */}
                {userRole === 'ADMIN' && (
                    <div className='p-4 bg-yellow-50 border border-yellow-200 rounded-lg'>
                        <div className='flex items-start justify-between'>
                            <div>
                                <h4 className='font-semibold text-gray-900 flex items-center gap-2'>
                                    <CheckCircle className='h-5 w-5 text-yellow-600' />
                                    Verification Status
                                </h4>
                                <p className='text-sm text-gray-600 mt-1'>
                                    {carrier.isVerified
                                        ? 'This carrier has been verified and approved for operations.'
                                        : 'This carrier is pending verification. Review documents and approve.'}
                                </p>
                            </div>
                            <Button
                                onClick={handleToggleVerification}
                                disabled={isVerifying}
                                variant={
                                    carrier.isVerified ? 'outline' : 'primary'
                                }
                                size='sm'
                            >
                                {isVerifying ? (
                                    'Processing...'
                                ) : carrier.isVerified ? (
                                    <>Revoke Verification</>
                                ) : (
                                    <>Mark as Verified</>
                                )}
                            </Button>
                        </div>
                    </div>
                )}

                {/* Contact Information */}
                <div className='space-y-4'>
                    <h3 className='text-lg font-semibold text-gray-900 flex items-center gap-2'>
                        <Users className='h-5 w-5 text-blue-600' />
                        Contact Information
                    </h3>
                    <div className='grid grid-cols-2 gap-4'>
                        <div className='flex items-start gap-3'>
                            <Mail className='h-5 w-5 text-gray-400 mt-0.5' />
                            <div>
                                <p className='text-sm text-gray-600'>Email</p>
                                <p className='font-medium text-gray-900'>
                                    {carrier.email}
                                </p>
                            </div>
                        </div>
                        <div className='flex items-start gap-3'>
                            <Phone className='h-5 w-5 text-gray-400 mt-0.5' />
                            <div>
                                <p className='text-sm text-gray-600'>Phone</p>
                                <p className='font-medium text-gray-900'>
                                    {carrier.phone}
                                </p>
                            </div>
                        </div>
                        <div className='flex items-start gap-3 col-span-2'>
                            <MapPin className='h-5 w-5 text-gray-400 mt-0.5' />
                            <div>
                                <p className='text-sm text-gray-600'>Address</p>
                                <p className='font-medium text-gray-900'>
                                    {carrier.address}
                                </p>
                            </div>
                        </div>
                        {carrier.taxNumber && (
                            <div className='flex items-start gap-3 col-span-2'>
                                <FileText className='h-5 w-5 text-gray-400 mt-0.5' />
                                <div>
                                    <p className='text-sm text-gray-600'>
                                        Tax Number (NPWP)
                                    </p>
                                    <p className='font-medium text-gray-900'>
                                        {carrier.taxNumber}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Service Types */}
                <div className='space-y-4'>
                    <h3 className='text-lg font-semibold text-gray-900'>
                        Service Types
                    </h3>
                    <div className='flex flex-wrap gap-2'>
                        {carrier.serviceTypes.map((type) => {
                            const config =
                                serviceTypeConfig[type] ||
                                serviceTypeConfig.ROAD;
                            const Icon = config.icon;
                            return (
                                <span
                                    key={type}
                                    className='inline-flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg'
                                >
                                    <Icon
                                        className={`h-5 w-5 ${config.color}`}
                                    />
                                    <span className='font-medium text-gray-900'>
                                        {config.label}
                                    </span>
                                </span>
                            );
                        })}
                    </div>
                </div>

                {/* Coverage Areas */}
                <div className='space-y-4'>
                    <h3 className='text-lg font-semibold text-gray-900'>
                        Coverage Areas
                    </h3>
                    {carrier.coverageAreas &&
                    carrier.coverageAreas.length > 0 ? (
                        <div>
                            <div className='flex flex-wrap gap-2 mb-3'>
                                {carrier.coverageAreas.map((area) => (
                                    <span
                                        key={area.id}
                                        className='inline-flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium'
                                    >
                                        <span>
                                            {getCoverageIcon(area.type)}
                                        </span>
                                        <span>{area.name}</span>
                                        {(area.type === 'COUNTRY' ||
                                            area.type === 'REGION') && (
                                            <span className='text-xs text-blue-600 font-normal'>
                                                {area.type === 'COUNTRY'
                                                    ? '(Nationwide)'
                                                    : '(Regional)'}
                                            </span>
                                        )}
                                    </span>
                                ))}
                            </div>
                            <div className='p-3 bg-gray-50 rounded-lg'>
                                <div className='flex items-center justify-between text-sm'>
                                    <span className='text-gray-600'>
                                        Coverage Scope:
                                    </span>
                                    <span className='font-medium text-gray-900'>
                                        {getCoverageScope(
                                            carrier.coverageAreas
                                        )}
                                    </span>
                                </div>
                                <div className='flex items-center justify-between text-sm mt-2'>
                                    <span className='text-gray-600'>
                                        Summary:
                                    </span>
                                    <span className='font-medium text-gray-900'>
                                        {formatCoverageDisplay(
                                            carrier.coverageAreas,
                                            3
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ) : carrier.coverage && carrier.coverage.length > 0 ? (
                        <div className='flex flex-wrap gap-2'>
                            {carrier.coverage.map((city, index) => (
                                <span
                                    key={index}
                                    className='inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium'
                                >
                                    {city}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className='text-gray-500 text-sm'>
                            No coverage areas specified
                        </p>
                    )}
                </div>

                {/* Performance Metrics */}
                <div className='space-y-4'>
                    <h3 className='text-lg font-semibold text-gray-900'>
                        Performance Metrics
                    </h3>
                    <div className='grid grid-cols-3 gap-4'>
                        <div className='bg-yellow-50 p-4 rounded-lg'>
                            <div className='flex items-center gap-2 mb-2'>
                                <Star className='h-5 w-5 text-yellow-600 fill-yellow-600' />
                                <span className='text-sm text-gray-600'>
                                    Rating
                                </span>
                            </div>
                            <p className='text-2xl font-bold text-gray-900'>
                                {carrier.rating.toFixed(1)}
                                <span className='text-sm text-gray-600 font-normal'>
                                    /5.0
                                </span>
                            </p>
                        </div>
                        <div className='bg-green-50 p-4 rounded-lg'>
                            <div className='flex items-center gap-2 mb-2'>
                                <TrendingUp className='h-5 w-5 text-green-600' />
                                <span className='text-sm text-gray-600'>
                                    On-Time Rate
                                </span>
                            </div>
                            <p className='text-2xl font-bold text-gray-900'>
                                {carrier.onTimeRate.toFixed(1)}%
                            </p>
                        </div>
                        <div className='bg-blue-50 p-4 rounded-lg'>
                            <div className='flex items-center gap-2 mb-2'>
                                <Truck className='h-5 w-5 text-blue-600' />
                                <span className='text-sm text-gray-600'>
                                    Total Shipments
                                </span>
                            </div>
                            <p className='text-2xl font-bold text-gray-900'>
                                {carrier.totalShipments}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Meta Information */}
                <div className='space-y-4 pt-4 border-t border-gray-200'>
                    <div className='flex items-center gap-3 text-sm text-gray-600'>
                        <Calendar className='h-4 w-4' />
                        <span>
                            Created on{' '}
                            {new Date(carrier.createdAt).toLocaleDateString(
                                'en-US',
                                {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                }
                            )}
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className='flex justify-end gap-3 pt-4 border-t border-gray-200'>
                    <Button variant='outline' onClick={onClose}>
                        Close
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
