const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgresql',
    logging: false,
  }
);

async function checkDatabaseStructure() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.\n');

    // Get all tables
    const tables = await sequelize.query(
      `SELECT table_name
       FROM information_schema.tables
       WHERE table_schema = 'public'`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    console.log('📊 Database Tables:');
    console.log('==================');

    // For each table, get its columns and constraints
    for (const table of tables) {
      const tableName = table.table_name;
      console.log(`\n📋 Table: ${tableName}`);
      console.log('------------------');

      // Get columns
      const columns = await sequelize.query(
        `SELECT column_name, data_type, is_nullable, column_default
         FROM information_schema.columns
         WHERE table_schema = 'public' AND table_name = :tableName`,
        {
          replacements: { tableName },
          type: Sequelize.QueryTypes.SELECT,
        }
      );

      console.log('Columns:');
      columns.forEach((column) => {
        console.log(`  - ${column.column_name}`);
        console.log(`    Type: ${column.data_type}`);
        console.log(`    Nullable: ${column.is_nullable}`);
        if (column.column_default) {
          console.log(`    Default: ${column.column_default}`);
        }
      });

      // Get foreign keys
      const foreignKeys = await sequelize.query(
        `SELECT
           kcu.column_name,
           ccu.table_name AS foreign_table_name,
           ccu.column_name AS foreign_column_name
         FROM information_schema.table_constraints AS tc
         JOIN information_schema.key_column_usage AS kcu
           ON tc.constraint_name = kcu.constraint_name
         JOIN information_schema.constraint_column_usage AS ccu
           ON ccu.constraint_name = tc.constraint_name
         WHERE tc.constraint_type = 'FOREIGN KEY'
           AND tc.table_name = :tableName`,
        {
          replacements: { tableName },
          type: Sequelize.QueryTypes.SELECT,
        }
      );

      if (foreignKeys.length > 0) {
        console.log('\n  Foreign Keys:');
        foreignKeys.forEach((fk) => {
          console.log(
            `  - ${fk.column_name} → ${fk.foreign_table_name}(${fk.foreign_column_name})`
          );
        });
      }

      // Get indexes
      const indexes = await sequelize.query(
        `SELECT indexname, indexdef
         FROM pg_indexes
         WHERE tablename = :tableName`,
        {
          replacements: { tableName },
          type: Sequelize.QueryTypes.SELECT,
        }
      );

      if (indexes.length > 0) {
        console.log('\n  Indexes:');
        indexes.forEach((index) => {
          console.log(`  - ${index.indexname}`);
        });
      }
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

checkDatabaseStructure();
