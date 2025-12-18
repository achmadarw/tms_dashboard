'use client';

import React, { useState, useMemo } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import StatCard from '@/components/ui/StatCard';
import { useShipments } from '@/hooks/useShipments';
import {
    useTransformedShipments,
    ShipmentWithDisplayData,
} from '@/utils/shipmentAdapter';
import CreateShipmentModal from '@/components/shipments/CreateShipmentModal';
import UpdateStatusModal from '@/components/shipments/UpdateStatusModal';
import ViewDetailsModal from '@/components/shipments/ViewDetailsModal';
import DocumentsModal from '@/components/shipments/DocumentsModal';
import TrackLocationModal from '@/components/shipments/TrackLocationModal';
import DeleteShipmentModal from '@/components/shipments/DeleteShipmentModal';
import {
    Plus,
    Download,
    Filter,
    Search,
    Package,
    Truck,
    MapPin,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Eye,
    Edit,
    Navigation,
    FileText,
    User,
    Calendar,
    RefreshCw,
    Loader2,
    Trash2,
} from 'lucide-react';

const statusConfig = {
    PENDING: {
        label: 'Pending',
        variant: 'warning' as const,
        icon: Clock,
        color: 'text-yellow-600',
    },
    ASSIGNED: {
        label: 'Assigned',
        variant: 'info' as const,
        icon: Package,
        color: 'text-indigo-600',
    },
    PICKED_UP: {
        label: 'Picked Up',
        variant: 'info' as const,
        icon: Package,
        color: 'text-blue-600',
    },
    IN_TRANSIT: {
        label: 'In Transit',
        variant: 'info' as const,
        icon: Truck,
        color: 'text-purple-600',
    },
    OUT_FOR_DELIVERY: {
        label: 'Out for Delivery',
        variant: 'info' as const,
        icon: Truck,
        color: 'text-orange-600',
    },
    DELIVERED: {
        label: 'Delivered',
        variant: 'success' as const,
        icon: CheckCircle,
        color: 'text-green-600',
    },
    FAILED: {
        label: 'Failed',
        variant: 'danger' as const,
        icon: XCircle,
        color: 'text-red-600',
    },
    CANCELLED: {
        label: 'Cancelled',
        variant: 'danger' as const,
        icon: XCircle,
        color: 'text-gray-600',
    },
};

// Helper function to calculate progress based on status
function calculateProgress(
    status: string,
    pickupDate: string,
    deliveryDate: string
): number {
    if (status === 'DELIVERED') return 100;
    if (status === 'PENDING' || status === 'CANCELLED') return 0;

    const now = new Date().getTime();
    const pickup = new Date(pickupDate).getTime();
    const delivery = new Date(deliveryDate).getTime();

    if (now < pickup) return 0;
    if (now > delivery) return 100;

    const progress = ((now - pickup) / (delivery - pickup)) * 100;
    return Math.round(Math.min(Math.max(progress, 0), 100));
}

// Helper function to format distance
function formatDistance(distance: number): string {
    return distance >= 1
        ? `${distance} km`
        : `${(distance * 1000).toFixed(0)} m`;
}

// Helper function to format date
function formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    try {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    } catch {
        return 'Invalid Date';
    }
}

