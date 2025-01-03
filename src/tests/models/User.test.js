const { User } = require('../../models');
const { clearDatabase } = require('../helpers');

/* global describe, beforeEach, it, expect */

describe('User Model', () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  describe('Validation', () => {
    it('should create a valid user', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        pregnancyStartDate: new Date(),
        prePregnancyWeight: 60,
        height: 165,
      };

      const user = await User.create(userData);
      expect(user).toBeDefined();
      expect(user.email).toBe(userData.email);
      expect(user.password).not.toBe(userData.password); // Should be hashed
    });

    it('should not create a user with invalid email', async () => {
      const userData = {
        email: 'invalid-email',
        password: 'password123',
        pregnancyStartDate: new Date(),
        prePregnancyWeight: 60,
        height: 165,
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    it('should not create a user with duplicate email', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        pregnancyStartDate: new Date(),
        prePregnancyWeight: 60,
        height: 165,
      };

      await User.create(userData);
      await expect(User.create(userData)).rejects.toThrow();
    });

    it('should not create a user without required fields', async () => {
      const userData = {
        email: 'test@example.com',
      };

      await expect(User.create(userData)).rejects.toThrow();
    });
  });

  describe('Instance Methods', () => {
    it('should validate correct password', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        pregnancyStartDate: new Date(),
        prePregnancyWeight: 60,
        height: 165,
      };

      const user = await User.create(userData);
      const isValid = await user.validatePassword('password123');
      expect(isValid).toBe(true);
    });

    it('should not validate incorrect password', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        pregnancyStartDate: new Date(),
        prePregnancyWeight: 60,
        height: 165,
      };

      const user = await User.create(userData);
      const isValid = await user.validatePassword('wrongpassword');
      expect(isValid).toBe(false);
    });
  });

  describe('Hooks', () => {
    it('should hash password before save', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        pregnancyStartDate: new Date(),
        prePregnancyWeight: 60,
        height: 165,
      };

      const user = await User.create(userData);
      expect(user.password).not.toBe(userData.password);
      expect(user.password).toMatch(/^\$2[aby]\$\d+\$/); // bcrypt hash pattern
    });
  });
});
