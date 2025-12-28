import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { google } from 'googleapis';
import {
    Analytics,
    TrendData,
    TrafficSource,
    ContentPage,
    CategoryPerformance,
    FrequencyData,
    Page,
    SearchTerm,
    VideoMetric,
    SearchQuery,
    DeviceMetric,
    SlowPage,
    DateRange,
    DeviceFilter,
} from '@/types/website';

/**
 * Google Analytics 4 Service
 * 
 * This service connects to GA4 API using the Analytics Data API v1
 * 
 * Setup Instructions:
 * 1. Go to Google Cloud Console (https://console.cloud.google.com)
 * 2. Create a new project or select existing
 * 3. Enable "Google Analytics Data API"
 * 4. Create a Service Account:
 *    - Go to IAM & Admin > Service Accounts
 *    - Create Service Account
 *    - Download JSON key
 * 5. Add the service account email to your GA4 property:
 *    - Go to GA4 Admin > Property Access Management
 *    - Add the service account email with "Viewer" role
 * 6. Save the JSON key content to .env.local as GOOGLE_APPLICATION_CREDENTIALS_JSON
 */

let analyticsDataClient: BetaAnalyticsDataClient | null = null;
let searchConsoleClient: any = null;

function getAnalyticsClient() {
    if (!analyticsDataClient) {
        const credentials = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;

        if (!credentials) {
            throw new Error('GOOGLE_APPLICATION_CREDENTIALS_JSON not found in environment variables');
        }

        const parsedCredentials = JSON.parse(credentials);

        analyticsDataClient = new BetaAnalyticsDataClient({
            credentials: parsedCredentials,
        });
    }

    return analyticsDataClient;
}

function getSearchConsoleClient() {
    if (!searchConsoleClient) {
        const credentials = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;

        if (!credentials) {
            throw new Error('GOOGLE_APPLICATION_CREDENTIALS_JSON not found in environment variables');
        }

        const parsedCredentials = JSON.parse(credentials);

        const auth = new google.auth.GoogleAuth({
            credentials: parsedCredentials,
            scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
        });

        searchConsoleClient = google.searchconsole({
            version: 'v1',
            auth,
        });
    }

    return searchConsoleClient;
}

/**
 * Fetch comprehensive analytics data for a website
 */
export async function fetchAnalytics(
    propertyId: string,
    searchConsoleProperty: string,
    dateRange: DateRange,
    deviceFilter: DeviceFilter
): Promise<Analytics> {
    const client = getAnalyticsClient();
    const searchClient = getSearchConsoleClient();

    const dimensionFilter = deviceFilter.type !== 'all'
        ? {
            filter: {
                fieldName: 'deviceCategory',
                stringFilter: {
                    value: deviceFilter.type,
                    matchType: 'EXACT' as const,
                },
            },
        }
        : undefined;

    try {
        // Fetch all analytics in parallel
        const [
            overviewData,
            trafficSourcesData,
            trendsData,
            contentData,
            loyaltyData,
            navigationData,
            engagementData,
            deviceData,
            performanceData,
            searchConsoleData,
        ] = await Promise.all([
            // 1. Overview metrics (Awareness & Reach)
            client.runReport({
                property: `properties/${propertyId}`,
                dateRanges: [{ startDate: dateRange.startDate, endDate: dateRange.endDate }],
                dimensions: [{ name: 'newVsReturning' }],
                metrics: [
                    { name: 'activeUsers' },
                    { name: 'sessions' },
                    { name: 'screenPageViews' },
                ],
                dimensionFilter,
            }),

            // 2. Traffic sources
            client.runReport({
                property: `properties/${propertyId}`,
                dateRanges: [{ startDate: dateRange.startDate, endDate: dateRange.endDate }],
                dimensions: [{ name: 'sessionDefaultChannelGroup' }],
                metrics: [{ name: 'sessions' }],
                dimensionFilter,
                orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
                limit: 10,
            }),

            // 3. Visit trends (last 30 days)
            client.runReport({
                property: `properties/${propertyId}`,
                dateRanges: [{ startDate: dateRange.startDate, endDate: dateRange.endDate }],
                dimensions: [{ name: 'date' }],
                metrics: [{ name: 'sessions' }],
                dimensionFilter,
                orderBys: [{ dimension: { dimensionName: 'date' } }],
            }),

            // 4. Content pages
            client.runReport({
                property: `properties/${propertyId}`,
                dateRanges: [{ startDate: dateRange.startDate, endDate: dateRange.endDate }],
                dimensions: [{ name: 'pagePath' }],
                metrics: [
                    { name: 'screenPageViews' },
                    { name: 'averageSessionDuration' },
                    { name: 'bounceRate' },
                ],
                dimensionFilter,
                orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
                limit: 20,
            }),

            // 5. Loyalty (returning user frequency)
            client.runReport({
                property: `properties/${propertyId}`,
                dateRanges: [{ startDate: dateRange.startDate, endDate: dateRange.endDate }],
                dimensions: [{ name: 'sessionDefaultChannelGroup' }],
                metrics: [
                    { name: 'activeUsers' },
                    { name: 'sessions' },
                    { name: 'sessionsPerUser' },
                ],
                dimensionFilter,
            }),

            // 6. Landing and exit pages
            client.runReport({
                property: `properties/${propertyId}`,
                dateRanges: [{ startDate: dateRange.startDate, endDate: dateRange.endDate }],
                dimensions: [{ name: 'landingPage' }],
                metrics: [{ name: 'sessions' }],
                dimensionFilter,
                orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
                limit: 10,
            }),

            // 7. Engagement events
            client.runReport({
                property: `properties/${propertyId}`,
                dateRanges: [{ startDate: dateRange.startDate, endDate: dateRange.endDate }],
                dimensions: [{ name: 'eventName' }],
                metrics: [{ name: 'eventCount' }],
                dimensionFilter,
                orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
                limit: 20,
            }),

            // 8. Device breakdown
            client.runReport({
                property: `properties/${propertyId}`,
                dateRanges: [{ startDate: dateRange.startDate, endDate: dateRange.endDate }],
                dimensions: [{ name: 'deviceCategory' }],
                metrics: [{ name: 'sessions' }],
                orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
            }),

            // 9. Page performance
            client.runReport({
                property: `properties/${propertyId}`,
                dateRanges: [{ startDate: dateRange.startDate, endDate: dateRange.endDate }],
                dimensions: [{ name: 'pagePath' }],
                metrics: [{ name: 'averageSessionDuration' }],
                dimensionFilter,
                orderBys: [{ metric: { metricName: 'averageSessionDuration' }, desc: true }],
                limit: 10,
            }),

            // 10. Search Console data
            fetchSearchConsoleData(searchClient, searchConsoleProperty, dateRange),
        ]);

        // Process the data
        const analytics = processAnalyticsData(
            overviewData,
            trafficSourcesData,
            trendsData,
            contentData,
            loyaltyData,
            navigationData,
            engagementData,
            deviceData,
            performanceData,
            searchConsoleData
        );

        return analytics;
    } catch (error) {
        console.error('Error fetching analytics:', error);
        throw error;
    }
}

