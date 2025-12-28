# Analytics Portal 📊

A modern, dynamic analytics dashboard for monitoring multiple websites using **Google Analytics 4** and **Google Search Console** APIs. Built with Next.js 14, TypeScript, and Tailwind CSS.

![Analytics Portal](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Free](https://img.shields.io/badge/Cost-Free-green)

## ✨ Features

### Multi-Website Support
- Select and switch between multiple websites dynamically
- All metrics update automatically based on selection
- Easy configuration to add new websites

### Comprehensive Analytics

#### 1️⃣ Awareness & Reach
- Total users, sessions, and page views
- New vs returning users
- Traffic sources breakdown
- Visit trends over time

#### 2️⃣ Content Consumption
- Average time on page
- Scroll depth metrics
- Pages per session
- Top performing content pages
- Content performance by category

#### 3️⃣ Audience Loyalty
- Returning user rate
- Visit frequency analysis
- User engagement patterns

#### 4️⃣ Discovery & Navigation
- Top landing pages
- Exit pages analysis
- Internal search usage
- Popular search terms

#### 5️⃣ Engagement
- File downloads tracking
- Social share clicks
- Video engagement metrics

#### 6️⃣ SEO Performance
- Organic traffic trends
- Top search queries from Google
- Organic landing pages
- Click-through rates (CTR)
- Average search positions

#### 7️⃣ Device & Performance
- Mobile vs Desktop vs Tablet breakdown
- Page load times
- Slow page identification

### Premium UI/UX
- 🌙 Dark theme with glassmorphism effects
- 🎨 Vibrant color-coded metrics
- 📈 Interactive charts (Line, Doughnut, Bar)
- ⚡ Smooth animations and transitions
- 📱 Fully responsive design
- 🎯 Executive-friendly layouts

### Flexible Filtering
- Date range selection (7, 30, 90, 365 days)
- Device-specific filtering
- Real-time data refresh

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Google Cloud account (free tier)
- Google Analytics 4 property
- Google Search Console property

### Installation

1. **Clone and install dependencies:**
```bash
cd analytics-portal
npm install
```

2. **Configure your websites:**

Edit `src/config/websites.ts` and add your websites:

```typescript
export const websites: Website[] = [
  {
    id: 'my-website',
    name: 'My Awesome Website',
    domain: 'example.com',
    ga4PropertyId: '123456789', // Your GA4 Property ID
    searchConsoleProperty: 'https://example.com', // Your Search Console URL
    enabled: true,
  },
  // Add more websites here...
];
```

3. **Set up Google Cloud credentials:**

Follow the detailed instructions in the next section.

4. **Create environment file:**

Copy `env.example` to `.env.local`:
```bash
cp env.example .env.local
```

Then paste your Google Cloud credentials JSON into the file.

5. **Run the development server:**
```bash
npm run dev
```

6. **Open your browser:**
Navigate to [http://localhost:3000](http://localhost:3000)

## 🔑 Google Cloud Setup (Free)

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click "Select a project" > "New Project"
3. Enter a project name (e.g., "Analytics Portal")
4. Click "Create"

### Step 2: Enable APIs

1. In the Cloud Console, go to **APIs & Services** > **Library**
2. Search and enable:
   - **Google Analytics Data API**
   - **Google Search Console API**

### Step 3: Create Service Account

1. Go to **IAM & Admin** > **Service Accounts**
2. Click **Create Service Account**
3. Enter details:
   - Name: `analytics-portal`
   - Description: `Service account for analytics portal`
4. Click **Create and Continue**
5. Skip optional steps, click **Done**

### Step 4: Generate Key

1. Click on the service account you just created
2. Go to the **Keys** tab
3. Click **Add Key** > **Create new key**
4. Select **JSON** format
5. Click **Create**
6. A JSON file will download - **keep this safe!**

### Step 5: Grant Access to GA4

For each website you want to monitor:

1. Go to [Google Analytics](https://analytics.google.com)
2. Click **Admin** (gear icon)
3. Select your **Property**
4. Click **Property Access Management**
5. Click the **+** button
6. Add the service account email (found in the JSON file: `client_email`)
7. Select role: **Viewer**
8. Click **Add**

### Step 6: Grant Access to Search Console

For each website:

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Select your property
3. Click **Settings** (gear icon)
4. Click **Users and permissions**
5. Click **Add user**
6. Enter the service account email
7. Permission level: **Full** or **Restricted**
8. Click **Add**

### Step 7: Configure Environment Variable

1. Open the downloaded JSON file
2. Copy the **entire contents** (it should be one long line)
3. Open `.env.local` in your project
4. Paste the JSON as the value of `GOOGLE_APPLICATION_CREDENTIALS_JSON`

Example:
```env
GOOGLE_APPLICATION_CREDENTIALS_JSON={"type":"service_account","project_id":"...","private_key":"..."}
```

## 📖 How to Use

### Adding a New Website

1. Get your GA4 Property ID:
   - Go to Google Analytics > Admin > Property Settings
   - Copy the Property ID (number like `123456789`)

2. Get your Search Console property URL:
   - Go to Search Console
   - The property is shown in the selector (e.g., `https://example.com`)

3. Add to `src/config/websites.ts`:
```typescript
{
  id: 'unique-id',
  name: 'Display Name',
  domain: 'example.com',
  ga4PropertyId: '123456789',
  searchConsoleProperty: 'https://example.com',
  enabled: true,
}
```

4. Restart the dev server

### Understanding Metrics

- **Users**: Unique visitors to your site
- **Sessions**: Individual visits (a user can have multiple sessions)
- **Page Views**: Total pages viewed
- **Pages per Session**: Average pages viewed in a single session
- **Bounce Rate**: % of single-page sessions
- **CTR**: Click-through rate from Google search results
- **Position**: Average ranking position in Google search

### Date Ranges

- **Last 7 days**: Recent short-term trends
- **Last 30 days**: Monthly performance (default)
- **Last 90 days**: Quarterly trends
- **Last 12 months**: Annual overview

## 🏗️ Project Structure

```
analytics-portal/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── analytics/      # Analytics API endpoint
│   │   │   └── websites/       # Websites list endpoint
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Main dashboard
│   ├── components/
│   │   ├── charts/             # Chart components
│   │   ├── tables/             # Table components
│   │   ├── WebsiteSelector.tsx
│   │   ├── DateRangeSelector.tsx
│   │   ├── DeviceFilter.tsx
│   │   └── MetricCard.tsx
│   ├── config/
│   │   └── websites.ts         # Website configuration
│   ├── lib/
│   │   └── analytics.ts        # Analytics service
│   └── types/
│       └── website.ts          # TypeScript types
├── env.example                 # Environment template
├── package.json
└── README.md
```

## 🎨 Customization

### Colors

Edit `src/app/globals.css` to change the color scheme:

```css
:root {
  --primary: 142.1 76.2% 36.3%;  /* Green */
  --accent: 217 91% 60%;          /* Blue */
}
```

### Chart Colors

Edit individual chart components in `src/components/charts/` to customize colors.

### Website List

All website configuration is in `src/config/websites.ts` - no code changes needed to add/remove websites.

## 🔒 Privacy & Security

- **No PII Collection**: Analytics data doesn't include personal information
- **Server-side API**: Credentials never exposed to client
- **Data Separation**: Each website's data is isolated by GA4 property
- **Free Tier**: Uses Google's free API tiers (no billing required)

## 📊 API Limits (Free Tier)

- **GA4 Data API**: 200,000 requests/day (more than enough)
- **Search Console API**: 600 queries/minute
- **No credit card required**

## 🐛 Troubleshooting

### "Failed to fetch analytics"

1. Check that your `.env.local` file exists and has valid JSON
2. Verify the service account has access to the GA4 property
3. Check that the GA4 Property ID is correct
4. Ensure APIs are enabled in Google Cloud Console

### "No data available"

1. Verify your website has recent traffic
2. Check that events are being tracked in GA4
3. Try a longer date range (e.g., 30 days)
4. Confirm the service account has "Viewer" role

### Charts not displaying

1. Clear browser cache
2. Check browser console for errors
3. Ensure all npm packages are installed: `npm install`

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variable:
   - Key: `GOOGLE_APPLICATION_CREDENTIALS_JSON`
   - Value: Your JSON credentials
5. Deploy!

### Other Platforms

Works on any platform supporting Node.js:
- Netlify
- Railway
- Render
- AWS Amplify

## 📝 License

MIT

## 🤝 Contributing

Contributions welcome! Feel free to open issues or submit PRs.

## ⭐ Acknowledgments

- Built with [Next.js](https://nextjs.org)
- Charts by [Chart.js](https://www.chartjs.org)
- Icons by [Lucide](https://lucide.dev)
- Styled with [Tailwind CSS](https://tailwindcss.com)

---

**Made with ❤️ for website owners who want comprehensive, free analytics**
