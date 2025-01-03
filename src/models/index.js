const { Sequelize } = require('sequelize');
const config = require('../config/app.config');

const sequelize = new Sequelize(
  config.db.database,
  config.db.username,
  config.db.password,
  {
    host: config.db.host,
    port: config.db.port,
    dialect: config.db.dialect,
    logging: config.db.logging,
    pool: config.db.pool,
  }
);

// Import models
const User = require('./User');
const Profile = require('./Profile');
const NutritionLog = require('./NutritionLog');

// Define relationships
User.hasOne(Profile, {
  foreignKey: 'user_id',
  as: 'profile',
});
Profile.belongsTo(User, {
  foreignKey: 'user_id',
});

User.hasMany(NutritionLog, {
  foreignKey: 'user_id',
  as: 'nutritionLogs',
});
NutritionLog.belongsTo(User, {
  foreignKey: 'user_id',
});

module.exports = {
  sequelize,
  User,
  Profile,
  NutritionLog,
};
