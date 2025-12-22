'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { apiClient } from '@/lib/api';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import StatCard from '@/components/ui/StatCard';
import RouteBuilderForm from '@/components/planning/RouteBuilderForm';
import CostEstimationPanel from '@/components/planning/CostEstimationPanel';
import PlansList from '@/components/planning/PlansList';
import PlanFormModal from '@/components/planning/PlanFormModal';
import {
    Settings,
    Plus,
    Route as RouteIcon,
    TrendingUp,
    FileText,
    DollarSign,
    Clock,
    CheckCircle,
    Loader2,
    RefreshCw,
} from 'lucide-react';

interface Waypoint {
    id: string;
    address: string;
    lat: number;
    lng: number;
}

interface RouteData {
    origin: Waypoint | null;
    destination: Waypoint | null;
    waypoints: Waypoint[];
}

interface CostBreakdown {
    baseCost: number;
    fuelCost: number;
    tollCost: number;
    additionalCost: number;
    totalCost: number;
}

interface TransportPlan {
    id: string;
    planName: string;
    description?: string;
    transportMode: 'ROAD' | 'SEA' | 'AIR' | 'RAIL' | 'MULTIMODAL';
    estimatedCost: number;
    estimatedTime: number;
    totalDistance: number;
    plannedDate: string;
    status: 'DRAFT' | 'APPROVED' | 'EXECUTED' | 'CANCELLED';
    createdAt: string;
}

interface OptimizedRoute {
    distance: number;
    duration: number;
    fuelCost: number;
    tollCost: number;
    totalCost: number;
    optimizedWaypoints: Array<{ lat: number; lng: number; address: string }>;
}

