#!/bin/bash

# This script creates a macOS URL handler for analytics://start
# After running this, you can click analytics://start in any browser

# Get the absolute path of the project directory
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
APP_NAME="AnalyticsPortalLauncher"
APP_PATH="$HOME/Applications/$APP_NAME.app"

echo "🔧 Creating URL handler for analytics:// protocol..."
echo "📁 Project directory: $PROJECT_DIR"

# Create the app bundle structure
mkdir -p "$APP_PATH/Contents/MacOS"
mkdir -p "$APP_PATH/Contents/Resources"

# Create the Info.plist file
cat > "$APP_PATH/Contents/Info.plist" << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleExecutable</key>
    <string>launcher</string>
    <key>CFBundleIdentifier</key>
    <string>com.analytics.portal.launcher</string>
    <key>CFBundleName</key>
    <string>Analytics Portal Launcher</string>
    <key>CFBundleVersion</key>
    <string>1.0</string>
    <key>CFBundleURLTypes</key>
    <array>
        <dict>
            <key>CFBundleURLName</key>
            <string>Analytics Portal Protocol</string>
            <key>CFBundleURLSchemes</key>
            <array>
                <string>analytics</string>
            </array>
        </dict>
    </array>
</dict>
</plist>
EOF

# Create the launcher script
cat > "$APP_PATH/Contents/MacOS/launcher" << LAUNCHER_EOF
#!/bin/bash

# Get the URL (analytics://start)
URL="\$1"

# Project directory (hardcoded at creation time)
PROJECT_DIR="$PROJECT_DIR"

# Open Terminal and run the start script
osascript <<APPLESCRIPT
tell application "Terminal"
    activate
    do script "cd '$PROJECT_DIR' && ./start.sh"
end tell
APPLESCRIPT
LAUNCHER_EOF

# Make the launcher executable
chmod +x "$APP_PATH/Contents/MacOS/launcher"

echo "✅ URL handler created at: $APP_PATH"
echo ""
echo "📝 Registering the protocol handler..."

# Register the protocol handler
/System/Library/Frameworks/CoreServices.framework/Frameworks/LaunchServices.framework/Support/lsregister -f "$APP_PATH"

echo "✅ Protocol handler registered!"
echo ""
echo "🎉 Setup complete! Now you can:"
echo "   1. Click 'analytics://start' in any browser"
echo "   2. Open the launcher.html file created in this directory"
echo ""
