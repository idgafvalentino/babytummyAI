#!/bin/bash

echo "🧹 Cleaning Git history of sensitive files..."

# Create a backup branch
git checkout -b backup-main

# Remove sensitive files from git history
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch \
    .env \
    config.js \
    **/config.js \
    secrets/* \
    **/*.key \
    **/*.pem \
    **/*.log" \
  --prune-empty --tag-name-filter cat -- --all

echo "✅ Git history cleaned"
echo "⚠️ To apply changes to remote repository, you will need to force push:"
echo "git push origin --force --all"
echo ""
echo "💡 To keep the old history as backup:"
echo "The backup-main branch contains the original history"