async function fetchSearchConsoleData(
    client: any,
    siteUrl: string,
    dateRange: DateRange
) {
    try {
        const response = await client.searchanalytics.query({
            siteUrl,
            requestBody: {
                startDate: dateRange.startDate,
                endDate: dateRange.endDate,
                dimensions: ['query', 'page'],
                rowLimit: 100,
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching Search Console data:', error);
        return null;
    }
}

function processAnalyticsData(
    overviewData: any,
    trafficSourcesData: any,
    trendsData: any,
    contentData: any,
    loyaltyData: any,
    navigationData: any,
    engagementData: any,
    deviceData: any,
    performanceData: any,
    searchConsoleData: any
): Analytics {
    // Process overview metrics
    let totalUsers = 0;
    let totalSessions = 0;
    let totalPageViews = 0;
    let newUsers = 0;
    let returningUsers = 0;

    overviewData[0]?.rows?.forEach((row: any) => {
        const isNew = row.dimensionValues[0].value === 'new';
        const users = parseInt(row.metricValues[0].value);
        const sessions = parseInt(row.metricValues[1].value);
        const pageViews = parseInt(row.metricValues[2].value);

        totalUsers += users;
        totalSessions += sessions;
        totalPageViews += pageViews;

        if (isNew) {
            newUsers = users;
        } else {
            returningUsers = users;
        }
    });

    // Process traffic sources
    const trafficSources: TrafficSource[] = [];
    trafficSourcesData[0]?.rows?.forEach((row: any) => {
        const sessions = parseInt(row.metricValues[0].value);
        trafficSources.push({
            source: row.dimensionValues[0].value,
            sessions,
            percentage: totalSessions > 0 ? (sessions / totalSessions) * 100 : 0,
        });
    });

    // Process trends
    const visitTrends: TrendData[] = [];
    trendsData[0]?.rows?.forEach((row: any) => {
        visitTrends.push({
            date: row.dimensionValues[0].value,
            value: parseInt(row.metricValues[0].value),
        });
    });

    // Process content pages
    const topContentPages: ContentPage[] = [];
    contentData[0]?.rows?.forEach((row: any) => {
        topContentPages.push({
            path: row.dimensionValues[0].value,
            pageViews: parseInt(row.metricValues[0].value),
            avgTimeOnPage: parseFloat(row.metricValues[1].value),
            bounceRate: parseFloat(row.metricValues[2].value) * 100,
        });
    });

    // Process landing pages
    const topLandingPages: Page[] = [];
    navigationData[0]?.rows?.forEach((row: any) => {
        const sessions = parseInt(row.metricValues[0].value);
        topLandingPages.push({
            path: row.dimensionValues[0].value,
            sessions,
            percentage: totalSessions > 0 ? (sessions / totalSessions) * 100 : 0,
        });
    });

    // Process engagement events
    let downloads = 0;
    let shareClicks = 0;
    const videoEngagement: VideoMetric[] = [];

    engagementData[0]?.rows?.forEach((row: any) => {
        const eventName = row.dimensionValues[0].value;
        const eventCount = parseInt(row.metricValues[0].value);

        if (eventName.includes('download') || eventName === 'file_download') {
            downloads += eventCount;
        }
        if (eventName.includes('share') || eventName === 'share') {
            shareClicks += eventCount;
        }
        if (eventName.includes('video')) {
            videoEngagement.push({
                videoTitle: eventName,
                plays: eventCount,
                completionRate: 0, // Would need additional metrics
            });
        }
    });

    // Process device data
    const mobileVsDesktop: DeviceMetric[] = [];
    deviceData[0]?.rows?.forEach((row: any) => {
        const sessions = parseInt(row.metricValues[0].value);
        mobileVsDesktop.push({
            device: row.dimensionValues[0].value,
            sessions,
            percentage: totalSessions > 0 ? (sessions / totalSessions) * 100 : 0,
        });
    });

    // Process Search Console data
    const topSearchQueries: SearchQuery[] = [];
    const organicLandingPages: Page[] = [];
    let totalClicks = 0;
    let totalImpressions = 0;

    if (searchConsoleData?.rows) {
        const queryMap = new Map<string, { clicks: number; impressions: number; position: number; count: number }>();
        const pageMap = new Map<string, number>();

        searchConsoleData.rows.forEach((row: any) => {
            const query = row.keys[0];
            const page = row.keys[1];
            const clicks = row.clicks || 0;
            const impressions = row.impressions || 0;
            const position = row.position || 0;

            // Aggregate by query
            if (!queryMap.has(query)) {
                queryMap.set(query, { clicks: 0, impressions: 0, position: 0, count: 0 });
            }
            const queryData = queryMap.get(query)!;
            queryData.clicks += clicks;
            queryData.impressions += impressions;
            queryData.position += position;
            queryData.count += 1;

            // Aggregate by page
            if (!pageMap.has(page)) {
                pageMap.set(page, 0);
            }
            pageMap.set(page, pageMap.get(page)! + clicks);

            totalClicks += clicks;
            totalImpressions += impressions;
        });

        // Top queries
        Array.from(queryMap.entries())
            .sort((a, b) => b[1].clicks - a[1].clicks)
            .slice(0, 20)
            .forEach(([query, data]) => {
                topSearchQueries.push({
                    query,
                    clicks: data.clicks,
                    impressions: data.impressions,
                    ctr: data.impressions > 0 ? (data.clicks / data.impressions) * 100 : 0,
                    position: data.position / data.count,
                });
            });

        // Top landing pages
        Array.from(pageMap.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .forEach(([page, clicks]) => {
                organicLandingPages.push({
                    path: page,
                    sessions: clicks,
                    percentage: totalClicks > 0 ? (clicks / totalClicks) * 100 : 0,
                });
            });
    }

    const avgCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

    // Calculate aggregate metrics
    const pagesPerSession = totalSessions > 0 ? totalPageViews / totalSessions : 0;
    const returningUserRate = totalUsers > 0 ? (returningUsers / totalUsers) * 100 : 0;
    const avgTimeOnPage = topContentPages.reduce((acc, page) => acc + page.avgTimeOnPage, 0) / (topContentPages.length || 1);
    const avgPageLoadTime = 2.5; // Would need real-world monitoring data

    return {
        users: totalUsers,
        sessions: totalSessions,
        pageViews: totalPageViews,
        newUsers,
        returningUsers,
        trafficSources,
        visitTrends,
        avgTimeOnPage,
        avgScrollDepth: 65, // Would need custom event tracking
        pagesPerSession,
        topContentPages,
        contentByCategory: [], // Would need custom dimensions
        returningUserRate,
        visitFrequency: [], // Would need custom processing
        topLandingPages,
        topExitPages: [], // Would need exit page dimension
        internalSearchUsage: 0, // Would need custom event tracking
        topSearchTerms: [], // Would need custom event tracking
        downloads,
        shareClicks,
        videoEngagement,
        organicTrafficTrend: visitTrends, // Simplified
        topSearchQueries,
        organicLandingPages,
        avgCTR,
        mobileVsDesktop,
        avgPageLoadTime,
        slowPages: [], // Would need RUM data
    };
}
