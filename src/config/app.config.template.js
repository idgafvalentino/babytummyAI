const path = require('path');

module.exports = {
  // Application settings
  app: {
    port: 3000,
    env: 'development',
    apiPrefix: '/api/v1',
  },

  // Database configuration
  database: {
    host: 'localhost',
    port: 5432,
    name: 'calorie_db',
    user: 'postgres',
    password: 'your_password',
  },

  // File paths
  paths: {
    root: path.resolve(__dirname, '../..'),
    client: path.resolve(__dirname, '../../client'),
    uploads: path.resolve(__dirname, '../../uploads'),
    logs: path.resolve(__dirname, '../../logs'),
  },

  // Logging configuration
  logging: {
    level: 'info',
    file: path.resolve(__dirname, '../../logs/app.log'),
  },

  // CORS configuration
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
};
