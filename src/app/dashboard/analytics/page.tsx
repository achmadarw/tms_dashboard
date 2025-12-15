'use client';
import { useState } from 'react';
import Card from '@/components/Card';
import ChartWidget from '@/components/ChartWidget';
import { BarChart, TrendingUp, DollarSign, Package } from 'lucide-react';

export default function AnalyticsPage() {
    const revenueData = [
        { name: 'Jan', revenue: 24000 },
        { name: 'Feb', revenue: 18000 },
        { name: 'Mar', revenue: 32000 },
        { name: 'Apr', revenue: 28000 },
        { name: 'May', revenue: 35000 },
        { name: 'Jun', revenue: 40000 },
    ];

    const shipmentsData = [
        { name: 'Jan', shipments: 400 },
        { name: 'Feb', shipments: 300 },
        { name: 'Mar', shipments: 500 },
        { name: 'Apr', shipments: 450 },
        { name: 'May', shipments: 600 },
        { name: 'Jun', shipments: 550 },
    ];

    return (
        <div className='space-y-6'>
            <div>
                <h1 className='text-3xl font-bold text-gray-900 flex items-center gap-2'>
                    <BarChart className='text-blue-600' /> Reports & Analytics
                </h1>
                <p className='text-gray-600 mt-1'>
                    Monitor KPIs and business performance
                </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                <Card
                    title='Total Revenue'
                    value='$177,000'
                    icon={<DollarSign className='text-green-600' size={32} />}
                />
                <Card
                    title='Total Shipments'
                    value='2,800'
                    icon={<Package className='text-blue-600' size={32} />}
                />
                <Card
                    title='Avg. Cost/Shipment'
                    value='$63'
                    icon={<TrendingUp className='text-purple-600' size={32} />}
                />
                <Card
                    title='On-Time Rate'
                    value='96.5%'
                    icon={<TrendingUp className='text-orange-600' size={32} />}
                />
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                <div className='bg-white rounded-xl shadow p-4'>
                    <h3 className='font-semibold text-gray-900 mb-4'>
                        Revenue Trend
                    </h3>
                    <ChartWidget
                        data={revenueData}
                        xKey='name'
                        yKey='revenue'
                        color='#10b981'
                        height={250}
                    />
                </div>
                <div className='bg-white rounded-xl shadow p-4'>
                    <h3 className='font-semibold text-gray-900 mb-4'>
                        Shipments Trend
                    </h3>
                    <ChartWidget
                        data={shipmentsData}
                        xKey='name'
                        yKey='shipments'
                        color='#3b82f6'
                        height={250}
                    />
                </div>
            </div>

            <div className='bg-white rounded-xl shadow p-6'>
                <h3 className='font-semibold text-gray-900 mb-4'>
                    KPI Performance
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                    <div>
                        <div className='text-sm text-gray-600'>
                            Fleet Utilization
                        </div>
                        <div className='flex items-center gap-2 mt-2'>
                            <div className='flex-1 bg-gray-200 rounded-full h-2'>
                                <div
                                    className='bg-blue-600 h-2 rounded-full'
                                    style={{ width: '87%' }}
                                ></div>
                            </div>
                            <span className='font-semibold'>87%</span>
                        </div>
                    </div>
                    <div>
                        <div className='text-sm text-gray-600'>
                            Customer Satisfaction
                        </div>
                        <div className='flex items-center gap-2 mt-2'>
                            <div className='flex-1 bg-gray-200 rounded-full h-2'>
                                <div
                                    className='bg-green-600 h-2 rounded-full'
                                    style={{ width: '92%' }}
                                ></div>
                            </div>
                            <span className='font-semibold'>92%</span>
                        </div>
                    </div>
                    <div>
                        <div className='text-sm text-gray-600'>
                            Cost Efficiency
                        </div>
                        <div className='flex items-center gap-2 mt-2'>
                            <div className='flex-1 bg-gray-200 rounded-full h-2'>
                                <div
                                    className='bg-purple-600 h-2 rounded-full'
                                    style={{ width: '78%' }}
                                ></div>
                            </div>
                            <span className='font-semibold'>78%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
