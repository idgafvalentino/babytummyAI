# Calorie Tracker Application

A comprehensive calorie and nutrition tracking application designed for pregnancy nutrition monitoring.

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
│   ├── models/        # Database models
│   ├── controllers/   # Business logic
│   ├── routes/        # API routes
│   ├── middleware/    # Express middleware
│   └── tests/         # Test files
├── client/
│   ├── src/
│   │   ├── js/       # Frontend JavaScript
│   │   └── styles/   # CSS styles
│   └── index.html    # Main HTML file
```

## API Documentation

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Food Entries

- `POST /api/food-entries` - Create new food entry
- `GET /api/food-entries` - Get user's food entries
- `DELETE /api/food-entries/:id` - Delete food entry

### Weight Tracking

- `POST /api/weight-logs` - Log new weight
- `GET /api/weight-logs` - Get weight history

### User Profile

- `GET /api/users/me` - Get current user profile
- `PATCH /api/users/me` - Update user profile

For detailed API documentation, see [API Documentation](docs/API_ENDPOINTS.md).

## Database Schema

### Users

- id (UUID)
- email (String, unique)
- password (String, hashed)
- pregnancyStartDate (Date)
- prePregnancyWeight (Float)
- height (Float)
- createdAt (DateTime)
- updatedAt (DateTime)

### FoodEntries

- id (UUID)
- userId (UUID, FK)
- name (String)
- calories (Integer)
- protein (Float)
- carbs (Float)
- fats (Float)
- mealType (Enum)
- date (Date)

### WeightLogs

- id (UUID)
- userId (UUID, FK)
- weight (Float)
- date (Date)

## Development

### Prerequisites

- Node.js >= 14
- PostgreSQL >= 13
- npm >= 6

### Environment Variables

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=calorie
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
