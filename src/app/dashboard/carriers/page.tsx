'use client';

import React, { useState, useMemo, useEffect } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import StatCard from '@/components/ui/StatCard';
import CreateCarrierModal from '@/components/carriers/CreateCarrierModal';
import EditCarrierModal from '@/components/carriers/EditCarrierModal';
import ViewCarrierDetailsModal from '@/components/carriers/ViewCarrierDetailsModal';
import DeleteCarrierModal from '@/components/carriers/DeleteCarrierModal';
import RatesModal from '@/components/carriers/RatesModal';
import RateCalculator from '@/components/carriers/RateCalculator';
import {
    formatCoverageDisplay,
    getCoverageScope,
} from '@/utils/coverage-display';
import { CoverageArea } from '@/types/coverage-area';
import {
    Plus,
    Download,
    Filter,
    Search,
    Users,
    Star,
    TrendingUp,
    CheckCircle,
    XCircle,
    Eye,
    Edit,
    Trash2,
    Tag,
    RefreshCw,
    Loader2,
    Truck,
    Ship,
    Plane,
    Train,
    Package,
    Calculator,
} from 'lucide-react';

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

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
    updatedAt: string;
}

const serviceTypeConfig = {
    ROAD: {
        label: 'Road',
        icon: Truck,
        color: 'text-blue-600',
        bg: 'bg-blue-50',
    },
    SEA: { label: 'Sea', icon: Ship, color: 'text-cyan-600', bg: 'bg-cyan-50' },
    AIR: {
        label: 'Air',
        icon: Plane,
        color: 'text-purple-600',
        bg: 'bg-purple-50',
    },
    RAIL: {
        label: 'Rail',
        icon: Train,
        color: 'text-orange-600',
        bg: 'bg-orange-50',
    },
};

