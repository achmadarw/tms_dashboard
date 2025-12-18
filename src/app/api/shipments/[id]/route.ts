import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const response = await fetch(`${API_BASE_URL}/shipments/${params.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
                errorData.message || `Backend API error: ${response.statusText}`
            );
        }

        return NextResponse.json({ message: 'Shipment deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting shipment:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to delete shipment' },
            { status: 500 }
        );
    }
}
