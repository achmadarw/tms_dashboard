import React from 'react';
import { Bell, Search, Settings } from 'lucide-react';

export default function Topbar({ userName = 'Admin' }: { userName?: string }) {
    return (
        <header className='flex items-center justify-between px-6 py-4 bg-white shadow-md border-b-2 border-gray-100'>
            {/* Search Bar */}
            <div className='flex-1 max-w-xl'>
                <div className='relative'>
                    <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400' />
                    <input
                        type='text'
                        placeholder='Search orders, shipments, vehicles...'
                        className='w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors'
                    />
                </div>
            </div>

            {/* Right Side Actions */}
            <div className='flex items-center gap-3 ml-4'>
                {/* Notifications */}
                <button className='relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all'>
                    <Bell className='h-5 w-5' />
                    <span className='absolute top-1 right-1 w-2.5 h-2.5 bg-gradient-to-br from-red-500 to-pink-500 rounded-full border-2 border-white animate-pulse'></span>
                </button>

                {/* Settings */}
                <button className='p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all'>
                    <Settings className='h-5 w-5' />
                </button>

                {/* Divider */}
                <div className='w-px h-8 bg-gray-200'></div>

                {/* User Profile */}
                <div className='flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-all'>
                    <div className='text-right'>
                        <p className='text-sm font-semibold text-gray-800'>
                            {userName}
                        </p>
                        <p className='text-xs text-gray-500'>Administrator</p>
                    </div>
                    <div className='w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg'>
                        {userName.charAt(0).toUpperCase()}
                    </div>
                </div>
            </div>
        </header>
    );
}
