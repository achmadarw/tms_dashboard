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

// Sample Data for Charts
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
            {/* Page Header */}
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

            {/* Key Metrics Grid */}
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
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                    <MetricCard
                        title='Active Shipments'
                        value={45}
                        icon={MapPin}
                        color='blue'
                        subtitle='Currently in transit'
                        trend={{ value: '+12%', direction: 'up' }}
                    />
                    <MetricCard
                        title='Total Orders'
                        value='1,250'
                        icon={Package}
                        color='purple'
                        subtitle='This month'
                        trend={{ value: '+8.5%', direction: 'up' }}
                    />
                    <MetricCard
                        title='Available Vehicles'
                        value={78}
                        icon={Truck}
                        color='green'
                        subtitle='Ready for dispatch'
                        trend={{ value: '+5%', direction: 'up' }}
                    />
                    <MetricCard
                        title='On-Time Rate'
                        value='98.5%'
                        icon={TrendingUp}
                        color='orange'
                        subtitle='Last 30 days'
                        trend={{ value: '+2.3%', direction: 'up' }}
                    />
                </div>
            </div>

            {/* Quick Stats Row */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                <StatCard
                    icon={Clock}
                    label='Avg. Delivery Time'
                    value='2.4 days'
                    color='green'
                />
                <StatCard
                    icon={DollarSign}
                    label='Revenue (MTD)'
                    value='$125K'
                    color='yellow'
                />
                <StatCard
                    icon={AlertCircle}
                    label='Pending Issues'
                    value={3}
                    color='red'
                />
                <StatCard
                    icon={Users}
                    label='Active Drivers'
                    value={52}
                    color='blue'
                />
            </div>

            {/* Analytics Section - 2 columns */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                {/* Shipments Trend */}
                <ChartCard
                    title='Shipments Trend'
                    subtitle='Monthly performance overview'
                    icon={TrendingUp}
                    actions={
                        <div className='flex gap-2'>
                            <Badge variant='success'>+15.2%</Badge>
                            <Badge variant='info'>6 Months</Badge>
                        </div>
                    }
                >
                    <AreaChartWidget
                        data={shipmentsData}
                        xKey='month'
                        yKey='shipments'
                        color='#3b82f6'
                        height={280}
                    />
                </ChartCard>

                {/* Vehicle Status Distribution */}
                <ChartCard
                    title='Fleet Status'
                    subtitle='Current vehicle distribution'
                    icon={Truck}
                >
                    <PieChartWidget
                        data={vehicleStatusData}
                        height={280}
                        innerRadius={60}
                    />
                </ChartCard>
            </div>

            {/* Revenue and Performance */}
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                {/* Order Types */}
                <div className='lg:col-span-2'>
                    <ChartCard
                        title='Order Distribution by Transport Mode'
                        subtitle='Orders and costs breakdown'
                        icon={Package}
                    >
                        <BarChartWidget
                            data={orderTypeData}
                            xKey='type'
                            bars={[
                                {
                                    key: 'orders',
                                    color: '#3b82f6',
                                    name: 'Orders',
                                },
                                {
                                    key: 'cost',
                                    color: '#8b5cf6',
                                    name: 'Cost ($)',
                                },
                            ]}
                            height={280}
                        />
                    </ChartCard>
                </div>

                {/* Performance Score */}
                <ChartCard
                    title='Performance Metrics'
                    subtitle='Weekly trends'
                    icon={Zap}
                >
                    <LineChartWidget
                        data={performanceData}
                        xKey='week'
                        lines={[
                            {
                                key: 'onTime',
                                color: '#10b981',
                                name: 'On-Time %',
                            },
                            {
                                key: 'efficiency',
                                color: '#f59e0b',
                                name: 'Efficiency %',
                            },
                        ]}
                        height={280}
                    />
                </ChartCard>
            </div>

            {/* Operational Progress */}
            <div>
                <SectionHeader
                    title='Operational Progress'
                    subtitle='Current day operations status'
                    color='green'
                />
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    <div className='bg-white rounded-xl shadow-lg p-6 border border-gray-200'>
                        <ProgressBar
                            value={85}
                            label='Orders Processed'
                            color='blue'
                            size='lg'
                        />
                        <p className='text-sm text-gray-500 mt-2'>
                            85 of 100 orders completed
                        </p>
                    </div>
                    <div className='bg-white rounded-xl shadow-lg p-6 border border-gray-200'>
                        <ProgressBar
                            value={92}
                            label='Deliveries Completed'
                            color='green'
                            size='lg'
                        />
                        <p className='text-sm text-gray-500 mt-2'>
                            46 of 50 deliveries done
                        </p>
                    </div>
                    <div className='bg-white rounded-xl shadow-lg p-6 border border-gray-200'>
                        <ProgressBar
                            value={67}
                            label='Vehicle Utilization'
                            color='orange'
                            size='lg'
                        />
                        <p className='text-sm text-gray-500 mt-2'>
                            52 of 78 vehicles in use
                        </p>
                    </div>
                </div>
            </div>

            {/* Map and Activities */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                {/* Live Tracking Map */}
                <div>
                    <SectionHeader
                        title='Live Tracking'
                        subtitle='Real-time vehicle locations'
                        color='green'
                        actions={
                            <Button
                                variant='outline'
                                icon={Navigation}
                                size='sm'
                            >
                                View All
                            </Button>
                        }
                    />
                    <MapView locations={[]} />
                </div>

                {/* Recent Activities */}
                <div>
                    <SectionHeader
                        title='Recent Activities'
                        subtitle='Latest system events'
                        color='orange'
                        actions={
                            <Button variant='outline' icon={Calendar} size='sm'>
                                View History
                            </Button>
                        }
                    />
                    <div className='bg-white rounded-xl shadow-lg border border-gray-200 p-6 max-h-[400px] overflow-y-auto'>
                        <div className='space-y-3'>
                            <ActivityItem
                                icon={CheckCircle}
                                title='Shipment SHP-20251215-001 delivered successfully'
                                timestamp='2 minutes ago'
                                color='green'
                                description='Delivered to customer at Jakarta warehouse'
                            />
                            <ActivityItem
                                icon={Truck}
                                title='Vehicle VH-1234 maintenance scheduled'
                                timestamp='15 minutes ago'
                                color='orange'
                                description='Regular maintenance due on Dec 20, 2025'
                            />
                            <ActivityItem
                                icon={Package}
                                title='New order ORD-20251215-045 created'
                                timestamp='1 hour ago'
                                color='blue'
                                description='Import order from Singapore - 500kg'
                            />
                            <ActivityItem
                                icon={Users}
                                title='Driver assigned to shipment SHP-20251215-002'
                                timestamp='2 hours ago'
                                color='purple'
                                description='Driver John Doe assigned'
                            />
                            <ActivityItem
                                icon={AlertCircle}
                                title='Delay notification for SHP-20251215-003'
                                timestamp='3 hours ago'
                                color='red'
                                description='Traffic congestion on route - estimated 30 min delay'
                            />
                            <ActivityItem
                                icon={FileText}
                                title='Document uploaded for customs clearance'
                                timestamp='4 hours ago'
                                color='blue'
                                description='BOL and invoice documents submitted'
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Summary Cards */}
            <div>
                <SectionHeader
                    title="Today's Summary"
                    subtitle='Current day performance snapshot'
                    color='purple'
                />
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                    <div className='bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white'>
                        <div className='flex items-center justify-between mb-4'>
                            <CheckCircle className='h-10 w-10' />
                            <Badge
                                variant='success'
                                className='bg-white/20 text-white border-white/30'
                            >
                                Today
                            </Badge>
                        </div>
                        <p className='text-3xl font-bold mb-1'>42</p>
                        <p className='text-blue-100'>Completed Deliveries</p>
                    </div>

                    <div className='bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white'>
                        <div className='flex items-center justify-between mb-4'>
                            <Truck className='h-10 w-10' />
                            <Badge
                                variant='success'
                                className='bg-white/20 text-white border-white/30'
                            >
                                Active
                            </Badge>
                        </div>
                        <p className='text-3xl font-bold mb-1'>28</p>
                        <p className='text-green-100'>Vehicles On Route</p>
                    </div>

                    <div className='bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white'>
                        <div className='flex items-center justify-between mb-4'>
                            <Package className='h-10 w-10' />
                            <Badge
                                variant='warning'
                                className='bg-white/20 text-white border-white/30'
                            >
                                Pending
                            </Badge>
                        </div>
                        <p className='text-3xl font-bold mb-1'>15</p>
                        <p className='text-purple-100'>Orders In Queue</p>
                    </div>

                    <div className='bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white'>
                        <div className='flex items-center justify-between mb-4'>
                            <DollarSign className='h-10 w-10' />
                            <Badge
                                variant='success'
                                className='bg-white/20 text-white border-white/30'
                            >
                                Revenue
                            </Badge>
                        </div>
                        <p className='text-3xl font-bold mb-1'>$8.4K</p>
                        <p className='text-orange-100'>Today's Earnings</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
