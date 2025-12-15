'use client';

import {
    Home,
    Truck,
    Package,
    Map,
    BarChart,
    Users,
    FileText,
    Settings,
    Link2,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
    { href: '/dashboard', icon: Home, label: 'Dashboard' },
    { href: '/dashboard/orders', icon: Package, label: 'Orders' },
    { href: '/dashboard/shipments', icon: Truck, label: 'Shipments' },
    { href: '/dashboard/fleet', icon: Truck, label: 'Fleet' },
    { href: '/dashboard/carriers', icon: Users, label: 'Carriers' },
    { href: '/dashboard/planning', icon: Settings, label: 'Planning' },
    { href: '/dashboard/tracking', icon: Map, label: 'Tracking' },
    { href: '/dashboard/documents', icon: FileText, label: 'Documents' },
    { href: '/dashboard/analytics', icon: BarChart, label: 'Analytics' },
    { href: '/dashboard/integration', icon: Link2, label: 'Integration' },
];

export default function SidebarNav() {
    const pathname = usePathname();

    return (
        <aside className='w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white flex flex-col shadow-2xl'>
            {/* Logo Section */}
            <div className='p-6 border-b border-blue-700'>
                <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 bg-white rounded-lg flex items-center justify-center'>
                        <Truck className='h-6 w-6 text-blue-600' />
                    </div>
                    <div>
                        <h1 className='text-xl font-bold'>TMS Pro</h1>
                        <p className='text-xs text-blue-300'>
                            Transport Management
                        </p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className='flex-1 p-4 space-y-1 overflow-y-auto'>
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                                isActive
                                    ? 'bg-white text-blue-900 shadow-lg font-semibold'
                                    : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                            }`}
                        >
                            <Icon className='h-5 w-5' />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className='p-4 border-t border-blue-700'>
                <div className='text-xs text-blue-300 text-center'>
                    © 2025 TMS Professional
                </div>
            </div>
        </aside>
    );
}
