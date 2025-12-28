#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting Analytics Portal...${NC}"

# Check if server is already running
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${GREEN}✓ Server already running on port 3000${NC}"
    echo -e "${BLUE}Opening browser...${NC}"
    open http://localhost:3000
else
    echo -e "${BLUE}Starting development server...${NC}"
    
    # Start the dev server in the background
    npm run dev &
    
    # Wait for the server to be ready
    echo -e "${BLUE}Waiting for server to start...${NC}"
    
    # Poll for the server to be ready (max 30 seconds)
    for i in {1..30}; do
        if curl -s http://localhost:3000 > /dev/null 2>&1; then
            echo -e "${GREEN}✓ Server is ready!${NC}"
            break
        fi
        sleep 1
    done
    
    # Open the browser
    echo -e "${BLUE}Opening browser...${NC}"
    sleep 1
    open http://localhost:3000
    
    echo -e "${GREEN}✓ Analytics Portal is running at http://localhost:3000${NC}"
    echo -e "${BLUE}Press Ctrl+C to stop the server${NC}"
    
    # Wait for the background process
    wait
fi
