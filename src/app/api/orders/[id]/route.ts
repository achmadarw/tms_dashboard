import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const response = await fetch(`${API_BASE_URL}/orders/${params.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Backend API error: ${response.statusText}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Error fetching order:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch order' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();

        const response = await fetch(`${API_BASE_URL}/orders/${params.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
                errorData.message || `Backend API error: ${response.statusText}`
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Error updating order:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to update order' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const response = await fetch(`${API_BASE_URL}/orders/${params.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
                errorData.message || `Backend API error: ${response.statusText}`
            );
        }

        return NextResponse.json({ message: 'Order deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting order:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to delete order' },
            { status: 500 }
        );
    }
}
