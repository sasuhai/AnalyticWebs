# Quick Start Scripts

This project includes several convenient ways to start the development server and automatically open your browser.

## Option 1: Double-Click (macOS Finder) ⭐ Easiest!

**File:** `quick-start.command`

Simply **double-click** the `quick-start.command` file in Finder, and it will:
1. Open Terminal
2. Start the dev server
3. Automatically open http://localhost:3000 in your default browser

> **First time setup:** Right-click → Get Info → ensure "Terminal" can open it

## Option 2: NPM Script

**Command:** `npm run open`

Run this in your terminal to:
1. Start the Next.js dev server
2. Automatically open http://localhost:3000 in your browser

```bash
npm run open
```

## Option 3: Shell Script

**File:** `start.sh`

Run the shell script:

```bash
./start.sh
```

Features:
- ✅ Checks if server is already running
- ✅ Starts the dev server if needed  
- ✅ Waits for server to be ready
- ✅ Automatically opens browser
- ✅ Colored output for better readability

## Traditional Method

If you prefer the manual approach:

```bash
npm run dev
# Then open http://localhost:3000 manually
```

## Stopping the Server

Press `Ctrl+C` in the terminal to stop the development server.

## Notes

- All scripts check if port 3000 is already in use
- The browser will only open once the server is ready
- Scripts are designed for macOS but can be adapted for other platforms
