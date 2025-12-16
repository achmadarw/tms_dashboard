import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
}: ModalProps) {
    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-2xl',
        lg: 'max-w-4xl',
        xl: 'max-w-6xl',
    };

    return (
        <div className='fixed inset-0 z-50 overflow-y-auto'>
            <div className='flex min-h-screen items-center justify-center p-4'>
                {/* Backdrop */}
                <div
                    className='fixed inset-0 bg-black bg-opacity-50 transition-opacity'
                    onClick={onClose}
                ></div>

                {/* Modal */}
                <div
                    className={`relative bg-white rounded-xl shadow-2xl ${sizeClasses[size]} w-full`}
                >
                    {/* Header */}
                    <div className='flex items-center justify-between px-6 py-4 border-b border-gray-200'>
                        <h3 className='text-xl font-semibold text-gray-800'>
                            {title}
                        </h3>
                        <button
                            onClick={onClose}
                            className='p-1 rounded-lg hover:bg-gray-100 transition-colors'
                        >
                            <X className='h-5 w-5 text-gray-500' />
                        </button>
                    </div>

                    {/* Content */}
                    <div className='px-6 py-4'>{children}</div>
                </div>
            </div>
        </div>
    );
}
