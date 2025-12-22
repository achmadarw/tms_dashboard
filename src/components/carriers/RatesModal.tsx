'use client';

import React, { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import {
    Tag,
    Plus,
    Calendar,
    MapPin,
    Truck,
    Ship,
    Plane,
    Train,
    Loader2,
    Edit2,
    Trash2,
    Package,
    Clock,
    DollarSign,
    Fuel,
    Shield,
    ChevronDown,
    ChevronUp,
} from 'lucide-react';

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface Carrier {
    id: string;
    companyName: string;
    contactPerson: string;
    email: string;
    phone: string;
    rating: number;
    onTimeRate: number;
}

interface Rate {
    id: string;
    serviceType: string;
    transportMode: string;
    originCity: string;
    destinationCity: string;
    originProvince?: string;
    destinationProvince?: string;
    baseRate: number;
    perKgRate: number;
    perKmRate: number;
    minimumCharge: number;
    leadTimeDays?: number;
    estimatedDays?: number;
    volumetricDivisor?: number;
    fuelSurchargePercent?: number;
    remoteAreaSurcharge?: number;
    codFeePercent?: number;
    insuranceRatePercent?: number;
    minWeight?: number;
    maxWeight?: number;
    validFrom: string;
    validTo: string;
}

interface RatesModalProps {
    isOpen: boolean;
    onClose: () => void;
    carrier: Carrier;
}

export default function RatesModal({
    isOpen,
    onClose,
    carrier,
}: RatesModalProps) {
    const [showAddRateForm, setShowAddRateForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingRates, setLoadingRates] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [rates, setRates] = useState<Rate[]>([]);
    const [editingRate, setEditingRate] = useState<Rate | null>(null);
    const [expandedRates, setExpandedRates] = useState<Set<string>>(new Set());
    const [formData, setFormData] = useState({
        serviceType: 'STANDARD',
        transportMode: 'ROAD',
        originCity: '',
        destinationCity: '',
        baseRate: '',
        perKgRate: '',
        perKmRate: '',
        minimumCharge: '',
        leadTimeDays: '',
        volumetricDivisor: '6000',
        fuelSurchargePercent: '0',
        remoteAreaSurcharge: '0',
        codFeePercent: '0',
        insuranceRatePercent: '0',
        validFrom: '2025-01-01',
        validTo: '2025-12-31',
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const url = editingRate
                ? `${API_BASE_URL}/carriers/${carrier.id}/rates/${editingRate.id}`
                : `${API_BASE_URL}/carriers/${carrier.id}/rates`;

            const method = editingRate ? 'PATCH' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    serviceType: formData.serviceType,
                    transportMode: formData.transportMode,
                    originCity: formData.originCity,
                    destinationCity: formData.destinationCity,
                    baseRate: parseFloat(formData.baseRate),
                    perKgRate: parseFloat(formData.perKgRate),
                    perKmRate: parseFloat(formData.perKmRate),
                    minimumCharge: parseFloat(formData.minimumCharge),
                    leadTimeDays: formData.leadTimeDays
                        ? parseInt(formData.leadTimeDays)
                        : null,
                    volumetricDivisor: formData.volumetricDivisor
                        ? parseInt(formData.volumetricDivisor)
                        : 6000,
                    fuelSurchargePercent: formData.fuelSurchargePercent
                        ? parseFloat(formData.fuelSurchargePercent)
                        : 0,
                    remoteAreaSurcharge: formData.remoteAreaSurcharge
                        ? parseFloat(formData.remoteAreaSurcharge)
                        : 0,
                    codFeePercent: formData.codFeePercent
                        ? parseFloat(formData.codFeePercent)
                        : 0,
                    insuranceRatePercent: formData.insuranceRatePercent
                        ? parseFloat(formData.insuranceRatePercent)
                        : 0,
                    validFrom: new Date(formData.validFrom).toISOString(),
                    validTo: new Date(formData.validTo).toISOString(),
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.message ||
                        `Failed to ${editingRate ? 'update' : 'add'} rate`
                );
            }

            // Reset form, close, and refresh rates
            setFormData({
                serviceType: 'STANDARD',
                transportMode: 'ROAD',
                originCity: '',
                destinationCity: '',
                baseRate: '',
                perKgRate: '',
                perKmRate: '',
                minimumCharge: '',
                leadTimeDays: '',
                volumetricDivisor: '6000',
                fuelSurchargePercent: '0',
                remoteAreaSurcharge: '0',
                codFeePercent: '0',
                insuranceRatePercent: '0',
                validFrom: '2025-01-01',
                validTo: '2025-12-31',
            });
            setShowAddRateForm(false);
            setEditingRate(null);
            fetchRates(); // Refresh rates list
            alert(`Rate ${editingRate ? 'updated' : 'added'} successfully!`);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : `Failed to ${editingRate ? 'update' : 'add'} rate`
            );
        } finally {
            setLoading(false);
        }
    };

    const fetchRates = async () => {
        try {
            setLoadingRates(true);
            const response = await fetch(
                `${API_BASE_URL}/carriers/${carrier.id}`
            );
            if (!response.ok) throw new Error('Failed to fetch rates');
            const data = await response.json();
            setRates(data.rates || []);
        } catch (err) {
            console.error('Error fetching rates:', err);
            setRates([]);
        } finally {
            setLoadingRates(false);
        }
    };

    const handleEditRate = (rate: Rate) => {
        setEditingRate(rate);
        setFormData({
            serviceType: rate.serviceType,
            transportMode: rate.transportMode,
            originCity: rate.originCity,
            destinationCity: rate.destinationCity,
            baseRate: rate.baseRate.toString(),
            perKgRate: rate.perKgRate.toString(),
            perKmRate: rate.perKmRate.toString(),
            minimumCharge: rate.minimumCharge.toString(),
            leadTimeDays: rate.leadTimeDays?.toString() || '',
            volumetricDivisor: rate.volumetricDivisor?.toString() || '6000',
            fuelSurchargePercent: rate.fuelSurchargePercent?.toString() || '0',
            remoteAreaSurcharge: rate.remoteAreaSurcharge?.toString() || '0',
            codFeePercent: rate.codFeePercent?.toString() || '0',
            insuranceRatePercent: rate.insuranceRatePercent?.toString() || '0',
            validFrom: rate.validFrom?.split('T')[0] || '2025-01-01',
            validTo: rate.validTo?.split('T')[0] || '2025-12-31',
        });
        setShowAddRateForm(true);
    };

    const handleDeleteRate = async (rateId: string) => {
        if (!confirm('Are you sure you want to delete this rate?')) {
            return;
        }

        try {
            const response = await fetch(
                `${API_BASE_URL}/carriers/${carrier.id}/rates/${rateId}`,
                { method: 'DELETE' }
            );

            if (!response.ok) {
                throw new Error('Failed to delete rate');
            }

            alert('Rate deleted successfully!');
            fetchRates();
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to delete rate');
        }
    };

    const handleCancelEdit = () => {
        setEditingRate(null);
        setShowAddRateForm(false);
        setFormData({
            serviceType: 'STANDARD',
            transportMode: 'ROAD',
            originCity: '',
            destinationCity: '',
            baseRate: '',
            perKgRate: '',
            perKmRate: '',
            minimumCharge: '',
            leadTimeDays: '',
            volumetricDivisor: '6000',
            fuelSurchargePercent: '0',
            remoteAreaSurcharge: '0',
            codFeePercent: '0',
            insuranceRatePercent: '0',
            validFrom: '2025-01-01',
            validTo: '2025-12-31',
        });
    };

    const toggleRateExpansion = (rateId: string) => {
        setExpandedRates((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(rateId)) {
                newSet.delete(rateId);
            } else {
                newSet.add(rateId);
            }
            return newSet;
        });
    };

    useEffect(() => {
        if (isOpen) {
            fetchRates();
        }
    }, [isOpen, carrier.id]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getTransportIcon = (mode: string) => {
        switch (mode) {
            case 'ROAD':
                return <Truck className='h-4 w-4' />;
            case 'SEA':
                return <Ship className='h-4 w-4' />;
            case 'AIR':
                return <Plane className='h-4 w-4' />;
            case 'RAIL':
                return <Train className='h-4 w-4' />;
            default:
                return <Truck className='h-4 w-4' />;
        }
    };

    const getServiceTypeBadge = (type: string) => {
        const config = {
            STANDARD: { variant: 'info' as const, label: 'Standard' },
            EXPRESS: { variant: 'warning' as const, label: 'Express' },
            SAME_DAY: { variant: 'danger' as const, label: 'Same Day' },
        };
        const { variant, label } =
            config[type as keyof typeof config] || config.STANDARD;
        return <Badge variant={variant}>{label}</Badge>;
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`${carrier.companyName} - Rates`}
            size='lg'
        >
            <div className='space-y-6'>
                {/* Carrier Info */}
                <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
                    <h3 className='font-semibold text-blue-900 mb-3'>
                        Carrier Information
                    </h3>
                    <div className='grid grid-cols-2 gap-4 text-sm'>
                        <div>
                            <span className='text-gray-600'>Contact:</span>
                            <p className='font-medium text-gray-900'>
                                {carrier.contactPerson}
                            </p>
                        </div>
                        <div>
                            <span className='text-gray-600'>Email:</span>
                            <p className='font-medium text-gray-900'>
                                {carrier.email}
                            </p>
                        </div>
                        <div>
                            <span className='text-gray-600'>Phone:</span>
                            <p className='font-medium text-gray-900'>
                                {carrier.phone}
                            </p>
                        </div>
                        <div>
                            <span className='text-gray-600'>Performance:</span>
                            <div className='flex items-center gap-2'>
                                <Badge variant='success'>
                                    Rating: {carrier.rating.toFixed(1)}/5
                                </Badge>
                                <Badge variant='info'>
                                    On-Time: {carrier.onTimeRate.toFixed(0)}%
                                </Badge>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Rate Table Placeholder */}
                <div>
                    <div className='flex items-center justify-between mb-4'>
                        <h3 className='text-lg font-semibold text-gray-900'>
                            Rate Structure
                        </h3>
                        {!showAddRateForm && (
                            <Button
                                variant='primary'
                                size='sm'
                                onClick={() => setShowAddRateForm(true)}
                            >
                                <Plus className='h-4 w-4 mr-2' />
                                Add Rate
                            </Button>
                        )}
                    </div>

                    {showAddRateForm ? (
                        <form
                            onSubmit={handleSubmit}
                            className='bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4'
                        >
                            <h4 className='font-medium text-gray-900 mb-3'>
                                {editingRate ? 'Edit Rate' : 'Add New Rate'}
                            </h4>

                            {error && (
                                <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4'>
                                    {error}
                                </div>
                            )}

                            <div className='grid grid-cols-2 gap-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        Service Type *
                                    </label>
                                    <select
                                        name='serviceType'
                                        value={formData.serviceType}
                                        onChange={handleChange}
                                        required
                                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
                                    >
                                        <option value='STANDARD'>
                                            Standard
                                        </option>
                                        <option value='EXPRESS'>Express</option>
                                        <option value='SAME_DAY'>
                                            Same Day
                                        </option>
                                    </select>
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        Transport Mode *
                                    </label>
                                    <select
                                        name='transportMode'
                                        value={formData.transportMode}
                                        onChange={handleChange}
                                        required
                                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
                                    >
                                        <option value='ROAD'>Road</option>
                                        <option value='SEA'>Sea</option>
                                        <option value='AIR'>Air</option>
                                        <option value='RAIL'>Rail</option>
                                    </select>
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        Origin City *
                                    </label>
                                    <input
                                        type='text'
                                        name='originCity'
                                        value={formData.originCity}
                                        onChange={handleChange}
                                        placeholder='Jakarta'
                                        required
                                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        Destination City *
                                    </label>
                                    <input
                                        type='text'
                                        name='destinationCity'
                                        value={formData.destinationCity}
                                        onChange={handleChange}
                                        placeholder='Surabaya'
                                        required
                                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        Base Rate (IDR) *
                                    </label>
                                    <input
                                        type='number'
                                        name='baseRate'
                                        value={formData.baseRate}
                                        onChange={handleChange}
                                        placeholder='50000'
                                        required
                                        min='0'
                                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        Per KG Rate (IDR) *
                                    </label>
                                    <input
                                        type='number'
                                        name='perKgRate'
                                        value={formData.perKgRate}
                                        onChange={handleChange}
                                        placeholder='2000'
                                        required
                                        min='0'
                                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        Per KM Rate (IDR) *
                                    </label>
                                    <input
                                        type='number'
                                        name='perKmRate'
                                        value={formData.perKmRate}
                                        onChange={handleChange}
                                        placeholder='500'
                                        required
                                        min='0'
                                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        Minimum Charge (IDR) *
                                    </label>
                                    <input
                                        type='number'
                                        name='minimumCharge'
                                        value={formData.minimumCharge}
                                        onChange={handleChange}
                                        placeholder='30000'
                                        required
                                        min='0'
                                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
                                    />
                                </div>

                                {/* Lead Time */}
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        Lead Time (Days)
                                    </label>
                                    <input
                                        type='number'
                                        name='leadTimeDays'
                                        value={formData.leadTimeDays}
                                        onChange={handleChange}
                                        placeholder='e.g., 2 (for 2 days)'
                                        min='0'
                                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
                                    />
                                    <p className='text-xs text-gray-500 mt-1'>
                                        Estimated delivery time in days
                                    </p>
                                </div>

                                {/* Volumetric Divisor */}
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        Volumetric Divisor (cm³/kg)
                                    </label>
                                    <input
                                        type='number'
                                        name='volumetricDivisor'
                                        value={formData.volumetricDivisor}
                                        onChange={handleChange}
                                        placeholder='6000'
                                        min='0'
                                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
                                    />
                                    <p className='text-xs text-gray-500 mt-1'>
                                        Default: 6000 cm³/kg (industry standard)
                                    </p>
                                </div>

                                {/* Fuel Surcharge */}
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        Fuel Surcharge (%)
                                    </label>
                                    <input
                                        type='number'
                                        name='fuelSurchargePercent'
                                        value={formData.fuelSurchargePercent}
                                        onChange={handleChange}
                                        placeholder='0'
                                        step='0.01'
                                        min='0'
                                        max='100'
                                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
                                    />
                                    <p className='text-xs text-gray-500 mt-1'>
                                        % of base rate
                                    </p>
                                </div>

                                {/* Remote Area Surcharge */}
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        Remote Area Surcharge (IDR)
                                    </label>
                                    <input
                                        type='number'
                                        name='remoteAreaSurcharge'
                                        value={formData.remoteAreaSurcharge}
                                        onChange={handleChange}
                                        placeholder='0'
                                        min='0'
                                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
                                    />
                                    <p className='text-xs text-gray-500 mt-1'>
                                        Fixed amount for remote areas
                                    </p>
                                </div>

                                {/* COD Fee */}
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        COD Fee (%)
                                    </label>
                                    <input
                                        type='number'
                                        name='codFeePercent'
                                        value={formData.codFeePercent}
                                        onChange={handleChange}
                                        placeholder='0'
                                        step='0.01'
                                        min='0'
                                        max='100'
                                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
                                    />
                                    <p className='text-xs text-gray-500 mt-1'>
                                        % of COD value
                                    </p>
                                </div>

                                {/* Insurance Rate */}
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        Insurance Rate (%)
                                    </label>
                                    <input
                                        type='number'
                                        name='insuranceRatePercent'
                                        value={formData.insuranceRatePercent}
                                        onChange={handleChange}
                                        placeholder='0'
                                        step='0.01'
                                        min='0'
                                        max='100'
                                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
                                    />
                                    <p className='text-xs text-gray-500 mt-1'>
                                        % of shipment value
                                    </p>
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        Valid From *
                                    </label>
                                    <input
                                        type='date'
                                        name='validFrom'
                                        value={formData.validFrom}
                                        onChange={handleChange}
                                        required
                                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        Valid To *
                                    </label>
                                    <input
                                        type='date'
                                        name='validTo'
                                        value={formData.validTo}
                                        onChange={handleChange}
                                        required
                                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
                                    />
                                </div>
                            </div>
                            <div className='flex gap-2 mt-4'>
                                <button
                                    type='submit'
                                    disabled={loading}
                                    className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium'
                                >
                                    {loading
                                        ? 'Saving...'
                                        : editingRate
                                        ? 'Update Rate'
                                        : 'Save Rate'}
                                </button>
                                <button
                                    type='button'
                                    onClick={handleCancelEdit}
                                    disabled={loading}
                                    className='px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium'
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : loadingRates ? (
                        <div className='flex justify-center items-center py-8'>
                            <Loader2 className='h-8 w-8 animate-spin text-gray-400' />
                        </div>
                    ) : rates.length > 0 ? (
                        <div className='space-y-3'>
                            {rates.map((rate) => {
                                const isExpanded = expandedRates.has(rate.id);

                                return (
                                    <div
                                        key={rate.id}
                                        className='bg-white border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-all shadow-sm hover:shadow-md'
                                    >
                                        {/* Collapsed Header - Always Visible */}
                                        <div className='p-4'>
                                            <div className='flex items-start justify-between'>
                                                <div
                                                    className='flex items-center gap-3 flex-1 cursor-pointer'
                                                    onClick={() =>
                                                        toggleRateExpansion(
                                                            rate.id
                                                        )
                                                    }
                                                >
                                                    {getTransportIcon(
                                                        rate.transportMode
                                                    )}
                                                    <div className='flex-1'>
                                                        <div className='flex items-center gap-2 mb-1'>
                                                            <h4 className='font-semibold text-gray-900 text-base'>
                                                                {
                                                                    rate.originCity
                                                                }{' '}
                                                                →{' '}
                                                                {
                                                                    rate.destinationCity
                                                                }
                                                            </h4>
                                                            {getServiceTypeBadge(
                                                                rate.serviceType
                                                            )}
                                                        </div>
                                                        <div className='flex items-center gap-3 text-sm text-gray-600'>
                                                            <span className='font-medium text-blue-600'>
                                                                {formatCurrency(
                                                                    rate.baseRate
                                                                )}
                                                            </span>
                                                            {rate.leadTimeDays && (
                                                                <span className='flex items-center gap-1'>
                                                                    <Clock className='h-3 w-3' />
                                                                    {
                                                                        rate.leadTimeDays
                                                                    }{' '}
                                                                    days
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className='flex items-center gap-2 ml-2'>
                                                    <Button
                                                        variant='outline'
                                                        size='sm'
                                                        onClick={() =>
                                                            handleEditRate(rate)
                                                        }
                                                    >
                                                        <Edit2 className='h-4 w-4' />
                                                    </Button>
                                                    <Button
                                                        variant='outline'
                                                        size='sm'
                                                        onClick={() =>
                                                            handleDeleteRate(
                                                                rate.id
                                                            )
                                                        }
                                                        className='text-red-600 hover:bg-red-50'
                                                    >
                                                        <Trash2 className='h-4 w-4' />
                                                    </Button>
                                                    <button
                                                        onClick={() =>
                                                            toggleRateExpansion(
                                                                rate.id
                                                            )
                                                        }
                                                        className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
                                                        title={
                                                            isExpanded
                                                                ? 'Hide Details'
                                                                : 'Show Details'
                                                        }
                                                    >
                                                        {isExpanded ? (
                                                            <ChevronUp className='h-5 w-5 text-gray-600' />
                                                        ) : (
                                                            <ChevronDown className='h-5 w-5 text-gray-600' />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Expanded Details - Conditional */}
                                        {isExpanded && (
                                            <div className='px-4 pb-4 space-y-3 border-t border-gray-200 pt-3'>
                                                {/* Basic Pricing Section */}
                                                <div className='bg-blue-50 rounded-lg p-3'>
                                                    <h5 className='font-semibold text-gray-700 mb-2 flex items-center gap-2 text-sm'>
                                                        <DollarSign className='h-4 w-4' />
                                                        Basic Pricing
                                                    </h5>
                                                    <div className='grid grid-cols-2 md:grid-cols-4 gap-3 text-sm'>
                                                        <div>
                                                            <p className='text-gray-600 text-xs mb-1'>
                                                                Base Rate
                                                            </p>
                                                            <p className='font-semibold text-gray-900'>
                                                                {formatCurrency(
                                                                    rate.baseRate
                                                                )}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className='text-gray-600 text-xs mb-1'>
                                                                Per KG
                                                            </p>
                                                            <p className='font-semibold text-gray-900'>
                                                                {formatCurrency(
                                                                    rate.perKgRate
                                                                )}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className='text-gray-600 text-xs mb-1'>
                                                                Per KM
                                                            </p>
                                                            <p className='font-semibold text-gray-900'>
                                                                {formatCurrency(
                                                                    rate.perKmRate
                                                                )}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className='text-gray-600 text-xs mb-1'>
                                                                Minimum Charge
                                                            </p>
                                                            <p className='font-semibold text-gray-900'>
                                                                {formatCurrency(
                                                                    rate.minimumCharge
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Service Details Section */}
                                                <div className='bg-green-50 rounded-lg p-3'>
                                                    <h5 className='font-semibold text-gray-700 mb-2 flex items-center gap-2 text-sm'>
                                                        <Clock className='h-4 w-4' />
                                                        Service Details
                                                    </h5>
                                                    <div className='grid grid-cols-2 md:grid-cols-3 gap-3 text-sm'>
                                                        <div>
                                                            <p className='text-gray-600 text-xs mb-1'>
                                                                Lead Time
                                                            </p>
                                                            <p className='font-semibold text-gray-900'>
                                                                {rate.leadTimeDays ||
                                                                    rate.estimatedDays ||
                                                                    '-'}{' '}
                                                                days
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className='text-gray-600 text-xs mb-1'>
                                                                Volumetric
                                                                Divisor
                                                            </p>
                                                            <p className='font-semibold text-gray-900'>
                                                                {rate.volumetricDivisor
                                                                    ? `${rate.volumetricDivisor} cm³/kg`
                                                                    : '6000 cm³/kg (default)'}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className='text-gray-600 text-xs mb-1'>
                                                                Valid Period
                                                            </p>
                                                            <p className='font-semibold text-gray-900 text-xs'>
                                                                {formatDate(
                                                                    rate.validFrom
                                                                )}{' '}
                                                                -{' '}
                                                                {formatDate(
                                                                    rate.validTo
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Surcharges Section */}
                                                <div className='bg-yellow-50 rounded-lg p-3'>
                                                    <h5 className='font-semibold text-gray-700 mb-2 flex items-center gap-2 text-sm'>
                                                        <Fuel className='h-4 w-4' />
                                                        Surcharges & Fees
                                                    </h5>
                                                    <div className='grid grid-cols-2 md:grid-cols-4 gap-3 text-sm'>
                                                        <div>
                                                            <p className='text-gray-600 text-xs mb-1'>
                                                                Fuel Surcharge
                                                            </p>
                                                            <p className='font-semibold text-gray-900'>
                                                                {rate.fuelSurchargePercent
                                                                    ? `${rate.fuelSurchargePercent}%`
                                                                    : '0%'}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className='text-gray-600 text-xs mb-1'>
                                                                Remote Area Fee
                                                            </p>
                                                            <p className='font-semibold text-gray-900'>
                                                                {rate.remoteAreaSurcharge
                                                                    ? formatCurrency(
                                                                          rate.remoteAreaSurcharge
                                                                      )
                                                                    : 'None'}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className='text-gray-600 text-xs mb-1'>
                                                                COD Fee
                                                            </p>
                                                            <p className='font-semibold text-gray-900'>
                                                                {rate.codFeePercent
                                                                    ? `${rate.codFeePercent}%`
                                                                    : '0%'}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className='text-gray-600 text-xs mb-1'>
                                                                Insurance Rate
                                                            </p>
                                                            <p className='font-semibold text-gray-900 flex items-center gap-1'>
                                                                <Shield className='h-3 w-3 text-green-600' />
                                                                {rate.insuranceRatePercent
                                                                    ? `${rate.insuranceRatePercent}%`
                                                                    : '0%'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Additional Info */}
                                                {(rate.minWeight ||
                                                    rate.maxWeight) && (
                                                    <div className='pt-2 border-t border-gray-200'>
                                                        <p className='text-xs text-gray-600 flex items-center gap-2'>
                                                            <Package className='h-3 w-3' />
                                                            {rate.minWeight &&
                                                                `Min: ${rate.minWeight} kg`}
                                                            {rate.minWeight &&
                                                                rate.maxWeight &&
                                                                ' • '}
                                                            {rate.maxWeight &&
                                                                `Max: ${rate.maxWeight} kg`}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className='bg-gray-50 border border-gray-200 rounded-lg p-8 text-center'>
                            <Tag className='h-12 w-12 text-gray-400 mx-auto mb-3' />
                            <p className='text-gray-600 mb-2'>
                                No rates configured yet
                            </p>
                            <p className='text-sm text-gray-500'>
                                Click "Add Rate" to configure pricing for this
                                carrier
                            </p>
                        </div>
                    )}
                </div>

                {/* Features Info */}
                <div className='bg-green-50 border border-green-200 rounded-lg p-4'>
                    <h4 className='font-medium text-green-900 mb-2 flex items-center gap-2'>
                        <Shield className='h-5 w-5' />✅ Rate Management
                        Complete
                    </h4>
                    <p className='text-sm text-green-800 mb-2'>
                        Full CRUD operations now available:
                    </p>
                    <ul className='list-disc list-inside text-sm text-green-800 space-y-1'>
                        <li>
                            Create rates with all 16 fields (pricing,
                            surcharges, lead time)
                        </li>
                        <li>Edit existing rates to correct errors</li>
                        <li>Delete rates with confirmation dialog</li>
                        <li>
                            View all fields in organized, color-coded sections
                        </li>
                    </ul>
                    <div className='mt-3 pt-3 border-t border-green-300'>
                        <p className='text-xs text-green-700 font-medium'>
                            Coming in Phase 2:
                        </p>
                        <p className='text-xs text-green-700'>
                            Rate comparison • Bulk import • Rate history •
                            Dynamic pricing
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className='flex justify-end gap-3 pt-4 border-t border-gray-200'>
                    <Button variant='outline' onClick={onClose}>
                        Close
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
