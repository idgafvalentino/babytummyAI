const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FoodEntry = sequelize.define('FoodEntry', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  calories: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  protein: {
    type: DataTypes.FLOAT,
  },
  carbs: {
    type: DataTypes.FLOAT,
  },
  fats: {
    type: DataTypes.FLOAT,
  },
  folicAcid: {
    type: DataTypes.FLOAT,
  },
  iron: {
    type: DataTypes.FLOAT,
  },
  calcium: {
    type: DataTypes.FLOAT,
  },
  mealType: {
    type: DataTypes.ENUM('breakfast', 'lunch', 'dinner', 'snack'),
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = FoodEntry;
