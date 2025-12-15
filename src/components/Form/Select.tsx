import React from 'react';

export default function Select({
    label,
    options,
    ...props
}: {
    label: string;
    options: { value: string; label: string }[];
    [key: string]: any;
}) {
    return (
        <div className='flex flex-col gap-1'>
            <label className='text-sm font-medium text-gray-700'>{label}</label>
            <select
                {...props}
                className='border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
