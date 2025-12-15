import React from 'react';

interface ProgressBarProps {
    label: string;
    value: number;
    max?: number;
    color?: 'blue' | 'green' | 'orange' | 'red' | 'purple';
    showPercentage?: boolean;
}

const colorSchemes = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
};

export default function ProgressBar({
    label,
    value,
    max = 100,
    color = 'blue',
    showPercentage = true,
}: ProgressBarProps) {
    const percentage = Math.min((value / max) * 100, 100);

    return (
        <div className='space-y-2'>
            <div className='flex items-center justify-between'>
                <span className='text-sm font-medium text-gray-700'>
                    {label}
                </span>
                {showPercentage && (
                    <span className='text-sm text-gray-600'>
                        {percentage.toFixed(0)}%
                    </span>
                )}
            </div>
            <div className='w-full bg-gray-200 rounded-full h-2.5 overflow-hidden'>
                <div
                    className={`${colorSchemes[color]} h-2.5 rounded-full transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
}
