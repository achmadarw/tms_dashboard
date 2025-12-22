'use client';

import { useState } from 'react';
import { Calculator, TrendingUp, Truck, Star } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface RateComparison {
    carrierId: string;
    carrierName: string;
    carrierRating: number | null;
    onTimeRate: number | null;
    serviceType: string;
    totalCost: number;
    breakdown: {
        baseRate: number;
        weightCost: number;
        distanceCost: number;
    };
}

export default function RateCalculator() {
    const [formData, setFormData] = useState({
        originCity: '',
        destinationCity: '',
        weight: '',
        distance: '',
    });
    const [results, setResults] = useState<RateComparison[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleCalculate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResults([]);

        try {
            const params = new URLSearchParams({
                originCity: formData.originCity,
                destinationCity: formData.destinationCity,
                weight: formData.weight,
                distance: formData.distance,
            });

            const response = await fetch(
                `${API_BASE_URL}/carriers/compare-rates?${params}`
            );

            if (!response.ok) {
                throw new Error('Failed to compare rates');
            }

            const data = await response.json();
            setResults(data);

            if (data.length === 0) {
                setError(
                    'No rates found for this route. Try a different route.'
                );
            }
        } catch (err) {
            setError(
                err instanceof Error ? err.message : 'Failed to calculate rates'
            );
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
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
        <div className='space-y-6'>
            {/* Header */}
            <div className='bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white'>
                <div className='flex items-center gap-3 mb-2'>
                    <Calculator className='h-8 w-8' />
                    <h2 className='text-2xl font-bold'>
                        Rate Calculator & Comparison
                    </h2>
                </div>
                <p className='text-blue-100'>
                    Compare shipping rates across all carriers for your route
                </p>
            </div>

            {/* Calculator Form */}
            <div className='bg-white rounded-lg shadow-md p-6'>
                <form onSubmit={handleCalculate} className='space-y-4'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Origin City
                            </label>
                            <input
                                type='text'
                                name='originCity'
                                value={formData.originCity}
                                onChange={handleChange}
                                placeholder='e.g., Jakarta'
                                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                required
                            />
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Destination City
                            </label>
                            <input
                                type='text'
                                name='destinationCity'
                                value={formData.destinationCity}
                                onChange={handleChange}
                                placeholder='e.g., Surabaya'
                                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                required
                            />
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Weight (kg)
                            </label>
                            <input
                                type='number'
                                name='weight'
                                value={formData.weight}
                                onChange={handleChange}
                                placeholder='e.g., 100'
                                min='0'
                                step='0.1'
                                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                required
                            />
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Distance (km)
                            </label>
                            <input
                                type='number'
                                name='distance'
                                value={formData.distance}
                                onChange={handleChange}
                                placeholder='e.g., 800'
                                min='0'
                                step='0.1'
                                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                required
                            />
                        </div>
                    </div>

                    <Button
                        type='submit'
                        className='w-full md:w-auto'
                        disabled={loading}
                    >
                        <Calculator className='h-4 w-4 mr-2' />
                        {loading ? 'Calculating...' : 'Compare Rates'}
                    </Button>
                </form>
            </div>

            {/* Error Message */}
            {error && (
                <div className='bg-red-50 border border-red-200 rounded-lg p-4 text-red-800'>
                    {error}
                </div>
            )}

            {/* Results */}
            {results.length > 0 && (
                <div className='bg-white rounded-lg shadow-md overflow-hidden'>
                    <div className='bg-gray-50 px-6 py-4 border-b border-gray-200'>
                        <div className='flex items-center justify-between'>
                            <div>
                                <h3 className='text-lg font-semibold text-gray-900'>
                                    Comparison Results
                                </h3>
                                <p className='text-sm text-gray-600'>
                                    {formData.originCity} →{' '}
                                    {formData.destinationCity} |{' '}
                                    {formData.weight} kg | {formData.distance}{' '}
                                    km
                                </p>
                            </div>
                            <Badge variant='success'>
                                {results.length} Options Found
                            </Badge>
                        </div>
                    </div>

                    <div className='overflow-x-auto'>
                        <table className='w-full'>
                            <thead className='bg-gray-100'>
                                <tr>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider'>
                                        Rank
                                    </th>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider'>
                                        Carrier
                                    </th>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider'>
                                        Service Type
                                    </th>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider'>
                                        Total Cost
                                    </th>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider'>
                                        Breakdown
                                    </th>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider'>
                                        Rating
                                    </th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-gray-200'>
                                {results.map((result, index) => (
                                    <tr
                                        key={`${result.carrierId}-${result.serviceType}`}
                                        className={`hover:bg-gray-50 transition-colors ${
                                            index === 0 ? 'bg-green-50' : ''
                                        }`}
                                    >
                                        <td className='px-6 py-4 whitespace-nowrap'>
                                            {index === 0 ? (
                                                <div className='flex items-center gap-1'>
                                                    <TrendingUp className='h-4 w-4 text-green-600' />
                                                    <span className='text-sm font-bold text-green-600'>
                                                        Best
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className='text-sm text-gray-600'>
                                                    #{index + 1}
                                                </span>
                                            )}
                                        </td>
                                        <td className='px-6 py-4'>
                                            <div className='flex items-center gap-2'>
                                                <Truck className='h-4 w-4 text-gray-400' />
                                                <span className='font-medium text-gray-900'>
                                                    {result.carrierName}
                                                </span>
                                            </div>
                                        </td>
                                        <td className='px-6 py-4'>
                                            {getServiceTypeBadge(
                                                result.serviceType
                                            )}
                                        </td>
                                        <td className='px-6 py-4'>
                                            <div className='text-lg font-bold text-gray-900'>
                                                {formatCurrency(
                                                    result.totalCost
                                                )}
                                            </div>
                                            {index > 0 && (
                                                <div className='text-xs text-red-600'>
                                                    +
                                                    {formatCurrency(
                                                        result.totalCost -
                                                            results[0].totalCost
                                                    )}{' '}
                                                    vs best
                                                </div>
                                            )}
                                        </td>
                                        <td className='px-6 py-4'>
                                            <div className='text-xs text-gray-600 space-y-1'>
                                                <div>
                                                    Base:{' '}
                                                    {formatCurrency(
                                                        result.breakdown
                                                            .baseRate
                                                    )}
                                                </div>
                                                <div>
                                                    Weight:{' '}
                                                    {formatCurrency(
                                                        result.breakdown
                                                            .weightCost
                                                    )}
                                                </div>
                                                <div>
                                                    Distance:{' '}
                                                    {formatCurrency(
                                                        result.breakdown
                                                            .distanceCost
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className='px-6 py-4'>
                                            <div className='space-y-1'>
                                                {result.carrierRating && (
                                                    <div className='flex items-center gap-1'>
                                                        <Star className='h-3 w-3 text-yellow-500 fill-yellow-500' />
                                                        <span className='text-sm text-gray-700'>
                                                            {result.carrierRating.toFixed(
                                                                1
                                                            )}
                                                        </span>
                                                    </div>
                                                )}
                                                {result.onTimeRate && (
                                                    <div className='text-xs text-gray-600'>
                                                        On-time:{' '}
                                                        {result.onTimeRate.toFixed(
                                                            0
                                                        )}
                                                        %
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Tips */}
            <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
                <h4 className='font-medium text-blue-900 mb-2'>💡 Tips</h4>
                <ul className='text-sm text-blue-800 space-y-1 list-disc list-inside'>
                    <li>Results are sorted by total cost (lowest first)</li>
                    <li>
                        Only shows carriers with rates configured for this route
                    </li>
                    <li>
                        Rates must be valid (within validFrom and validTo dates)
                    </li>
                    <li>
                        Total cost includes base rate + weight charge + distance
                        charge
                    </li>
                    <li>
                        Minimum charge applies if total is below carrier's
                        minimum
                    </li>
                </ul>
            </div>
        </div>
    );
}
