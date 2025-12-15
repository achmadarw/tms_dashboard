'use client';
import { useState } from 'react';
import DataTable from '@/components/DataTable';
import DocumentUploader from '@/components/DocumentUploader';
import StatusBadge from '@/components/StatusBadge';
import { FileText, Upload, Download } from 'lucide-react';

export default function DocumentsPage() {
    const columns = [
        { key: 'name', label: 'Document Name' },
        { key: 'type', label: 'Type' },
        { key: 'shipment', label: 'Shipment #' },
        { key: 'uploadedBy', label: 'Uploaded By' },
        { key: 'uploadDate', label: 'Upload Date' },
        { key: 'status', label: 'Status' },
        { key: 'actions', label: 'Actions' },
    ];

    const mockDocuments = [
        {
            name: 'Bill of Lading - SHP001.pdf',
            type: 'BOL',
            shipment: 'SHP-001',
            uploadedBy: 'Admin',
            uploadDate: '2024-12-15',
            status: 'approved',
            actions: (
                <button className='text-blue-600 hover:underline'>
                    <Download size={16} />
                </button>
            ),
        },
        {
            name: 'Invoice - ORD045.pdf',
            type: 'Invoice',
            shipment: 'ORD-045',
            uploadedBy: 'Finance',
            uploadDate: '2024-12-14',
            status: 'pending',
            actions: (
                <button className='text-blue-600 hover:underline'>
                    <Download size={16} />
                </button>
            ),
        },
        {
            name: 'POD - SHP002.jpg',
            type: 'POD',
            shipment: 'SHP-002',
            uploadedBy: 'Driver',
            uploadDate: '2024-12-13',
            status: 'approved',
            actions: (
                <button className='text-blue-600 hover:underline'>
                    <Download size={16} />
                </button>
            ),
        },
    ];

    function handleUpload(files: FileList) {
        console.log('Uploading files:', files);
    }

    return (
        <div className='space-y-6'>
            <div>
                <h1 className='text-3xl font-bold text-gray-900 flex items-center gap-2'>
                    <FileText className='text-blue-600' /> Document Management
                </h1>
                <p className='text-gray-600 mt-1'>
                    Manage shipping documents and compliance files
                </p>
            </div>

            <div className='bg-white rounded-xl shadow p-6'>
                <h3 className='font-semibold text-gray-900 mb-4 flex items-center gap-2'>
                    <Upload size={20} className='text-blue-600' /> Upload
                    Documents
                </h3>
                <DocumentUploader onUpload={handleUpload} />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                <div className='bg-white rounded-xl shadow p-4 text-center'>
                    <div className='text-2xl font-bold text-blue-600'>120</div>
                    <div className='text-sm text-gray-600'>Total Documents</div>
                </div>
                <div className='bg-white rounded-xl shadow p-4 text-center'>
                    <div className='text-2xl font-bold text-green-600'>95</div>
                    <div className='text-sm text-gray-600'>Approved</div>
                </div>
                <div className='bg-white rounded-xl shadow p-4 text-center'>
                    <div className='text-2xl font-bold text-yellow-600'>18</div>
                    <div className='text-sm text-gray-600'>Pending</div>
                </div>
                <div className='bg-white rounded-xl shadow p-4 text-center'>
                    <div className='text-2xl font-bold text-red-600'>7</div>
                    <div className='text-sm text-gray-600'>Rejected</div>
                </div>
            </div>

            <div className='bg-white rounded-xl shadow overflow-hidden'>
                <DataTable
                    columns={columns}
                    data={mockDocuments.map((doc) => ({
                        ...doc,
                        status: <StatusBadge status={doc.status} />,
                    }))}
                />
            </div>
        </div>
    );
}
