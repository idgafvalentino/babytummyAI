const User = require('./User');
const FoodEntry = require('./FoodEntry');
const WeightLog = require('./WeightLog');

// Set up relationships
User.hasMany(FoodEntry, { foreignKey: 'userId' });
FoodEntry.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(WeightLog, { foreignKey: 'userId' });
WeightLog.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  User,
  FoodEntry,
  WeightLog,
};
