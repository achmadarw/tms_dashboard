'use client';
import { useState, useEffect } from 'react';
import { X, Calendar, Truck, Ship, Plane, Train, Layers } from 'lucide-react';
import Input from '../Form/Input';
import Select from '../Form/Select';

interface TransportPlan {
    id?: string;
    planName: string;
    description?: string;
    transportMode: 'ROAD' | 'SEA' | 'AIR' | 'RAIL' | 'MULTIMODAL';
    estimatedCost: number;
    estimatedTime: number; // minutes
    totalDistance: number; // km
    plannedDate: string;
    status?: 'DRAFT' | 'APPROVED' | 'EXECUTED' | 'CANCELLED';
}

interface PlanFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (plan: TransportPlan) => Promise<void>;
    initialData?: TransportPlan | null;
}

export default function PlanFormModal({
    isOpen,
    onClose,
    onSave,
    initialData,
}: PlanFormModalProps) {
    const [formData, setFormData] = useState<TransportPlan>({
        planName: '',
        description: '',
        transportMode: 'ROAD',
        estimatedCost: 0,
        estimatedTime: 0,
        totalDistance: 0,
        plannedDate: new Date().toISOString().split('T')[0],
        status: 'DRAFT',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                plannedDate: initialData.plannedDate.split('T')[0],
            });
        } else {
            // Reset form for new plan
            setFormData({
                planName: '',
                description: '',
                transportMode: 'ROAD',
                estimatedCost: 0,
                estimatedTime: 0,
                totalDistance: 0,
                plannedDate: new Date().toISOString().split('T')[0],
                status: 'DRAFT',
            });
        }
        setErrors({});
    }, [initialData, isOpen]);

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.planName.trim()) {
            newErrors.planName = 'Plan name is required';
        }
        if (formData.estimatedCost <= 0) {
            newErrors.estimatedCost = 'Cost must be greater than 0';
        }
        if (formData.estimatedTime <= 0) {
            newErrors.estimatedTime = 'Time must be greater than 0';
        }
        if (formData.totalDistance <= 0) {
            newErrors.totalDistance = 'Distance must be greater than 0';
        }
        if (!formData.plannedDate) {
            newErrors.plannedDate = 'Planned date is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        setSaving(true);
        try {
            // Convert date to ISO string with time
            const planData = {
                ...formData,
                plannedDate: new Date(formData.plannedDate).toISOString(),
            };
            await onSave(planData);
            onClose();
        } catch (error) {
            console.error('Error saving plan:', error);
            setErrors({ submit: 'Failed to save plan. Please try again.' });
        } finally {
            setSaving(false);
        }
    };

    const getModeIcon = (mode: string) => {
        const icons: Record<string, any> = {
            ROAD: Truck,
            SEA: Ship,
            AIR: Plane,
            RAIL: Train,
            MULTIMODAL: Layers,
        };
        return icons[mode] || Truck;
    };

    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
            <div className='bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
                {/* Header */}
                <div className='flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white'>
                    <h2 className='text-2xl font-bold text-gray-900'>
                        {initialData
                            ? 'Edit Transport Plan'
                            : 'Create New Transport Plan'}
                    </h2>
                    <button
                        onClick={onClose}
                        className='p-2 hover:bg-gray-100 rounded-lg transition'
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className='p-6 space-y-6'>
                    {/* Plan Name */}
                    <div>
                        <Input
                            label='Plan Name *'
                            placeholder='e.g., Jakarta to Surabaya - Week 50'
                            value={formData.planName}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                                setFormData({
                                    ...formData,
                                    planName: e.target.value,
                                })
                            }
                            error={errors.planName}
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(
                                e: React.ChangeEvent<HTMLTextAreaElement>
                            ) =>
                                setFormData({
                                    ...formData,
                                    description: e.target.value,
                                })
                            }
                            placeholder='Add plan details...'
                            rows={3}
                            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                        />
                    </div>

                    {/* Transport Mode */}
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Transport Mode *
                        </label>
                        <div className='grid grid-cols-5 gap-2'>
                            {['ROAD', 'SEA', 'AIR', 'RAIL', 'MULTIMODAL'].map(
                                (mode) => {
                                    const Icon = getModeIcon(mode);
                                    const isSelected =
                                        formData.transportMode === mode;
                                    return (
                                        <button
                                            key={mode}
                                            type='button'
                                            onClick={() =>
                                                setFormData({
                                                    ...formData,
                                                    transportMode: mode as any,
                                                })
                                            }
                                            className={`p-3 rounded-lg border-2 flex flex-col items-center gap-1 transition ${
                                                isSelected
                                                    ? 'border-blue-600 bg-blue-50 text-blue-600'
                                                    : 'border-gray-300 hover:border-gray-400'
                                            }`}
                                        >
                                            <Icon size={20} />
                                            <span className='text-xs font-medium'>
                                                {mode}
                                            </span>
                                        </button>
                                    );
                                }
                            )}
                        </div>
                    </div>

                    {/* Grid: Cost, Time, Distance */}
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                        <div>
                            <Input
                                label='Estimated Cost (IDR) *'
                                type='number'
                                min='0'
                                step='1000'
                                value={formData.estimatedCost}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) =>
                                    setFormData({
                                        ...formData,
                                        estimatedCost: Number(e.target.value),
                                    })
                                }
                                error={errors.estimatedCost}
                            />
                        </div>
                        <div>
                            <Input
                                label='Estimated Time (minutes) *'
                                type='number'
                                min='0'
                                step='15'
                                value={formData.estimatedTime}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) =>
                                    setFormData({
                                        ...formData,
                                        estimatedTime: Number(e.target.value),
                                    })
                                }
                                error={errors.estimatedTime}
                            />
                            {formData.estimatedTime > 0 && (
                                <div className='text-xs text-gray-600 mt-1'>
                                    ≈ {Math.floor(formData.estimatedTime / 60)}h{' '}
                                    {formData.estimatedTime % 60}m
                                </div>
                            )}
                        </div>
                        <div>
                            <Input
                                label='Total Distance (km) *'
                                type='number'
                                min='0'
                                step='0.1'
                                value={formData.totalDistance}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) =>
                                    setFormData({
                                        ...formData,
                                        totalDistance: Number(e.target.value),
                                    })
                                }
                                error={errors.totalDistance}
                            />
                        </div>
                    </div>

                    {/* Planned Date */}
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                            <Calendar size={16} className='inline mr-2' />
                            Planned Date *
                        </label>
                        <input
                            type='date'
                            value={formData.plannedDate}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                                setFormData({
                                    ...formData,
                                    plannedDate: e.target.value,
                                })
                            }
                            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                        />
                        {errors.plannedDate && (
                            <p className='text-red-500 text-sm mt-1'>
                                {errors.plannedDate}
                            </p>
                        )}
                    </div>

                    {/* Status (for edit only) */}
                    {initialData && (
                        <div>
                            <Select
                                label='Status'
                                options={[
                                    { value: 'DRAFT', label: 'Draft' },
                                    { value: 'APPROVED', label: 'Approved' },
                                    { value: 'EXECUTED', label: 'Executed' },
                                    { value: 'CANCELLED', label: 'Cancelled' },
                                ]}
                                value={formData.status || 'DRAFT'}
                                onChange={(
                                    e: React.ChangeEvent<HTMLSelectElement>
                                ) =>
                                    setFormData({
                                        ...formData,
                                        status: e.target.value as any,
                                    })
                                }
                            />
                        </div>
                    )}

                    {/* Error Message */}
                    {errors.submit && (
                        <div className='p-4 bg-red-50 border border-red-200 rounded-lg'>
                            <p className='text-red-700 text-sm'>
                                {errors.submit}
                            </p>
                        </div>
                    )}

                    {/* Footer Buttons */}
                    <div className='flex items-center justify-end gap-3 pt-4 border-t border-gray-200'>
                        <button
                            type='button'
                            onClick={onClose}
                            className='px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition'
                            disabled={saving}
                        >
                            Cancel
                        </button>
                        <button
                            type='submit'
                            className='px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed'
                            disabled={saving}
                        >
                            {saving
                                ? 'Saving...'
                                : initialData
                                ? 'Update Plan'
                                : 'Create Plan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
