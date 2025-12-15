'use client';
import { useState } from 'react';
import Card from '@/components/Card';
import Input from '@/components/Form/Input';
import { Link2, Key, Webhook, Database } from 'lucide-react';

export default function IntegrationPage() {
    const [apiKey, setApiKey] = useState('tms_api_key_xxxxxxxxxxxxxxxx');

    function generateNewKey() {
        setApiKey('tms_api_key_' + Math.random().toString(36).substring(2, 15));
    }

    return (
        <div className='space-y-6'>
            <div>
                <h1 className='text-3xl font-bold text-gray-900 flex items-center gap-2'>
                    <Link2 className='text-blue-600' /> Integration & API
                </h1>
                <p className='text-gray-600 mt-1'>
                    Connect with external systems and manage API access
                </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <Card
                    title='Active Integrations'
                    value={5}
                    icon={<Link2 className='text-blue-600' size={32} />}
                />
                <Card
                    title='API Calls (Today)'
                    value='12,450'
                    icon={<Database className='text-green-600' size={32} />}
                />
                <Card
                    title='Webhooks'
                    value={8}
                    icon={<Webhook className='text-purple-600' size={32} />}
                />
            </div>

            <div className='bg-white rounded-xl shadow p-6'>
                <h3 className='font-semibold text-gray-900 mb-4 flex items-center gap-2'>
                    <Key size={20} className='text-blue-600' /> API Key
                    Management
                </h3>
                <div className='space-y-4'>
                    <Input label='Your API Key' value={apiKey} readOnly />
                    <button
                        onClick={generateNewKey}
                        className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition'
                    >
                        Generate New Key
                    </button>
                </div>
            </div>

            <div className='bg-white rounded-xl shadow p-6'>
                <h3 className='font-semibold text-gray-900 mb-4'>
                    API Documentation
                </h3>
                <div className='space-y-3'>
                    <div className='p-4 bg-gray-50 rounded-lg'>
                        <div className='font-semibold text-sm'>
                            GET /api/orders
                        </div>
                        <div className='text-xs text-gray-600'>
                            Retrieve all orders
                        </div>
                    </div>
                    <div className='p-4 bg-gray-50 rounded-lg'>
                        <div className='font-semibold text-sm'>
                            POST /api/shipments
                        </div>
                        <div className='text-xs text-gray-600'>
                            Create new shipment
                        </div>
                    </div>
                    <div className='p-4 bg-gray-50 rounded-lg'>
                        <div className='font-semibold text-sm'>
                            GET /api/tracking/:id
                        </div>
                        <div className='text-xs text-gray-600'>
                            Track shipment by ID
                        </div>
                    </div>
                </div>
                <a
                    href='/api/docs'
                    target='_blank'
                    className='mt-4 inline-block text-blue-600 hover:underline'
                >
                    View Full API Documentation →
                </a>
            </div>

            <div className='bg-white rounded-xl shadow p-6'>
                <h3 className='font-semibold text-gray-900 mb-4'>
                    Connected Systems
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='p-4 border rounded-lg'>
                        <div className='font-semibold'>SAP ERP</div>
                        <div className='text-xs text-green-600'>Connected</div>
                    </div>
                    <div className='p-4 border rounded-lg'>
                        <div className='font-semibold'>Shopify</div>
                        <div className='text-xs text-green-600'>Connected</div>
                    </div>
                    <div className='p-4 border rounded-lg'>
                        <div className='font-semibold'>QuickBooks</div>
                        <div className='text-xs text-green-600'>Connected</div>
                    </div>
                    <div className='p-4 border rounded-lg'>
                        <div className='font-semibold'>WooCommerce</div>
                        <div className='text-xs text-gray-400'>
                            Not Connected
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
