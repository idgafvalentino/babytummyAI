#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 Running Project Status Check...${NC}\n"

# Run the project manager status check
node src/tools/projectManager.js

# Run the AI context generator
node src/tools/projectDocs.js

echo -e "\n${GREEN}✅ Status check complete!${NC}"
echo -e "${YELLOW}📝 Review the AI context in docs/AI_CONTEXT.md before proceeding${NC}"
