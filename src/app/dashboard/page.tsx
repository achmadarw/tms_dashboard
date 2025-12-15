'use client';

import React from 'react';
import MetricCard from '@/components/ui/MetricCard';
import StatCard from '@/components/ui/StatCard';
import ChartCard from '@/components/ui/ChartCard';
import PageHeader from '@/components/ui/PageHeader';
import SectionHeader from '@/components/ui/SectionHeader';
import ActivityItem from '@/components/ui/ActivityItem';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import ProgressBar from '@/components/ui/ProgressBar';
import AreaChartWidget from '@/components/charts/AreaChartWidget';
import BarChartWidget from '@/components/charts/BarChartWidget';
import PieChartWidget from '@/components/charts/PieChartWidget';
import LineChartWidget from '@/components/charts/LineChartWidget';
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
    CheckCircle,
    XCircle,
    Calendar,
    Navigation,
    Zap,
    Download,
    Filter,
    RefreshCw,
} from 'lucide-react';

const shipmentsData = [
    { month: 'Jan', shipments: 420, revenue: 84000, onTime: 410 },
    { month: 'Feb', shipments: 380, revenue: 76000, onTime: 365 },
    { month: 'Mar', shipments: 520, revenue: 104000, onTime: 512 },
    { month: 'Apr', shipments: 480, revenue: 96000, onTime: 475 },
    { month: 'May', shipments: 620, revenue: 124000, onTime: 610 },
    { month: 'Jun', shipments: 580, revenue: 116000, onTime: 571 },
];

const vehicleStatusData = [
    { name: 'Active', value: 45 },
    { name: 'Idle', value: 23 },
    { name: 'Maintenance', value: 8 },
    { name: 'Out of Service', value: 2 },
];

const orderTypeData = [
    { type: 'Darat', orders: 450, cost: 90000 },
    { type: 'Laut', orders: 280, cost: 112000 },
    { type: 'Udara', orders: 180, cost: 144000 },
    { type: 'Kereta', orders: 90, cost: 45000 },
];

const performanceData = [
    { week: 'W1', onTime: 98.2, efficiency: 94.5 },
    { week: 'W2', onTime: 97.8, efficiency: 95.2 },
    { week: 'W3', onTime: 98.5, efficiency: 96.1 },
    { week: 'W4', onTime: 99.1, efficiency: 97.3 },
];

