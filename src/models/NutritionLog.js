const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('./index');

class NutritionLog extends Model {}

NutritionLog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'user_id',
      references: {
        model: 'users',
        key: 'id',
      },
    },
    mealType: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'meal_type',
    },
    calories: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    foodName: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'food_name',
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    time: {
      type: DataTypes.TIME,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIME'),
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
      field: 'created_at',
    },
  },
  {
    sequelize,
    modelName: 'NutritionLog',
    tableName: 'nutrition_logs',
    timestamps: false,
    underscored: true,
  }
);

module.exports = NutritionLog;
