import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ChartCardProps {
    title: string;
    subtitle?: string;
    icon?: LucideIcon;
    children: React.ReactNode;
    actions?: React.ReactNode;
}

export default function ChartCard({
    title,
    subtitle,
    icon: Icon,
    children,
    actions,
}: ChartCardProps) {
    return (
        <div className='bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden'>
            <div className='bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4'>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                        {Icon && (
                            <div className='bg-white/20 p-2 rounded-lg'>
                                <Icon className='h-5 w-5 text-white' />
                            </div>
                        )}
                        <div>
                            <h3 className='text-lg font-semibold text-white'>
                                {title}
                            </h3>
                            {subtitle && (
                                <p className='text-sm text-blue-100'>
                                    {subtitle}
                                </p>
                            )}
                        </div>
                    </div>
                    {actions && (
                        <div className='flex items-center gap-2'>{actions}</div>
                    )}
                </div>
            </div>
            <div className='p-6'>{children}</div>
        </div>
    );
}
