# AI Collaboration Guide

## Project Context

### Current Status

- Step: 4 (Core Features)
- Branch: main
- Last Update: 2025-01-03
- Last Test: Pre-commit hook test

### Completed Steps

1. ✅ Basic Setup

   - Project structure
   - Environment configuration
   - Database connection

2. ✅ Database Models

   - User model
   - Profile model
   - NutritionLog model
   - Model relationships

3. ✅ Authentication
   - Auth middleware
   - Validation middleware
   - Error handling
   - Auth routes

### Current Implementation

4. 🔄 Core Features
   - Status: In Progress
   - Files to Implement:
     - src/routes/profile.routes.js
     - src/routes/nutrition.routes.js
     - src/controllers/profile.controller.js
     - src/controllers/nutrition.controller.js

### Database Structure

- Tables:
  - users (id, email, password, timestamps)
  - profiles (user_id, pregnancy details, health data)
  - nutrition_logs (user_id, meal details, timestamps)

## AI Session Guidelines

### Starting a New Session

1. Review current step in `.cursorrules`
2. Check `docs/devlog.md` for latest updates
3. Run `node src/tools/projectManager.js` for status
4. Verify database structure with `node src/tests/db-check.js`

### During Development

1. Follow incremental approach from `.cursorrules`
2. Reference existing patterns in codebase
3. Update documentation alongside code changes
4. Run tests before committing

### Before Ending Session

1. Update devlog with progress
2. Commit all changes with descriptive messages
3. Run project manager to verify status
4. Update this file if project phase changes

## Reference Files

- `.cursorrules`: Project structure and rules
- `docs/devlog.md`: Development progress log
- `README.md`: Project overview and setup
- `src/tests/db-check.js`: Database structure verification

## Current Questions/Decisions

1. Profile management features priority
2. Nutrition tracking data requirements
3. API response formats standardization
