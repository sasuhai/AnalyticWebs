export interface Website {
  id: string;
  name: string;
  domain: string;
  ga4PropertyId: string;
  searchConsoleProperty: string;
  enabled: boolean;
}

export interface Analytics {
  // Awareness & Reach
  users: number;
  sessions: number;
  pageViews: number;
  newUsers: number;
  returningUsers: number;
  trafficSources: TrafficSource[];
  visitTrends: TrendData[];
  
  // Content Consumption
  avgTimeOnPage: number;
  avgScrollDepth: number;
  pagesPerSession: number;
  topContentPages: ContentPage[];
  contentByCategory: CategoryPerformance[];
  
  // Audience Loyalty
  returningUserRate: number;
  visitFrequency: FrequencyData[];
  
  // Discovery & Navigation
  topLandingPages: Page[];
  topExitPages: Page[];
  internalSearchUsage: number;
  topSearchTerms: SearchTerm[];
  
  // Engagement
  downloads: number;
  shareClicks: number;
  videoEngagement: VideoMetric[];
  
  // SEO
  organicTrafficTrend: TrendData[];
  topSearchQueries: SearchQuery[];
  organicLandingPages: Page[];
  avgCTR: number;
  
  // Device & Performance
  mobileVsDesktop: DeviceMetric[];
  avgPageLoadTime: number;
  slowPages: SlowPage[];
}

export interface TrafficSource {
  source: string;
  sessions: number;
  percentage: number;
}

export interface TrendData {
  date: string;
  value: number;
}

export interface ContentPage {
  path: string;
  pageViews: number;
  avgTimeOnPage: number;
  bounceRate: number;
}

export interface CategoryPerformance {
  category: string;
  pageViews: number;
  sessions: number;
}

export interface FrequencyData {
  frequency: string;
  users: number;
}

export interface Page {
  path: string;
  sessions: number;
  percentage: number;
}

export interface SearchTerm {
  term: string;
  searches: number;
}

export interface VideoMetric {
  videoTitle: string;
  plays: number;
  completionRate: number;
}

export interface SearchQuery {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface DeviceMetric {
  device: string;
  sessions: number;
  percentage: number;
}

export interface SlowPage {
  path: string;
  avgLoadTime: number;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface DeviceFilter {
  type: 'all' | 'mobile' | 'desktop' | 'tablet';
}
