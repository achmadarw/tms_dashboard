import React from 'react';

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
};

export default function StatusBadge({ status }: { status: string }) {
    return (
        <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                statusColors[status] || 'bg-gray-100 text-gray-800'
            }`}
        >
            {status.replace('_', ' ').toUpperCase()}
        </span>
    );
}
