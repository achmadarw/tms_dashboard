import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    description?: string;
    color?: 'blue' | 'purple' | 'green' | 'orange' | 'red' | 'yellow' | 'gray';
    onClick?: () => void;
}

const colorSchemes = {
    blue: {
        bg: 'bg-blue-50',
        iconBg: 'bg-blue-500',
        text: 'text-blue-600',
    },
    purple: {
        bg: 'bg-purple-50',
        iconBg: 'bg-purple-500',
        text: 'text-purple-600',
    },
    green: {
        bg: 'bg-green-50',
        iconBg: 'bg-green-500',
        text: 'text-green-600',
    },
    orange: {
        bg: 'bg-orange-50',
        iconBg: 'bg-orange-500',
        text: 'text-orange-600',
    },
    red: {
        bg: 'bg-red-50',
        iconBg: 'bg-red-500',
        text: 'text-red-600',
    },
    yellow: {
        bg: 'bg-yellow-50',
        iconBg: 'bg-yellow-500',
        text: 'text-yellow-600',
    },
    gray: {
        bg: 'bg-gray-50',
        iconBg: 'bg-gray-500',
        text: 'text-gray-600',
    },
};

export default function StatCard({
    title,
    value,
    icon: Icon,
    description,
    color = 'blue',
    onClick,
}: StatCardProps) {
    const scheme = colorSchemes[color];

    return (
        <div
            onClick={onClick}
            className={`
                ${scheme.bg}
                rounded-lg p-4
                border border-gray-200
                hover:shadow-md
                transition-all duration-200
                ${onClick ? 'cursor-pointer hover:scale-105' : ''}
            `}
        >
            <div className='flex items-center gap-3'>
                <div className={`${scheme.iconBg} p-2 rounded-lg`}>
                    <Icon className='h-5 w-5 text-white' />
                </div>
                <div className='flex-1'>
                    <p className='text-xs font-medium text-gray-600'>{title}</p>
                    <p className={`text-xl font-bold ${scheme.text}`}>
                        {value}
                    </p>
                    {description && (
                        <p className='text-xs text-gray-500 mt-1'>
                            {description}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
