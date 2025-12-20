import React from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import {
    User,
    Phone,
    Mail,
    MapPin,
    Calendar,
    Star,
    Award,
} from 'lucide-react';

interface Driver {
    id: string;
    licenseNumber: string;
    name: string;
    phone: string;
    email: string | null;
    address: string | null;
    dateOfBirth: string | null;
    licenseExpiry: string | null;
    rating: number | null;
    isAvailable: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

interface ViewDriverModalProps {
    isOpen: boolean;
    onClose: () => void;
    driver: Driver | null;
}

export default function ViewDriverModal({
    isOpen,
    onClose,
    driver,
}: ViewDriverModalProps) {
    if (!driver) return null;

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const getRatingStars = (rating: number | null) => {
        if (!rating) return 'No rating';
        return (
            <div className='flex items-center gap-1'>
                <Star className='h-5 w-5 fill-yellow-400 text-yellow-400' />
                <span className='text-lg font-semibold text-gray-800'>
                    {rating.toFixed(1)}
                </span>
                <span className='text-sm text-gray-600'>/ 5.0</span>
            </div>
        );
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title='Driver Details' size='lg'>
            <div className='space-y-6'>
                {/* Driver Header */}
                <div className='bg-gradient-to-r from-blue-50 to-indigo-50 -m-6 mb-6 p-6 border-b border-gray-200'>
                    <div className='flex items-center gap-4'>
                        <div className='bg-blue-100 p-3 rounded-lg'>
                            <User className='h-8 w-8 text-blue-600' />
                        </div>
                        <div>
                            <h3 className='text-2xl font-bold text-gray-900'>
                                {driver.name}
                            </h3>
                            <p className='text-blue-600 font-medium mt-1'>
                                {driver.licenseNumber}
                            </p>
                        </div>
                    </div>
                </div>
            {/* Status & Rating */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 pb-4 border-b border-gray-200'>
                <div>
                    <p className='text-sm text-gray-600 mb-2'>Availability</p>
                    <Badge variant={driver.isAvailable ? 'success' : 'default'}>
                        {driver.isAvailable ? 'Available' : 'Unavailable'}
                    </Badge>
                </div>
                <div>
                    <p className='text-sm text-gray-600 mb-2'>Active Status</p>
                    <Badge variant={driver.isActive ? 'success' : 'danger'}>
                        {driver.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                </div>
                <div>
                    <p className='text-sm text-gray-600 mb-2 flex items-center gap-1'>
                        <Award className='h-4 w-4' />
                        Rating
                    </p>
                    {getRatingStars(driver.rating)}
                </div>
            </div>

            {/* Contact Information */}
            <div>
                <h3 className='text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2'>
                    <Phone className='h-5 w-5 text-blue-600' />
                    Contact Information
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='bg-gray-50 p-4 rounded-lg'>
                        <p className='text-sm text-gray-600 mb-1 flex items-center gap-1'>
                            <Phone className='h-4 w-4' />
                            Phone Number
                        </p>
                        <p className='font-semibold text-gray-800'>
                            {driver.phone}
                        </p>
                    </div>
                    <div className='bg-gray-50 p-4 rounded-lg'>
                        <p className='text-sm text-gray-600 mb-1 flex items-center gap-1'>
                            <Mail className='h-4 w-4' />
                            Email Address
                        </p>
                        <p className='font-semibold text-gray-800'>
                            {driver.email || 'N/A'}
                        </p>
                    </div>
                    <div className='bg-gray-50 p-4 rounded-lg md:col-span-2'>
                        <p className='text-sm text-gray-600 mb-1 flex items-center gap-1'>
                            <MapPin className='h-4 w-4' />
                            Address
                        </p>
                        <p className='font-semibold text-gray-800'>
                            {driver.address || 'N/A'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Personal Information */}
            <div>
                <h3 className='text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2'>
                    <Calendar className='h-5 w-5 text-blue-600' />
                    Personal Information
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='bg-gray-50 p-4 rounded-lg'>
                        <p className='text-sm text-gray-600 mb-1'>
                            Date of Birth
                        </p>
                        <p className='font-semibold text-gray-800'>
                            {formatDate(driver.dateOfBirth)}
                        </p>
                    </div>
                    <div className='bg-gray-50 p-4 rounded-lg'>
                        <p className='text-sm text-gray-600 mb-1'>
                            License Expiry
                        </p>
                        <p className='font-semibold text-gray-800'>
                            {formatDate(driver.licenseExpiry)}
                        </p>
                        {driver.licenseExpiry &&
                            new Date(driver.licenseExpiry) <
                                new Date() && (
                            <p className='text-xs text-red-600 mt-1'>
                                ⚠ License expired
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Timestamps */}
            <div className='pt-4 border-t border-gray-200'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
                    <div>
                        <p className='text-gray-600 mb-1'>
                            Registered At
                        </p>
                        <p className='text-gray-800 font-medium'>
                            {formatDate(driver.createdAt)}
                        </p>
                    </div>
                    <div>
                        <p className='text-gray-600 mb-1'>
                            Last Updated
                        </p>
                        <p className='text-gray-800 font-medium'>
                            {formatDate(driver.updatedAt)}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        {/* Footer */}
        <div className='flex justify-end gap-3 pt-4 border-t'>
            <Button variant='outline' onClick={onClose}>
                Close
            </Button>
        </div>
    </Modal>
);
}
