'use client';

import { useState } from 'react';
import Card from '@/components/Card';
import ChartWidget from '@/components/ChartWidget';
import MapView from '@/components/MapView';
import {
    Package,
    Truck,
    MapPin,
    TrendingUp,
    Plus,
    FileText,
    Users,
    Clock,
    DollarSign,
    AlertCircle,
} from 'lucide-react';

const kpiData = [
    {
        title: 'Active Shipments',
        value: 45,
        icon: <MapPin className='h-8 w-8' />,
        color: 'from-blue-500 to-blue-600',
        bgColor: 'from-white to-blue-50',
        borderColor: 'border-blue-100',
        change: '+12%',
        changeType: 'increase',
    },
    {
        title: 'Total Orders',
        value: '1,250',
        icon: <Package className='h-8 w-8' />,
        color: 'from-purple-500 to-purple-600',
        bgColor: 'from-white to-purple-50',
        borderColor: 'border-purple-100',
        change: '+8%',
        changeType: 'increase',
    },
    {
        title: 'Available Vehicles',
        value: 78,
        icon: <Truck className='h-8 w-8' />,
        color: 'from-green-500 to-green-600',
        bgColor: 'from-white to-green-50',
        borderColor: 'border-green-100',
        change: '+5%',
        changeType: 'increase',
    },
    {
        title: 'On-Time Rate',
        value: '98.5%',
        icon: <TrendingUp className='h-8 w-8' />,
        color: 'from-orange-500 to-orange-600',
        bgColor: 'from-white to-orange-50',
        borderColor: 'border-orange-100',
        change: '+2.3%',
        changeType: 'increase',
    },
];

const chartData = [
    { name: 'Jan', shipments: 400 },
    { name: 'Feb', shipments: 300 },
    { name: 'Mar', shipments: 500 },
    { name: 'Apr', shipments: 450 },
    { name: 'May', shipments: 600 },
    { name: 'Jun', shipments: 550 },
];

