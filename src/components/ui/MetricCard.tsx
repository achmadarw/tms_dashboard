import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: {
        value: string;
        direction: 'up' | 'down' | 'neutral';
    };
    color?:
        | 'blue'
        | 'purple'
        | 'green'
        | 'orange'
        | 'red'
        | 'yellow'
        | 'indigo'
        | 'pink';
    subtitle?: string;
    onClick?: () => void;
}

const colorSchemes = {
    blue: {
        gradient: 'from-blue-500 to-blue-600',
        bg: 'from-white to-blue-50',
        border: 'border-blue-100',
        text: 'text-blue-600',
    },
    purple: {
        gradient: 'from-purple-500 to-purple-600',
        bg: 'from-white to-purple-50',
        border: 'border-purple-100',
        text: 'text-purple-600',
    },
    green: {
        gradient: 'from-green-500 to-green-600',
        bg: 'from-white to-green-50',
        border: 'border-green-100',
        text: 'text-green-600',
    },
    orange: {
        gradient: 'from-orange-500 to-orange-600',
        bg: 'from-white to-orange-50',
        border: 'border-orange-100',
        text: 'text-orange-600',
    },
    red: {
        gradient: 'from-red-500 to-red-600',
        bg: 'from-white to-red-50',
        border: 'border-red-100',
        text: 'text-red-600',
    },
    yellow: {
        gradient: 'from-yellow-500 to-yellow-600',
        bg: 'from-white to-yellow-50',
        border: 'border-yellow-100',
        text: 'text-yellow-600',
    },
    indigo: {
        gradient: 'from-indigo-500 to-indigo-600',
        bg: 'from-white to-indigo-50',
        border: 'border-indigo-100',
        text: 'text-indigo-600',
    },
    pink: {
        gradient: 'from-pink-500 to-pink-600',
        bg: 'from-white to-pink-50',
        border: 'border-pink-100',
        text: 'text-pink-600',
    },
};

export default function MetricCard({
    title,
    value,
    icon: Icon,
    trend,
    color = 'blue',
    subtitle,
    onClick,
}: MetricCardProps) {
    const scheme = colorSchemes[color];
    const TrendIcon = trend
        ? trend.direction === 'up'
            ? TrendingUp
            : trend.direction === 'down'
            ? TrendingDown
            : Minus
        : null;

    return (
        <div
            onClick={onClick}
            className={`
                relative overflow-hidden
                bg-gradient-to-br ${scheme.bg}
                border-2 ${scheme.border}
                rounded-xl p-6
                shadow-lg hover:shadow-xl
                transition-all duration-300
                ${onClick ? 'cursor-pointer hover:scale-105' : ''}
            `}
        >
            <div className='absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-bl-full'></div>

            <div className='relative flex items-start justify-between'>
                <div className='flex-1'>
                    <p className='text-sm font-medium text-gray-600 mb-1'>
                        {title}
                    </p>
                    <p className={`text-3xl font-bold ${scheme.text} mb-2`}>
                        {value}
                    </p>
                    {subtitle && (
                        <p className='text-xs text-gray-500'>{subtitle}</p>
                    )}

                    {trend && TrendIcon && (
                        <div className='flex items-center gap-1 mt-3'>
                            <TrendIcon
                                className={`h-4 w-4 ${
                                    trend.direction === 'up'
                                        ? 'text-green-500'
                                        : trend.direction === 'down'
                                        ? 'text-red-500'
                                        : 'text-gray-500'
                                }`}
                            />
                            <span
                                className={`text-sm font-semibold ${
                                    trend.direction === 'up'
                                        ? 'text-green-600'
                                        : trend.direction === 'down'
                                        ? 'text-red-600'
                                        : 'text-gray-600'
                                }`}
                            >
                                {trend.value}
                            </span>
                        </div>
                    )}
                </div>

                <div
                    className={`bg-gradient-to-br ${scheme.gradient} p-3 rounded-lg shadow-lg`}
                >
                    <Icon className='h-6 w-6 text-white' />
                </div>
            </div>
        </div>
    );
}
