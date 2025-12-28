# ✅ Getting Started Checklist

Follow this checklist to get your analytics portal up and running:

## Initial Setup

- [x] ✅ Install dependencies (`npm install`)
- [x] ✅ Start development server (`npm run dev`)
- [x] ✅ Verify portal loads at http://localhost:3000
- [ ] ⏳ Configure Google Cloud project
- [ ] ⏳ Set up service account
- [ ] ⏳ Add credentials to .env.local
- [ ] ⏳ Configure your websites

---

## Google Cloud Setup

### Step 1: Create Project
- [x] Go to https://console.cloud.google.com
- [x] Click "New Project"
- [ ] Name it "Analytics Portal"
- [ ] Click "Create"

### Step 2: Enable APIs
- [ ] Go to "APIs & Services" > "Library"
- [ ] Enable "Google Analytics Data API"
- [ ] Enable "Google Search Console API"

### Step 3: Create Service Account
- [ ] Go to "IAM & Admin" > "Service Accounts"
- [ ] Click "Create Service Account"
- [ ] Name: `analytics-portal`
- [ ] Click "Create" > "Done"

### Step 4: Download Credentials
- [ ] Click on your service account
- [ ] Go to "Keys" tab
- [ ] Click "Add Key" > "Create new key"
- [ ] Choose JSON format
- [ ] Download the file (keep it safe!)

---

## Website Integration

### For Each Website You Want to Monitor

#### Google Analytics 4
- [ ] Open Google Analytics
- [ ] Go to Admin > Property Access Management
- [ ] Click "+" to add user
- [ ] Paste service account email (from JSON: `client_email`)
- [ ] Select role: **Viewer**
  [ ] Click "Add"

#### Google Search Console
- [ ] Open Search Console
- [ ] Settings > Users and permissions
- [ ] Click "Add user"
- [ ] Paste service account email
- [ ] Permission: **Full** or **Restricted**
- [ ] Click "Add"

---

## Portal Configuration

### Create Environment File
```bash
# In the analytics-portal directory
cp env.example .env.local
```

- [ ] Open `.env.local` in a text editor
- [ ] Copy the ENTIRE contents of your downloaded JSON key
- [ ] Paste it as one line after `GOOGLE_APPLICATION_CREDENTIALS_JSON=`
- [ ] Save the file

### Add Your Websites

Edit `src/config/websites.ts`:

- [ ] Find your GA4 Property ID:
  - Google Analytics > Admin > Property Settings
  - Copy the number (e.g., `123456789`)

- [ ] Find your Search Console property:
  - Google Search Console > Property selector
  - Copy the URL (e.g., `https://example.com`)

- [ ] Update the `websites` array:
  ```typescript
  export const websites: Website[] = [
    {
      id: 'my-site',                    // Unique ID
      name: 'My Website Name',          // Display name
      domain: 'example.com',            // Domain
      ga4PropertyId: '123456789',       // Your GA4 ID
      searchConsoleProperty: 'https://example.com',  // Your SC property
      enabled: true,
    },
    // Add more websites here...
  ];
  ```

- [ ] Save the file

---

## Testing

### Verify It Works
- [ ] Restart the dev server (Ctrl+C, then `npm run dev`)
- [ ] Open http://localhost:3000
- [ ] Select your website from the dropdown
- [ ] Click "Refresh Data"
- [ ] ✅ You should see metrics appear!

### Troubleshooting
If you see errors:

- [ ] Check `.env.local` has valid JSON (no extra spaces, correct format)
- [ ] Verify service account email is added to GA4 with "Viewer" role
- [ ] Verify service account email is added to Search Console
- [ ] Check GA4 Property ID is correct (just numbers)
- [ ] Make sure your website has recent traffic data
- [ ] Try a longer date range (30 or 90 days)

---

## Optional Enhancements

### Customize Appearance
- [ ] Update colors in `src/app/globals.css`
- [ ] Change logo/icons
- [ ] Add your company name

### Deploy to Production
- [ ] Push to GitHub
- [ ] Connect to Vercel
- [ ] Add environment variable
- [ ] Deploy!

### Add More Websites
- [ ] Repeat the Google Cloud permissions steps
- [ ] Add to `src/config/websites.ts`
- [ ] Restart server

---

## Success Criteria

You'll know everything is working when you see:

✅ Website selector shows your configured sites  
✅ Date range and device filters are clickable  
✅ Clicking "Refresh Data" loads actual metrics  
✅ User counts, sessions, and page views appear  
✅ Charts display your traffic data  
✅ Tables show your top pages and search queries  
✅ No error messages  

---

## Quick Reference

### Get GA4 Property ID
```
Google Analytics → Admin → Property Settings → Property ID (top of page)
```

### Get Service Account Email
```
Open your downloaded JSON file → look for "client_email"
```

### Restart Development Server
```bash
# Stop server: Ctrl + C
npm run dev
```

### View Logs
```
Check the terminal where npm run dev is running
```

---

## Need Help?

- 📖 See README.md for detailed documentation
- 🚀 See SETUP.md for quick setup guide
- 🎯 See PROJECT_SUMMARY.md for feature overview

---

## Time Estimates

- Google Cloud Setup: **5 minutes**
- Website integration (per site): **2 minutes**
- Portal configuration: **3 minutes**

**Total: ~10 minutes for first website**, then ~2 minutes per additional website.

---

**Ready? Start with Step 1 of Google Cloud Setup! 🚀**
