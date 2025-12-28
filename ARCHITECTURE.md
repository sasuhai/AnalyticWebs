# Analytics Portal Architecture

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        USER BROWSER                          │
│  ┌───────────────────────────────────────────────────────┐  │
│  │             Analytics Portal UI (Dark Theme)            │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐  │  │
│  │  │  Website    │  │ Date Range   │  │   Device     │  │  │
│  │  │  Selector   │  │   Filter     │  │   Filter     │  │  │
│  │  └─────────────┘  └──────────────┘  └──────────────┘  │  │
│  │  ┌──────────────────────────────────────────────────┐   │  │
│  │  │           Metric Cards (4 columns)                │  │  │
│  │  │  Users | Sessions | Pages | Pages/Session       │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────┐  ┌────────────────────────────┐   │  │
│  │  │  Line Chart    │  │   Doughnut Chart           │  │  │
│  │  │ (Visit Trends) │  │ (Traffic Sources)          │  │  │
│  │  └────────────────┘  └────────────────────────────┘   │  │
│  │  ┌──────────────────────────────────────────────────┐   │  │
│  │  │         Data Tables (Top Pages, Queries)          │  │  │
│  │  └──────────────────────────────────────────────────┘   │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ↓
                    HTTP Requests (API Calls)
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    NEXT.JS SERVER                            │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                   API Routes                            │  │
│  │  ┌──────────────────┐  ┌──────────────────────────┐   │  │
│  │  │ /api/websites    │  │  /api/analytics          │   │  │
│  │  │ (list sites)     │  │  (fetch metrics)         │   │  │
│  │  └──────────────────┘  └──────────────────────────┘   │  │
│  └───────────────────────────────────────────────────────┘  │
│                              ↓                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │            Analytics Service (lib/analytics.ts)        │  │
│  │                                                          │  │
│  │  • Processes date ranges & device filters              │  │
│  │  • Aggregates metrics from multiple sources             │  │
│  │  • Transforms data for charts & tables                  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ↓
                    External API Calls (HTTPS)
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   GOOGLE CLOUD APIS                          │
│  ┌─────────────────────┐  ┌────────────────────────────┐   │
│  │  Google Analytics   │  │   Google Search Console     │   │
│  │    Data API v1      │  │          API                │   │
│  │                     │  │                              │   │
│  │  • User metrics     │  │  • Search queries            │   │
│  │  • Session data     │  │  • Click-through rates       │   │
│  │  • Page views       │  │  • Search positions          │   │
│  │  • Traffic sources  │  │  • Organic landing pages     │   │
│  │  • Device breakdown │  │  • Impressions               │   │
│  └─────────────────────┘  └────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ↑
                    Service Account Authentication
                              ↑
┌─────────────────────────────────────────────────────────────┐
│            GOOGLE ANALYTICS 4 PROPERTIES                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Website 1   │  │  Website 2   │  │  Website 3   │      │
│  │  (GA4 ID)    │  │  (GA4 ID)    │  │  (GA4 ID)    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## 📊 Data Flow

### 1. User Selection
```
User selects website → Component state updates → API call triggered
```

### 2. API Request
```
Browser → /api/analytics?websiteId=X&startDate=Y&endDate=Z&deviceType=W
```

### 3. Server Processing
```
API Route → Analytics Service → Parallel API calls to:
  - Google Analytics Data API (7+ requests)
  - Google Search Console API (1 request)
```

### 4. Data Aggregation
```
Raw API responses → Data processing → Transformed metrics → JSON response
```

### 5. UI Update
```
JSON data → React state → Charts render → Tables populate → UI animates
```

## 🔐 Security Model

```
┌─────────────────────────────────────────────────────────────┐
│                      Environment Variables                   │
│              GOOGLE_APPLICATION_CREDENTIALS_JSON             │
│                    (Service Account Key)                     │
└─────────────────────────────────────────────────────────────┘
                              ↓ (Server-side only)
┌─────────────────────────────────────────────────────────────┐
│                      Server Components                       │
│            Credentials NEVER sent to browser                 │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                     Google Cloud APIs                        │
│           OAuth 2.0 Service Account Authentication           │
└─────────────────────────────────────────────────────────────┘
```

## 🎨 Component Hierarchy

```
page.tsx (Main Dashboard)
├── WebsiteSelector
│   └── Dropdown menu with website list
├── DateRangeSelector
│   └── Preset range buttons (7, 30, 90, 365 days)
├── DeviceFilter
│   └── Device type buttons (All, Desktop, Mobile, Tablet)
├── MetricCard (×7)
│   └── Icon + Value + Trend indicator
├── TrendChart
│   └── Chart.js Line component
├── TrafficSourceChart
│   └── Chart.js Doughnut component
├── DeviceChart
│   └── Chart.js Bar component
├── TopPagesTable
│   └── Data table with sorting
└── SearchQueriesTable
    └── SEO metrics table
```

## 💾 Data Models

### Website Configuration
```typescript
{
  id: string,
  name: string,
  domain: string,
  ga4PropertyId: string,
  searchConsoleProperty: string,
  enabled: boolean
}
```

### Analytics Response
```typescript
{
  users: number,
  sessions: number,
  pageViews: number,
  newUsers: number,
  returningUsers: number,
  trafficSources: TrafficSource[],
  visitTrends: TrendData[],
  topContentPages: ContentPage[],
  topSearchQueries: SearchQuery[],
  mobileVsDesktop: DeviceMetric[],
  // ... 15+ more metrics
}
```

## 🔄 State Management

```
User Interaction
    ↓
Component State (useState)
    ↓
useEffect Hook
    ↓
API Fetch (useCallback)
    ↓
State Update
    ↓
Component Re-render
    ↓
UI Update with Animations
```

## 🚀 Deployment Architecture

### Development
```
Local Machine → npm run dev → http://localhost:3000
```

### Production (Vercel)
```
GitHub Repository
    ↓
Vercel Platform
    ↓
Edge Network (CDN)
    ↓
Users Worldwide
```

## 📈 Scalability

- **Websites**: Add unlimited sites (config file only)
- **API Calls**: 200,000/day per GA4 property (free tier)
- **Concurrent Users**: Limited by hosting (Vercel: generous free tier)
- **Data Storage**: None (real-time fetching only)
- **Caching**: Implemented via React state

## 🎯 Key Features

1. **Multi-Website Support**
   - Single portal for all your sites
   - Dynamic switching without page reload
   - Shared authentication

2. **Free Services**
   - Google Analytics 4 Data API (free tier)
   - Google Search Console API (free tier)
   - No database costs (real-time only)

3. **Privacy-Friendly**
   - No PII collection
   - Server-side API calls only
   - Credentials never exposed to browser

4. **Performance**
   - Parallel API requests
   - Optimized re-renders
   - Minimal bundle size

## 🛠️ Technology Stack

- **Frontend**: React 19, Next.js 14
- **Styling**: Tailwind CSS v4
- **Charts**: Chart.js + react-chartjs-2
- **Language**: TypeScript
- **Icons**: Lucide React
- **APIs**: Google Analytics Data API, Search Console API
- **Hosting**: Vercel (recommended)
