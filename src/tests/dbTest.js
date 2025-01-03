const { Sequelize } = require('sequelize');
require('dotenv').config();

async function testConnection() {
  const sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD.replace(/!/g, '\\!'),
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    logging: false,
    dialectOptions: {
      ssl: false,
    },
  });

  try {
    await sequelize.authenticate();
    console.log('✅ Database connection successful!');
    console.log('Connection details:');
    console.log(`Host: ${process.env.DB_HOST}`);
    console.log(`Database: ${process.env.DB_NAME}`);
    console.log(`User: ${process.env.DB_USER}`);
    console.log(`Port: ${process.env.DB_PORT}`);
  } catch (error) {
    console.error('❌ Unable to connect to the database:');
    console.error('Error details:', error.message);
    console.error('Using password:', process.env.DB_PASSWORD);
  } finally {
    await sequelize.close();
  }
}

testConnection();
