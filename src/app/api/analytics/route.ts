import { NextRequest, NextResponse } from 'next/server';
import { fetchAnalytics } from '@/lib/analytics';
import { getWebsiteById } from '@/config/websites';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const websiteId = searchParams.get('websiteId');
    const startDate = searchParams.get('startDate') || '30daysAgo';
    const endDate = searchParams.get('endDate') || 'today';
    const deviceType = searchParams.get('deviceType') || 'all';

    if (!websiteId) {
        return NextResponse.json(
            { error: 'Website ID is required' },
            { status: 400 }
        );
    }

    const website = getWebsiteById(websiteId);

    if (!website) {
        return NextResponse.json(
            { error: 'Website not found' },
            { status: 404 }
        );
    }

    if (!website.enabled) {
        return NextResponse.json(
            { error: 'Website is disabled' },
            { status: 403 }
        );
    }

    try {
        const analytics = await fetchAnalytics(
            website.ga4PropertyId,
            website.searchConsoleProperty,
            { startDate, endDate },
            { type: deviceType as any }
        );

        return NextResponse.json({
            website: {
                id: website.id,
                name: website.name,
                domain: website.domain,
            },
            dateRange: { startDate, endDate },
            deviceType,
            analytics,
        });
    } catch (error: any) {
        console.error('Error fetching analytics:', error);

        return NextResponse.json(
            {
                error: 'Failed to fetch analytics',
                message: error.message,
                details: process.env.NODE_ENV === 'development' ? error.stack : undefined
            },
            { status: 500 }
        );
    }
}
