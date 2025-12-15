import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

interface BarChartWidgetProps {
    data: any[];
    bars: { dataKey: string; fill: string; name: string }[];
    xAxisKey: string;
    height?: number;
}

export default function BarChartWidget({
    data,
    bars,
    xAxisKey,
    height = 300,
}: BarChartWidgetProps) {
    return (
        <ResponsiveContainer width='100%' height={height}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray='3 3' stroke='#e5e7eb' />
                <XAxis dataKey={xAxisKey} stroke='#6b7280' />
                <YAxis stroke='#6b7280' />
                <Tooltip />
                <Legend />
                {bars.map((bar) => (
                    <Bar
                        key={bar.dataKey}
                        dataKey={bar.dataKey}
                        fill={bar.fill}
                        name={bar.name}
                    />
                ))}
            </BarChart>
        </ResponsiveContainer>
    );
}