export default function DashboardPage() {
    return (
        <div className='space-y-6'>
            {/* Header with Quick Actions */}
            <div className='bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 rounded-xl shadow-2xl p-8 text-white'>
                <div className='flex items-center justify-between'>
                    <div>
                        <h1 className='text-4xl font-bold mb-2'>
                            Dashboard Overview
                        </h1>
                        <p className='text-blue-100 text-lg'>
                            Welcome to TMS Professional - Monitor and manage
                            your logistics operations in real-time
                        </p>
                    </div>
                    <div className='flex gap-3'>
                        <button className='flex items-center gap-2 bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl transform hover:scale-105'>
                            <Plus className='h-5 w-5' />
                            New Order
                        </button>
                        <button className='flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-all border border-white/20'>
                            <FileText className='h-5 w-5' />
                            Reports
                        </button>
                    </div>
                </div>
            </div>

            {/* KPI Section */}
            <div>
                <h2 className='text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2'>
                    <div className='w-1 h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full'></div>
                    Key Performance Indicators
                </h2>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                    {kpiData.map((kpi) => (
                        <Card
                            key={kpi.title}
                            title={kpi.title}
                            value={kpi.value}
                            icon={kpi.icon}
                            color={kpi.color}
                            bgColor={kpi.bgColor}
                            borderColor={kpi.borderColor}
                            change={kpi.change}
                            changeType={kpi.changeType}
                        />
                    ))}
                </div>
            </div>

            {/* Analytics Section */}
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                {/* Chart Widget - Span 2 columns */}
                <div className='lg:col-span-2'>
                    <h2 className='text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2'>
                        <div className='w-1 h-8 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full'></div>
                        Analytics & Insights
                    </h2>
                    <ChartWidget
                        data={chartData}
                        xKey='name'
                        yKey='shipments'
                    />
                </div>

                {/* Quick Stats */}
                <div>
                    <h2 className='text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2'>
                        <div className='w-1 h-8 bg-gradient-to-b from-green-600 to-teal-600 rounded-full'></div>
                        Quick Stats
                    </h2>
                    <div className='space-y-4'>
                        <div className='bg-gradient-to-br from-white to-green-50 p-5 rounded-xl shadow-lg border border-green-100'>
                            <div className='flex items-center gap-3'>
                                <div className='bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-3'>
                                    <Clock className='h-6 w-6 text-white' />
                                </div>
                                <div>
                                    <p className='text-sm text-gray-600'>
                                        Avg. Delivery Time
                                    </p>
                                    <p className='text-2xl font-bold text-gray-900'>
                                        2.4 days
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className='bg-gradient-to-br from-white to-yellow-50 p-5 rounded-xl shadow-lg border border-yellow-100'>
                            <div className='flex items-center gap-3'>
                                <div className='bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg p-3'>
                                    <DollarSign className='h-6 w-6 text-white' />
                                </div>
                                <div>
                                    <p className='text-sm text-gray-600'>
                                        Revenue (MTD)
                                    </p>
                                    <p className='text-2xl font-bold text-gray-900'>
                                        $125K
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className='bg-gradient-to-br from-white to-red-50 p-5 rounded-xl shadow-lg border border-red-100'>
                            <div className='flex items-center gap-3'>
                                <div className='bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-3'>
                                    <AlertCircle className='h-6 w-6 text-white' />
                                </div>
                                <div>
                                    <p className='text-sm text-gray-600'>
                                        Pending Issues
                                    </p>
                                    <p className='text-2xl font-bold text-gray-900'>
                                        3
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Map and Recent Activities */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                <div>
                    <h2 className='text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2'>
                        <div className='w-1 h-8 bg-gradient-to-b from-green-600 to-emerald-600 rounded-full'></div>
                        Live Tracking
                    </h2>
                    <MapView locations={[]} />
                </div>

                {/* Recent Activities */}
                <div>
                    <h2 className='text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2'>
                        <div className='w-1 h-8 bg-gradient-to-b from-orange-600 to-red-600 rounded-full'></div>
                        Recent Activities
                    </h2>
                    <div className='bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg border border-gray-200 p-6'>
                        <div className='space-y-4'>
                            <div className='flex items-start gap-4 p-4 bg-green-50 rounded-lg border-l-4 border-green-500'>
                                <div className='bg-green-500 rounded-full p-2 mt-0.5'>
                                    <Package className='h-4 w-4 text-white' />
                                </div>
                                <div className='flex-1'>
                                    <p className='text-sm font-semibold text-gray-900'>
                                        Shipment SHP-20251215-001 delivered
                                        successfully
                                    </p>
                                    <p className='text-xs text-gray-500 mt-1'>
                                        2 minutes ago
                                    </p>
                                </div>
                            </div>

                            <div className='flex items-start gap-4 p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500'>
                                <div className='bg-orange-500 rounded-full p-2 mt-0.5'>
                                    <Truck className='h-4 w-4 text-white' />
                                </div>
                                <div className='flex-1'>
                                    <p className='text-sm font-semibold text-gray-900'>
                                        Vehicle VH-1234 maintenance scheduled
                                    </p>
                                    <p className='text-xs text-gray-500 mt-1'>
                                        15 minutes ago
                                    </p>
                                </div>
                            </div>

                            <div className='flex items-start gap-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500'>
                                <div className='bg-blue-500 rounded-full p-2 mt-0.5'>
                                    <FileText className='h-4 w-4 text-white' />
                                </div>
                                <div className='flex-1'>
                                    <p className='text-sm font-semibold text-gray-900'>
                                        New order ORD-20251215-045 created
                                    </p>
                                    <p className='text-xs text-gray-500 mt-1'>
                                        1 hour ago
                                    </p>
                                </div>
                            </div>

                            <div className='flex items-start gap-4 p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500'>
                                <div className='bg-purple-500 rounded-full p-2 mt-0.5'>
                                    <Users className='h-4 w-4 text-white' />
                                </div>
                                <div className='flex-1'>
                                    <p className='text-sm font-semibold text-gray-900'>
                                        Driver assigned to shipment
                                        SHP-20251215-002
                                    </p>
                                    <p className='text-xs text-gray-500 mt-1'>
                                        2 hours ago
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
