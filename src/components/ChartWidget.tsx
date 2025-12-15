import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from 'recharts';
import { TrendingUp } from 'lucide-react';

export default function ChartWidget({
    data,
    xKey,
    yKey,
    color = '#2563eb',
    height = 300,
    title = 'Shipment Trends',
}: {
    data: any[];
    xKey: string;
    yKey: string;
    color?: string;
    height?: number;
    title?: string;
}) {
    return (
        <div className='bg-gradient-to-br from-white to-purple-50 rounded-xl shadow-lg p-6 border border-purple-100'>
            <div className='flex items-center gap-3 mb-4'>
                <div className='bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-3 shadow-lg'>
                    <TrendingUp className='h-5 w-5 text-white' />
                </div>
                <h3 className='text-lg font-semibold text-gray-800'>{title}</h3>
            </div>
            <ResponsiveContainer width='100%' height={height}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#e5e7eb' />
                    <XAxis dataKey={xKey} stroke='#6b7280' />
                    <YAxis stroke='#6b7280' />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        }}
                    />
                    <Bar dataKey={yKey} fill={color} radius={[8, 8, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
