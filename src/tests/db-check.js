const { Pool } = require('pg');
const config = require('../config/app.config');

async function verifyDatabaseStructure() {
  const pool = new Pool(config.database);

  try {
    // Check database connection
    await pool.query('SELECT NOW()');

    // Verify required tables exist
    const tables = ['users', 'profiles', 'nutrition_logs'];
    for (const table of tables) {
      const { rows } = await pool.query(
        `
        SELECT EXISTS (
          SELECT FROM information_schema.tables
          WHERE table_schema = 'public'
          AND table_name = $1
        );
      `,
        [table]
      );

      if (!rows[0].exists) {
        throw new Error(`Required table '${table}' does not exist`);
      }
    }

    // Verify timestamps and validation constraints
    const tableChecks = {
      users: ['id', 'created_at', 'updated_at', 'email', 'password_hash'],
      profiles: ['id', 'created_at', 'updated_at', 'user_id', 'name'],
      nutrition_logs: [
        'id',
        'created_at',
        'updated_at',
        'user_id',
        'date',
        'calories',
      ],
    };

    for (const [table, columns] of Object.entries(tableChecks)) {
      const { rows } = await pool.query(
        `
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = $1;
      `,
        [table]
      );

      const existingColumns = rows.map((row) => row.column_name);
      const missingColumns = columns.filter(
        (col) => !existingColumns.includes(col)
      );

      if (missingColumns.length > 0) {
        throw new Error(
          `Table '${table}' missing required columns: ${missingColumns.join(
            ', '
          )}`
        );
      }
    }

    return { status: 'healthy', message: 'All database checks passed' };
  } catch (error) {
    console.error('Database verification failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

module.exports = { verifyDatabaseStructure };
