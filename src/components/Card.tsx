import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function Card({
    title,
    value,
    icon,
    color = 'from-blue-500 to-blue-600',
    bgColor = 'from-white to-blue-50',
    borderColor = 'border-blue-100',
    change,
    changeType,
}: {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color?: string;
    bgColor?: string;
    borderColor?: string;
    change?: string;
    changeType?: 'increase' | 'decrease';
}) {
    return (
        <div
            className={`bg-gradient-to-br ${bgColor} rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border ${borderColor} hover:scale-105 transform`}
        >
            <div className='flex items-start justify-between'>
                <div className='flex-1'>
                    <p className='text-sm font-medium text-gray-600 mb-2'>
                        {title}
                    </p>
                    <p className='text-4xl font-bold text-gray-900 tracking-tight mb-2'>
                        {value}
                    </p>
                    {change && (
                        <div
                            className={`flex items-center gap-1 text-sm font-medium ${
                                changeType === 'increase'
                                    ? 'text-green-600'
                                    : 'text-red-600'
                            }`}
                        >
                            {changeType === 'increase' ? (
                                <TrendingUp className='h-4 w-4' />
                            ) : (
                                <TrendingDown className='h-4 w-4' />
                            )}
                            <span>{change} from last month</span>
                        </div>
                    )}
                </div>
                <div
                    className={`bg-gradient-to-br ${color} rounded-xl p-4 shadow-lg`}
                >
                    <div className='text-white'>{icon}</div>
                </div>
            </div>
        </div>
    );
}
