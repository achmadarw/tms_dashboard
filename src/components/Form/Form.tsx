import React from 'react';

export default function Form({
    children,
    onSubmit,
}: {
    children: React.ReactNode;
    onSubmit: (e: React.FormEvent) => void;
}) {
    return (
        <form onSubmit={onSubmit} className='space-y-4'>
            {children}
        </form>
    );
}
