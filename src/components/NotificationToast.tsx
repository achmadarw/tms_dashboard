import React from 'react';

export default function NotificationToast({
    message,
    type = 'info',
}: {
    message: string;
    type?: 'info' | 'success' | 'error';
}) {
    const color =
        type === 'success'
            ? 'bg-green-500'
            : type === 'error'
            ? 'bg-red-500'
            : 'bg-blue-500';
    return (
        <div
            className={`fixed top-6 right-6 px-4 py-2 rounded shadow text-white ${color} z-50`}
        >
            {message}
        </div>
    );
}
