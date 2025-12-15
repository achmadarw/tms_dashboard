import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

interface LineChartWidgetProps {
    data: any[];
    lines: { dataKey: string; stroke: string; name: string }[];
    xAxisKey: string;
    height?: number;
}

export default function LineChartWidget({
    data,
    lines,
    xAxisKey,
    height = 300,
}: LineChartWidgetProps) {
    return (
        <ResponsiveContainer width='100%' height={height}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray='3 3' stroke='#e5e7eb' />
                <XAxis dataKey={xAxisKey} stroke='#6b7280' />
                <YAxis stroke='#6b7280' />
                <Tooltip />
                <Legend />
                {lines.map((line) => (
                    <Line
                        key={line.dataKey}
                        type='monotone'
                        dataKey={line.dataKey}
                        stroke={line.stroke}
                        name={line.name}
                        strokeWidth={2}
                    />
                ))}
            </LineChart>
        </ResponsiveContainer>
    );
}
