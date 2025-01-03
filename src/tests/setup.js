const { sequelize } = require('../models');
const config = require('../config/test.config');

/* global jest, beforeAll, afterAll */

// Set test environment
process.env.NODE_ENV = 'test';

// Global test timeout
jest.setTimeout(30000);

// Setup and teardown
beforeAll(async () => {
  // Connect to test database
  await sequelize.authenticate();

  // Sync database (create tables)
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  // Close database connection
  await sequelize.close();
});

// Global test configuration
global.testConfig = config;
