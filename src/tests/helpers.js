const jwt = require('jsonwebtoken');
const { User, FoodEntry, WeightLog } = require('../models');
const config = require('../config/test.config');

// Clear all test data
const clearDatabase = async () => {
  await WeightLog.destroy({ where: {}, force: true });
  await FoodEntry.destroy({ where: {}, force: true });
  await User.destroy({ where: {}, force: true });
};

// Create test user
const createTestUser = async (overrides = {}) => {
  const defaultUser = {
    email: 'test@example.com',
    password: 'password123',
    pregnancyStartDate: new Date(),
    prePregnancyWeight: 60,
    height: 165,
  };

  const user = await User.create({ ...defaultUser, ...overrides });
  const token = jwt.sign({ id: user.id }, config.auth.jwtSecret, {
    expiresIn: config.auth.jwtExpiration,
  });

  return { user, token };
};

// Create test food entry
const createTestFoodEntry = async (userId, overrides = {}) => {
  const defaultEntry = {
    userId,
    name: 'Test Food',
    calories: 500,
    protein: 20,
    carbs: 50,
    fats: 25,
    mealType: 'lunch',
    date: new Date(),
  };

  return await FoodEntry.create({ ...defaultEntry, ...overrides });
};

// Create test weight log
const createTestWeightLog = async (userId, overrides = {}) => {
  const defaultLog = {
    userId,
    weight: 65,
    date: new Date(),
  };

  return await WeightLog.create({ ...defaultLog, ...overrides });
};

// Test data factory
const createTestData = async () => {
  const { user, token } = await createTestUser();
  const foodEntry = await createTestFoodEntry(user.id);
  const weightLog = await createTestWeightLog(user.id);

  return {
    user,
    token,
    foodEntry,
    weightLog,
  };
};

// Authorization header helper
const authHeader = (token) => ({
  Authorization: `${config.auth.tokenType} ${token}`,
});

module.exports = {
  clearDatabase,
  createTestUser,
  createTestFoodEntry,
  createTestWeightLog,
  createTestData,
  authHeader,
};
