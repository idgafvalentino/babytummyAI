#!/bin/bash

# Remove redundant documentation
rm -f docs/AI_ASSISTANCE.md docs/AI_PAIRING.md docs/SESSION_TEMPLATE.md

# Remove empty directories
find . -type d -empty -delete

# Remove temporary files
find . -type f -name "*.tmp" -delete
find . -type f -name "*.log" -delete

# Remove unused dependencies (be careful with this one)
npm prune

echo "Cleanup completed!"