export default function PlanningPage() {
    const [plans, setPlans] = useState<TransportPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [optimizing, setOptimizing] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState<TransportPlan | null>(null);

    const [routeData, setRouteData] = useState<RouteData>({
        origin: null,
        destination: null,
        waypoints: [],
    });
    const [costData, setCostData] = useState<CostBreakdown>({
        baseCost: 0,
        fuelCost: 0,
        tollCost: 0,
        additionalCost: 0,
        totalCost: 0,
    });
    const [optimizedRoute, setOptimizedRoute] = useState<OptimizedRoute | null>(
        null
    );

    // Load plans on mount
    useEffect(() => {
        loadPlans();
    }, []);

    const loadPlans = async () => {
        try {
            setLoading(true);
            const response = await apiClient.planning.getAll();
            setPlans(response.data);
        } catch (error) {
            console.error('Error loading plans:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRouteChange = (data: RouteData) => {
        setRouteData(data);
    };

    const handleCostChange = useCallback((costs: CostBreakdown) => {
        setCostData(costs);
    }, []);

    const handleOptimizeRoute = async () => {
        if (!routeData.origin || !routeData.destination) {
            alert('Please set origin and destination');
            return;
        }

        try {
            setOptimizing(true);
            const response = await apiClient.routes.optimize({
                origin: {
                    lat: routeData.origin.lat,
                    lng: routeData.origin.lng,
                    address: routeData.origin.address,
                },
                destination: {
                    lat: routeData.destination.lat,
                    lng: routeData.destination.lng,
                    address: routeData.destination.address,
                },
                waypoints: routeData.waypoints.map((wp) => ({
                    lat: wp.lat,
                    lng: wp.lng,
                    address: wp.address,
                })),
            });
            setOptimizedRoute(response.data);
        } catch (error) {
            console.error('Error optimizing route:', error);
            alert('Failed to optimize route');
        } finally {
            setOptimizing(false);
        }
    };

    const handleCreatePlan = async (
        planData: Omit<TransportPlan, 'id' | 'createdAt'>
    ) => {
        try {
            await apiClient.planning.create(planData);
            await loadPlans();
            setModalOpen(false);
        } catch (error) {
            console.error('Error creating plan:', error);
            throw error;
        }
    };

    const handleUpdatePlan = async (planData: TransportPlan) => {
        if (!editingPlan?.id) return;

        try {
            await apiClient.planning.update(editingPlan.id, planData);
            await loadPlans();
            setModalOpen(false);
            setEditingPlan(null);
        } catch (error) {
            console.error('Error updating plan:', error);
            throw error;
        }
    };

    const handleDeletePlan = async (planId: string) => {
        if (!confirm('Are you sure you want to delete this plan?')) {
            return;
        }

        try {
            // Note: Backend needs DELETE endpoint implementation
            // For now, update status to CANCELLED
            await apiClient.planning.update(planId, { status: 'CANCELLED' });
            await loadPlans();
        } catch (error) {
            console.error('Error deleting plan:', error);
            alert('Failed to delete plan');
        }
    };

    const handleEditPlan = (plan: TransportPlan) => {
        setEditingPlan(plan);
        setModalOpen(true);
    };

    const handleViewPlan = (plan: TransportPlan) => {
        // Future: Show plan details in a separate view
        console.log('View plan:', plan);
    };

    const handleCreateFromRoute = () => {
        if (!optimizedRoute || !routeData.origin || !routeData.destination) {
            alert('Please optimize a route first');
            return;
        }

        // Pre-fill modal with optimized route data
        setEditingPlan({
            id: '',
            planName: `${routeData.origin.address} to ${routeData.destination.address}`,
            description: `Route with ${routeData.waypoints.length} waypoints`,
            transportMode: 'ROAD',
            estimatedCost: costData.totalCost,
            estimatedTime: optimizedRoute.duration,
            totalDistance: optimizedRoute.distance,
            plannedDate: new Date().toISOString(),
            status: 'DRAFT',
            createdAt: new Date().toISOString(),
        });
        setModalOpen(true);
    };

    // Statistics
    const stats = useMemo(() => {
        const total = plans.length;
        const draft = plans.filter((p) => p.status === 'DRAFT').length;
        const approved = plans.filter((p) => p.status === 'APPROVED').length;
        const executed = plans.filter((p) => p.status === 'EXECUTED').length;
        const totalCost = plans.reduce(
            (sum, p) => sum + Number(p.estimatedCost),
            0
        );
        const avgCost = total > 0 ? totalCost / total : 0;

        return { total, draft, approved, executed, avgCost };
    }, [plans]);

    if (loading) {
        return (
            <div className='flex items-center justify-center h-[calc(100vh-200px)]'>
                <div className='text-center'>
                    <Loader2 className='h-12 w-12 animate-spin text-blue-600 mx-auto mb-4' />
                    <p className='text-gray-600'>Loading plans...</p>
                </div>
            </div>
        );
    }

    return (
        <div className='space-y-6'>
            {/* Page Header */}
            <PageHeader
                title='Transportation Planning'
                description='Optimize routes and manage transportation plans'
                icon={Settings}
                actions={
                    <>
                        <Button
                            variant='outline'
                            icon={RefreshCw}
                            onClick={loadPlans}
                        >
                            Refresh
                        </Button>
                        <Button
                            variant='primary'
                            icon={Plus}
                            onClick={() => {
                                setEditingPlan(null);
                                setModalOpen(true);
                            }}
                        >
                            Create Plan
                        </Button>
                    </>
                }
            />

            {/* Stats Cards */}
            <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
                <StatCard
                    title='Total Plans'
                    value={stats.total}
                    icon={FileText}
                    color='blue'
                />
                <StatCard
                    title='Draft'
                    value={stats.draft}
                    icon={Clock}
                    color='yellow'
                />
                <StatCard
                    title='Approved'
                    value={stats.approved}
                    icon={CheckCircle}
                    color='green'
                />
                <StatCard
                    title='Avg Cost'
                    value={`Rp ${(stats.avgCost / 1000).toFixed(0)}K`}
                    icon={DollarSign}
                    color='purple'
                />
            </div>

            {/* Route Optimization Section */}
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                {/* Route Builder */}
                <div className='lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
                    <h3 className='font-semibold text-gray-900 mb-4 flex items-center gap-2'>
                        <RouteIcon size={20} className='text-blue-600' />
                        Route Builder
                    </h3>
                    <RouteBuilderForm onRouteChange={handleRouteChange} />

                    <div className='mt-6 flex gap-3'>
                        <Button
                            variant='primary'
                            onClick={handleOptimizeRoute}
                            disabled={
                                !routeData.origin ||
                                !routeData.destination ||
                                optimizing
                            }
                            className='flex-1'
                        >
                            {optimizing ? (
                                <>
                                    <Loader2 className='h-4 w-4 animate-spin' />
                                    Optimizing...
                                </>
                            ) : (
                                'Optimize Route'
                            )}
                        </Button>
                        {optimizedRoute && (
                            <Button
                                variant='success'
                                onClick={handleCreateFromRoute}
                            >
                                Create Plan
                            </Button>
                        )}
                    </div>

                    {/* Optimized Route Results */}
                    {optimizedRoute && (
                        <div className='mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200'>
                            <h4 className='font-semibold text-blue-900 mb-3 flex items-center gap-2'>
                                <TrendingUp size={18} />
                                Optimized Route
                            </h4>
                            <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-sm'>
                                <div>
                                    <span className='text-gray-600'>
                                        Distance:
                                    </span>{' '}
                                    <span className='font-semibold text-gray-900 block'>
                                        {optimizedRoute.distance.toFixed(1)} km
                                    </span>
                                </div>
                                <div>
                                    <span className='text-gray-600'>
                                        Duration:
                                    </span>{' '}
                                    <span className='font-semibold text-gray-900 block'>
                                        {Math.floor(
                                            optimizedRoute.duration / 60
                                        )}
                                        h {optimizedRoute.duration % 60}m
                                    </span>
                                </div>
                                <div>
                                    <span className='text-gray-600'>
                                        Fuel Cost:
                                    </span>{' '}
                                    <span className='font-semibold text-gray-900 block'>
                                        Rp{' '}
                                        {optimizedRoute.fuelCost.toLocaleString()}
                                    </span>
                                </div>
                                <div>
                                    <span className='text-gray-600'>
                                        Total Cost:
                                    </span>{' '}
                                    <span className='font-semibold text-green-700 block'>
                                        Rp{' '}
                                        {optimizedRoute.totalCost.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Cost Estimation - Sticky Sidebar */}
                <div className='lg:sticky lg:top-6 lg:self-start'>
                    <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
                        <CostEstimationPanel
                            distance={optimizedRoute?.distance || 0}
                            duration={optimizedRoute?.duration || 0}
                            onCostChange={handleCostChange}
                        />
                    </div>
                </div>
            </div>

            {/* Transport Plans List */}
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
                <h2 className='text-xl font-semibold text-gray-900 mb-4'>
                    Transport Plans
                </h2>
                <PlansList
                    plans={plans}
                    loading={loading}
                    onEdit={handleEditPlan}
                    onDelete={handleDeletePlan}
                    onView={handleViewPlan}
                />
            </div>

            {/* Plan Form Modal */}
            <PlanFormModal
                isOpen={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setEditingPlan(null);
                }}
                onSave={editingPlan?.id ? handleUpdatePlan : handleCreatePlan}
                initialData={editingPlan}
            />
        </div>
    );
}
