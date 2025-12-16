import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { Shipment } from '@/hooks/useShipments';
import {
    FileText,
    Download,
    Upload,
    File,
    CheckCircle,
    Clock,
    XCircle,
    Plus,
    Printer,
} from 'lucide-react';

interface DocumentsModalProps {
    isOpen: boolean;
    onClose: () => void;
    shipment: Shipment;
}

interface Document {
    id: number;
    type: string;
    name: string;
    status: 'verified' | 'pending' | 'rejected';
    uploadedAt: string;
    url?: string;
}

// Mock documents - akan diganti dengan API call
const mockDocuments: Document[] = [
    {
        id: 1,
        type: 'BOL',
        name: 'Bill of Lading',
        status: 'verified',
        uploadedAt: '2025-12-15T10:00:00Z',
    },
    {
        id: 2,
        type: 'INVOICE',
        name: 'Commercial Invoice',
        status: 'verified',
        uploadedAt: '2025-12-15T10:30:00Z',
    },
    {
        id: 3,
        type: 'POD',
        name: 'Proof of Delivery',
        status: 'pending',
        uploadedAt: '2025-12-16T08:00:00Z',
    },
];

const documentTypeColors = {
    BOL: 'bg-blue-100 text-blue-700',
    INVOICE: 'bg-green-100 text-green-700',
    POD: 'bg-purple-100 text-purple-700',
    CUSTOMS: 'bg-orange-100 text-orange-700',
    OTHER: 'bg-gray-100 text-gray-700',
};

const statusConfig = {
    verified: {
        icon: CheckCircle,
        color: 'text-green-600',
        bg: 'bg-green-50',
        label: 'Verified',
    },
    pending: {
        icon: Clock,
        color: 'text-yellow-600',
        bg: 'bg-yellow-50',
        label: 'Pending',
    },
    rejected: {
        icon: XCircle,
        color: 'text-red-600',
        bg: 'bg-red-50',
        label: 'Rejected',
    },
};

