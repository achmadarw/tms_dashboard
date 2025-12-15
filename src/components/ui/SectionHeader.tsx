import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    icon?: LucideIcon;
    color?: 'blue' | 'purple' | 'green' | 'orange' | 'red';
    actions?: React.ReactNode;
}

const colorSchemes = {
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    green: 'from-green-500 to-green-600',
    orange: 'from-orange-500 to-orange-600',
    red: 'from-red-500 to-red-600',
};

export default function SectionHeader({
    title,
    subtitle,
    icon: Icon,
    color = 'blue',
    actions,
}: SectionHeaderProps) {
    return (
        <div
            className={`bg-gradient-to-r ${colorSchemes[color]} rounded-lg shadow-md p-4 mb-4`}
        >
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                    {Icon && (
                        <div className='bg-white/20 p-2 rounded-lg'>
                            <Icon className='h-5 w-5 text-white' />
                        </div>
                    )}
                    <div>
                        <h2 className='text-xl font-bold text-white'>
                            {title}
                        </h2>
                        {subtitle && (
                            <p className='text-sm text-white/80'>{subtitle}</p>
                        )}
                    </div>
                </div>
                {actions && <div>{actions}</div>}
            </div>
        </div>
    );
}
