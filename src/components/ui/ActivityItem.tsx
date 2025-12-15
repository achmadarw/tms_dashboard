import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ActivityItemProps {
    icon: LucideIcon;
    title: string;
    description: string;
    time: string;
    color?: 'blue' | 'green' | 'orange' | 'red' | 'purple';
}

const colorSchemes = {
    blue: {
        bg: 'bg-blue-100',
        icon: 'bg-blue-500',
    },
    green: {
        bg: 'bg-green-100',
        icon: 'bg-green-500',
    },
    orange: {
        bg: 'bg-orange-100',
        icon: 'bg-orange-500',
    },
    red: {
        bg: 'bg-red-100',
        icon: 'bg-red-500',
    },
    purple: {
        bg: 'bg-purple-100',
        icon: 'bg-purple-500',
    },
};

export default function ActivityItem({
    icon: Icon,
    title,
    description,
    time,
    color = 'blue',
}: ActivityItemProps) {
    const scheme = colorSchemes[color];

    return (
        <div className='flex items-start gap-3 py-3 border-b border-gray-100 last:border-0'>
            <div className={`${scheme.icon} p-2 rounded-lg`}>
                <Icon className='h-4 w-4 text-white' />
            </div>
            <div className='flex-1'>
                <p className='font-medium text-gray-800'>{title}</p>
                <p className='text-sm text-gray-600'>{description}</p>
            </div>
            <span className='text-xs text-gray-500'>{time}</span>
        </div>
    );
}
