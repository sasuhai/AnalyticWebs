# 🚀 Quick Setup Guide

## Complete Setup in 10 Minutes

### Part 1: Google Cloud Setup (5 minutes)

#### 1. Create Project
```
1. Visit: https://console.cloud.google.com
2. Click "New Project"
3. Name: "Analytics Portal"
4. Click "Create"
```

#### 2. Enable APIs
```
1. Go to: APIs & Services > Library
2. Search "Google Analytics Data API" → Enable
3. Search "Google Search Console API" → Enable
```

#### 3. Create Service Account
```
1. Go to: IAM & Admin > Service Accounts
2. Click "Create Service Account"
3. Name: analytics-portal
4. Click "Create and Continue" → "Done"
```

#### 4. Download Credentials
```
1. Click on your new service account
2. Keys tab → Add Key → Create new key
3. Select JSON → Create
4. Save the downloaded file!
```

### Part 2: Grant Permissions (3 minutes)

#### For Google Analytics 4
For EACH website:
```
1. Open Google Analytics
2. Admin → Property Access Management
3. Click "+"
4. Paste service account email (from JSON: client_email)
5. Role: Viewer
6. Click "Add"
```

#### For Search Console
For EACH website:
```
1. Open Search Console
2. Settings → Users and permissions
3. Click "Add user"
4. Paste service account email
5. Permission: Full or Restricted
6. Click "Add"
```

### Part 3: Configure Portal (2 minutes)

#### 1. Environment Variables
```bash
# Create .env.local file
cp env.example .env.local

# Open .env.local and paste your entire JSON credentials
# (The JSON from the file you downloaded in Part 1, Step 4)
```

#### 2. Add Your Websites
Edit `src/config/websites.ts`:

```typescript
export const websites: Website[] = [
  {
    id: 'my-blog',
    name: 'My Blog',
    domain: 'myblog.com',
    ga4PropertyId: '123456789',  // From GA4: Admin > Property Settings
    searchConsoleProperty: 'https://myblog.com',  // From Search Console
    enabled: true,
  },
];
```

**Where to find IDs:**
- **GA4 Property ID**: Google Analytics → Admin → Property Settings (top of page)
- **Search Console Property**: The URL shown in the property selector

#### 3. Run the Portal
```bash
npm install
npm run dev
```

Open http://localhost:3000 🎉

---

## Quick Reference Card

### Getting GA4 Property ID
```
Google Analytics → Admin → Property Settings → Property ID
```

### Getting Service Account Email
```
Look in your downloaded JSON file:
"client_email": "analytics-portal@your-project.iam.gserviceaccount.com"
```

### Testing the Setup
1. Select a website from dropdown
2. Click "Refresh Data"
3. If you see metrics → Success! ✅
4. If you see an error → Check troubleshooting below

---

## Troubleshooting

### Error: "GOOGLE_APPLICATION_CREDENTIALS_JSON not found"
**Fix**: Make sure `.env.local` exists with your JSON credentials

### Error: "Failed to fetch analytics"
**Check:**
1. ✅ Service account has Viewer access in GA4
2. ✅ GA4 Property ID is correct (just numbers, no spaces)
3. ✅ APIs are enabled in Google Cloud Console
4. ✅ Your website has recent traffic data

### Error: "Website not found"
**Fix**: Make sure the website ID in your config matches what you're selecting

### No Search Console data showing
**Check:**
1. ✅ Service account added to Search Console
2. ✅ Property URL matches exactly (https://example.com)
3. ✅ Website has been verified in Search Console
4. ✅ Website has search traffic in the date range

---

## Next Steps

### Add More Websites
Just edit `src/config/websites.ts` and add a new object. No code changes needed!

### Customize Look
Edit colors in `src/app/globals.css`:
```css
:root {
  --primary: 142.1 76.2% 36.3%;  /* Your color */
  --accent: 217 91% 60%;          /* Your accent */
}
```

### Deploy to Production
See README.md for Vercel deployment instructions (5 minutes)

---

## Support

- 📖 Full documentation: See README.md
- 🐛 Issues: Check the Troubleshooting section
- 💡 Feature requests: Open an issue on GitHub

**Happy monitoring! 📊**
