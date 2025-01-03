# Database Schema

## Users Table

- Primary key: id
- Unique email
- Encrypted password
- Timestamps

## Profiles Table

- Links to user via user_id
- Pregnancy-specific data
- Health metrics
- Dietary preferences

## Nutrition Logs Table

- Links to user via user_id
- Meal tracking
- Calorie counting
- Timestamps
