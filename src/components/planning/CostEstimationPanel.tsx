'use client';
import { useState, useEffect } from 'react';
import { DollarSign, Fuel, Receipt, Calculator } from 'lucide-react';

interface CostBreakdown {
    baseCost: number;
    fuelCost: number;
    tollCost: number;
    additionalCost: number;
    totalCost: number;
}

interface CostEstimationPanelProps {
    distance?: number; // in km
    duration?: number; // in minutes
    onCostChange: (costs: CostBreakdown) => void;
}

export default function CostEstimationPanel({
    distance = 0,
    duration = 0,
    onCostChange,
}: CostEstimationPanelProps) {
    const [baseCost, setBaseCost] = useState(0);
    const [fuelCost, setFuelCost] = useState(0);
    const [tollCost, setTollCost] = useState(0);
    const [additionalCost, setAdditionalCost] = useState(0);
    const [totalCost, setTotalCost] = useState(0);

    // Auto-calculate costs based on distance
    useEffect(() => {
        if (distance > 0) {
            // Cost calculation formulas
            const calculatedBaseCost = distance * 2000; // Rp 2,000/km base rate
            const fuelConsumption = distance / 8; // 8 km/liter
            const fuelPrice = 6800; // Rp 6,800/liter
            const calculatedFuelCost = fuelConsumption * fuelPrice;
            const calculatedTollCost = Math.floor(distance / 100) * 50000; // Rp 50k per 100km

            setBaseCost(calculatedBaseCost);
            setFuelCost(calculatedFuelCost);
            setTollCost(calculatedTollCost);
        }
    }, [distance]);

    // Calculate total whenever any cost changes
    useEffect(() => {
        const total = baseCost + fuelCost + tollCost + additionalCost;
        setTotalCost(total);
        onCostChange({
            baseCost,
            fuelCost,
            tollCost,
            additionalCost,
            totalCost: total,
        });
    }, [baseCost, fuelCost, tollCost, additionalCost, onCostChange]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);
    };

    const CostItem = ({
        icon: Icon,
        label,
        value,
        onChange,
        color,
        bgColor,
    }: {
        icon: any;
        label: string;
        value: number;
        onChange: (val: number) => void;
        color: string;
        bgColor: string;
    }) => (
        <div className='group'>
            <div className='flex items-center justify-between mb-2'>
                <div className='flex items-center gap-2'>
                    <div className={`p-1.5 ${bgColor} rounded-md`}>
                        <Icon size={14} className={color} />
                    </div>
                    <span className='text-xs font-semibold text-gray-700 uppercase tracking-wide'>
                        {label}
                    </span>
                </div>
                <button
                    onClick={() => onChange(0)}
                    className='text-xs text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity'
                >
                    Reset
                </button>
            </div>
            <div className='relative'>
                <input
                    type='number'
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className='w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all'
                    min='0'
                    step='1000'
                    placeholder='0'
                />
            </div>
            <div className='mt-1.5 text-xs font-medium text-gray-600'>
                {formatCurrency(value)}
            </div>
        </div>
    );

    return (
        <div className='space-y-5'>
            <div className='flex items-center justify-between'>
                <h3 className='font-semibold text-gray-900 flex items-center gap-2'>
                    <Calculator size={20} className='text-blue-600' />
                    Cost Estimation
                </h3>
                {distance > 0 && (
                    <div className='text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full'>
                        {distance.toFixed(1)} km
                    </div>
                )}
            </div>

            {/* Cost Inputs - Single Column for compact layout */}
            <div className='space-y-4'>
                <CostItem
                    icon={DollarSign}
                    label='Base Cost'
                    value={baseCost}
                    onChange={setBaseCost}
                    color='text-blue-600'
                    bgColor='bg-blue-50'
                />
                <CostItem
                    icon={Fuel}
                    label='Fuel Cost'
                    value={fuelCost}
                    onChange={setFuelCost}
                    color='text-orange-600'
                    bgColor='bg-orange-50'
                />
                <CostItem
                    icon={Receipt}
                    label='Toll Cost'
                    value={tollCost}
                    onChange={setTollCost}
                    color='text-purple-600'
                    bgColor='bg-purple-50'
                />
                <CostItem
                    icon={Calculator}
                    label='Additional Cost'
                    value={additionalCost}
                    onChange={setAdditionalCost}
                    color='text-green-600'
                    bgColor='bg-green-50'
                />
            </div>

            {/* Total Cost Display - More Compact */}
            <div className='mt-6 p-5 bg-gradient-to-br from-blue-600 via-blue-600 to-blue-700 rounded-xl text-white shadow-lg'>
                <div className='flex items-center justify-between mb-2'>
                    <div className='text-xs font-semibold uppercase tracking-wider opacity-90'>
                        Total Estimated Cost
                    </div>
                    <DollarSign size={18} className='opacity-75' />
                </div>
                <div className='text-2xl font-bold tracking-tight'>
                    {formatCurrency(totalCost)}
                </div>
                {duration > 0 && (
                    <div className='mt-3 pt-3 border-t border-blue-500/30 text-sm opacity-90'>
                        Est. Duration: {Math.floor(duration / 60)}h{' '}
                        {duration % 60}m
                    </div>
                )}
            </div>

            {/* Cost Breakdown Chart - More Compact */}
            {totalCost > 0 && (
                <div className='space-y-3'>
                    <div className='text-xs font-semibold text-gray-700 uppercase tracking-wide'>
                        Cost Breakdown
                    </div>
                    <div className='space-y-2'>
                        {[
                            {
                                label: 'Base',
                                value: baseCost,
                                color: 'bg-blue-500',
                            },
                            {
                                label: 'Fuel',
                                value: fuelCost,
                                color: 'bg-orange-500',
                            },
                            {
                                label: 'Toll',
                                value: tollCost,
                                color: 'bg-purple-500',
                            },
                            {
                                label: 'Extra',
                                value: additionalCost,
                                color: 'bg-green-500',
                            },
                        ].map((item) => {
                            const percentage =
                                totalCost > 0
                                    ? (item.value / totalCost) * 100
                                    : 0;
                            return (
                                <div
                                    key={item.label}
                                    className='flex items-center gap-2'
                                >
                                    <div className='w-12 text-xs text-gray-600 font-medium'>
                                        {item.label}
                                    </div>
                                    <div className='flex-1 h-5 bg-gray-100 rounded-full overflow-hidden'>
                                        <div
                                            className={`h-full ${item.color} transition-all duration-300`}
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                    <div className='w-12 text-xs text-gray-900 text-right font-semibold'>
                                        {percentage.toFixed(0)}%
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
