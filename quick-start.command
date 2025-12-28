#!/bin/bash

# This is a macOS .command file that can be double-clicked from Finder
# It will open in Terminal and start the dev server + browser

# Change to the script's directory
cd "$(dirname "$0")"

echo "🚀 Starting Analytics Portal..."

# Check if server is already running
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "✓ Server already running on port 3000"
    echo "Opening browser..."
    open http://localhost:3000
    echo ""
    echo "Press any key to exit..."
    read -n 1
else
    echo "Starting development server..."
    
    # Start the dev server in the background
    npm run dev &
    SERVER_PID=$!
    
    # Wait for the server to be ready
    echo "Waiting for server to start..."
    
    for i in {1..30}; do
        if curl -s http://localhost:3000 > /dev/null 2>&1; then
            echo "✓ Server is ready!"
            break
        fi
        sleep 1
    done
    
    # Open the browser
    echo "Opening browser..."
    sleep 1
    open http://localhost:3000
    
    echo ""
    echo "✓ Analytics Portal is running at http://localhost:3000"
    echo "Press Ctrl+C to stop the server"
    
    # Wait for the background process
    wait $SERVER_PID
fi
