import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;
    const session = await auth();
    const accessToken = session?.user?.accessToken;

    if (!accessToken) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API}/submissions/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        );

        if (!response.ok) {
            const text = await response.text();
            return NextResponse.json(
                { error: text || 'Backend error' },
                { status: response.status },
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Proxy error fetching submission:', error);
        return NextResponse.json(
            { error: 'Failed to fetch submission' },
            { status: 502 },
        );
    }
}
