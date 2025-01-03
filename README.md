# Calorie Tracker Application

A comprehensive calorie and nutrition tracking application designed for pregnancy nutrition monitoring.

## Project Status

Currently in development - Step 4: Core Features

- ✅ Basic Setup: Complete
- ✅ Database Models: Complete
- ✅ Authentication: Complete
- 🔄 Core Features: In Progress
- ⏳ Frontend Integration: Pending

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Run database migrations
npm run migrate

# Start development server
npm run dev
```

## Project Structure

```
├── src/
│   ├── config/        # Application configuration
│   │   ├── app.config.js
│   │   └── test.config.js
│   ├── models/        # Database models
│   │   ├── index.js
│   │   ├── User.js
│   │   ├── Profile.js
│   │   └── NutritionLog.js
│   ├── controllers/   # Business logic
│   ├── routes/        # API routes
│   ├── middleware/    # Express middleware
│   │   ├── auth.js
│   │   ├── validate.js
│   │   └── error.js
│   └── tests/         # Test files
├── client/           # Frontend code
└── docs/            # Documentation
```

## Database Schema

### Users

- id (Integer, PK)
- email (String, unique)
- password (String, hashed)
- created_at (Timestamp)
- updated_at (Timestamp)

### Profiles

- id (Integer, PK)
- user_id (Integer, FK)
- pregnancy_week (Integer)
- pre_pregnancy_weight (Decimal)
- current_weight (Decimal)
- height (Decimal)
- activity_level (String)
- dietary_restrictions (String[])
- medical_conditions (String[])
- trimester (Integer)
- created_at (Timestamp)
- updated_at (Timestamp)

### Nutrition Logs

- id (Integer, PK)
- user_id (Integer, FK)
- meal_type (String)
- calories (Integer)
- food_name (String)
- date (Date)
- time (Time)
- created_at (Timestamp)

## API Documentation

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Profile Management

- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile

### Nutrition Tracking

- `POST /api/nutrition` - Log food entry
- `GET /api/nutrition` - Get nutrition logs
- `GET /api/nutrition/summary` - Get nutrition summary

## Development

### Prerequisites

- Node.js >= 14
- PostgreSQL >= 13
- npm >= 6

### Environment Variables

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pregnancy_nutrition
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
```

### Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

### Code Quality

```bash
# Run linter
npm run lint

# Format code
npm run format
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.