export default function ShipmentsPage() {
    const { shipments: rawShipments, loading, error, refetch } = useShipments();
    const shipments = useTransformedShipments(rawShipments);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    // Modal states
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isDocumentsModalOpen, setIsDocumentsModalOpen] = useState(false);
    const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedShipment, setSelectedShipment] =
        useState<ShipmentWithDisplayData | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const filteredShipments = useMemo(() => {
        return shipments.filter((shipment) => {
            const matchesSearch =
                (shipment.shipmentNumber || '')
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                (shipment.order?.orderNumber || '')
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                (shipment.order?.customer || '')
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                (shipment.origin || '')
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                (shipment.destination || '')
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());

            const matchesStatus =
                statusFilter === 'all' || shipment.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [shipments, searchTerm, statusFilter]);

    const stats = useMemo(() => {
        return {
            total: shipments.length,
            pending: shipments.filter((s) => s.status === 'PENDING').length,
            inProgress: shipments.filter(
                (s) =>
                    s.status === 'ASSIGNED' ||
                    s.status === 'PICKED_UP' ||
                    s.status === 'IN_TRANSIT' ||
                    s.status === 'OUT_FOR_DELIVERY'
            ).length,
            delivered: shipments.filter((s) => s.status === 'DELIVERED').length,
        };
    }, [shipments]);

    // Modal handlers
    const handleViewDetails = (shipment: ShipmentWithDisplayData) => {
        setSelectedShipment(shipment);
        setIsViewModalOpen(true);
    };

    const handleUpdateStatus = (shipment: ShipmentWithDisplayData) => {
        setSelectedShipment(shipment);
        setIsUpdateModalOpen(true);
    };

    const handleTrackLocation = (shipment: ShipmentWithDisplayData) => {
        setSelectedShipment(shipment);
        setIsTrackModalOpen(true);
    };

    const handleDocuments = (shipment: ShipmentWithDisplayData) => {
        setSelectedShipment(shipment);
        setIsDocumentsModalOpen(true);
    };

    const handleDelete = (shipment: ShipmentWithDisplayData) => {
        setSelectedShipment(shipment);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedShipment) return;

        setIsDeleting(true);
        try {
            const response = await fetch(
                `/api/shipments/${selectedShipment.id}`,
                {
                    method: 'DELETE',
                }
            );

            if (!response.ok) {
                throw new Error('Failed to delete shipment');
            }

            // Refresh data
            await refetch();

            // Close modal
            setIsDeleteModalOpen(false);
            setSelectedShipment(null);
        } catch (error) {
            console.error('Error deleting shipment:', error);
            alert('Failed to delete shipment. Please try again.');
        } finally {
            setIsDeleting(false);
        }
    };

    // Pagination calculations
    const totalPages = Math.ceil(filteredShipments.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedShipments = filteredShipments.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleItemsPerPageChange = (value: number) => {
        setItemsPerPage(value);
        setCurrentPage(1);
    };

    // Generate page numbers
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxPagesToShow = 5;

        if (totalPages <= maxPagesToShow) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push('...');
                pages.push(currentPage - 1);
                pages.push(currentPage);
                pages.push(currentPage + 1);
                pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    const handleExport = () => {
        // Export to CSV
        const headers = [
            'Shipment Number',
            'Order',
            'Customer',
            'Origin',
            'Destination',
            'Status',
            'Driver',
            'Vehicle',
            'Pickup Date',
            'Delivery Date',
            'Cost',
        ];
        const rows = filteredShipments.map((s) => [
            s.shipmentNumber,
            s.order?.orderNumber || 'N/A',
            s.order?.customer || 'Unknown',
            s.origin,
            s.destination,
            s.status,
            s.driver?.name || 'Unassigned',
            s.vehicle?.plateNumber || 'N/A',
            new Date(s.pickupDate).toLocaleDateString(),
            new Date(s.deliveryDate).toLocaleDateString(),
            `$${s.estimatedCost}`,
        ]);

        const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `shipments-export-${
            new Date().toISOString().split('T')[0]
        }.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    if (error) {
        return (
            <div className='space-y-6'>
                <PageHeader
                    title='Shipments Management'
                    subtitle='Track and manage all shipments in real-time'
                    icon={Truck}
                />
                <div className='bg-white rounded-xl shadow-lg border border-red-200 p-12 text-center'>
                    <AlertCircle className='h-16 w-16 text-red-500 mx-auto mb-4' />
                    <h3 className='text-xl font-semibold text-gray-800 mb-2'>
                        Failed to load shipments
                    </h3>
                    <p className='text-gray-600 mb-6'>{error.message}</p>
                    <Button
                        variant='primary'
                        icon={RefreshCw}
                        onClick={refetch}
                    >
                        Retry
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className='space-y-6'>
            <PageHeader
                title='Shipments Management'
                subtitle='Track and manage all shipments in real-time'
                icon={Truck}
                actions={
                    <>
                        <Button
                            variant='ghost'
                            icon={RefreshCw}
                            onClick={refetch}
                            disabled={loading}
                        >
                            Refresh
                        </Button>
                        <Button
                            variant='primary'
                            icon={Plus}
                            onClick={() => setIsCreateModalOpen(true)}
                        >
                            New Shipment
                        </Button>
                        <Button
                            variant='ghost'
                            icon={Download}
                            onClick={handleExport}
                            disabled={filteredShipments.length === 0}
                        >
                            Export
                        </Button>
                    </>
                }
            />

            {/* Statistics Cards */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                <StatCard
                    title='Total Shipments'
                    value={stats.total}
                    icon={Package}
                    color='purple'
                />
                <StatCard
                    title='Pending'
                    value={stats.pending}
                    icon={Clock}
                    color='yellow'
                />
                <StatCard
                    title='In Progress'
                    value={stats.inProgress}
                    icon={Truck}
                    color='blue'
                />
                <StatCard
                    title='Delivered'
                    value={stats.delivered}
                    icon={CheckCircle}
                    color='green'
                />
            </div>

            {/* Search and Filter */}
            <div className='bg-white rounded-xl shadow-md p-6'>
                <div className='flex flex-col md:flex-row gap-4'>
                    <div className='flex-1 relative'>
                        <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400' />
                        <input
                            type='text'
                            placeholder='Search by shipment number, order, customer, origin, or destination...'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className='w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                        />
                    </div>
                    <div className='flex gap-2'>
                        <div className='relative'>
                            <Filter className='absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400' />
                            <select
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(e.target.value)
                                }
                                className='pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white'
                            >
                                <option value='all'>All Status</option>
                                <option value='PENDING'>Pending</option>
                                <option value='ASSIGNED'>Assigned</option>
                                <option value='PICKED_UP'>Picked Up</option>
                                <option value='IN_TRANSIT'>In Transit</option>
                                <option value='OUT_FOR_DELIVERY'>
                                    Out for Delivery
                                </option>
                                <option value='DELIVERED'>Delivered</option>
                                <option value='FAILED'>Failed</option>
                                <option value='CANCELLED'>Cancelled</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Shipments Table */}
            <div className='bg-white rounded-xl shadow-md overflow-hidden'>
                {loading ? (
                    <div className='flex items-center justify-center h-96'>
                        <div className='text-center'>
                            <Loader2 className='h-12 w-12 text-purple-600 animate-spin mx-auto mb-4' />
                            <p className='text-gray-600'>
                                Loading shipments...
                            </p>
                        </div>
                    </div>
                ) : filteredShipments.length === 0 ? (
                    <div className='text-center py-12'>
                        <Package className='h-16 w-16 text-gray-400 mx-auto mb-4' />
                        <h3 className='text-lg font-semibold text-gray-800 mb-2'>
                            No shipments found
                        </h3>
                        <p className='text-gray-600 mb-4'>
                            {searchTerm || statusFilter !== 'all'
                                ? 'Try adjusting your search or filter'
                                : 'Create your first shipment to get started'}
                        </p>
                    </div>
                ) : (
                    <div className='overflow-x-auto'>
                        <table className='w-full'>
                            <thead className='bg-gradient-to-r from-purple-50 to-indigo-50'>
                                <tr>
                                    <th className='px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
                                        Shipment
                                    </th>
                                    <th className='px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
                                        Order
                                    </th>
                                    <th className='px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
                                        Route
                                    </th>
                                    <th className='px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
                                        Schedule
                                    </th>
                                    <th className='px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
                                        Status
                                    </th>
                                    <th className='px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
                                        Progress
                                    </th>
                                    <th className='px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
                                        Assignment
                                    </th>
                                    <th className='px-4 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider'>
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-gray-200'>
                                {paginatedShipments.map((shipment) => {
                                    const config =
                                        statusConfig[
                                            shipment.status as keyof typeof statusConfig
                                        ];
                                    const StatusIcon = config?.icon || Clock;
                                    const progress = calculateProgress(
                                        shipment.status,
                                        shipment.pickupDate,
                                        shipment.deliveryDate
                                    );

                                    return (
                                        <tr
                                            key={shipment.id}
                                            className='hover:bg-gray-50 transition-colors'
                                        >
                                            <td className='px-4 py-4'>
                                                <div>
                                                    <div className='font-semibold text-gray-900'>
                                                        {
                                                            shipment.shipmentNumber
                                                        }
                                                    </div>
                                                    <div className='text-sm text-gray-500'>
                                                        Cost: $
                                                        {shipment.estimatedCost}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='px-4 py-4'>
                                                <div>
                                                    <div className='font-medium text-gray-900'>
                                                        {shipment.order
                                                            ?.orderNumber ||
                                                            'N/A'}
                                                    </div>
                                                    <div className='text-sm text-gray-500 flex items-center gap-1'>
                                                        <User className='h-3 w-3' />
                                                        {shipment.order
                                                            ?.customer ||
                                                            'Unknown'}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='px-4 py-4'>
                                                <div className='space-y-1'>
                                                    <div className='flex items-center gap-1 text-sm'>
                                                        <MapPin className='h-3.5 w-3.5 text-green-600' />
                                                        <span className='font-medium'>
                                                            {shipment.order
                                                                ?.pickupAddress ||
                                                                shipment.origin}
                                                        </span>
                                                    </div>
                                                    <div className='flex items-center gap-1 text-sm'>
                                                        <MapPin className='h-3.5 w-3.5 text-red-600' />
                                                        <span className='font-medium'>
                                                            {shipment.order
                                                                ?.deliveryAddress ||
                                                                shipment.destination}
                                                        </span>
                                                    </div>
                                                    <div className='text-xs text-gray-500'>
                                                        {formatDistance(
                                                            shipment.distance
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='px-4 py-4'>
                                                <div className='space-y-1 text-sm'>
                                                    <div className='flex items-center gap-1'>
                                                        <Calendar className='h-3.5 w-3.5 text-gray-400' />
                                                        <span className='text-gray-600'>
                                                            Pickup:{' '}
                                                        </span>
                                                        <span className='font-medium'>
                                                            {formatDate(
                                                                shipment.pickupDate
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className='flex items-center gap-1'>
                                                        <Calendar className='h-3.5 w-3.5 text-gray-400' />
                                                        <span className='text-gray-600'>
                                                            Delivery:{' '}
                                                        </span>
                                                        <span className='font-medium'>
                                                            {formatDate(
                                                                shipment.deliveryDate
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='px-4 py-4'>
                                                <Badge
                                                    variant={
                                                        config?.variant ||
                                                        'default'
                                                    }
                                                >
                                                    {config?.label ||
                                                        shipment.status}
                                                </Badge>
                                            </td>
                                            <td className='px-4 py-4'>
                                                <div className='space-y-1'>
                                                    <div className='flex items-center justify-between text-xs'>
                                                        <span className='text-gray-600'>
                                                            Progress
                                                        </span>
                                                        <span className='font-semibold text-gray-900'>
                                                            {progress}%
                                                        </span>
                                                    </div>
                                                    <div className='w-full bg-gray-200 rounded-full h-2 overflow-hidden'>
                                                        <div
                                                            className='bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all duration-300'
                                                            style={{
                                                                width: `${progress}%`,
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='px-4 py-4'>
                                                <div className='text-sm'>
                                                    {shipment.driver ? (
                                                        <>
                                                            <div className='font-medium text-gray-900'>
                                                                {
                                                                    shipment
                                                                        .driver
                                                                        .name
                                                                }
                                                            </div>
                                                            <div className='text-gray-500'>
                                                                {shipment
                                                                    .vehicle
                                                                    ?.plateNumber ||
                                                                    'No vehicle'}
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <Badge variant='warning'>
                                                            Unassigned
                                                        </Badge>
                                                    )}
                                                </div>
                                            </td>
                                            <td className='px-4 py-4'>
                                                <div className='flex items-center justify-center gap-2'>
                                                    <button
                                                        onClick={() =>
                                                            handleTrackLocation(
                                                                shipment
                                                            )
                                                        }
                                                        className='p-1.5 text-purple-600 hover:bg-purple-50 rounded transition-colors'
                                                        title='Track Location'
                                                    >
                                                        <Navigation className='h-4 w-4' />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleViewDetails(
                                                                shipment
                                                            )
                                                        }
                                                        className='p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors'
                                                        title='View Details'
                                                    >
                                                        <Eye className='h-4 w-4' />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleUpdateStatus(
                                                                shipment
                                                            )
                                                        }
                                                        className='p-1.5 text-orange-600 hover:bg-orange-50 rounded transition-colors'
                                                        title='Update Status'
                                                    >
                                                        <Edit className='h-4 w-4' />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDocuments(
                                                                shipment
                                                            )
                                                        }
                                                        className='p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors'
                                                        title='Documents'
                                                    >
                                                        <FileText className='h-4 w-4' />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                shipment
                                                            )
                                                        }
                                                        className='p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors'
                                                        title='Delete Shipment'
                                                    >
                                                        <Trash2 className='h-4 w-4' />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {!loading && !error && filteredShipments.length > 0 && (
                    <div className='flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-gray-200 gap-4'>
                        <div className='flex items-center gap-4'>
                            <p className='text-sm text-gray-600'>
                                Showing {startIndex + 1} to{' '}
                                {Math.min(endIndex, filteredShipments.length)}{' '}
                                of {filteredShipments.length} shipments
                            </p>
                            <div className='flex items-center gap-2'>
                                <label className='text-sm text-gray-600'>
                                    Per page:
                                </label>
                                <select
                                    value={itemsPerPage}
                                    onChange={(e) =>
                                        handleItemsPerPageChange(
                                            parseInt(e.target.value)
                                        )
                                    }
                                    className='px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm'
                                >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={25}>25</option>
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                </select>
                            </div>
                        </div>
                        <div className='flex items-center gap-2'>
                            <Button
                                variant='outline'
                                size='sm'
                                onClick={() =>
                                    handlePageChange(currentPage - 1)
                                }
                                disabled={currentPage === 1}
                            >
                                Previous
                            </Button>
                            <div className='flex items-center gap-1'>
                                {getPageNumbers().map((page, index) =>
                                    page === '...' ? (
                                        <span
                                            key={`ellipsis-${index}`}
                                            className='px-3 py-1.5 text-gray-500'
                                        >
                                            ...
                                        </span>
                                    ) : (
                                        <button
                                            key={page}
                                            onClick={() =>
                                                handlePageChange(page as number)
                                            }
                                            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                                                currentPage === page
                                                    ? 'bg-purple-600 text-white'
                                                    : 'hover:bg-gray-100 text-gray-700'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    )
                                )}
                            </div>
                            <Button
                                variant='outline'
                                size='sm'
                                onClick={() =>
                                    handlePageChange(currentPage + 1)
                                }
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            <CreateShipmentModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={() => {
                    refetch();
                }}
            />

            {selectedShipment && (
                <>
                    <UpdateStatusModal
                        isOpen={isUpdateModalOpen}
                        onClose={() => {
                            setIsUpdateModalOpen(false);
                            setSelectedShipment(null);
                        }}
                        onSuccess={() => {
                            refetch();
                        }}
                        shipment={selectedShipment}
                    />

                    <ViewDetailsModal
                        isOpen={isViewModalOpen}
                        onClose={() => {
                            setIsViewModalOpen(false);
                            setSelectedShipment(null);
                        }}
                        shipment={selectedShipment}
                    />

                    <DocumentsModal
                        isOpen={isDocumentsModalOpen}
                        onClose={() => {
                            setIsDocumentsModalOpen(false);
                            setSelectedShipment(null);
                        }}
                        shipment={selectedShipment}
                    />

                    <TrackLocationModal
                        isOpen={isTrackModalOpen}
                        onClose={() => {
                            setIsTrackModalOpen(false);
                            setSelectedShipment(null);
                        }}
                        shipment={selectedShipment}
                    />

                    <DeleteShipmentModal
                        isOpen={isDeleteModalOpen}
                        onClose={() => {
                            setIsDeleteModalOpen(false);
                            setSelectedShipment(null);
                        }}
                        onConfirm={handleConfirmDelete}
                        shipment={selectedShipment}
                        isDeleting={isDeleting}
                    />
                </>
            )}
        </div>
    );
}
