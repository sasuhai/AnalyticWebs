import { NextResponse } from 'next/server';
import { getEnabledWebsites } from '@/config/websites';

export async function GET() {
    try {
        const websites = getEnabledWebsites();

        return NextResponse.json({
            websites: websites.map(w => ({
                id: w.id,
                name: w.name,
                domain: w.domain,
            })),
        });
    } catch (error: any) {
        console.error('Error fetching websites:', error);

        return NextResponse.json(
            { error: 'Failed to fetch websites' },
            { status: 500 }
        );
    }
}
