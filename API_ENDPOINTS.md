# API Endpoints Documentation

## Authentication

- POST /api/auth/register

  - Register new user
  - Body: { email, password, pregnancyStartDate, prePregnancyWeight, height }

- POST /api/auth/login
  - Login user
  - Body: { email, password }

## Food Entries

- POST /api/food-entries

  - Create new food entry
  - Auth required
  - Body: { name, calories, protein, carbs, fats, mealType }

- GET /api/food-entries

  - Get all food entries for current user
  - Auth required
  - Query params: startDate, endDate

- DELETE /api/food-entries/:id
  - Delete food entry
  - Auth required

## Weight Tracking

- POST /api/weight-logs

  - Log new weight
  - Auth required
  - Body: { weight, date }

- GET /api/weight-logs
  - Get weight history
  - Auth required
  - Query params: startDate, endDate

## User Profile

- GET /api/users/me

  - Get current user profile
  - Auth required

- PATCH /api/users/me
  - Update user profile
  - Auth required
  - Body: { pregnancyStartDate, prePregnancyWeight, height, dietaryRestrictions }

## Nutrition Analytics

- GET /api/analytics/nutrition

  - Get nutrition summary
  - Auth required
  - Query params: startDate, endDate

- GET /api/analytics/weight
  - Get weight gain analysis
  - Auth required
