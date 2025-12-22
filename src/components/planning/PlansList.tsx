'use client';
import { useState } from 'react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import {
    Calendar,
    TrendingUp,
    Package,
    Truck,
    Ship,
    Plane,
    Train,
    Layers,
    Edit,
    Trash2,
    Eye,
    Filter,
} from 'lucide-react';

interface TransportPlan {
    id: string;
    planName: string;
    description?: string;
    transportMode: 'ROAD' | 'SEA' | 'AIR' | 'RAIL' | 'MULTIMODAL';
    estimatedCost: number;
    estimatedTime: number; // minutes
    totalDistance: number; // km
    plannedDate: string;
    status: 'DRAFT' | 'APPROVED' | 'EXECUTED' | 'CANCELLED';
    createdAt: string;
}

interface PlansListProps {
    plans: TransportPlan[];
    loading?: boolean;
    onEdit: (plan: TransportPlan) => void;
    onDelete: (planId: string) => void;
    onView: (plan: TransportPlan) => void;
}

export default function PlansList({
    plans,
    loading = false,
    onEdit,
    onDelete,
    onView,
}: PlansListProps) {
    const [filterStatus, setFilterStatus] = useState<string>('ALL');
    const [filterMode, setFilterMode] = useState<string>('ALL');

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            DRAFT: 'bg-gray-100 text-gray-700',
            APPROVED: 'bg-blue-100 text-blue-700',
            EXECUTED: 'bg-green-100 text-green-700',
            CANCELLED: 'bg-red-100 text-red-700',
        };
        return (
            <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    styles[status] || styles.DRAFT
                }`}
            >
                {status}
            </span>
        );
    };

    const getModeIcon = (mode: string) => {
        const icons: Record<string, any> = {
            ROAD: Truck,
            SEA: Ship,
            AIR: Plane,
            RAIL: Train,
            MULTIMODAL: Layers,
        };
        const Icon = icons[mode] || Package;
        return <Icon size={18} />;
    };

    const getModeColor = (mode: string) => {
        const colors: Record<string, string> = {
            ROAD: 'text-blue-600',
            SEA: 'text-teal-600',
            AIR: 'text-purple-600',
            RAIL: 'text-orange-600',
            MULTIMODAL: 'text-indigo-600',
        };
        return colors[mode] || 'text-gray-600';
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const formatDuration = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours > 0) {
            return `${hours}h ${mins}m`;
        }
        return `${mins}m`;
    };

    // Filter plans
    const filteredPlans = plans.filter((plan) => {
        const statusMatch =
            filterStatus === 'ALL' || plan.status === filterStatus;
        const modeMatch =
            filterMode === 'ALL' || plan.transportMode === filterMode;
        return statusMatch && modeMatch;
    });

    if (loading) {
        return (
            <div className='space-y-4'>
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className='bg-white rounded-xl shadow p-6 animate-pulse'
                    >
                        <div className='h-6 bg-gray-200 rounded w-1/3 mb-4'></div>
                        <div className='h-4 bg-gray-200 rounded w-2/3'></div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className='space-y-4'>
            {/* Filters - Consistent with other pages */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-gray-200'>
                {/* Status Filter */}
                <div>
                    <label className='text-sm font-medium text-gray-700 mb-2 block'>
                        <Filter className='inline h-4 w-4 mr-1' />
                        Status
                    </label>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
                    >
                        <option value='ALL'>All Status</option>
                        <option value='DRAFT'>Draft</option>
                        <option value='APPROVED'>Approved</option>
                        <option value='EXECUTED'>Executed</option>
                        <option value='CANCELLED'>Cancelled</option>
                    </select>
                </div>
                <div>
                    <label className='text-sm font-medium text-gray-700 mb-2 block'>
                        <Filter className='inline h-4 w-4 mr-1' />
                        Transport Mode
                    </label>
                    <select
                        value={filterMode}
                        onChange={(e) => setFilterMode(e.target.value)}
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    >
                        <option value='ALL'>All Modes</option>
                        <option value='ROAD'>Road</option>
                        <option value='SEA'>Sea</option>
                        <option value='AIR'>Air</option>
                        <option value='RAIL'>Rail</option>
                        <option value='MULTIMODAL'>Multimodal</option>
                    </select>
                </div>
            </div>

            {/* Plans Grid */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4'>
                {filteredPlans.length === 0 ? (
                    <div className='col-span-2 p-12 text-center'>
                        <Package
                            size={48}
                            className='mx-auto text-gray-400 mb-4'
                        />
                        <p className='text-gray-600'>
                            No transport plans found
                        </p>
                        <p className='text-sm text-gray-500 mt-2'>
                            Create a new plan to get started
                        </p>
                    </div>
                ) : (
                    filteredPlans.map((plan) => (
                        <div
                            key={plan.id}
                            className='bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition p-5 cursor-pointer'
                            onClick={() => onView(plan)}
                        >
                            {/* Header */}
                            <div className='flex items-start justify-between mb-4'>
                                <div className='flex-1'>
                                    <h3 className='font-semibold text-gray-900 text-lg mb-1'>
                                        {plan.planName}
                                    </h3>
                                    {plan.description && (
                                        <p className='text-sm text-gray-600 line-clamp-2'>
                                            {plan.description}
                                        </p>
                                    )}
                                </div>
                                <div className='flex items-center gap-2 ml-4'>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEdit(plan);
                                        }}
                                        className='p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition'
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDelete(plan.id);
                                        }}
                                        className='p-2 text-red-600 hover:bg-red-50 rounded-lg transition'
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Status & Mode */}
                            <div className='flex items-center gap-3 mb-4'>
                                {getStatusBadge(plan.status)}
                                <div
                                    className={`flex items-center gap-1 ${getModeColor(
                                        plan.transportMode
                                    )}`}
                                >
                                    {getModeIcon(plan.transportMode)}
                                    <span className='text-sm font-medium'>
                                        {plan.transportMode}
                                    </span>
                                </div>
                            </div>

                            {/* Metrics Grid */}
                            <div className='grid grid-cols-2 gap-4 mb-4'>
                                <div className='p-3 bg-blue-50 rounded-lg'>
                                    <div className='text-xs text-blue-600 mb-1'>
                                        Cost
                                    </div>
                                    <div className='font-semibold text-blue-900'>
                                        {formatCurrency(plan.estimatedCost)}
                                    </div>
                                </div>
                                <div className='p-3 bg-purple-50 rounded-lg'>
                                    <div className='text-xs text-purple-600 mb-1'>
                                        Duration
                                    </div>
                                    <div className='font-semibold text-purple-900'>
                                        {formatDuration(plan.estimatedTime)}
                                    </div>
                                </div>
                                <div className='p-3 bg-green-50 rounded-lg'>
                                    <div className='text-xs text-green-600 mb-1'>
                                        Distance
                                    </div>
                                    <div className='font-semibold text-green-900'>
                                        {plan.totalDistance.toFixed(1)} km
                                    </div>
                                </div>
                                <div className='p-3 bg-orange-50 rounded-lg'>
                                    <div className='text-xs text-orange-600 mb-1'>
                                        Planned Date
                                    </div>
                                    <div className='font-semibold text-orange-900'>
                                        {formatDate(plan.plannedDate)}
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className='flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-200'>
                                <span>
                                    Created {formatDate(plan.createdAt)}
                                </span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onView(plan);
                                    }}
                                    className='flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium'
                                >
                                    <Eye size={14} />
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
