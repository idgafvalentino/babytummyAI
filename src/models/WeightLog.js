const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const WeightLog = sequelize.define('WeightLog', {
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
  weight: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  week: {
    type: DataTypes.INTEGER,
  },
});

module.exports = WeightLog;
