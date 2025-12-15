'use client';

import SidebarNav from '@/components/SidebarNav';
import Topbar from '@/components/Topbar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className='flex h-screen bg-gray-50'>
            <SidebarNav />
            <div className='flex-1 flex flex-col overflow-hidden'>
                <Topbar />
                <main className='flex-1 overflow-y-auto p-6'>{children}</main>
            </div>
        </div>
    );
}
