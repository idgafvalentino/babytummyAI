#!/bin/bash

echo "🧹 Cleaning up old logs..."

# Get current date
current_date=$(date +%Y-%m-%d)

# Clean up logs older than 14 days
find ./logs -name "*.log" -type f -mtime +14 -exec rm {} \;

# Clean up rotated logs
find ./logs -name "*.gz" -type f -mtime +14 -exec rm {} \;

# Clean up empty log files
find ./logs -type f -empty -delete

# Create fresh log files if they don't exist
touch ./logs/error-${current_date}.log
touch ./logs/combined-${current_date}.log

echo "✅ Log cleanup complete"
echo "📊 Current log files:"
ls -lh ./logs/