export default function CarriersPage() {
    const [carriers, setCarriers] = useState<Carrier[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [serviceTypeFilter, setServiceTypeFilter] = useState<string>('all');

    // Modal states
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isRatesModalOpen, setIsRatesModalOpen] = useState(false);
    const [showCalculator, setShowCalculator] = useState(false);
    const [selectedCarrier, setSelectedCarrier] = useState<Carrier | null>(
        null
    );

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const fetchCarriers = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/carriers`);
            if (!response.ok) throw new Error('Failed to fetch carriers');
            const data = await response.json();
            setCarriers(data);
            setError(null);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : 'Failed to load carriers'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCarriers();
    }, []);

    // Filtered and searched carriers
    const filteredCarriers = useMemo(() => {
        return carriers.filter((carrier) => {
            const matchesSearch =
                carrier.companyName
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                carrier.contactPerson
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                carrier.email.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus =
                statusFilter === 'all' ||
                (statusFilter === 'active' && carrier.isActive) ||
                (statusFilter === 'inactive' && !carrier.isActive) ||
                (statusFilter === 'verified' && carrier.isVerified);

            const matchesServiceType =
                serviceTypeFilter === 'all' ||
                carrier.serviceTypes.includes(serviceTypeFilter);

            return matchesSearch && matchesStatus && matchesServiceType;
        });
    }, [carriers, searchTerm, statusFilter, serviceTypeFilter]);

    // Paginated carriers
    const paginatedCarriers = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredCarriers.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredCarriers, currentPage]);

    const totalPages = Math.ceil(filteredCarriers.length / itemsPerPage);

    // Statistics
    const stats = useMemo(() => {
        const active = carriers.filter((c) => c.isActive).length;
        const verified = carriers.filter((c) => c.isVerified).length;
        const avgRating =
            carriers.length > 0
                ? carriers.reduce((sum, c) => sum + c.rating, 0) /
                  carriers.length
                : 0;
        const avgOnTime =
            carriers.length > 0
                ? carriers.reduce((sum, c) => sum + c.onTimeRate, 0) /
                  carriers.length
                : 0;

        return { active, verified, avgRating, avgOnTime };
    }, [carriers]);

    const handleViewDetails = (carrier: Carrier) => {
        setSelectedCarrier(carrier);
        setIsViewModalOpen(true);
    };

    const handleEdit = (carrier: Carrier) => {
        setSelectedCarrier(carrier);
        setIsEditModalOpen(true);
    };

    const handleDelete = (carrier: Carrier) => {
        setSelectedCarrier(carrier);
        setIsDeleteModalOpen(true);
    };

    const handleViewRates = (carrier: Carrier) => {
        setSelectedCarrier(carrier);
        setIsRatesModalOpen(true);
    };

    const handleExport = () => {
        const csv = [
            [
                'Company',
                'Contact',
                'Email',
                'Phone',
                'Services',
                'Rating',
                'On-Time Rate',
                'Status',
            ],
            ...filteredCarriers.map((c) => [
                c.companyName,
                c.contactPerson,
                c.email,
                c.phone,
                c.serviceTypes.join('; '),
                c.rating.toFixed(1),
                c.onTimeRate.toFixed(1) + '%',
                c.isActive ? 'Active' : 'Inactive',
            ]),
        ]
            .map((row) => row.join(','))
            .join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `carriers-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    if (loading) {
        return (
            <div className='flex items-center justify-center h-[calc(100vh-200px)]'>
                <div className='text-center'>
                    <Loader2 className='h-12 w-12 animate-spin text-blue-600 mx-auto mb-4' />
                    <p className='text-gray-600'>Loading carriers...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className='flex items-center justify-center h-[calc(100vh-200px)]'>
                <div className='text-center'>
                    <XCircle className='h-12 w-12 text-red-500 mx-auto mb-4' />
                    <p className='text-red-600 mb-4'>{error}</p>
                    <Button onClick={fetchCarriers} variant='primary'>
                        <RefreshCw className='h-4 w-4 mr-2' />
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className='space-y-6'>
            {/* Page Header */}
            <PageHeader
                title='Carriers & Vendors'
                subtitle='Manage carrier partnerships and evaluate performance'
                icon={Users}
                actions={
                    <div className='flex gap-3'>
                        <Button
                            onClick={() => setShowCalculator(!showCalculator)}
                            variant={showCalculator ? 'primary' : 'outline'}
                        >
                            <Calculator className='h-4 w-4 mr-2' />
                            {showCalculator
                                ? 'Hide Calculator'
                                : 'Rate Calculator'}
                        </Button>
                        <Button onClick={handleExport} variant='outline'>
                            <Download className='h-4 w-4 mr-2' />
                            Export
                        </Button>
                        <Button onClick={fetchCarriers} variant='outline'>
                            <RefreshCw className='h-4 w-4 mr-2' />
                            Refresh
                        </Button>
                        <Button
                            onClick={() => setIsCreateModalOpen(true)}
                            variant='primary'
                        >
                            <Plus className='h-4 w-4 mr-2' />
                            Add Carrier
                        </Button>
                    </div>
                }
            />

            {/* Rate Calculator Section */}
            {showCalculator && (
                <div className='animate-fadeIn'>
                    <RateCalculator />
                </div>
            )}

            {/* Stats Cards */}
            <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
                <StatCard
                    title='Total Carriers'
                    value={carriers.length}
                    icon={Users}
                    color='blue'
                />
                <StatCard
                    title='Active'
                    value={stats.active}
                    icon={CheckCircle}
                    color='green'
                />
                <StatCard
                    title='Verified'
                    value={stats.verified}
                    icon={Star}
                    color='yellow'
                />
                <StatCard
                    title='Avg Rating'
                    value={`${stats.avgRating.toFixed(1)} / 5.0`}
                    icon={Star}
                    color='purple'
                />
            </div>

            {/* Filters and Search */}
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-4'>
                <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                    {/* Search */}
                    <div className='md:col-span-2'>
                        <div className='relative'>
                            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400' />
                            <input
                                type='text'
                                placeholder='Search carriers, contacts, email...'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                            />
                        </div>
                    </div>

                    {/* Status Filter */}
                    <div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        >
                            <option value='all'>All Status</option>
                            <option value='active'>Active</option>
                            <option value='inactive'>Inactive</option>
                            <option value='verified'>Verified Only</option>
                        </select>
                    </div>

                    {/* Service Type Filter */}
                    <div>
                        <select
                            value={serviceTypeFilter}
                            onChange={(e) =>
                                setServiceTypeFilter(e.target.value)
                            }
                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        >
                            <option value='all'>All Services</option>
                            <option value='ROAD'>Road</option>
                            <option value='SEA'>Sea</option>
                            <option value='AIR'>Air</option>
                            <option value='RAIL'>Rail</option>
                        </select>
                    </div>
                </div>

                {/* Active Filters */}
                {(searchTerm ||
                    statusFilter !== 'all' ||
                    serviceTypeFilter !== 'all') && (
                    <div className='flex items-center gap-2 mt-3 pt-3 border-t border-gray-200'>
                        <span className='text-sm text-gray-600'>
                            Active filters:
                        </span>
                        {searchTerm && (
                            <Badge variant='default'>
                                Search: {searchTerm}
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className='ml-2 hover:text-gray-700'
                                >
                                    ×
                                </button>
                            </Badge>
                        )}
                        {statusFilter !== 'all' && (
                            <Badge variant='info'>
                                Status: {statusFilter}
                                <button
                                    onClick={() => setStatusFilter('all')}
                                    className='ml-2 hover:text-blue-700'
                                >
                                    ×
                                </button>
                            </Badge>
                        )}
                        {serviceTypeFilter !== 'all' && (
                            <Badge variant='info'>
                                Service: {serviceTypeFilter}
                                <button
                                    onClick={() => setServiceTypeFilter('all')}
                                    className='ml-2 hover:text-blue-700'
                                >
                                    ×
                                </button>
                            </Badge>
                        )}
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setStatusFilter('all');
                                setServiceTypeFilter('all');
                            }}
                            className='text-sm text-blue-600 hover:text-blue-700 ml-2'
                        >
                            Clear all
                        </button>
                    </div>
                )}
            </div>

            {/* Carriers Table */}
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
                <div className='overflow-x-auto'>
                    <table className='w-full'>
                        <thead className='bg-gray-50 border-b border-gray-200'>
                            <tr>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    Company
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    Services
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    Coverage
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    Rating
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    On-Time Rate
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    Shipments
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    Status
                                </th>
                                <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className='bg-white divide-y divide-gray-200'>
                            {paginatedCarriers.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className='px-6 py-12 text-center'
                                    >
                                        <Package className='h-12 w-12 text-gray-400 mx-auto mb-4' />
                                        <p className='text-gray-500'>
                                            No carriers found
                                        </p>
                                        <p className='text-sm text-gray-400 mt-1'>
                                            Try adjusting your filters or add a
                                            new carrier
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                paginatedCarriers.map((carrier) => (
                                    <tr
                                        key={carrier.id}
                                        className='hover:bg-gray-50 transition-colors'
                                    >
                                        <td className='px-6 py-4'>
                                            <div>
                                                <div className='font-medium text-gray-900'>
                                                    {carrier.companyName}
                                                </div>
                                                <div className='text-sm text-gray-500'>
                                                    {carrier.contactPerson}
                                                </div>
                                                <div className='text-xs text-gray-400'>
                                                    {carrier.email}
                                                </div>
                                            </div>
                                        </td>
                                        <td className='px-6 py-4'>
                                            <div className='flex flex-wrap gap-1'>
                                                {carrier.serviceTypes.map(
                                                    (type) => {
                                                        const config =
                                                            serviceTypeConfig[
                                                                type as keyof typeof serviceTypeConfig
                                                            ];
                                                        const Icon =
                                                            config?.icon ||
                                                            Truck;
                                                        return (
                                                            <span
                                                                key={type}
                                                                className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${config?.bg} ${config?.color}`}
                                                            >
                                                                <Icon className='h-3 w-3' />
                                                                {type}
                                                            </span>
                                                        );
                                                    }
                                                )}
                                            </div>
                                        </td>
                                        <td className='px-6 py-4'>
                                            <div className='text-sm'>
                                                <div className='font-medium text-gray-900'>
                                                    {carrier.coverageAreas &&
                                                    carrier.coverageAreas
                                                        .length > 0
                                                        ? formatCoverageDisplay(
                                                              carrier.coverageAreas,
                                                              2
                                                          )
                                                        : carrier.coverage &&
                                                          carrier.coverage
                                                              .length > 0
                                                        ? carrier.coverage.join(
                                                              ', '
                                                          )
                                                        : 'No coverage'}
                                                </div>
                                                {carrier.coverageAreas &&
                                                    carrier.coverageAreas
                                                        .length > 0 && (
                                                        <div className='text-xs text-gray-500 mt-0.5'>
                                                            {getCoverageScope(
                                                                carrier.coverageAreas
                                                            )}
                                                        </div>
                                                    )}
                                            </div>
                                        </td>
                                        <td className='px-6 py-4'>
                                            <div className='flex items-center gap-1'>
                                                <Star className='h-4 w-4 text-yellow-500 fill-yellow-500' />
                                                <span className='font-medium text-gray-900'>
                                                    {carrier.rating.toFixed(1)}
                                                </span>
                                                <span className='text-sm text-gray-500'>
                                                    /5
                                                </span>
                                            </div>
                                        </td>
                                        <td className='px-6 py-4'>
                                            <div className='flex items-center gap-2'>
                                                <div className='flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]'>
                                                    <div
                                                        className={`h-2 rounded-full ${
                                                            carrier.onTimeRate >=
                                                            95
                                                                ? 'bg-green-500'
                                                                : carrier.onTimeRate >=
                                                                  85
                                                                ? 'bg-yellow-500'
                                                                : 'bg-red-500'
                                                        }`}
                                                        style={{
                                                            width: `${carrier.onTimeRate}%`,
                                                        }}
                                                    />
                                                </div>
                                                <span className='text-sm font-medium text-gray-900'>
                                                    {carrier.onTimeRate.toFixed(
                                                        0
                                                    )}
                                                    %
                                                </span>
                                            </div>
                                        </td>
                                        <td className='px-6 py-4'>
                                            <span className='font-medium text-gray-900'>
                                                {carrier.totalShipments}
                                            </span>
                                        </td>
                                        <td className='px-6 py-4'>
                                            <div className='flex flex-col gap-1'>
                                                <Badge
                                                    variant={
                                                        carrier.isActive
                                                            ? 'success'
                                                            : 'danger'
                                                    }
                                                >
                                                    {carrier.isActive
                                                        ? 'Active'
                                                        : 'Inactive'}
                                                </Badge>
                                                {carrier.isVerified && (
                                                    <Badge variant='info'>
                                                        <CheckCircle className='h-3 w-3 mr-1' />
                                                        Verified
                                                    </Badge>
                                                )}
                                            </div>
                                        </td>
                                        <td className='px-6 py-4'>
                                            <div className='flex items-center justify-end gap-2'>
                                                <Button
                                                    variant='ghost'
                                                    size='sm'
                                                    onClick={() =>
                                                        handleViewDetails(
                                                            carrier
                                                        )
                                                    }
                                                >
                                                    <Eye className='h-4 w-4' />
                                                </Button>
                                                <Button
                                                    variant='ghost'
                                                    size='sm'
                                                    onClick={() =>
                                                        handleViewRates(carrier)
                                                    }
                                                >
                                                    <Tag className='h-4 w-4' />
                                                </Button>
                                                <Button
                                                    variant='ghost'
                                                    size='sm'
                                                    onClick={() =>
                                                        handleEdit(carrier)
                                                    }
                                                >
                                                    <Edit className='h-4 w-4' />
                                                </Button>
                                                <Button
                                                    variant='ghost'
                                                    size='sm'
                                                    onClick={() =>
                                                        handleDelete(carrier)
                                                    }
                                                >
                                                    <Trash2 className='h-4 w-4 text-red-600' />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className='bg-gray-50 px-6 py-4 border-t border-gray-200'>
                        <div className='flex items-center justify-between'>
                            <div className='text-sm text-gray-700'>
                                Showing{' '}
                                <span className='font-medium'>
                                    {(currentPage - 1) * itemsPerPage + 1}
                                </span>{' '}
                                to{' '}
                                <span className='font-medium'>
                                    {Math.min(
                                        currentPage * itemsPerPage,
                                        filteredCarriers.length
                                    )}
                                </span>{' '}
                                of{' '}
                                <span className='font-medium'>
                                    {filteredCarriers.length}
                                </span>{' '}
                                results
                            </div>
                            <div className='flex gap-2'>
                                <Button
                                    variant='outline'
                                    size='sm'
                                    onClick={() =>
                                        setCurrentPage((p) =>
                                            Math.max(1, p - 1)
                                        )
                                    }
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </Button>
                                {Array.from(
                                    { length: totalPages },
                                    (_, i) => i + 1
                                ).map((page) => (
                                    <Button
                                        key={page}
                                        variant={
                                            currentPage === page
                                                ? 'primary'
                                                : 'outline'
                                        }
                                        size='sm'
                                        onClick={() => setCurrentPage(page)}
                                    >
                                        {page}
                                    </Button>
                                ))}
                                <Button
                                    variant='outline'
                                    size='sm'
                                    onClick={() =>
                                        setCurrentPage((p) =>
                                            Math.min(totalPages, p + 1)
                                        )
                                    }
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            <CreateCarrierModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={() => {
                    setIsCreateModalOpen(false);
                    fetchCarriers();
                }}
            />

            {selectedCarrier && (
                <>
                    <EditCarrierModal
                        isOpen={isEditModalOpen}
                        onClose={() => {
                            setIsEditModalOpen(false);
                            setSelectedCarrier(null);
                        }}
                        onSuccess={() => {
                            setIsEditModalOpen(false);
                            setSelectedCarrier(null);
                            fetchCarriers();
                        }}
                        carrier={selectedCarrier}
                    />

                    <ViewCarrierDetailsModal
                        isOpen={isViewModalOpen}
                        onClose={() => {
                            setIsViewModalOpen(false);
                            setSelectedCarrier(null);
                        }}
                        onSuccess={() => {
                            setIsViewModalOpen(false);
                            setSelectedCarrier(null);
                            fetchCarriers(); // Refresh data setelah verification
                        }}
                        carrier={selectedCarrier}
                        userRole='ADMIN' // TODO: Get from actual user session/auth
                    />

                    <DeleteCarrierModal
                        isOpen={isDeleteModalOpen}
                        onClose={() => {
                            setIsDeleteModalOpen(false);
                            setSelectedCarrier(null);
                        }}
                        onSuccess={() => {
                            setIsDeleteModalOpen(false);
                            setSelectedCarrier(null);
                            fetchCarriers();
                        }}
                        carrier={selectedCarrier}
                    />

                    <RatesModal
                        isOpen={isRatesModalOpen}
                        onClose={() => {
                            setIsRatesModalOpen(false);
                            setSelectedCarrier(null);
                        }}
                        carrier={selectedCarrier}
                    />
                </>
            )}
        </div>
    );
}
