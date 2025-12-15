import React from 'react';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

interface PieChartWidgetProps {
    data: any[];
    dataKey: string;
    nameKey: string;
    colors?: string[];
    height?: number;
}

const DEFAULT_COLORS = [
    '#3b82f6',
    '#8b5cf6',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#ec4899',
];

export default function PieChartWidget({
    data,
    dataKey,
    nameKey,
    colors = DEFAULT_COLORS,
    height = 300,
}: PieChartWidgetProps) {
    return (
        <ResponsiveContainer width='100%' height={height}>
            <PieChart>
                <Pie
                    data={data}
                    cx='50%'
                    cy='50%'
                    labelLine={false}
                    label={(entry) => entry[nameKey]}
                    outerRadius={80}
                    fill='#8884d8'
                    dataKey={dataKey}
                >
                    {data.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={colors[index % colors.length]}
                        />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
}
