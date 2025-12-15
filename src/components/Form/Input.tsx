import React from 'react';

export default function Input({
    label,
    ...props
}: {
    label: string;
    [key: string]: any;
}) {
    return (
        <div className='flex flex-col gap-1'>
            <label className='text-sm font-medium text-gray-700'>{label}</label>
            <input
                {...props}
                className='border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
        </div>
    );
}
