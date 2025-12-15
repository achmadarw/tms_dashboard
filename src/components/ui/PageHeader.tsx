import React from 'react';
import { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    icon?: LucideIcon;
    actions?: React.ReactNode;
}

export default function PageHeader({
    title,
    subtitle,
    icon: Icon,
    actions,
}: PageHeaderProps) {
    return (
        <div className='bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-6'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-4'>
                    {Icon && (
                        <div className='bg-white/20 p-3 rounded-lg'>
                            <Icon className='h-8 w-8 text-white' />
                        </div>
                    )}
                    <div>
                        <h1 className='text-3xl font-bold text-white'>
                            {title}
                        </h1>
                        {subtitle && (
                            <p className='text-blue-100 mt-1'>{subtitle}</p>
                        )}
                    </div>
                </div>
                {actions && (
                    <div className='flex items-center gap-3'>{actions}</div>
                )}
            </div>
        </div>
    );
}
