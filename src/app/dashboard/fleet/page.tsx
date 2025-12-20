'use client';

import React, { useState, useMemo } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import StatCard from '@/components/ui/StatCard';
import { useVehicles } from '@/hooks/useVehicles';
import { useDrivers } from '@/hooks/useDrivers';
import CreateVehicleModal from '@/components/fleet/CreateVehicleModal';
import ViewVehicleModal from '@/components/fleet/ViewVehicleModal';
import EditVehicleModal from '@/components/fleet/EditVehicleModal';
import DeleteVehicleModal from '@/components/fleet/DeleteVehicleModal';
import CreateDriverModal from '@/components/fleet/CreateDriverModal';
import ViewDriverModal from '@/components/fleet/ViewDriverModal';
import EditDriverModal from '@/components/fleet/EditDriverModal';
import DeleteDriverModal from '@/components/fleet/DeleteDriverModal';
import {
    Plus,
    Download,
    Filter,
    Search,
    Truck,
    User,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Eye,
    Edit,
    Trash2,
    RefreshCw,
    Loader2,
    Wrench,
    Fuel,
    Calendar,
} from 'lucide-react';

type TabType = 'vehicles' | 'drivers';

const vehicleStatusConfig = {
    AVAILABLE: {
        label: 'Available',
        variant: 'success' as const,
        icon: CheckCircle,
        color: 'text-green-600',
    },
    IN_USE: {
        label: 'In Use',
        variant: 'info' as const,
        icon: Truck,
        color: 'text-blue-600',
    },
    MAINTENANCE: {
        label: 'Maintenance',
        variant: 'warning' as const,
        icon: Wrench,
        color: 'text-orange-600',
    },
    OUT_OF_SERVICE: {
        label: 'Out of Service',
        variant: 'danger' as const,
        icon: XCircle,
        color: 'text-red-600',
    },
};

const driverStatusConfig = {
    true: {
        label: 'Available',
        variant: 'success' as const,
        icon: CheckCircle,
        color: 'text-green-600',
    },
    false: {
        label: 'Unavailable',
        variant: 'danger' as const,
        icon: XCircle,
        color: 'text-gray-600',
    },
};

