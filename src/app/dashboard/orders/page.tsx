'use client';

import React, { useState, useMemo } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import StatCard from '@/components/ui/StatCard';
import { useOrders } from '@/hooks/useOrders';
import CreateOrderModal from '@/components/orders/CreateOrderModal';
import ViewOrderDetailsModal from '@/components/orders/ViewOrderDetailsModal';
import EditOrderModal from '@/components/orders/EditOrderModal';
import DeleteOrderModal from '@/components/orders/DeleteOrderModal';
import AdvancedFiltersModal, {
    FilterValues,
} from '@/components/orders/AdvancedFiltersModal';
import {
    Plus,
    Download,
    Filter,
    Search,
    Package,
    Truck,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Eye,
    Edit,
    Trash2,
    RefreshCw,
    Loader2,
} from 'lucide-react';

const statusConfig = {
    PENDING: {
        label: 'Pending',
        variant: 'warning' as const,
        icon: Clock,
        color: 'text-yellow-600',
    },
    CONFIRMED: {
        label: 'Confirmed',
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
    DELIVERED: {
        label: 'Delivered',
        variant: 'success' as const,
        icon: CheckCircle,
        color: 'text-green-600',
    },
    CANCELLED: {
        label: 'Cancelled',
        variant: 'danger' as const,
        icon: XCircle,
        color: 'text-red-600',
    },
};

const priorityConfig = {
    LOW: { label: 'Low', variant: 'default' as const, color: 'text-gray-600' },
    NORMAL: {
        label: 'Normal',
        variant: 'info' as const,
        color: 'text-blue-600',
    },
    HIGH: {
        label: 'High',
        variant: 'warning' as const,
        color: 'text-orange-600',
    },
    URGENT: {
        label: 'Urgent',
        variant: 'danger' as const,
        color: 'text-red-600',
    },
};

export default function OrdersPage() {
    const { orders, loading, error, refetch } = useOrders();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    // Modal states
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Advanced filters
    const [advancedFilters, setAdvancedFilters] = useState<FilterValues>({
        status: 'all',
        priority: 'all',
        dateFrom: '',
        dateTo: '',
        minWeight: '',
        maxWeight: '',
        minVolume: '',
        maxVolume: '',
        hasShipment: 'all',
    });

    const filteredOrders = useMemo(() => {
        return orders.filter((order) => {
            const matchesSearch =
                order.orderNumber
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                (order.customer || '')
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                order.pickupAddress
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                order.deliveryAddress
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());

            const matchesStatus =
                statusFilter === 'all' || order.status === statusFilter;

            // Advanced filters
            const matchesAdvStatus =
                advancedFilters.status === 'all' ||
                order.status === advancedFilters.status;

            const matchesAdvPriority =
                advancedFilters.priority === 'all' ||
                order.priority === advancedFilters.priority;

            const matchesDateFrom =
                !advancedFilters.dateFrom ||
                new Date(order.requestedDate) >=
                    new Date(advancedFilters.dateFrom);

            const matchesDateTo =
                !advancedFilters.dateTo ||
                new Date(order.requestedDate) <=
                    new Date(advancedFilters.dateTo);

            const matchesMinWeight =
                !advancedFilters.minWeight ||
                order.totalWeight >= parseFloat(advancedFilters.minWeight);

            const matchesMaxWeight =
                !advancedFilters.maxWeight ||
                order.totalWeight <= parseFloat(advancedFilters.maxWeight);

            const matchesMinVolume =
                !advancedFilters.minVolume ||
                (order.totalVolume || 0) >=
                    parseFloat(advancedFilters.minVolume);

            const matchesMaxVolume =
                !advancedFilters.maxVolume ||
                (order.totalVolume || 0) <=
                    parseFloat(advancedFilters.maxVolume);

            const matchesShipment =
                advancedFilters.hasShipment === 'all' ||
                (advancedFilters.hasShipment === 'yes' && order.shipment) ||
                (advancedFilters.hasShipment === 'no' && !order.shipment);

            return (
                matchesSearch &&
                matchesStatus &&
                matchesAdvStatus &&
                matchesAdvPriority &&
                matchesDateFrom &&
                matchesDateTo &&
                matchesMinWeight &&
                matchesMaxWeight &&
                matchesMinVolume &&
                matchesMaxVolume &&
                matchesShipment
            );
        });
    }, [orders, searchTerm, statusFilter, advancedFilters]);

    const stats = useMemo(() => {
        return {
            total: orders.length,
            pending: orders.filter((o) => o.status === 'PENDING').length,
            confirmed: orders.filter((o) => o.status === 'CONFIRMED').length,
            inTransit: orders.filter((o) => o.status === 'IN_TRANSIT').length,
            delivered: orders.filter((o) => o.status === 'DELIVERED').length,
        };
    }, [orders]);

    // Modal handlers
    const handleViewOrder = (order: any) => {
        setSelectedOrder(order);
        setIsViewModalOpen(true);
    };

    const handleEditOrder = (order: any) => {
        setSelectedOrder(order);
        setIsEditModalOpen(true);
    };

    const handleDeleteOrder = (order: any) => {
        setSelectedOrder(order);
        setIsDeleteModalOpen(true);
    };

    const handleApplyFilters = (filters: FilterValues) => {
        setAdvancedFilters(filters);
        setCurrentPage(1);
    };

    // Pagination calculations
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

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
        const csvHeaders = [
            'Order Number',
            'Customer',
            'Email',
            'Phone',
            'Pickup Address',
            'Delivery Address',
            'Status',
            'Priority',
            'Requested Date',
            'Total Weight (kg)',
            'Total Volume (m³)',
            'Total Qty',
            'Shipment Number',
            'Created At',
        ];

        const csvRows = filteredOrders.map((order) => [
            order.orderNumber,
            order.customer,
            order.customerEmail || '',
            order.customerPhone || '',
            order.pickupAddress,
            order.deliveryAddress,
            order.status,
            order.priority,
            new Date(order.requestedDate).toLocaleString(),
            order.totalWeight,
            order.totalVolume || 0,
            order.totalQty || 0,
            order.shipment?.shipmentNumber || 'N/A',
            new Date(order.createdAt).toLocaleString(),
        ]);

        const csvContent = [
            csvHeaders.join(','),
            ...csvRows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `orders-export-${
            new Date().toISOString().split('T')[0]
        }.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className='space-y-6'>
            <PageHeader
                title='Orders Management'
                subtitle='Manage and track all shipment orders'
                icon={Package}
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
                            New Order
                        </Button>
                        <Button
                            variant='ghost'
                            icon={Download}
                            onClick={handleExport}
                            disabled={filteredOrders.length === 0}
                        >
                            Export
                        </Button>
                    </>
                }
            />

            {/* Statistics Cards */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                <StatCard
                    title='Total Orders'
                    value={stats.total}
                    icon={Package}
                    color='blue'
                />
                <StatCard
                    title='Pending'
                    value={stats.pending}
                    icon={Clock}
                    color='yellow'
                />
                <StatCard
                    title='In Progress'
                    value={stats.confirmed + stats.inTransit}
                    icon={Truck}
                    color='purple'
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
                            placeholder='Search by order number, customer, or location...'
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
                                <option value='all'>All Status</option>
                                <option value='PENDING'>Pending</option>
                                <option value='CONFIRMED'>Confirmed</option>
                                <option value='IN_TRANSIT'>In Transit</option>
                                <option value='DELIVERED'>Delivered</option>
                                <option value='CANCELLED'>Cancelled</option>
                            </select>
                        </div>
                        <Button
                            variant='outline'
                            icon={Filter}
                            onClick={() => setIsFiltersModalOpen(true)}
                        >
                            More Filters
                        </Button>
                    </div>
                </div>
            </div>

            {/* Orders Table */}
            <div className='bg-white rounded-xl shadow-md overflow-hidden'>
                {loading ? (
                    <div className='flex items-center justify-center h-96'>
                        <div className='text-center'>
                            <Loader2 className='h-12 w-12 text-blue-600 animate-spin mx-auto mb-4' />
                            <p className='text-gray-600'>Loading orders...</p>
                        </div>
                    </div>
                ) : error ? (
                    <div className='bg-white rounded-xl shadow-lg border border-red-200 p-12 text-center'>
                        <AlertCircle className='h-16 w-16 text-red-500 mx-auto mb-4' />
                        <h3 className='text-xl font-semibold text-gray-800 mb-2'>
                            Failed to load orders
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
                ) : filteredOrders.length === 0 ? (
                    <div className='text-center py-12'>
                        <Package className='h-16 w-16 text-gray-400 mx-auto mb-4' />
                        <h3 className='text-lg font-semibold text-gray-800 mb-2'>
                            No orders found
                        </h3>
                        <p className='text-gray-600 mb-4'>
                            {searchTerm || statusFilter !== 'all'
                                ? 'Try adjusting your search or filter'
                                : 'Create your first order to get started'}
                        </p>
                    </div>
                ) : (
                    <div className='overflow-x-auto'>
                        <table className='w-full'>
                            <thead className='bg-gradient-to-r from-blue-50 to-indigo-50'>
                                <tr>
                                    <th className='px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
                                        Order Number
                                    </th>
                                    <th className='px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
                                        Customer
                                    </th>
                                    <th className='px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
                                        Route
                                    </th>
                                    <th className='px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
                                        Status
                                    </th>
                                    <th className='px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
                                        Priority
                                    </th>
                                    <th className='px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
                                        Requested Date
                                    </th>
                                    <th className='px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
                                        Weight/Volume
                                    </th>
                                    <th className='px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
                                        Shipment
                                    </th>
                                    <th className='px-4 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider'>
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-gray-200'>
                                {paginatedOrders.map((order) => {
                                    const statusInfo =
                                        statusConfig[
                                            order.status as keyof typeof statusConfig
                                        ] || statusConfig.PENDING;
                                    const priorityInfo =
                                        priorityConfig[
                                            order.priority as keyof typeof priorityConfig
                                        ] || priorityConfig.NORMAL;
                                    const StatusIcon = statusInfo.icon;

                                    return (
                                        <tr
                                            key={order.id}
                                            className='hover:bg-gray-50 transition-colors'
                                        >
                                            <td className='px-4 py-4'>
                                                <div className='font-semibold text-gray-800'>
                                                    {order.orderNumber}
                                                </div>
                                                <div className='text-xs text-gray-500'>
                                                    {new Date(
                                                        order.createdAt
                                                    ).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className='px-4 py-4'>
                                                <div className='font-medium text-gray-700'>
                                                    {order.customer}
                                                </div>
                                            </td>
                                            <td className='px-4 py-4'>
                                                <div className='text-sm'>
                                                    <div className='flex items-center gap-1 text-gray-700'>
                                                        <span className='font-medium'>
                                                            {
                                                                order.pickupAddress
                                                            }
                                                        </span>
                                                    </div>
                                                    <div className='flex items-center gap-1 text-gray-500 text-xs'>
                                                        <span>→</span>
                                                        <span>
                                                            {
                                                                order.deliveryAddress
                                                            }
                                                        </span>
                                                    </div>
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
                                                <Badge
                                                    variant={
                                                        priorityInfo.variant
                                                    }
                                                >
                                                    {priorityInfo.label}
                                                </Badge>
                                            </td>
                                            <td className='px-4 py-4'>
                                                <div className='text-sm text-gray-700'>
                                                    {new Date(
                                                        order.requestedDate
                                                    ).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className='px-4 py-4'>
                                                <div className='text-sm'>
                                                    <div className='font-medium text-gray-700'>
                                                        {order.totalWeight} kg
                                                    </div>
                                                    <div className='text-xs text-gray-500'>
                                                        {order.totalVolume
                                                            ? `${order.totalVolume} m³`
                                                            : 'N/A'}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='px-4 py-4'>
                                                {order.shipment ? (
                                                    <div className='text-sm'>
                                                        <div className='font-medium text-blue-600'>
                                                            {
                                                                order.shipment
                                                                    .shipmentNumber
                                                            }
                                                        </div>
                                                        <div className='text-xs text-gray-500'>
                                                            {
                                                                order.shipment
                                                                    .status
                                                            }
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className='text-xs text-gray-400'>
                                                        No shipment
                                                    </span>
                                                )}
                                            </td>
                                            <td className='px-4 py-4'>
                                                <div className='flex items-center justify-center gap-2'>
                                                    <button
                                                        onClick={() =>
                                                            handleViewOrder(
                                                                order
                                                            )
                                                        }
                                                        className='p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors'
                                                        title='View Details'
                                                    >
                                                        <Eye className='h-4 w-4' />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleEditOrder(
                                                                order
                                                            )
                                                        }
                                                        className='p-1.5 text-orange-600 hover:bg-orange-50 rounded transition-colors'
                                                        title='Edit Order'
                                                    >
                                                        <Edit className='h-4 w-4' />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDeleteOrder(
                                                                order
                                                            )
                                                        }
                                                        className='p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors'
                                                        title='Delete Order'
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

                {!loading && !error && filteredOrders.length > 0 && (
                    <div className='flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-gray-200 gap-4'>
                        <div className='flex items-center gap-4'>
                            <p className='text-sm text-gray-600'>
                                Showing {startIndex + 1} to{' '}
                                {Math.min(endIndex, filteredOrders.length)} of{' '}
                                {filteredOrders.length} orders
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

            {/* Modals */}
            <CreateOrderModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={() => {
                    refetch();
                    setIsCreateModalOpen(false);
                }}
            />

            <ViewOrderDetailsModal
                isOpen={isViewModalOpen}
                onClose={() => {
                    setIsViewModalOpen(false);
                    setSelectedOrder(null);
                }}
                order={selectedOrder}
                onEdit={(order) => {
                    setIsViewModalOpen(false);
                    handleEditOrder(order);
                }}
                onDelete={(order) => {
                    setIsViewModalOpen(false);
                    handleDeleteOrder(order);
                }}
            />

            <EditOrderModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedOrder(null);
                }}
                order={selectedOrder}
                onSuccess={() => {
                    refetch();
                    setIsEditModalOpen(false);
                    setSelectedOrder(null);
                }}
            />

            <DeleteOrderModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedOrder(null);
                }}
                order={selectedOrder}
                onSuccess={() => {
                    refetch();
                    setIsDeleteModalOpen(false);
                    setSelectedOrder(null);
                }}
            />

            <AdvancedFiltersModal
                isOpen={isFiltersModalOpen}
                onClose={() => setIsFiltersModalOpen(false)}
                onApply={handleApplyFilters}
                currentFilters={advancedFilters}
            />
        </div>
    );
}
