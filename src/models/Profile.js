const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('./index');

class Profile extends Model {}

Profile.init(
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
    pregnancyWeek: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'pregnancy_week',
    },
    prePregnancyWeight: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      field: 'pre_pregnancy_weight',
    },
    currentWeight: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      field: 'current_weight',
    },
    height: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    activityLevel: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'activity_level',
    },
    dietaryRestrictions: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      field: 'dietary_restrictions',
    },
    medicalConditions: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      field: 'medical_conditions',
    },
    trimester: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
      field: 'created_at',
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
      field: 'updated_at',
    },
  },
  {
    sequelize,
    modelName: 'Profile',
    tableName: 'profiles',
    timestamps: true,
    underscored: true,
  }
);

module.exports = Profile;