export default function DocumentsModal({
    isOpen,
    onClose,
    shipment,
}: DocumentsModalProps) {
    const [documents, setDocuments] = useState<Document[]>(mockDocuments);
    const [uploading, setUploading] = useState(false);
    const [generating, setGenerating] = useState<string | null>(null);

    const handleFileUpload = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setUploading(true);
        // TODO: Implement actual file upload to API
        setTimeout(() => {
            const newDoc: Document = {
                id: documents.length + 1,
                type: 'OTHER',
                name: file.name,
                status: 'pending',
                uploadedAt: new Date().toISOString(),
            };
            setDocuments([...documents, newDoc]);
            setUploading(false);
            event.target.value = '';
        }, 1500);
    };

    const handleGenerateDocument = async (type: 'BOL' | 'INVOICE') => {
        setGenerating(type);
        // TODO: Call API to generate document
        // Example: POST /api/documents with { shipmentId, type }
        setTimeout(() => {
            alert(
                `${
                    type === 'BOL' ? 'Bill of Lading' : 'Invoice'
                } generated successfully!\n\nShipment: ${
                    shipment.shipmentNumber
                }\nThis will integrate with /api/documents endpoint.`
            );
            setGenerating(null);
        }, 1500);
    };

    const handleDownload = (doc: Document) => {
        // TODO: Implement actual download from API
        alert(
            `Downloading: ${doc.name}\n\nThis will integrate with /api/documents/${doc.id}/download`
        );
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title='Shipment Documents'
            size='lg'
        >
            <div className='space-y-6'>
                {/* Shipment Info Header */}
                <div className='bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <h3 className='font-semibold text-gray-900'>
                                {shipment.shipmentNumber}
                            </h3>
                            <p className='text-sm text-gray-600'>
                                Order: {shipment.order?.orderNumber || 'N/A'}
                            </p>
                        </div>
                        <div className='text-right'>
                            <p className='text-sm text-gray-600'>
                                {shipment.origin || 'N/A'} →{' '}
                                {shipment.destination || 'N/A'}
                            </p>
                            <p className='text-sm font-medium text-gray-900'>
                                {documents.length} Documents
                            </p>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className='grid grid-cols-2 gap-3'>
                    <Button
                        variant='primary'
                        icon={Printer}
                        onClick={() => handleGenerateDocument('BOL')}
                        disabled={generating === 'BOL'}
                    >
                        {generating === 'BOL'
                            ? 'Generating...'
                            : 'Generate BOL'}
                    </Button>
                    <Button
                        variant='primary'
                        icon={FileText}
                        onClick={() => handleGenerateDocument('INVOICE')}
                        disabled={generating === 'INVOICE'}
                    >
                        {generating === 'INVOICE'
                            ? 'Generating...'
                            : 'Generate Invoice'}
                    </Button>
                </div>

                {/* Upload Section */}
                <div className='border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors'>
                    <input
                        type='file'
                        id='file-upload'
                        className='hidden'
                        onChange={handleFileUpload}
                        accept='.pdf,.jpg,.jpeg,.png,.doc,.docx'
                        disabled={uploading}
                    />
                    <label
                        htmlFor='file-upload'
                        className='cursor-pointer flex flex-col items-center'
                    >
                        <Upload className='h-12 w-12 text-gray-400 mb-2' />
                        <p className='text-sm font-medium text-gray-700 mb-1'>
                            {uploading
                                ? 'Uploading document...'
                                : 'Click to upload document'}
                        </p>
                        <p className='text-xs text-gray-500'>
                            PDF, JPG, PNG, DOC up to 10MB
                        </p>
                    </label>
                </div>

                {/* Documents List */}
                <div>
                    <h4 className='font-semibold text-gray-900 mb-3'>
                        Existing Documents
                    </h4>
                    {documents.length === 0 ? (
                        <div className='text-center py-8 bg-gray-50 rounded-lg'>
                            <File className='h-12 w-12 text-gray-400 mx-auto mb-2' />
                            <p className='text-gray-600'>No documents yet</p>
                            <p className='text-sm text-gray-500'>
                                Upload or generate documents to get started
                            </p>
                        </div>
                    ) : (
                        <div className='space-y-2 max-h-64 overflow-y-auto'>
                            {documents.map((doc) => {
                                const StatusIcon =
                                    statusConfig[doc.status].icon;
                                const typeColor =
                                    documentTypeColors[
                                        doc.type as keyof typeof documentTypeColors
                                    ] || documentTypeColors.OTHER;

                                return (
                                    <div
                                        key={doc.id}
                                        className='flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'
                                    >
                                        <div className='flex items-center gap-3 flex-1'>
                                            <div
                                                className={`p-2 rounded ${typeColor}`}
                                            >
                                                <FileText className='h-5 w-5' />
                                            </div>
                                            <div className='flex-1'>
                                                <div className='flex items-center gap-2'>
                                                    <p className='font-medium text-gray-900'>
                                                        {doc.name}
                                                    </p>
                                                    <span
                                                        className={`px-2 py-0.5 rounded text-xs font-medium ${typeColor}`}
                                                    >
                                                        {doc.type}
                                                    </span>
                                                </div>
                                                <div className='flex items-center gap-3 mt-1'>
                                                    <p className='text-sm text-gray-500'>
                                                        {formatDate(
                                                            doc.uploadedAt
                                                        )}
                                                    </p>
                                                    <div
                                                        className={`flex items-center gap-1 ${
                                                            statusConfig[
                                                                doc.status
                                                            ].color
                                                        }`}
                                                    >
                                                        <StatusIcon className='h-3.5 w-3.5' />
                                                        <span className='text-xs font-medium'>
                                                            {
                                                                statusConfig[
                                                                    doc.status
                                                                ].label
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDownload(doc)}
                                            className='p-2 text-green-600 hover:bg-green-50 rounded transition-colors'
                                            title='Download'
                                        >
                                            <Download className='h-5 w-5' />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className='flex justify-end gap-3 pt-4 border-t'>
                    <Button variant='ghost' onClick={onClose}>
                        Close
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
