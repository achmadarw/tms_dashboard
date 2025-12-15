import React from 'react';

export default function DataTable<T>({
    columns,
    data,
}: {
    columns: { key: keyof T; label: string }[];
    data: T[];
}) {
    return (
        <table className='min-w-full bg-white rounded-xl shadow overflow-hidden'>
            <thead>
                <tr>
                    {columns.map((col) => (
                        <th
                            key={col.key as string}
                            className='px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'
                        >
                            {col.label}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((row, i) => (
                    <tr key={i} className='border-t'>
                        {columns.map((col) => (
                            <td
                                key={col.key as string}
                                className='px-4 py-2 text-sm text-gray-700'
                            >
                                {row[col.key] as React.ReactNode}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