export default function DashboardPage() {
    return (
        <div className='space-y-6'>
            <PageHeader
                title='Dashboard Overview'
                subtitle='Monitor and manage your logistics operations in real-time'
                actions={
                    <>
                        <Button variant='primary' icon={Plus}>
                            New Order
                        </Button>
                        <Button variant='ghost' icon={Download}>
                            Export
                        </Button>
                        <Button variant='ghost' icon={RefreshCw}>
                            Refresh
                        </Button>
                    </>
                }
            />

            <div>
                <SectionHeader
                    title='Key Performance Indicators'
                    subtitle='Real-time metrics for business performance'
                    color='blue'
                    actions={
                        <Button variant='outline' icon={Filter} size='sm'>
                            Filter
                        </Button>
                    }
                />

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6'>
                    <MetricCard
                        title='Total Shipments'
                        value='1,250'
                        icon={Package}
                        color='blue'
                        subtitle='This month'
                        trend={{ value: '+8.5%', direction: 'up' }}
                    />
                    <MetricCard
                        title='Active Deliveries'
                        value='342'
                        icon={Truck}
                        color='purple'
                        subtitle='In transit'
                        trend={{ value: '+12.3%', direction: 'up' }}
                    />
                    <MetricCard
                        title='Revenue'
                        value='$284K'
                        icon={DollarSign}
                        color='green'
                        subtitle='This month'
                        trend={{ value: '+15.2%', direction: 'up' }}
                    />
                    <MetricCard
                        title='On-Time Rate'
                        value='98.5%'
                        icon={TrendingUp}
                        color='orange'
                        subtitle='Performance'
                        trend={{ value: '+2.1%', direction: 'up' }}
                    />
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
                    <StatCard
                        title='Available Vehicles'
                        value='78'
                        icon={Truck}
                        description='Ready for dispatch'
                        color='green'
                    />
                    <StatCard
                        title='Pending Orders'
                        value='24'
                        icon={FileText}
                        description='Awaiting assignment'
                        color='orange'
                    />
                    <StatCard
                        title='Active Drivers'
                        value='156'
                        icon={Users}
                        description='On duty'
                        color='blue'
                    />
                    <StatCard
                        title='Avg Delivery Time'
                        value='4.2h'
                        icon={Clock}
                        description='Last 7 days'
                        color='purple'
                    />
                </div>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                <ChartCard
                    title='Shipments Trend'
                    subtitle='Monthly shipment volume for the last 6 months'
                    icon={Package}
                >
                    <AreaChartWidget
                        data={shipmentsData}
                        dataKey='shipments'
                        xAxisKey='month'
                        color='#3b82f6'
                        height={300}
                    />
                </ChartCard>

                <ChartCard
                    title='Vehicle Status Distribution'
                    subtitle='Current fleet status breakdown'
                    icon={Truck}
                >
                    <PieChartWidget
                        data={vehicleStatusData}
                        dataKey='value'
                        nameKey='name'
                        colors={['#10b981', '#3b82f6', '#f59e0b', '#ef4444']}
                        height={300}
                    />
                </ChartCard>

                <ChartCard
                    title='Order Distribution by Type'
                    subtitle='Volume and cost comparison'
                    icon={FileText}
                >
                    <BarChartWidget
                        data={orderTypeData}
                        bars={[
                            {
                                dataKey: 'orders',
                                fill: '#3b82f6',
                                name: 'Orders',
                            },
                            {
                                dataKey: 'cost',
                                fill: '#8b5cf6',
                                name: 'Cost ($)',
                            },
                        ]}
                        xAxisKey='type'
                        height={300}
                    />
                </ChartCard>

                <ChartCard
                    title='Weekly Performance'
                    subtitle='On-time delivery and efficiency metrics'
                    icon={TrendingUp}
                >
                    <LineChartWidget
                        data={performanceData}
                        lines={[
                            {
                                dataKey: 'onTime',
                                stroke: '#10b981',
                                name: 'On-Time %',
                            },
                            {
                                dataKey: 'efficiency',
                                stroke: '#3b82f6',
                                name: 'Efficiency %',
                            },
                        ]}
                        xAxisKey='week'
                        height={300}
                    />
                </ChartCard>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                <div className='lg:col-span-2'>
                    <div className='bg-white rounded-xl shadow-lg border border-gray-200 p-6'>
                        <h3 className='text-lg font-semibold text-gray-800 mb-4'>
                            Live Tracking Map
                        </h3>
                        <div className='bg-gray-100 rounded-lg h-96 flex items-center justify-center'>
                            <MapView locations={[]} />
                        </div>
                    </div>
                </div>

                <div className='bg-white rounded-xl shadow-lg border border-gray-200 p-6'>
                    <h3 className='text-lg font-semibold text-gray-800 mb-4'>
                        Recent Activities
                    </h3>
                    <div className='space-y-1'>
                        <ActivityItem
                            icon={CheckCircle}
                            title='Delivery Completed'
                            description='Order #12345 delivered successfully'
                            time='2 min ago'
                            color='green'
                        />
                        <ActivityItem
                            icon={Truck}
                            title='Vehicle Dispatched'
                            description='Truck T-089 assigned to route R-42'
                            time='15 min ago'
                            color='blue'
                        />
                        <ActivityItem
                            icon={AlertCircle}
                            title='Delay Alert'
                            description='Order #12340 delayed by 30 minutes'
                            time='1 hour ago'
                            color='orange'
                        />
                        <ActivityItem
                            icon={FileText}
                            title='New Order'
                            description='Order #12350 created and pending'
                            time='2 hours ago'
                            color='purple'
                        />
                        <ActivityItem
                            icon={XCircle}
                            title='Route Cancelled'
                            description='Route R-38 cancelled due to weather'
                            time='3 hours ago'
                            color='red'
                        />
                    </div>
                </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <div className='bg-white rounded-xl shadow-lg border border-gray-200 p-6'>
                    <div className='flex items-center gap-3 mb-4'>
                        <div className='bg-blue-500 p-2 rounded-lg'>
                            <Navigation className='h-5 w-5 text-white' />
                        </div>
                        <h3 className='text-lg font-semibold text-gray-800'>
                            Fleet Utilization
                        </h3>
                    </div>
                    <div className='space-y-4'>
                        <ProgressBar
                            label='Long Haul Trucks'
                            value={85}
                            color='blue'
                        />
                        <ProgressBar
                            label='Delivery Vans'
                            value={72}
                            color='green'
                        />
                        <ProgressBar
                            label='Refrigerated Units'
                            value={58}
                            color='purple'
                        />
                    </div>
                </div>

                <div className='bg-white rounded-xl shadow-lg border border-gray-200 p-6'>
                    <div className='flex items-center gap-3 mb-4'>
                        <div className='bg-green-500 p-2 rounded-lg'>
                            <DollarSign className='h-5 w-5 text-white' />
                        </div>
                        <h3 className='text-lg font-semibold text-gray-800'>
                            Revenue Overview
                        </h3>
                    </div>
                    <div className='space-y-3'>
                        <div className='flex items-center justify-between'>
                            <span className='text-sm text-gray-600'>Today</span>
                            <span className='text-lg font-bold text-green-600'>
                                $12,450
                            </span>
                        </div>
                        <div className='flex items-center justify-between'>
                            <span className='text-sm text-gray-600'>
                                This Week
                            </span>
                            <span className='text-lg font-bold text-blue-600'>
                                $84,320
                            </span>
                        </div>
                        <div className='flex items-center justify-between'>
                            <span className='text-sm text-gray-600'>
                                This Month
                            </span>
                            <span className='text-lg font-bold text-purple-600'>
                                $284,150
                            </span>
                        </div>
                    </div>
                </div>

                <div className='bg-white rounded-xl shadow-lg border border-gray-200 p-6'>
                    <div className='flex items-center gap-3 mb-4'>
                        <div className='bg-orange-500 p-2 rounded-lg'>
                            <Zap className='h-5 w-5 text-white' />
                        </div>
                        <h3 className='text-lg font-semibold text-gray-800'>
                            Quick Stats
                        </h3>
                    </div>
                    <div className='space-y-3'>
                        <div className='flex items-center justify-between'>
                            <span className='text-sm text-gray-600'>
                                Fuel Efficiency
                            </span>
                            <Badge variant='success'>12.5 km/L</Badge>
                        </div>
                        <div className='flex items-center justify-between'>
                            <span className='text-sm text-gray-600'>
                                Avg Load
                            </span>
                            <Badge variant='info'>78%</Badge>
                        </div>
                        <div className='flex items-center justify-between'>
                            <span className='text-sm text-gray-600'>
                                Maintenance
                            </span>
                            <Badge variant='warning'>8 vehicles</Badge>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
