const path = require('path');

module.exports = {
  db: {
    host: 'localhost',
    port: 5432,
    database: 'calorie_test',
    username: 'postgres',
    password: 'postgres',
    dialect: 'postgresql',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
  auth: {
    jwtSecret: 'test-secret',
    jwtExpiration: '1h',
    saltRounds: 10,
    tokenType: 'Bearer',
  },
  app: {
    env: 'test',
    port: 3001,
    apiVersion: 'v1',
    corsOrigins: ['http://localhost:3001'],
    uploadDir: path.join(__dirname, '../test-uploads'),
    logDir: path.join(__dirname, '../test-logs'),
    rateLimiting: {
      windowMs: 15 * 60 * 1000,
      max: 100,
    },
  },
};
