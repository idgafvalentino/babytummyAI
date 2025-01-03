const DocGenerator = {
  generateTechnicalSpec() {
    // Technical specification template
    const template = `
# Technical Specification

## Overview
- Project: Pregnancy Nutrition Tracker
- Target Platform: Mobile Web
- Primary Users: Pregnant Women

## Architecture
- Frontend: HTML5, CSS3, JavaScript
- Backend: Node.js, Express
- Database: PostgreSQL
- Authentication: JWT

## Key Features
1. User Authentication
2. Food Tracking
3. Nutrition Analysis
4. Weight Monitoring
5. Pregnancy-specific Recommendations

## Security Considerations
- Data Privacy (HIPAA considerations)
- Input Validation
- Rate Limiting
- Secure Storage`;

    return template;
  },
};

module.exports = DocGenerator;
