import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

interface AreaChartWidgetProps {
    data: any[];
    dataKey: string;
    xAxisKey: string;
    color?: string;
    height?: number;
}

export default function AreaChartWidget({
    data,
    dataKey,
    xAxisKey,
    color = '#3b82f6',
    height = 300,
}: AreaChartWidgetProps) {
    return (
        <ResponsiveContainer width='100%' height={height}>
            <AreaChart data={data}>
                <defs>
                    <linearGradient
                        id='colorGradient'
                        x1='0'
                        y1='0'
                        x2='0'
                        y2='1'
                    >
                        <stop offset='5%' stopColor={color} stopOpacity={0.8} />
                        <stop
                            offset='95%'
                            stopColor={color}
                            stopOpacity={0.1}
                        />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray='3 3' stroke='#e5e7eb' />
                <XAxis dataKey={xAxisKey} stroke='#6b7280' />
                <YAxis stroke='#6b7280' />
                <Tooltip />
                <Area
                    type='monotone'
                    dataKey={dataKey}
                    stroke={color}
                    fillOpacity={1}
                    fill='url(#colorGradient)'
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}
