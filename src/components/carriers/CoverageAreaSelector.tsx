import React, { useState, useEffect, useMemo } from 'react';
import { Search, ChevronDown, ChevronRight, MapPin, X } from 'lucide-react';
import { coverageAreaApi } from '@/services/coverage-area.service';
import { CoverageArea } from '@/types/coverage-area';
import { getCoverageIcon, getCoverageLabel } from '@/utils/coverage-display';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

interface CoverageAreaSelectorProps {
    selectedIds: string[];
    onChange: (ids: string[]) => void;
    label?: string;
    placeholder?: string;
    maxSelections?: number;
}

const typeLabels = {
    COUNTRY: 'Country',
    REGION: 'Region',
    PROVINCE: 'Province',
    CITY: 'City',
    DISTRICT: 'District',
};

const typeColors = {
    COUNTRY: 'bg-purple-100 text-purple-800',
    REGION: 'bg-blue-100 text-blue-800',
    PROVINCE: 'bg-green-100 text-green-800',
    CITY: 'bg-orange-100 text-orange-800',
    DISTRICT: 'bg-pink-100 text-pink-800',
};

export default function CoverageAreaSelector({
    selectedIds,
    onChange,
    label = 'Coverage Areas',
    placeholder = 'Select coverage areas...',
    maxSelections,
}: CoverageAreaSelectorProps) {
    const [areas, setAreas] = useState<CoverageArea[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [expandedTypes, setExpandedTypes] = useState<Set<string>>(
        new Set(['COUNTRY'])
    );

    useEffect(() => {
        loadAreas();
    }, []);

    const loadAreas = async () => {
        setLoading(true);
        try {
            const data = await coverageAreaApi.getAll({
                isActive: true,
                includeParent: true,
            });
            setAreas(data);
        } catch (error) {
            console.error('Failed to load coverage areas:', error);
        } finally {
            setLoading(false);
        }
    };

    const selectedAreas = useMemo(() => {
        return areas.filter((area) => selectedIds.includes(area.id));
    }, [areas, selectedIds]);

    const filteredAreas = useMemo(() => {
        if (!searchQuery) return areas;
        const query = searchQuery.toLowerCase();
        return areas.filter(
            (area) =>
                area.name.toLowerCase().includes(query) ||
                area.code.toLowerCase().includes(query)
        );
    }, [areas, searchQuery]);

    const groupedAreas = useMemo(() => {
        const types = ['COUNTRY', 'REGION', 'PROVINCE', 'CITY', 'DISTRICT'];
        const grouped: { [key: string]: CoverageArea[] } = {};

        types.forEach((type) => {
            grouped[type] = filteredAreas.filter((area) => area.type === type);
        });

        return grouped;
    }, [filteredAreas]);

    const handleToggle = (id: string) => {
        if (selectedIds.includes(id)) {
            onChange(selectedIds.filter((selectedId) => selectedId !== id));
        } else {
            if (maxSelections && selectedIds.length >= maxSelections) {
                return; // Don't add if max reached
            }
            onChange([...selectedIds, id]);
        }
    };

    const handleRemove = (id: string) => {
        onChange(selectedIds.filter((selectedId) => selectedId !== id));
    };

    const handleClearAll = () => {
        onChange([]);
    };

    const toggleType = (type: string) => {
        const newExpanded = new Set(expandedTypes);
        if (newExpanded.has(type)) {
            newExpanded.delete(type);
        } else {
            newExpanded.add(type);
        }
        setExpandedTypes(newExpanded);
    };

    return (
        <div className='space-y-2'>
            {label && (
                <label className='block text-sm font-medium text-gray-700'>
                    {label}
                    {maxSelections && (
                        <span className='ml-2 text-xs text-gray-500'>
                            ({selectedIds.length}/{maxSelections})
                        </span>
                    )}
                </label>
            )}

            {/* Selected Areas */}
            {selectedAreas.length > 0 && (
                <div className='flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200'>
                    {selectedAreas.map((area) => (
                        <Badge
                            key={area.id}
                            variant='secondary'
                            className='flex items-center gap-1.5 pr-1'
                        >
                            <span className='text-xs'>
                                {getCoverageIcon(area.type)}
                            </span>
                            <span className='text-xs'>
                                {area.name}
                                {(area.type === 'COUNTRY' ||
                                    area.type === 'REGION') &&
                                    ` ${getCoverageLabel(area.type)}`}
                            </span>
                            <button
                                type='button'
                                onClick={() => handleRemove(area.id)}
                                className='ml-1 hover:bg-gray-200 rounded-full p-0.5'
                            >
                                <X className='h-3 w-3' />
                            </button>
                        </Badge>
                    ))}
                    {selectedAreas.length > 1 && (
                        <Button
                            type='button'
                            variant='ghost'
                            size='sm'
                            onClick={handleClearAll}
                            className='text-xs text-red-600 hover:text-red-700'
                        >
                            Clear All
                        </Button>
                    )}
                </div>
            )}

            {/* Dropdown Trigger */}
            <div className='relative'>
                <button
                    type='button'
                    onClick={() => setIsOpen(!isOpen)}
                    className='w-full px-4 py-2.5 text-left bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
                >
                    <span className='text-sm text-gray-600'>{placeholder}</span>
                </button>

                {/* Dropdown Panel */}
                {isOpen && (
                    <div className='absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-96 overflow-hidden'>
                        {/* Search */}
                        <div className='p-3 border-b border-gray-200'>
                            <div className='relative'>
                                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
                                <input
                                    type='text'
                                    placeholder='Search areas...'
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                />
                            </div>
                        </div>

                        {/* Area List */}
                        <div className='overflow-y-auto max-h-80'>
                            {loading ? (
                                <div className='p-8 text-center text-gray-500'>
                                    <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto'></div>
                                    <p className='mt-2 text-sm'>Loading...</p>
                                </div>
                            ) : (
                                <div className='p-2'>
                                    {Object.entries(groupedAreas).map(
                                        ([type, typeAreas]) => {
                                            if (typeAreas.length === 0)
                                                return null;
                                            const isExpanded =
                                                expandedTypes.has(type);

                                            return (
                                                <div
                                                    key={type}
                                                    className='mb-2'
                                                >
                                                    {/* Type Header */}
                                                    <button
                                                        type='button'
                                                        onClick={() =>
                                                            toggleType(type)
                                                        }
                                                        className='w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg text-left'
                                                    >
                                                        {isExpanded ? (
                                                            <ChevronDown className='h-4 w-4 text-gray-500' />
                                                        ) : (
                                                            <ChevronRight className='h-4 w-4 text-gray-500' />
                                                        )}
                                                        <span className='text-sm font-medium text-gray-700'>
                                                            {
                                                                typeLabels[
                                                                    type as keyof typeof typeLabels
                                                                ]
                                                            }
                                                        </span>
                                                        <span className='ml-auto text-xs text-gray-500'>
                                                            {typeAreas.length}
                                                        </span>
                                                    </button>

                                                    {/* Areas */}
                                                    {isExpanded && (
                                                        <div className='ml-6 space-y-1'>
                                                            {typeAreas.map(
                                                                (area) => {
                                                                    const isSelected =
                                                                        selectedIds.includes(
                                                                            area.id
                                                                        );
                                                                    const isDisabled =
                                                                        maxSelections &&
                                                                        selectedIds.length >=
                                                                            maxSelections &&
                                                                        !isSelected;

                                                                    return (
                                                                        <button
                                                                            key={
                                                                                area.id
                                                                            }
                                                                            type='button'
                                                                            onClick={() =>
                                                                                !isDisabled &&
                                                                                handleToggle(
                                                                                    area.id
                                                                                )
                                                                            }
                                                                            disabled={
                                                                                isDisabled
                                                                            }
                                                                            className={`
                                    w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm
                                    ${
                                        isSelected
                                            ? 'bg-blue-50 text-blue-700 font-medium'
                                            : isDisabled
                                            ? 'text-gray-400 cursor-not-allowed'
                                            : 'text-gray-700 hover:bg-gray-50'
                                    }
                                  `}
                                                                        >
                                                                            <span className='mr-1'>
                                                                                {getCoverageIcon(
                                                                                    area.type
                                                                                )}
                                                                            </span>
                                                                            <span className='flex-1'>
                                                                                {
                                                                                    area.name
                                                                                }{' '}
                                                                                {area.type ===
                                                                                    'COUNTRY' ||
                                                                                area.type ===
                                                                                    'REGION' ? (
                                                                                    <span className='text-xs text-gray-500 font-normal'>
                                                                                        {getCoverageLabel(
                                                                                            area.type
                                                                                        )}
                                                                                    </span>
                                                                                ) : null}
                                                                            </span>
                                                                            {area.parent && (
                                                                                <span className='text-xs text-gray-400'>
                                                                                    {
                                                                                        area
                                                                                            .parent
                                                                                            .name
                                                                                    }
                                                                                </span>
                                                                            )}
                                                                            <span
                                                                                className={`text-xs px-2 py-0.5 rounded ${
                                                                                    typeColors[
                                                                                        area
                                                                                            .type
                                                                                    ]
                                                                                }`}
                                                                            >
                                                                                {
                                                                                    area.code
                                                                                }
                                                                            </span>
                                                                        </button>
                                                                    );
                                                                }
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        }
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className='p-3 border-t border-gray-200 bg-gray-50 flex justify-between items-center'>
                            <span className='text-xs text-gray-600'>
                                {selectedIds.length} selected
                            </span>
                            <Button
                                type='button'
                                variant='ghost'
                                size='sm'
                                onClick={() => setIsOpen(false)}
                            >
                                Done
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
