const path = require('path');
const fs = require('fs');

// Read .env file directly
const envPath = path.resolve(__dirname, '../../.env');
console.log('\n📄 Reading .env file directly from:', envPath);
try {
  const envContent = fs.readFileSync(envPath, 'utf8');
  console.log('\nRaw .env content:');
  console.log(envContent);
} catch (error) {
  console.error('Error reading .env:', error);
}

require('dotenv').config({ path: envPath });
const { Sequelize } = require('sequelize');
const dbConfig = require('../config/database');

async function checkDatabaseStructure() {
  console.log('\n📊 Database Structure Check\n');

  // Debug: Log raw environment variables
  console.log('Raw Environment Variables:');
  console.log('DB_NAME:', process.env.DB_NAME);
  console.log('DB_USER:', process.env.DB_USER);
  console.log('DB_HOST:', process.env.DB_HOST);
  console.log('DB_PORT:', process.env.DB_PORT);
  console.log(
    'DB_PASSWORD length:',
    process.env.DB_PASSWORD ? process.env.DB_PASSWORD.length : 0
  );
  console.log(
    'DB_PASSWORD first char:',
    process.env.DB_PASSWORD ? process.env.DB_PASSWORD[0] : 'none'
  );
  console.log(
    'DB_PASSWORD last char:',
    process.env.DB_PASSWORD
      ? process.env.DB_PASSWORD[process.env.DB_PASSWORD.length - 1]
      : 'none'
  );

  // Debug: Log configuration
  const config = dbConfig[process.env.NODE_ENV || 'development'];
  console.log('\nDatabase Configuration:');
  console.log('- Environment:', process.env.NODE_ENV || 'development');
  console.log('- Database:', config.database);
  console.log('- Host:', config.host);
  console.log('- Port:', config.port);
  console.log('- User:', config.username);
  console.log(
    '- Password length:',
    config.password ? config.password.length : 0
  );
  console.log(
    '- Password first char:',
    config.password ? config.password[0] : 'none'
  );
  console.log(
    '- Password last char:',
    config.password ? config.password[config.password.length - 1] : 'none'
  );

  // Try direct connection string first
  const connectionString = `postgresql://${
    config.username
  }:${encodeURIComponent(config.password)}@${config.host}:${config.port}/${
    config.database
  }`;
  console.log(
    '\nTrying connection string (masked):',
    connectionString.replace(/:([^:@]+)@/, ':****@')
  );

  try {
    // First try connection string
    console.log('\nAttempting connection with connection string...');
    const sequelize1 = new Sequelize(connectionString);
    await sequelize1.authenticate();
    console.log('✓ Connection string method successful');
    await sequelize1.close();
  } catch (error) {
    console.log('✗ Connection string method failed:', error.message);
  }

  try {
    // Then try config object
    console.log('\nAttempting connection with config object...');
    const sequelize2 = new Sequelize(config);
    await sequelize2.authenticate();
    console.log('✓ Config object method successful');

    // Get all tables
    const [results] = await sequelize2.query(`
      SELECT
        table_name,
        column_name,
        data_type,
        is_nullable,
        column_default
      FROM information_schema.columns
      WHERE table_schema = 'public'
      ORDER BY table_name, ordinal_position;
    `);

    // Group by table
    const tables = {};
    results.forEach((row) => {
      if (!tables[row.table_name]) {
        tables[row.table_name] = [];
      }
      tables[row.table_name].push({
        column: row.column_name,
        type: row.data_type,
        nullable: row.is_nullable,
        default: row.column_default,
      });
    });

    // Print table structure
    for (const [tableName, columns] of Object.entries(tables)) {
      console.log(`\nTable: ${tableName}`);
      console.log('Columns:');
      columns.forEach((col) => {
        console.log(`  - ${col.column}`);
        console.log(`    Type: ${col.type}`);
        console.log(`    Nullable: ${col.nullable}`);
        if (col.default) {
          console.log(`    Default: ${col.default}`);
        }
      });
    }

    await sequelize2.close();
    return true;
  } catch (error) {
    console.error('\nDatabase check failed:', error.message);
    return false;
  }
}

if (require.main === module) {
  checkDatabaseStructure();
}

module.exports = { checkDatabaseStructure };