export default function FleetPage() {
    const {
        vehicles,
        loading: vehiclesLoading,
        error: vehiclesError,
        refetch: refetchVehicles,
    } = useVehicles();
    const {
        drivers,
        loading: driversLoading,
        error: driversError,
        refetch: refetchDrivers,
    } = useDrivers();

    const [activeTab, setActiveTab] = useState<TabType>('vehicles');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Modal States for Vehicles
    const [isCreateVehicleModalOpen, setIsCreateVehicleModalOpen] =
        useState(false);
    const [isViewVehicleModalOpen, setIsViewVehicleModalOpen] = useState(false);
    const [isEditVehicleModalOpen, setIsEditVehicleModalOpen] = useState(false);
    const [isDeleteVehicleModalOpen, setIsDeleteVehicleModalOpen] =
        useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState<any>(null);

    // Modal States for Drivers
    const [isCreateDriverModalOpen, setIsCreateDriverModalOpen] =
        useState(false);
    const [isViewDriverModalOpen, setIsViewDriverModalOpen] = useState(false);
    const [isEditDriverModalOpen, setIsEditDriverModalOpen] = useState(false);
    const [isDeleteDriverModalOpen, setIsDeleteDriverModalOpen] =
        useState(false);
    const [selectedDriver, setSelectedDriver] = useState<any>(null);

    // Reset page when tab changes
    const handleTabChange = (tab: TabType) => {
        setActiveTab(tab);
        setCurrentPage(1);
        setSearchTerm('');
        setStatusFilter('all');
    };

    // Filtered Vehicles
    const filteredVehicles = useMemo(() => {
        return vehicles.filter((vehicle) => {
            const matchesSearch =
                vehicle.vehicleNumber
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                vehicle.licensePlate
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                (vehicle.brand || '')
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                (vehicle.model || '')
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());

            const matchesStatus =
                statusFilter === 'all' || vehicle.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [vehicles, searchTerm, statusFilter]);

    // Filtered Drivers
    const filteredDrivers = useMemo(() => {
        return drivers.filter((driver) => {
            const matchesSearch =
                driver.licenseNumber
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                (driver.name || '')
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                (driver.phone || '')
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());

            const matchesStatus =
                statusFilter === 'all' ||
                (statusFilter === 'available' && driver.isAvailable) ||
                (statusFilter === 'unavailable' && !driver.isAvailable);

            return matchesSearch && matchesStatus;
        });
    }, [drivers, searchTerm, statusFilter]);

    // Stats
    const vehicleStats = useMemo(() => {
        return {
            total: vehicles.length,
            available: vehicles.filter((v) => v.status === 'AVAILABLE').length,
            inUse: vehicles.filter((v) => v.status === 'IN_USE').length,
            maintenance: vehicles.filter((v) => v.status === 'MAINTENANCE')
                .length,
        };
    }, [vehicles]);

    const driverStats = useMemo(() => {
        return {
            total: drivers.length,
            available: drivers.filter((d) => d.isAvailable).length,
            unavailable: drivers.filter((d) => !d.isAvailable).length,
            highRated: drivers.filter((d) => d.rating >= 4.5).length,
        };
    }, [drivers]);

    // Pagination calculations
    const currentItems =
        activeTab === 'vehicles' ? filteredVehicles : filteredDrivers;
    const totalPages = Math.ceil(currentItems.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = currentItems.slice(startIndex, endIndex);

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

    // Export to CSV
    const handleExport = () => {
        if (activeTab === 'vehicles') {
            const csvHeaders = [
                'Vehicle Number',
                'License Plate',
                'Type',
                'Brand',
                'Model',
                'Year',
                'Capacity (kg)',
                'Status',
            ];

            const csvRows = filteredVehicles.map((v) => [
                v.vehicleNumber,
                v.licensePlate,
                v.vehicleType,
                v.brand || '',
                v.model || '',
                (v as any).year || '',
                v.capacity,
                v.status,
            ]);

            const csvContent = [
                csvHeaders.join(','),
                ...csvRows.map((row) =>
                    row.map((cell) => `"${cell}"`).join(',')
                ),
            ].join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `vehicles-export-${
                new Date().toISOString().split('T')[0]
            }.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } else {
            const csvHeaders = [
                'License Number',
                'Name',
                'Phone',
                'Email',
                'Available',
                'Rating',
            ];

            const csvRows = filteredDrivers.map((d) => [
                d.licenseNumber,
                d.name || '',
                d.phone || '',
                d.user.email,
                d.isAvailable ? 'Yes' : 'No',
                d.rating,
            ]);

            const csvContent = [
                csvHeaders.join(','),
                ...csvRows.map((row) =>
                    row.map((cell) => `"${cell}"`).join(',')
                ),
            ].join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `drivers-export-${
                new Date().toISOString().split('T')[0]
            }.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }
    };

    const loading = activeTab === 'vehicles' ? vehiclesLoading : driversLoading;
    const error = activeTab === 'vehicles' ? vehiclesError : driversError;
    const refetch = activeTab === 'vehicles' ? refetchVehicles : refetchDrivers;

    return (
        <div className='space-y-6'>
            <PageHeader
                title='Fleet Management'
                subtitle='Manage vehicles, drivers, and fleet operations'
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
                            onClick={() => {
                                if (activeTab === 'vehicles') {
                                    setIsCreateVehicleModalOpen(true);
                                } else {
                                    setIsCreateDriverModalOpen(true);
                                }
                            }}
                        >
                            {activeTab === 'vehicles'
                                ? 'Add Vehicle'
                                : 'Add Driver'}
                        </Button>
                        <Button
                            variant='ghost'
                            icon={Download}
                            onClick={handleExport}
                            disabled={currentItems.length === 0}
                        >
                            Export
                        </Button>
                    </>
                }
            />

            {/* Tabs */}
            <div className='bg-white rounded-xl shadow-md p-2'>
                <div className='flex gap-2'>
                    <button
                        onClick={() => handleTabChange('vehicles')}
                        className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
                            activeTab === 'vehicles'
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        <Truck className='inline-block h-5 w-5 mr-2' />
                        Vehicles
                    </button>
                    <button
                        onClick={() => handleTabChange('drivers')}
                        className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
                            activeTab === 'drivers'
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        <User className='inline-block h-5 w-5 mr-2' />
                        Drivers
                    </button>
                </div>
            </div>

            {/* Statistics Cards */}
            {activeTab === 'vehicles' ? (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                    <StatCard
                        title='Total Vehicles'
                        value={vehicleStats.total}
                        icon={Truck}
                        color='blue'
                    />
                    <StatCard
                        title='Available'
                        value={vehicleStats.available}
                        icon={CheckCircle}
                        color='green'
                    />
                    <StatCard
                        title='In Use'
                        value={vehicleStats.inUse}
                        icon={Truck}
                        color='purple'
                    />
                    <StatCard
                        title='Maintenance'
                        value={vehicleStats.maintenance}
                        icon={Wrench}
                        color='yellow'
                    />
                </div>
            ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                    <StatCard
                        title='Total Drivers'
                        value={driverStats.total}
                        icon={User}
                        color='blue'
                    />
                    <StatCard
                        title='Available'
                        value={driverStats.available}
                        icon={CheckCircle}
                        color='green'
                    />
                    <StatCard
                        title='Unavailable'
                        value={driverStats.unavailable}
                        icon={XCircle}
                        color='gray'
                    />
                    <StatCard
                        title='High Rated (≥4.5)'
                        value={driverStats.highRated}
                        icon={CheckCircle}
                        color='yellow'
                    />
                </div>
            )}

            {/* Search and Filter */}
            <div className='bg-white rounded-xl shadow-md p-6'>
                <div className='flex flex-col md:flex-row gap-4'>
                    <div className='flex-1 relative'>
                        <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400' />
                        <input
                            type='text'
                            placeholder={`Search ${
                                activeTab === 'vehicles'
                                    ? 'vehicles'
                                    : 'drivers'
                            }...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className='w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
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
                                className='pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white'
                            >
                                {activeTab === 'vehicles' ? (
                                    <>
                                        <option value='all'>All Status</option>
                                        <option value='AVAILABLE'>
                                            Available
                                        </option>
                                        <option value='IN_USE'>In Use</option>
                                        <option value='MAINTENANCE'>
                                            Maintenance
                                        </option>
                                        <option value='OUT_OF_SERVICE'>
                                            Out of Service
                                        </option>
                                    </>
                                ) : (
                                    <>
                                        <option value='all'>All Status</option>
                                        <option value='available'>
                                            Available
                                        </option>
                                        <option value='unavailable'>
                                            Unavailable
                                        </option>
                                    </>
                                )}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className='bg-white rounded-xl shadow-md overflow-hidden'>
                {loading ? (
                    <div className='flex items-center justify-center h-96'>
                        <div className='text-center'>
                            <Loader2 className='h-12 w-12 text-blue-600 animate-spin mx-auto mb-4' />
                            <p className='text-gray-600'>
                                Loading{' '}
                                {activeTab === 'vehicles'
                                    ? 'vehicles'
                                    : 'drivers'}
                                ...
                            </p>
                        </div>
                    </div>
                ) : error ? (
                    <div className='bg-white rounded-xl shadow-lg border border-red-200 p-12 text-center'>
                        <AlertCircle className='h-16 w-16 text-red-500 mx-auto mb-4' />
                        <h3 className='text-xl font-semibold text-gray-800 mb-2'>
                            Failed to load{' '}
                            {activeTab === 'vehicles' ? 'vehicles' : 'drivers'}
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
                ) : currentItems.length === 0 ? (
                    <div className='text-center py-12'>
                        {activeTab === 'vehicles' ? (
                            <Truck className='h-16 w-16 text-gray-400 mx-auto mb-4' />
                        ) : (
                            <User className='h-16 w-16 text-gray-400 mx-auto mb-4' />
                        )}
                        <h3 className='text-lg font-semibold text-gray-800 mb-2'>
                            No{' '}
                            {activeTab === 'vehicles' ? 'vehicles' : 'drivers'}{' '}
                            found
                        </h3>
                        <p className='text-gray-600 mb-4'>
                            {searchTerm || statusFilter !== 'all'
                                ? 'Try adjusting your search or filter'
                                : `Create your first ${
                                      activeTab === 'vehicles'
                                          ? 'vehicle'
                                          : 'driver'
                                  } to get started`}
                        </p>
                    </div>
                ) : (
                    <div className='overflow-x-auto'>
                        {activeTab === 'vehicles' ? (
                            <table className='w-full'>
                                <thead className='bg-gradient-to-r from-blue-50 to-indigo-50'>
                                    <tr>
                                        <th className='px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
                                            Vehicle Number
                                        </th>
                                        <th className='px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
                                            License Plate
                                        </th>
                                        <th className='px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
                                            Type
                                        </th>
                                        <th className='px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
                                            Brand/Model
                                        </th>
                                        <th className='px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
                                            Capacity
                                        </th>
                                        <th className='px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
                                            Status
                                        </th>
                                        <th className='px-4 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider'>
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className='divide-y divide-gray-200'>
                                    {paginatedItems.map((vehicle: any) => {
                                        const statusInfo =
                                            vehicleStatusConfig[
                                                vehicle.status as keyof typeof vehicleStatusConfig
                                            ];
                                        const StatusIcon = statusInfo.icon;

                                        return (
                                            <tr
                                                key={vehicle.id}
                                                className='hover:bg-gray-50 transition-colors'
                                            >
                                                <td className='px-4 py-4'>
                                                    <div className='font-semibold text-gray-800'>
                                                        {vehicle.vehicleNumber}
                                                    </div>
                                                </td>
                                                <td className='px-4 py-4'>
                                                    <div className='font-medium text-gray-700'>
                                                        {vehicle.licensePlate}
                                                    </div>
                                                </td>
                                                <td className='px-4 py-4'>
                                                    <Badge variant='info'>
                                                        {vehicle.vehicleType}
                                                    </Badge>
                                                </td>
                                                <td className='px-4 py-4'>
                                                    <div className='text-sm text-gray-700'>
                                                        {vehicle.brand || 'N/A'}{' '}
                                                        {vehicle.model || ''}
                                                    </div>
                                                    {vehicle.year && (
                                                        <div className='text-xs text-gray-500'>
                                                            Year: {vehicle.year}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className='px-4 py-4'>
                                                    <div className='text-sm font-medium text-gray-700'>
                                                        {vehicle.capacity} kg
                                                    </div>
                                                </td>
                                                <td className='px-4 py-4'>
                                                    <div className='flex items-center gap-2'>
                                                        <StatusIcon
                                                            className={`h-4 w-4 ${statusInfo.color}`}
                                                        />
                                                        <Badge
                                                            variant={
                                                                statusInfo.variant
                                                            }
                                                        >
                                                            {statusInfo.label}
                                                        </Badge>
                                                    </div>
                                                </td>
                                                <td className='px-4 py-4'>
                                                    <div className='flex items-center justify-center gap-2'>
                                                        <button
                                                            onClick={() => {
                                                                setSelectedVehicle(
                                                                    vehicle
                                                                );
                                                                setIsViewVehicleModalOpen(
                                                                    true
                                                                );
                                                            }}
                                                            className='p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors'
                                                            title='View Details'
                                                        >
                                                            <Eye className='h-4 w-4' />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setSelectedVehicle(
                                                                    vehicle
                                                                );
                                                                setIsEditVehicleModalOpen(
                                                                    true
                                                                );
                                                            }}
                                                            className='p-1.5 text-orange-600 hover:bg-orange-50 rounded transition-colors'
                                                            title='Edit Vehicle'
                                                        >
                                                            <Edit className='h-4 w-4' />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setSelectedVehicle(
                                                                    vehicle
                                                                );
                                                                setIsDeleteVehicleModalOpen(
                                                                    true
                                                                );
                                                            }}
                                                            className='p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors'
                                                            title='Delete Vehicle'
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
                        ) : (
                            <table className='w-full'>
                                <thead className='bg-gradient-to-r from-blue-50 to-indigo-50'>
                                    <tr>
                                        <th className='px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
                                            License Number
                                        </th>
                                        <th className='px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
                                            Name
                                        </th>
                                        <th className='px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
                                            Contact
                                        </th>
                                        <th className='px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
                                            Rating
                                        </th>
                                        <th className='px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
                                            Status
                                        </th>
                                        <th className='px-4 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider'>
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className='divide-y divide-gray-200'>
                                    {paginatedItems.map((driver: any) => {
                                        const statusInfo =
                                            driverStatusConfig[
                                                driver.isAvailable.toString() as keyof typeof driverStatusConfig
                                            ];
                                        const StatusIcon = statusInfo.icon;

                                        return (
                                            <tr
                                                key={driver.id}
                                                className='hover:bg-gray-50 transition-colors'
                                            >
                                                <td className='px-4 py-4'>
                                                    <div className='font-semibold text-gray-800'>
                                                        {driver.licenseNumber}
                                                    </div>
                                                </td>
                                                <td className='px-4 py-4'>
                                                    <div className='font-medium text-gray-700'>
                                                        {driver.name || 'N/A'}
                                                    </div>
                                                </td>
                                                <td className='px-4 py-4'>
                                                    <div className='text-sm text-gray-700'>
                                                        {driver.phone || 'N/A'}
                                                    </div>
                                                    <div className='text-xs text-gray-500'>
                                                        {driver.user?.email ||
                                                            ''}
                                                    </div>
                                                </td>
                                                <td className='px-4 py-4'>
                                                    <div className='flex items-center gap-1'>
                                                        <span className='text-yellow-500'>
                                                            ★
                                                        </span>
                                                        <span className='text-sm font-medium text-gray-700'>
                                                            {driver.rating.toFixed(
                                                                1
                                                            )}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className='px-4 py-4'>
                                                    <div className='flex items-center gap-2'>
                                                        <StatusIcon
                                                            className={`h-4 w-4 ${statusInfo.color}`}
                                                        />
                                                        <Badge
                                                            variant={
                                                                statusInfo.variant
                                                            }
                                                        >
                                                            {statusInfo.label}
                                                        </Badge>
                                                    </div>
                                                </td>
                                                <td className='px-4 py-4'>
                                                    <div className='flex items-center justify-center gap-2'>
                                                        <button
                                                            onClick={() => {
                                                                setSelectedDriver(
                                                                    driver
                                                                );
                                                                setIsViewDriverModalOpen(
                                                                    true
                                                                );
                                                            }}
                                                            className='p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors'
                                                            title='View Details'
                                                        >
                                                            <Eye className='h-4 w-4' />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setSelectedDriver(
                                                                    driver
                                                                );
                                                                setIsEditDriverModalOpen(
                                                                    true
                                                                );
                                                            }}
                                                            className='p-1.5 text-orange-600 hover:bg-orange-50 rounded transition-colors'
                                                            title='Edit Driver'
                                                        >
                                                            <Edit className='h-4 w-4' />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setSelectedDriver(
                                                                    driver
                                                                );
                                                                setIsDeleteDriverModalOpen(
                                                                    true
                                                                );
                                                            }}
                                                            className='p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors'
                                                            title='Delete Driver'
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
                        )}
                    </div>
                )}

                {!loading && !error && currentItems.length > 0 && (
                    <div className='flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-gray-200 gap-4'>
                        <div className='flex items-center gap-4'>
                            <p className='text-sm text-gray-600'>
                                Showing {startIndex + 1} to{' '}
                                {Math.min(endIndex, currentItems.length)} of{' '}
                                {currentItems.length}{' '}
                                {activeTab === 'vehicles'
                                    ? 'vehicles'
                                    : 'drivers'}
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
                                    className='px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
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
                                                    ? 'bg-blue-600 text-white'
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

            {/* Vehicle Modals */}
            <CreateVehicleModal
                isOpen={isCreateVehicleModalOpen}
                onClose={() => setIsCreateVehicleModalOpen(false)}
                onSuccess={() => {
                    refetchVehicles();
                    setIsCreateVehicleModalOpen(false);
                }}
            />
            <ViewVehicleModal
                isOpen={isViewVehicleModalOpen}
                onClose={() => {
                    setIsViewVehicleModalOpen(false);
                    setSelectedVehicle(null);
                }}
                vehicle={selectedVehicle}
            />
            <EditVehicleModal
                isOpen={isEditVehicleModalOpen}
                onClose={() => {
                    setIsEditVehicleModalOpen(false);
                    setSelectedVehicle(null);
                }}
                onSuccess={() => {
                    refetchVehicles();
                    setIsEditVehicleModalOpen(false);
                    setSelectedVehicle(null);
                }}
                vehicle={selectedVehicle}
            />
            <DeleteVehicleModal
                isOpen={isDeleteVehicleModalOpen}
                onClose={() => {
                    setIsDeleteVehicleModalOpen(false);
                    setSelectedVehicle(null);
                }}
                onSuccess={() => {
                    refetchVehicles();
                    setIsDeleteVehicleModalOpen(false);
                    setSelectedVehicle(null);
                }}
                vehicle={selectedVehicle}
            />

            {/* Driver Modals */}
            <CreateDriverModal
                isOpen={isCreateDriverModalOpen}
                onClose={() => setIsCreateDriverModalOpen(false)}
                onSuccess={() => {
                    refetchDrivers();
                    setIsCreateDriverModalOpen(false);
                }}
            />
            <ViewDriverModal
                isOpen={isViewDriverModalOpen}
                onClose={() => {
                    setIsViewDriverModalOpen(false);
                    setSelectedDriver(null);
                }}
                driver={selectedDriver}
            />
            <EditDriverModal
                isOpen={isEditDriverModalOpen}
                onClose={() => {
                    setIsEditDriverModalOpen(false);
                    setSelectedDriver(null);
                }}
                onSuccess={() => {
                    refetchDrivers();
                    setIsEditDriverModalOpen(false);
                    setSelectedDriver(null);
                }}
                driver={selectedDriver}
            />
            <DeleteDriverModal
                isOpen={isDeleteDriverModalOpen}
                onClose={() => {
                    setIsDeleteDriverModalOpen(false);
                    setSelectedDriver(null);
                }}
                onSuccess={() => {
                    refetchDrivers();
                    setIsDeleteDriverModalOpen(false);
                    setSelectedDriver(null);
                }}
                driver={selectedDriver}
            />
        </div>
    );
}
