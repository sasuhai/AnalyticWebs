'use client';

import { useState, useEffect, useCallback } from 'react';
import { BarChart3, RefreshCw } from 'lucide-react';
import WebsiteSelector from '@/components/WebsiteSelector';
import DateRangeSelector from '@/components/DateRangeSelector';
import DeviceFilter from '@/components/DeviceFilter';
import MetricCard from '@/components/MetricCard';
import TrendChart from '@/components/charts/TrendChart';
import TrafficSourceChart from '@/components/charts/TrafficSourceChart';
import DeviceChart from '@/components/charts/DeviceChart';
import TopPagesTable from '@/components/tables/TopPagesTable';
import SearchQueriesTable from '@/components/tables/SearchQueriesTable';
import { Analytics } from '@/types/website';

export default function Home() {
    const [selectedWebsiteId, setSelectedWebsiteId] = useState<string | null>(null);
    const [startDate, setStartDate] = useState('30daysAgo');
    const [endDate, setEndDate] = useState('today');
    const [deviceType, setDeviceType] = useState('all');
    const [analytics, setAnalytics] = useState<Analytics | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAnalytics = useCallback(async () => {
        if (!selectedWebsiteId) return;

        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams({
                websiteId: selectedWebsiteId,
                startDate,
                endDate,
                deviceType,
            });

            const response = await fetch(`/api/analytics?${params}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch analytics');
            }

            setAnalytics(data.analytics);
        } catch (err: any) {
            console.error('Error fetching analytics:', err);
            setError(err.message || 'Failed to load analytics data');
        } finally {
            setLoading(false);
        }
    }, [selectedWebsiteId, startDate, endDate, deviceType]);

    useEffect(() => {
        if (selectedWebsiteId) {
            fetchAnalytics();
        }
    }, [selectedWebsiteId, fetchAnalytics]);

    const handleDateRangeChange = (start: string, end: string) => {
        setStartDate(start);
        setEndDate(end);
    };

    return (
        <main className="min-h-screen gradient-bg">
            {/* Header */}
            <header className="border-b border-border bg-card/50 backdrop-blur-lg sticky top-0 z-40">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                <BarChart3 className="w-8 h-8" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">Analytics Portal</h1>
                                <p className="text-sm text-muted-foreground">Multi-website monitoring dashboard</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8 space-y-8">
                {/* Controls */}
                <div className="space-y-4">
                    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                        <WebsiteSelector
                            selectedWebsiteId={selectedWebsiteId}
                            onSelect={setSelectedWebsiteId}
                        />
                        <button
                            onClick={fetchAnalytics}
                            disabled={loading || !selectedWebsiteId}
                            className="btn-premium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            Refresh Data
                        </button>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between flex-wrap">
                        <DateRangeSelector onSelect={handleDateRangeChange} />
                        <DeviceFilter onSelect={setDeviceType} />
                    </div>
                </div>

                {/* Error State */}
                {error && (
                    <div className="gradient-card p-6 rounded-xl border-2 border-red-500/50 bg-red-500/10">
                        <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-red-500/20 text-red-400">
                                <BarChart3 className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-red-400 mb-1">Failed to Load Analytics</h3>
                                <p className="text-sm text-muted-foreground">{error}</p>
                                <p className="text-xs text-muted-foreground mt-2">
                                    Make sure you have configured your Google Analytics credentials in the .env.local file.
                                    See the README for setup instructions.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {loading && !analytics && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="skeleton h-32 rounded-xl"></div>
                            ))}
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="skeleton h-80 rounded-xl"></div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Analytics Dashboard */}
                {analytics && !loading && (
                    <div className="space-y-8">
                        {/* Section 1: Awareness & Reach */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-8 bg-primary rounded-full"></div>
                                <h2 className="text-2xl font-bold">Awareness & Reach</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <MetricCard
                                    title="Total Users"
                                    value={analytics.users}
                                    icon="users"
                                    subtitle={`${analytics.newUsers.toLocaleString()} new users`}
                                />
                                <MetricCard
                                    title="Sessions"
                                    value={analytics.sessions}
                                    icon="click"
                                />
                                <MetricCard
                                    title="Page Views"
                                    value={analytics.pageViews}
                                    icon="eye"
                                />
                                <MetricCard
                                    title="Pages per Session"
                                    value={analytics.pagesPerSession.toFixed(2)}
                                    icon="trending"
                                />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <TrendChart
                                    data={analytics.visitTrends}
                                    title="Visit Trends"
                                    color="rgb(74, 222, 128)"
                                />
                                <TrafficSourceChart data={analytics.trafficSources} />
                            </div>
                        </section>

                        {/* Section 2: Content Consumption */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-8 bg-accent rounded-full"></div>
                                <h2 className="text-2xl font-bold">Content Consumption</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <MetricCard
                                    title="Avg. Time on Page"
                                    value={`${analytics.avgTimeOnPage.toFixed(1)}s`}
                                    icon="trending"
                                />
                                <MetricCard
                                    title="Avg. Scroll Depth"
                                    value={`${analytics.avgScrollDepth}%`}
                                    icon="eye"
                                />
                                <MetricCard
                                    title="Pages per Session"
                                    value={analytics.pagesPerSession.toFixed(2)}
                                    icon="click"
                                />
                            </div>

                            <TopPagesTable pages={analytics.topContentPages} />
                        </section>

                        {/* Section 3: Audience Loyalty */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-8 bg-purple-500 rounded-full"></div>
                                <h2 className="text-2xl font-bold">Audience Loyalty</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <MetricCard
                                    title="Returning User Rate"
                                    value={`${analytics.returningUserRate.toFixed(1)}%`}
                                    icon="users"
                                    subtitle={`${analytics.returningUsers.toLocaleString()} returning users`}
                                />
                                <MetricCard
                                    title="New vs Returning"
                                    value={`${((analytics.newUsers / analytics.users) * 100).toFixed(1)}% new`}
                                    icon="trending"
                                />
                            </div>
                        </section>

                        {/* Section 4: Discovery & Navigation */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-8 bg-yellow-500 rounded-full"></div>
                                <h2 className="text-2xl font-bold">Discovery & Navigation</h2>
                            </div>

                            <TopPagesTable pages={analytics.topLandingPages.map(p => ({
                                path: p.path,
                                pageViews: p.sessions,
                                avgTimeOnPage: 0,
                                bounceRate: 0,
                            }))} title="Top Landing Pages" />
                        </section>

                        {/* Section 5: Engagement */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-8 bg-pink-500 rounded-full"></div>
                                <h2 className="text-2xl font-bold">Engagement</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <MetricCard
                                    title="Downloads"
                                    value={analytics.downloads}
                                    icon="click"
                                />
                                <MetricCard
                                    title="Share Clicks"
                                    value={analytics.shareClicks}
                                    icon="trending"
                                />
                                <MetricCard
                                    title="Video Plays"
                                    value={analytics.videoEngagement.reduce((acc, v) => acc + v.plays, 0)}
                                    icon="eye"
                                />
                            </div>
                        </section>

                        {/* Section 6: SEO */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-8 bg-green-500 rounded-full"></div>
                                <h2 className="text-2xl font-bold">SEO Performance</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <MetricCard
                                    title="Average CTR"
                                    value={`${analytics.avgCTR.toFixed(2)}%`}
                                    icon="click"
                                />
                                <MetricCard
                                    title="Organic Landing Pages"
                                    value={analytics.organicLandingPages.length}
                                    icon="trending"
                                />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <TrendChart
                                    data={analytics.organicTrafficTrend}
                                    title="Organic Traffic Trend"
                                    color="rgb(34, 197, 94)"
                                />
                                <div className="space-y-4">
                                    <SearchQueriesTable queries={analytics.topSearchQueries.slice(0, 10)} />
                                </div>
                            </div>
                        </section>

                        {/* Section 7: Device & Performance */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-8 bg-blue-500 rounded-full"></div>
                                <h2 className="text-2xl font-bold">Device & Performance</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <MetricCard
                                    title="Avg. Page Load Time"
                                    value={`${analytics.avgPageLoadTime.toFixed(2)}s`}
                                    icon="trending"
                                />
                                <MetricCard
                                    title="Mobile Traffic"
                                    value={`${(analytics.mobileVsDesktop.find(d => d.device.toLowerCase() === 'mobile')?.percentage || 0).toFixed(1)}%`}
                                    icon="click"
                                />
                            </div>

                            <DeviceChart data={analytics.mobileVsDesktop} />
                        </section>
                    </div>
                )}

                {/* Empty State */}
                {!selectedWebsiteId && !loading && (
                    <div className="gradient-card p-12 rounded-xl text-center">
                        <div className="max-w-md mx-auto space-y-4">
                            <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                                <BarChart3 className="w-8 h-8 text-primary" />
                            </div>
                            <h2 className="text-2xl font-bold">Welcome to Analytics Portal</h2>
                            <p className="text-muted-foreground">
                                Select a website from the dropdown above to view comprehensive analytics across all key metrics.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <footer className="border-t border-border mt-16">
                <div className="container mx-auto px-4 py-6">
                    <p className="text-center text-sm text-muted-foreground">
                        Analytics Portal - Powered by Google Analytics 4 & Search Console
                    </p>
                </div>
            </footer>
        </main>
    );
}
